import datetime as dt

from rest_framework import mixins, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from ..cakes.filters import CheesecakeFilter
from ..cakes.models import Cheesecake, CheesecakeCategory, DeliveryBlackoutDate
from ..cakes.serializers import (
    CheesecakeCategorySerializer, CheesecakeDetailSerializer,
    CheesecakeListSerializer, CheesecakeReviewSerializer, DeliverySlotSerializer,
)


class CheesecakeCategoryViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    """Category filter chips shown on the cheesecake catalog page."""

    queryset = CheesecakeCategory.objects.all()
    serializer_class = CheesecakeCategorySerializer
    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]
    pagination_class = None


class CheesecakeViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    """
    Browse + view cheesecake details. Read-only in the public API — no
    online purchase endpoint here by design: buying happens over WhatsApp
    (see apps.orders for how a cheesecake order is turned into a wa.me link).
    """

    queryset = (
        Cheesecake.objects.filter(status="active")
        .select_related("category")
        .prefetch_related("images", "variants", "reviews")
    )
    filterset_class = CheesecakeFilter
    search_fields = ["name", "short_description", "description"]
    ordering_fields = ["base_price", "created_at", "name"]
    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        return CheesecakeDetailSerializer if self.action == "retrieve" else CheesecakeListSerializer

    @action(detail=True, methods=["get", "post"], url_path="reviews")
    def reviews(self, request, slug=None):
        cheesecake = self.get_object()
        if request.method == "POST":
            serializer = CheesecakeReviewSerializer(
                data=request.data, context={"cheesecake_id": cheesecake.id}
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=201)
        qs = cheesecake.reviews.filter(is_approved=True)
        return Response(CheesecakeReviewSerializer(qs, many=True).data)

    @action(detail=True, methods=["get"], url_path="delivery-slots")
    def delivery_slots(self, request, slug=None):
        """
        Computes the next few deliverable dates given the cheesecake's
        prep_hours lead time and any blackout dates — mirrors the delivery
        date pills on the product page.
        """
        cheesecake = self.get_object()
        blackout = set(DeliveryBlackoutDate.objects.values_list("date", flat=True))
        earliest = dt.datetime.now() + dt.timedelta(hours=cheesecake.prep_hours)
        slots, cursor, found = [], earliest.date(), 0
        while found < 5:
            available = cursor not in blackout
            slots.append({"date": cursor, "label": cursor.strftime("%d %b"), "available": available})
            if available:
                found += 1
            cursor += dt.timedelta(days=1)
        return Response(DeliverySlotSerializer(slots, many=True).data)
