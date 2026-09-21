from django.urls import path
from rest_framework.routers import DefaultRouter

from ..orders.views import CartItemView, CartView, CheckoutView, OrderViewSet

router = DefaultRouter()
router.register("history", OrderViewSet, basename="order-history")

urlpatterns = [
                  path("cart/", CartView.as_view(), name="cart"),
                  path("cart/items/", CartItemView.as_view(), name="cart-items"),
                  path("cart/items/<int:item_id>/", CartItemView.as_view(), name="cart-item-detail"),
                  path("checkout/", CheckoutView.as_view(), name="checkout"),
              ] + router.urls
