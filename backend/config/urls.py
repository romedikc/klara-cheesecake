from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="docs"),

    path("api/auth/", include("backend.apps.accounts.urls")),
    path("api/", include("backend.apps.common.urls")),
    path("api/cakes/", include("backend.apps.cakes.urls")),
    path("api/courses/", include("backend.apps.courses.urls")),
    path("api/orders/", include("backend.apps.orders.urls")),
    path("api/payments/", include("backend.apps.payments.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
