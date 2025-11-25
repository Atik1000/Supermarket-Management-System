from rest_framework import serializers
from .models import Category, Brand, Product, ProductVariant, ProductImage


class CategoryListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for category lists"""
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'parent', 'is_active']


class CategorySerializer(serializers.ModelSerializer):
    """Full category serializer with children"""
    
    children = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'parent',
            'image', 'is_active', 'display_order',
            'created_at', 'updated_at', 'children', 'product_count'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']
    
    def get_children(self, obj):
        if obj.children.exists():
            return CategoryListSerializer(obj.children.filter(is_active=True), many=True).data
        return []
    
    def get_product_count(self, obj):
        return obj.products.filter(is_active=True, is_deleted=False).count()


class BrandListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for brand lists"""
    
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'logo', 'is_active']


class BrandSerializer(serializers.ModelSerializer):
    """Full brand serializer"""
    
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Brand
        fields = [
            'id', 'name', 'slug', 'description', 'logo', 'website',
            'is_active', 'created_at', 'updated_at', 'product_count'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']
    
    def get_product_count(self, obj):
        return obj.products.filter(is_active=True, is_deleted=False).count()


class ProductImageSerializer(serializers.ModelSerializer):
    """Product image serializer"""
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'display_order', 'created_at']
        read_only_fields = ['created_at']


class ProductVariantSerializer(serializers.ModelSerializer):
    """Product variant serializer"""
    
    final_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = ProductVariant
        fields = [
            'id', 'name', 'sku', 'barcode', 'price_adjustment',
            'stock_quantity', 'is_active', 'is_default', 'final_price',
            'is_in_stock', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for product lists"""
    
    category_name = serializers.CharField(source='category.name', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    primary_image = serializers.SerializerMethodField()
    final_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'category', 'category_name',
            'brand', 'brand_name', 'short_description', 'selling_price',
            'discount_price', 'final_price', 'discount_percentage',
            'stock_quantity', 'is_in_stock', 'is_low_stock',
            'is_featured', 'is_new', 'primary_image'
        ]
    
    def get_primary_image(self, obj):
        primary_img = obj.images.filter(is_primary=True).first()
        if primary_img:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary_img.image.url)
            return primary_img.image.url
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full product serializer with all relations"""
    
    category = CategoryListSerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    brand = BrandListSerializer(read_only=True)
    brand_id = serializers.PrimaryKeyRelatedField(
        queryset=Brand.objects.all(),
        source='brand',
        write_only=True,
        required=False,
        allow_null=True
    )
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    final_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'barcode',
            'category', 'category_id', 'brand', 'brand_id',
            'description', 'short_description',
            'cost_price', 'selling_price', 'discount_price',
            'final_price', 'discount_percentage',
            'stock_quantity', 'low_stock_threshold', 'track_inventory',
            'is_in_stock', 'is_low_stock',
            'weight', 'dimensions',
            'is_active', 'is_featured', 'is_new',
            'meta_title', 'meta_description', 'meta_keywords',
            'images', 'variants',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']
    
    def validate(self, data):
        """Validate product data"""
        if 'discount_price' in data and 'selling_price' in data:
            if data['discount_price'] and data['discount_price'] >= data['selling_price']:
                raise serializers.ValidationError({
                    'discount_price': 'Discount price must be less than selling price'
                })
        
        if 'cost_price' in data and 'selling_price' in data:
            if data['cost_price'] > data['selling_price']:
                raise serializers.ValidationError({
                    'selling_price': 'Selling price should be greater than cost price'
                })
        
        return data


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating products"""
    
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'sku', 'barcode', 'category', 'brand',
            'description', 'short_description',
            'cost_price', 'selling_price', 'discount_price',
            'stock_quantity', 'low_stock_threshold', 'track_inventory',
            'weight', 'dimensions',
            'is_active', 'is_featured', 'is_new',
            'meta_title', 'meta_description', 'meta_keywords',
            'images', 'variants'
        ]
        read_only_fields = ['id']
    
    def validate(self, data):
        """Validate product data"""
        if 'discount_price' in data and 'selling_price' in data:
            if data.get('discount_price') and data['discount_price'] >= data['selling_price']:
                raise serializers.ValidationError({
                    'discount_price': 'Discount price must be less than selling price'
                })
        
        if 'cost_price' in data and 'selling_price' in data:
            if data['cost_price'] > data['selling_price']:
                raise serializers.ValidationError({
                    'selling_price': 'Selling price should be greater than cost price'
                })
        
        return data
