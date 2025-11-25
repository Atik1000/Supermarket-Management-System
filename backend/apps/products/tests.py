import pytest
from decimal import Decimal
from django.utils.text import slugify
from apps.products.models import Category, Brand, Product, ProductVariant, ProductImage


@pytest.mark.django_db
class TestCategoryModel:
    """Tests for Category model"""
    
    def test_category_creation(self):
        """Test creating a category"""
        category = Category.objects.create(
            name='Electronics',
            description='Electronic products'
        )
        assert category.name == 'Electronics'
        assert category.slug == 'electronics'
        assert category.is_active is True
        assert category.parent is None
    
    def test_category_slug_auto_generation(self):
        """Test slug is auto-generated from name"""
        category = Category.objects.create(name='Home & Garden')
        assert category.slug == 'home-garden'
    
    def test_category_hierarchy(self):
        """Test parent-child relationship"""
        parent = Category.objects.create(name='Electronics')
        child = Category.objects.create(name='Laptops', parent=parent)
        
        assert child.parent == parent
        assert child in parent.children.all()
    
    def test_category_get_all_children(self):
        """Test getting all descendant categories"""
        parent = Category.objects.create(name='Electronics')
        child1 = Category.objects.create(name='Computers', parent=parent)
        grandchild = Category.objects.create(name='Laptops', parent=child1)
        
        children = parent.get_all_children()
        assert child1 in children
        assert grandchild in children
        assert len(children) == 2
    
    def test_category_str(self):
        """Test string representation"""
        category = Category.objects.create(name='Books')
        assert str(category) == 'Books'


@pytest.mark.django_db
class TestBrandModel:
    """Tests for Brand model"""
    
    def test_brand_creation(self):
        """Test creating a brand"""
        brand = Brand.objects.create(
            name='Apple',
            description='Technology company',
            website='https://apple.com'
        )
        assert brand.name == 'Apple'
        assert brand.slug == 'apple'
        assert brand.is_active is True
    
    def test_brand_slug_auto_generation(self):
        """Test slug is auto-generated from name"""
        brand = Brand.objects.create(name='Samsung Electronics')
        assert brand.slug == 'samsung-electronics'
    
    def test_brand_str(self):
        """Test string representation"""
        brand = Brand.objects.create(name='Sony')
        assert str(brand) == 'Sony'


@pytest.mark.django_db
class TestProductModel:
    """Tests for Product model"""
    
    @pytest.fixture
    def category(self):
        return Category.objects.create(name='Electronics')
    
    @pytest.fixture
    def brand(self):
        return Brand.objects.create(name='Apple')
    
    @pytest.fixture
    def product(self, category, brand):
        return Product.objects.create(
            name='iPhone 15',
            sku='IP15-001',
            category=category,
            brand=brand,
            cost_price=Decimal('800.00'),
            selling_price=Decimal('999.00'),
            stock_quantity=50
        )
    
    def test_product_creation(self, product):
        """Test creating a product"""
        assert product.name == 'iPhone 15'
        assert product.sku == 'IP15-001'
        assert product.selling_price == Decimal('999.00')
        assert product.is_active is True
        assert product.is_deleted is False
    
    def test_product_slug_auto_generation(self, category):
        """Test slug is auto-generated"""
        product = Product.objects.create(
            name='MacBook Pro',
            sku='MBP-001',
            category=category,
            cost_price=Decimal('1500.00'),
            selling_price=Decimal('1999.00')
        )
        assert product.slug == 'macbook-pro-mbp-001'
    
    def test_product_final_price_without_discount(self, product):
        """Test final price when no discount"""
        assert product.final_price == Decimal('999.00')
    
    def test_product_final_price_with_discount(self, product):
        """Test final price with discount"""
        product.discount_price = Decimal('899.00')
        product.save()
        assert product.final_price == Decimal('899.00')
    
    def test_product_discount_percentage(self, product):
        """Test discount percentage calculation"""
        product.discount_price = Decimal('799.00')
        product.save()
        expected = round(((Decimal('999.00') - Decimal('799.00')) / Decimal('999.00')) * 100, 2)
        assert product.discount_percentage == expected
    
    def test_product_is_in_stock(self, product):
        """Test in stock check"""
        assert product.is_in_stock is True
        
        product.stock_quantity = 0
        assert product.is_in_stock is False
    
    def test_product_is_low_stock(self, product):
        """Test low stock check"""
        product.stock_quantity = 5
        product.low_stock_threshold = 10
        product.save()
        assert product.is_low_stock is True
        
        product.stock_quantity = 20
        assert product.is_low_stock is False
    
    def test_product_soft_delete(self, product):
        """Test soft delete functionality"""
        product.soft_delete()
        assert product.is_deleted is True
        assert product.is_active is False
        assert product.deleted_at is not None
    
    def test_product_str(self, product):
        """Test string representation"""
        assert str(product) == 'iPhone 15'


