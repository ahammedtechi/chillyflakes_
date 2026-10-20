# Django REST Framework Backend Guide for Chilly Flakes

This document details the exact Django models, serializers, views, and URL patterns matching the frontend API architecture configured in `src/api/`.

---

## 1. Quick Start & Setup

### Install Dependencies
```bash
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt django-filter pillow
```

### Initialize Project & Apps
```bash
django-admin startproject backend
cd backend
python manage.py startapp core
python manage.py startapp products
python manage.py startapp services
python manage.py startapp orders
python manage.py startapp accounts
```

---

## 2. Django `settings.py` Configuration

Add the following to your `settings.py`:

```python
INSTALLED_APPS = [
    # Django Built-in
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third Party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',

    # Local Apps
    'core',
    'products',
    'services',
    'orders',
    'accounts',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # MUST be near the top
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CORS Configuration for React (Vite)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
CORS_ALLOW_CREDENTIALS = True

# REST Framework Settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ),
}

# Media files (for product/service image uploads)
import os
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

---

## 3. Models

### `products/models.py`
```python
from django.db import models

class Category(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=100)
    icon_name = models.CharField(max_length=50, default='Sparkles')
    product_count = models.IntegerField(default=0)
    image = models.URLField(max_length=500)
    description = models.TextField()

    def __str__(self):
        return self.name

class Product(models.Model):
    CONDITION_CHOICES = (
        ('New', 'New'),
        ('Like New', 'Like New'),
        ('Pre-Owned', 'Pre-Owned'),
    )

    id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='New')
    condition_details = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.IntegerField(default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=5.0)
    reviews_count = models.IntegerField(default=0)
    image = models.URLField(max_length=500)
    description = models.TextField()
    material = models.CharField(max_length=200)
    features = models.JSONField(default=list)
    additional_images = models.JSONField(default=list, blank=True)
    is_featured = models.BooleanField(default=False)
    is_pre_owned = models.BooleanField(default=False)
    stock = models.IntegerField(default=10)
    is_assured = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
```

### `services/models.py`
```python
from django.db import models

class Service(models.Model):
    CATEGORY_CHOICES = (
        ('Wellness', 'Wellness'),
        ('Home', 'Home'),
        ('Crafts', 'Crafts'),
        ('Education', 'Education'),
    )

    id = models.CharField(max_length=100, primary_key=True)
    title = models.CharField(max_length=150)
    subtitle = models.CharField(max_length=150)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='Wellness')
    description = models.TextField()
    duration = models.CharField(max_length=50)
    price = models.CharField(max_length=50) # e.g. "From CAD $75.00"
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=5.0)
    reviews_count = models.IntegerField(default=0)
    image = models.URLField(max_length=500)

    def __str__(self):
        return self.title

class ServiceBooking(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='bookings')
    user_name = models.CharField(max_length=100)
    user_contact = models.CharField(max_length=100)
    preferred_date = models.DateField()
    preferred_time = models.CharField(max_length=50)
    status = models.CharField(max_length=20, default='confirmed')
    booking_ref = models.CharField(max_length=30, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.booking_ref} - {self.user_name} ({self.service.title})"
```

### `core/models.py` (Hero Slides & Newsletter)
```python
from django.db import models

class HeroSlide(models.Model):
    subtitle = models.CharField(max_length=100)
    title_line1 = models.CharField(max_length=100)
    title_line2 = models.CharField(max_length=100)
    description = models.TextField()
    button_text = models.CharField(max_length=50, default='Shop Now')
    image = models.CharField(max_length=500)
    category = models.CharField(max_length=50, default='All')
    background_position = models.CharField(max_length=100, default='right 30% center')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email
```

### `orders/models.py`
```python
from django.db import models

class Order(models.Model):
    order_number = models.CharField(max_length=30, unique=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_charge = models.DecimalField(max_digits=6, decimal_places=2, default=0.0)
    discount_amount = models.DecimalField(max_digits=6, decimal_places=2, default=0.0)
    postal_code = models.CharField(max_length=20, blank=True)
    customer_name = models.CharField(max_length=100, blank=True)
    customer_email = models.EmailField(blank=True)
    customer_phone = models.CharField(max_length=30, blank=True)
    status = models.CharField(max_length=30, default='processing')
    items_json = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.order_number} (${self.total_amount})"

class Coupon(models.Model):
    code = models.CharField(max_length=30, unique=True)
    discount_percent = models.IntegerField(default=10)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.code
