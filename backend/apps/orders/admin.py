from django.contrib import admin

from ..orders.models import Cart, CartItem, Order, OrderItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "session_key", "updated_at"]
    inlines = [CartItemInline]


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ["line_total"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["order_number", "user", "order_type", "status", "total", "created_at"]
    list_filter = ["order_type", "status", "delivery_method"]
    search_fields = ["order_number", "contact_name", "contact_email", "contact_phone"]
    inlines = [OrderItemInline]
    readonly_fields = ["order_number", "subtotal", "total"]