@pytest.mark.django_db
class TestProductVariantModel:
    """Tests for ProductVariant model"""
    
    @pytest.fixture
    def category(self):
        return Category.objects.create(name='Clothing')
    
    @pytest.fixture
    def product(self, category):
        return Product.objects.create(
            name='T-Shirt',
            sku='TS-001',
            category=category,
            cost_price=Decimal('10.00'),
            selling_price=Decimal('20.00'),
            stock_quantity=100
        )
    
    @pytest.fixture
    def variant(self, product):
        return ProductVariant.objects.create(
            product=product,
            name='Large - Red',
            sku='TS-001-L-R',
            price_adjustment=Decimal('2.00'),
            stock_quantity=25
        )
    
    def test_variant_creation(self, variant):
        """Test creating a product variant"""
        assert variant.name == 'Large - Red'
        assert variant.sku == 'TS-001-L-R'
        assert variant.is_active is True
    
    def test_variant_final_price(self, variant):
        """Test variant final price calculation"""
        expected = Decimal('20.00') + Decimal('2.00')
        assert variant.final_price == expected
    
    def test_variant_is_in_stock(self, variant):
        """Test variant in stock check"""
        assert variant.is_in_stock is True
        
        variant.stock_quantity = 0
        assert variant.is_in_stock is False
    
    def test_variant_str(self, variant):
        """Test string representation"""
        assert str(variant) == 'T-Shirt - Large - Red'


@pytest.mark.django_db
class TestProductImageModel:
    """Tests for ProductImage model"""
    
    @pytest.fixture
    def category(self):
        return Category.objects.create(name='Electronics')
    
    @pytest.fixture
    def product(self, category):
        return Product.objects.create(
            name='Camera',
            sku='CAM-001',
            category=category,
            cost_price=Decimal('300.00'),
            selling_price=Decimal('450.00')
        )
    
    def test_image_creation(self, product):
        """Test creating a product image"""
        from django.core.files.uploadedfile import SimpleUploadedFile
        
        image_file = SimpleUploadedFile(
            name='test.jpg',
            content=b'fake image content',
            content_type='image/jpeg'
        )
        
        image = ProductImage.objects.create(
            product=product,
            image=image_file,
            alt_text='Camera front view',
            is_primary=True,
            display_order=1
        )
        
        assert image.product == product
        assert image.alt_text == 'Camera front view'
        assert image.is_primary is True
    
    def test_only_one_primary_image(self, product):
        """Test that only one image can be primary"""
        from django.core.files.uploadedfile import SimpleUploadedFile
        
        image1 = ProductImage.objects.create(
            product=product,
            image=SimpleUploadedFile('img1.jpg', b'content', 'image/jpeg'),
            is_primary=True
        )
        
        image2 = ProductImage.objects.create(
            product=product,
            image=SimpleUploadedFile('img2.jpg', b'content', 'image/jpeg'),
            is_primary=True
        )
        
        # Refresh image1 from database
        image1.refresh_from_db()
        assert image1.is_primary is False
        assert image2.is_primary is True
    
    def test_image_str(self, product):
        """Test string representation"""
        from django.core.files.uploadedfile import SimpleUploadedFile
        
        image = ProductImage.objects.create(
            product=product,
            image=SimpleUploadedFile('test.jpg', b'content', 'image/jpeg')
        )
        assert 'Camera - Image' in str(image)
