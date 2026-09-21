from django.contrib import admin

from ..cakes.models import (
    Cheesecake, CheesecakeCategory, CheesecakeImage, CheesecakeReview,
    CheesecakeVariant, DeliveryBlackoutDate,
)


class CheesecakeImageInline(admin.TabularInline):
    model = CheesecakeImage
    extra = 1


class CheesecakeVariantInline(admin.TabularInline):
    model = CheesecakeVariant
    extra = 1


@admin.register(Cheesecake)
class CheesecakeAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "base_price", "badge", "is_available", "status"]
    list_filter = ["category", "status", "is_available", "is_vegan", "is_gluten_free", "badge"]
    search_fields = ["name", "description"]
    prepopulated_fields = {"slug": ("name",)}
    inlines = [CheesecakeImageInline, CheesecakeVariantInline]


@admin.register(CheesecakeCategory)
class CheesecakeCategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "sort_order"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(CheesecakeReview)
class CheesecakeReviewAdmin(admin.ModelAdmin):
    list_display = ["cheesecake", "author_name", "rating", "is_approved", "created_at"]
    list_filter = ["is_approved", "rating"]


@admin.register(DeliveryBlackoutDate)
class DeliveryBlackoutDateAdmin(admin.ModelAdmin):
    list_display = ["date", "reason"]
