from rest_framework import serializers

from ..orders.models import Cart, CartItem, DeliveryMethod, Order, OrderItem


class CartItemSerializer(serializers.ModelSerializer):
    product_type = serializers.ReadOnlyField()
    unit_price = serializers.ReadOnlyField()
    line_total = serializers.ReadOnlyField()
    name = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            "id", "cheesecake_variant", "course", "quantity", "delivery_date",
            "special_request", "product_type", "unit_price", "line_total", "name",
        ]

    def get_name(self, obj):
        if obj.cheesecake_variant_id:
            return f"{obj.cheesecake_variant.cheesecake.name} ({obj.cheesecake_variant.name})"
        return obj.course.title

    def validate(self, attrs):
        variant = attrs.get("cheesecake_variant")
        course = attrs.get("course")
        if bool(variant) == bool(course):
            raise serializers.ValidationError("Provide exactly one of cheesecake_variant or course.")
        if course:
            attrs["quantity"] = 1
        return attrs


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.SerializerMethodField()
    has_course_item = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = ["id", "items", "subtotal", "has_course_item"]

    def get_subtotal(self, obj):
        return sum((i.line_total for i in obj.items.all()), start=0)


class OrderItemSerializer(serializers.ModelSerializer):
    line_total = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = [
            "id", "product_type", "name_snapshot", "variant_snapshot",
            "unit_price", "quantity", "delivery_date", "line_total",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "order_number", "order_type", "status", "contact_name",
            "contact_phone", "contact_email", "delivery_method", "delivery_city",
            "delivery_street", "delivery_apartment", "delivery_floor",
            "delivery_date", "delivery_comment", "subtotal", "delivery_fee",
            "discount_amount", "total", "promo_code", "items", "created_at",
        ]
        read_only_fields = [
            "id", "order_number", "order_type", "status", "subtotal",
            "delivery_fee", "discount_amount", "total", "items", "created_at",
        ]


class CheckoutSerializer(serializers.Serializer):
    """Input payload for POST /api/orders/checkout/ — mirrors the checkout page's forms."""

    contact_name = serializers.CharField(max_length=160)
    contact_phone = serializers.CharField(max_length=32)
    contact_email = serializers.EmailField(required=False, allow_blank=True)
    promo_code = serializers.CharField(max_length=40, required=False, allow_blank=True)

    delivery_method = serializers.ChoiceField(choices=DeliveryMethod.choices, required=False)
    delivery_city = serializers.CharField(max_length=120, required=False, allow_blank=True)
    delivery_street = serializers.CharField(max_length=255, required=False, allow_blank=True)
    delivery_apartment = serializers.CharField(max_length=40, required=False, allow_blank=True)
    delivery_floor = serializers.CharField(max_length=20, required=False, allow_blank=True)
    delivery_date = serializers.DateField(required=False, allow_null=True)
    delivery_comment = serializers.CharField(required=False, allow_blank=True)


class OrderResultSerializer(serializers.Serializer):
    """Response shape for checkout: the order, plus the next step for the frontend."""

    order = OrderSerializer()
    next_step = serializers.ChoiceField(choices=["whatsapp", "payment"])
    whatsapp_url = serializers.CharField(required=False, allow_null=True)
    payment_providers_url = serializers.CharField(required=False, allow_null=True)
