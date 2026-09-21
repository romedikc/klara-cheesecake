from rest_framework.routers import DefaultRouter

from ..cakes.views import CheesecakeCategoryViewSet, CheesecakeViewSet

router = DefaultRouter()
router.register("categories", CheesecakeCategoryViewSet, basename="cheesecake-category")
router.register("", CheesecakeViewSet, basename="cheesecake")

urlpatterns = router.urls
