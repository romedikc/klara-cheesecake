from rest_framework import serializers

from ..cakes.models import (
    Cheesecake, CheesecakeCategory, CheesecakeImage, CheesecakeReview,
    CheesecakeVariant,
)


class CheesecakeCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CheesecakeCategory
        fields = ["id", "name", "slug", "description"]


class CheesecakeImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheesecakeImage
        fields = ["id", "image", "alt_text", "is_primary", "sort_order"]


class CheesecakeVariantSerializer(serializers.ModelSerializer):
    price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CheesecakeVariant
        fields = ["id", "name", "portion_note", "price_delta", "price", "is_default"]


class CheesecakeReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheesecakeReview
        fields = ["id", "author_name", "rating", "text", "created_at"]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        validated_data["cheesecake_id"] = self.context["cheesecake_id"]
        return super().create(validated_data)


class CheesecakeListSerializer(serializers.ModelSerializer):
    category = CheesecakeCategorySerializer(read_only=True)
    primary_image = serializers.SerializerMethodField()
    average_rating = serializers.ReadOnlyField()
    reviews_count = serializers.ReadOnlyField()
    is_on_sale = serializers.ReadOnlyField()

    class Meta:
        model = Cheesecake
        fields = [
            "id", "name", "slug", "category", "short_description", "base_price",
            "old_price", "is_on_sale", "badge", "is_vegan", "is_gluten_free",
            "is_available", "primary_image", "average_rating", "reviews_count",
        ]

    def get_primary_image(self, obj):
        img = next((i for i in obj.images.all() if i.is_primary), None) or next(iter(obj.images.all()), None)
        return CheesecakeImageSerializer(img).data if img else None


class CheesecakeDetailSerializer(CheesecakeListSerializer):
    images = CheesecakeImageSerializer(many=True, read_only=True)
    variants = CheesecakeVariantSerializer(many=True, read_only=True)
    reviews = serializers.SerializerMethodField()

    class Meta(CheesecakeListSerializer.Meta):
        fields = CheesecakeListSerializer.Meta.fields + [
            "description", "ingredients", "allergen_info", "prep_hours",
            "images", "variants", "reviews",
        ]

    def get_reviews(self, obj):
        qs = obj.reviews.filter(is_approved=True)[:20]
        return CheesecakeReviewSerializer(qs, many=True).data


class DeliverySlotSerializer(serializers.Serializer):
    date = serializers.DateField()
    label = serializers.CharField()
    available = serializers.BooleanField()
