from django.core.exceptions import PermissionDenied
from django.db import transaction

from ..common.utils import build_whatsapp_url
from ..courses.models import Enrollment
from ..orders.models import Cart, Order, OrderItem, OrderType, OrderStatus


def get_or_create_cart(request) -> Cart:
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
        _merge_session_cart_into(request, cart)
        return cart
    if not request.session.session_key:
        request.session.create()
    cart, _ = Cart.objects.get_or_create(session_key=request.session.session_key, user=None)
    return cart


def _merge_session_cart_into(request, user_cart: Cart) -> None:
    """
    Folds a pre-login guest cart (tracked by session key, e.g. a course added
    before signing up) into the now-authenticated user's cart, so the sign-up
    step in the course flow doesn't lose whatever was already in the cart.
    """
    session_key = request.session.session_key
    if not session_key:
        return
    guest_cart = Cart.objects.filter(session_key=session_key, user__isnull=True).exclude(pk=user_cart.pk).first()
    if not guest_cart:
        return
    guest_cart.items.update(cart=user_cart)
    guest_cart.delete()


class CheckoutError(Exception):
    pass


@transaction.atomic
def checkout_cart(request, cart: Cart, contact_info: dict, delivery_info: dict) -> Order:
    """
    Turns a Cart into an Order (+ OrderItems, + pending Enrollments for any
    courses). This is the fork in the road between the two purchase flows:

    - Cheesecake-only orders end up `AWAITING_WHATSAPP_CONTACT`: no payment
      is collected in-app, the caller is expected to redirect the customer
      to the WhatsApp link returned alongside the order.
    - Orders containing a course require an authenticated user and end up
      `AWAITING_PAYMENT`, ready for apps.payments to create a Payment against.
    """
    items = list(cart.items.select_related("cheesecake_variant__cheesecake", "course"))
    if not items:
        raise CheckoutError("Cart is empty.")

    has_course = any(i.course_id for i in items)
    has_cheesecake = any(i.cheesecake_variant_id for i in items)

    if has_course and not request.user.is_authenticated:
        raise PermissionDenied("Please sign up or log in to purchase a course.")

    order_type = OrderType.MIXED if (has_course and has_cheesecake) else (
        OrderType.COURSE if has_course else OrderType.CHEESECAKE
    )
    initial_status = (
        OrderStatus.AWAITING_PAYMENT if has_course else OrderStatus.AWAITING_WHATSAPP_CONTACT
    )

    order = Order.objects.create(
        user=request.user if request.user.is_authenticated else None,
        order_type=order_type,
        status=initial_status,
        contact_name=contact_info.get("contact_name", ""),
        contact_phone=contact_info.get("contact_phone", ""),
        contact_email=contact_info.get("contact_email", ""),
        delivery_method=delivery_info.get("delivery_method") or "n_a",
        delivery_city=delivery_info.get("delivery_city", ""),
        delivery_street=delivery_info.get("delivery_street", ""),
        delivery_apartment=delivery_info.get("delivery_apartment", ""),
        delivery_floor=delivery_info.get("delivery_floor", ""),
        delivery_date=delivery_info.get("delivery_date"),
        delivery_comment=delivery_info.get("delivery_comment", ""),
        promo_code=contact_info.get("promo_code", ""),
    )

    for item in items:
        if item.cheesecake_variant_id:
            variant = item.cheesecake_variant
            OrderItem.objects.create(
                order=order, product_type="cheesecake",
                cheesecake=variant.cheesecake, cheesecake_variant=variant,
                name_snapshot=variant.cheesecake.name, variant_snapshot=variant.name,
                unit_price=variant.price, quantity=item.quantity, delivery_date=item.delivery_date,
            )
        else:
            course = item.course
            order_item = OrderItem.objects.create(
                order=order, product_type="course", course=course,
                name_snapshot=course.title, variant_snapshot="Online course",
                unit_price=course.price, quantity=1,
            )
            Enrollment.objects.update_or_create(
                user=request.user, course=course,
                defaults={"order_item": order_item, "status": Enrollment.Status.PENDING_PAYMENT},
            )

    order.delivery_fee = 300 if has_cheesecake and delivery_info.get("delivery_method") in ("courier", "express") else 0
    order.recalculate_totals()
    order.save()

    cart.items.all().delete()
    return order


def get_order_whatsapp_url(order: Order) -> str:
    return build_whatsapp_url(order)
