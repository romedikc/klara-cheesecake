from django.urls import path
from rest_framework.routers import DefaultRouter

from ..common.views import ContactMessageViewSet, SiteSettingsView

router = DefaultRouter()
router.register("contact-messages", ContactMessageViewSet, basename="contact-message")

urlpatterns = [
                  path("site-settings/", SiteSettingsView.as_view(), name="site-settings"),
              ] + router.urls
