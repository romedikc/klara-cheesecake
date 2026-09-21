from django.core.exceptions import PermissionDenied
from rest_framework import permissions, status, viewsets
from rest_framework.exceptions import PermissionDenied as DRFPermissionDenied
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from ..orders.models import Order
from ..orders.serializers import (
    CartItemSerializer, CartSerializer, CheckoutSerializer, OrderSerializer,
)
from ..orders.services import CheckoutError, checkout_cart, get_or_create_cart, get_order_whatsapp_url


class CartView(APIView):
    """
    GET    /api/orders/cart/                 — view the current cart
    POST   /api/orders/cart/items/           — add an item
    PATCH  /api/orders/cart/items/<id>/      — update quantity/date
    DELETE /api/orders/cart/items/<id>/      — remove an item
    DELETE /api/orders/cart/                 — clear the cart

    Works for both guests (session-based) and logged-in users (see
    apps.orders.services.get_or_create_cart), matching the cart page which
    is reachable before login.
    """

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        cart = get_or_create_cart(request)
        return Response(CartSerializer(cart).data)

    def delete(self, request):
        cart = get_or_create_cart(request)
        cart.items.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CartItemView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        cart = get_or_create_cart(request)
        serializer = CartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(cart=cart)
        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)

    def patch(self, request, item_id):
        cart = get_or_create_cart(request)
        item = cart.items.filter(id=item_id).first()
        if not item:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = CartItemSerializer(item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(CartSerializer(cart).data)

    def delete(self, request, item_id):
        cart = get_or_create_cart(request)
        cart.items.filter(id=item_id).delete()
        return Response(CartSerializer(cart).data)


class CheckoutView(APIView):
    """
    POST /api/orders/checkout/ — the single endpoint behind both purchase
    flows. It inspects the cart contents and decides what happens next:

    * cheesecake-only cart -> Order created with status
      `awaiting_whatsapp_contact`, response includes `whatsapp_url`.
    * cart containing a course -> requires auth; Order created with status
      `awaiting_payment`, response points the frontend at
      `payment_providers_url` to continue into the payment page.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        cart = get_or_create_cart(request)
        payload = CheckoutSerializer(data=request.data)
        payload.is_valid(raise_exception=True)
        data = payload.validated_data

        contact_info = {
            "contact_name": data.get("contact_name"),
            "contact_phone": data.get("contact_phone"),
            "contact_email": data.get("contact_email", ""),
            "promo_code": data.get("promo_code", ""),
        }
        delivery_info = {k: v for k, v in data.items() if k.startswith("delivery_")}

        try:
            order = checkout_cart(request, cart, contact_info, delivery_info)
        except CheckoutError as exc:
            raise ValidationError(str(exc))
        except PermissionDenied as exc:
            raise DRFPermissionDenied(str(exc))

        if order.order_type == "cheesecake":
            return Response({
                "order": OrderSerializer(order).data,
                "next_step": "whatsapp",
                "whatsapp_url": get_order_whatsapp_url(order),
            }, status=status.HTTP_201_CREATED)

        return Response({
            "order": OrderSerializer(order).data,
            "next_step": "payment",
            "payment_providers_url": "/api/payments/providers/",
        }, status=status.HTTP_201_CREATED)


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    """List/retrieve past orders — 'order history' on the personal account page."""

    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related("items")