```

---

## 4. Serializers

### `products/serializers.py`
```python
from rest_framework import serializers
from .models import Product, Category

class CategorySerializer(serializers.ModelSerializer):
    iconName = serializers.CharField(source='icon_name')
    productCount = serializers.IntegerField(source='product_count')

    class Meta:
        model = Category
        fields = ['id', 'name', 'iconName', 'productCount', 'image', 'description']

class ProductSerializer(serializers.ModelSerializer):
    originalPrice = serializers.FloatField(source='original_price')
    price = serializers.FloatField()
    conditionDetails = serializers.CharField(source='condition_details')
    reviewsCount = serializers.IntegerField(source='reviews_count')
    additionalImages = serializers.JSONField(source='additional_images', required=False)
    isFeatured = serializers.BooleanField(source='is_featured', required=False)
    isPreOwned = serializers.BooleanField(source='is_pre_owned', required=False)
    isAssured = serializers.BooleanField(source='is_assured', required=False)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'condition', 'conditionDetails',
            'price', 'originalPrice', 'discount', 'rating', 'reviewsCount',
            'image', 'additionalImages', 'description', 'material', 'features',
            'isFeatured', 'isPreOwned', 'stock', 'isAssured'
        ]
```

### `services/serializers.py`
```python
from rest_framework import serializers
from .models import Service, ServiceBooking
import random

class ServiceSerializer(serializers.ModelSerializer):
    reviewsCount = serializers.IntegerField(source='reviews_count')

    class Meta:
        model = Service
        fields = ['id', 'title', 'subtitle', 'category', 'description', 'duration', 'price', 'rating', 'reviewsCount', 'image']

class ServiceBookingSerializer(serializers.ModelSerializer):
    serviceId = serializers.CharField(source='service_id', write_only=True)
    userName = serializers.CharField(source='user_name')
    userContact = serializers.CharField(source='user_contact')
    preferredDate = serializers.DateField(source='preferred_date')
    preferredTime = serializers.CharField(source='preferred_time')

    class Meta:
        model = ServiceBooking
        fields = ['serviceId', 'userName', 'userContact', 'preferredDate', 'preferredTime']

    def create(self, validated_data):
        ref = f"CF-{random.randint(100000, 999999)}"
        booking = ServiceBooking.objects.create(
            service_id=validated_data['service_id'],
            user_name=validated_data['user_name'],
            user_contact=validated_data['user_contact'],
            preferred_date=validated_data['preferred_date'],
            preferred_time=validated_data['preferred_time'],
            booking_ref=ref,
            status='confirmed'
        )
        return booking
```

---

## 5. ViewSets & API Views

### `products/views.py`
```python
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = None
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'condition', 'is_featured']
    search_fields = ['name', 'description', 'material', 'category']
    ordering_fields = ['price', 'rating', 'reviews_count']

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_products = self.queryset.filter(is_featured=True)[:5]
        if not featured_products.exists():
            featured_products = self.queryset.all()[:5]
        serializer = self.get_serializer(featured_products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def trending(self, request):
        trending_products = self.queryset.all()[5:10]
        serializer = self.get_serializer(trending_products, many=True)
        return Response(serializer.data)
```

### `services/views.py`
```python
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Service, ServiceBooking
from .serializers import ServiceSerializer, ServiceBookingSerializer

class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    pagination_class = None

class ServiceBookingView(APIView):
    def post(self, request):
        serializer = ServiceBookingSerializer(data=request.data)
        if serializer.is_valid():
            booking = serializer.save()
            return Response({
                'id': f"booking-{booking.id}",
                'status': booking.status,
                'message': 'Booking request registered successfully.',
                'bookingRef': booking.booking_ref,
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

---

## 6. Root `urls.py`

```python
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from products.views import ProductViewSet, CategoryViewSet
from services.views import ServiceViewSet, ServiceBookingView

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'services', ServiceViewSet, basename='service')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/services/bookings/', ServiceBookingView.as_view(), name='service-booking'),
    
    # SimpleJWT Auth endpoints
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
```

---

## 7. Frontend Integration Status

The frontend is already 100% prepared to connect:
- **API Base URL:** Configured in `.env` as `VITE_API_BASE_URL=http://localhost:8000/api`
- **Fallback Mode:** If the Django server is offline, the frontend seamlessly uses structured mock data with zero crash.
- **JWT & CSRF Handling:** The client automatically sends `Authorization: Bearer <token>` and `X-CSRFToken` headers.
- **Daily Rotation:** Operates on the retrieved product pool automatically.
