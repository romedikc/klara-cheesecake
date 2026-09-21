import uuid

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models

from ..cakes.models import Cheesecake, CheesecakeVariant
from ..common.models import TimeStampedModel
from ..courses.models import Course


class Cart(TimeStampedModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name="carts",
    )
    session_key = models.CharField(max_length=64, null=True, blank=True, db_index=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user"], name="unique_cart_per_user",
                                    condition=models.Q(user__isnull=False)),
            models.UniqueConstraint(fields=["session_key"], name="unique_cart_per_session",
                                    condition=models.Q(session_key__isnull=False)),
        ]

    def __str__(self):
        return f"Cart<{self.user or self.session_key}>"

    @property
    def has_course_item(self) -> bool:
        return self.items.filter(course__isnull=False).exists()


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")

    cheesecake_variant = models.ForeignKey(
        CheesecakeVariant, on_delete=models.CASCADE, null=True, blank=True, related_name="cart_items",
    )
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, null=True, blank=True, related_name="cart_items",
    )

    quantity = models.PositiveIntegerField(default=1)
    delivery_date = models.DateField(null=True, blank=True, help_text="Cheesecake items only.")
    special_request = models.CharField(max_length=255, blank=True)

    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["added_at"]

    def clean(self):
        has_variant = self.cheesecake_variant_id is not None
        has_course = self.course_id is not None
        if has_variant == has_course:
            raise ValidationError("A cart item must reference exactly one of cheesecake_variant or course.")
        if has_course and self.quantity != 1:
            raise ValidationError("Course quantity must be 1.")

    def __str__(self):
        return f"{self.quantity}x {self.cheesecake_variant or self.course}"

    @property
    def unit_price(self):
        return self.cheesecake_variant.price if self.cheesecake_variant_id else self.course.price

    @property
    def line_total(self):
        return self.unit_price * self.quantity

    @property
    def product_type(self):
        return "cheesecake" if self.cheesecake_variant_id else "course"


class OrderType(models.TextChoices):
    CHEESECAKE = "cheesecake", "Cheesecake"
    COURSE = "course", "Course"
    MIXED = "mixed", "Mixed"


class OrderStatus(models.TextChoices):
    NEW = "new", "New"
    AWAITING_WHATSAPP_CONTACT = "awaiting_whatsapp_contact", "Awaiting WhatsApp contact"
    AWAITING_PAYMENT = "awaiting_payment", "Awaiting payment"
    PAID = "paid", "Paid"
    PROCESSING = "processing", "Processing"
    COMPLETED = "completed", "Completed"
    CANCELLED = "cancelled", "Cancelled"


class DeliveryMethod(models.TextChoices):
    COURIER = "courier", "Courier"
    EXPRESS = "express", "Express courier"
    PICKUP = "pickup", "Studio pickup"
    NOT_APPLICABLE = "n_a", "Not applicable (digital order)"


def generate_order_number() -> str:
    return f"KL-{uuid.uuid4().hex[:6].upper()}"


class Order(TimeStampedModel):
    order_number = models.CharField(max_length=20, unique=True, default=generate_order_number)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="orders",
    )
    order_type = models.CharField(max_length=12, choices=OrderType.choices)
    status = models.CharField(max_length=30, choices=OrderStatus.choices, default=OrderStatus.NEW)

    contact_name = models.CharField(max_length=160)
    contact_phone = models.CharField(max_length=32)
    contact_email = models.EmailField(blank=True)

    delivery_method = models.CharField(max_length=10, choices=DeliveryMethod.choices,
                                       default=DeliveryMethod.NOT_APPLICABLE)
    delivery_city = models.CharField(max_length=120, blank=True)
    delivery_street = models.CharField(max_length=255, blank=True)
    delivery_apartment = models.CharField(max_length=40, blank=True)
    delivery_floor = models.CharField(max_length=20, blank=True)
    delivery_date = models.DateField(null=True, blank=True)
    delivery_comment = models.TextField(blank=True)

    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    promo_code = models.CharField(max_length=40, blank=True)

    whatsapp_contacted_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.order_number

    def recalculate_totals(self):
        self.subtotal = sum((i.line_total for i in self.items.all()), start=0)
        self.total = self.subtotal + self.delivery_fee - self.discount_amount


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product_type = models.CharField(max_length=12, choices=[("cheesecake", "Cheesecake"), ("course", "Course")])

    cheesecake = models.ForeignKey(Cheesecake, on_delete=models.SET_NULL, null=True, blank=True,
                                   related_name="order_items")
    cheesecake_variant = models.ForeignKey(CheesecakeVariant, on_delete=models.SET_NULL, null=True, blank=True)
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name="order_items")

    # Snapshots so the order stays accurate even if the product changes later.
    name_snapshot = models.CharField(max_length=200)
    variant_snapshot = models.CharField(max_length=120, blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    delivery_date = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.quantity}x {self.name_snapshot}"

    @property
    def line_total(self):
        return self.unit_price * self.quantity
