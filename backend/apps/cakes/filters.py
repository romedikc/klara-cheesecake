import django_filters as filters

from ..cakes.models import Cheesecake


class CheesecakeFilter(filters.FilterSet):
    category = filters.CharFilter(field_name="category__slug")
    is_vegan = filters.BooleanFilter()
    is_gluten_free = filters.BooleanFilter()
    min_price = filters.NumberFilter(field_name="base_price", lookup_expr="gte")
    max_price = filters.NumberFilter(field_name="base_price", lookup_expr="lte")

    class Meta:
        model = Cheesecake
        fields = ["category", "is_vegan", "is_gluten_free", "badge"]
