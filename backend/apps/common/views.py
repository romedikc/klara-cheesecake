from rest_framework import mixins, viewsets
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import AllowAny

from ..common.models import ContactMessage, SiteSettings
from ..common.serializers import ContactMessageSerializer, SiteSettingsSerializer


class SiteSettingsView(RetrieveAPIView):
    """GET /api/site-settings/ — public studio info for the Contacts page."""

    serializer_class = SiteSettingsSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return SiteSettings.load()


class ContactMessageViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """POST /api/contact-messages/ — public contact form submission."""

    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]
