from django.core.management.base import BaseCommand
from decimal import Decimal
from apps.products.models import Category, Brand, Product, ProductVariant, ProductImage


class Command(BaseCommand):
    help = 'Seed database with sample product data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding product data...')

        # Create Categories
        electronics = Category.objects.create(
            name='Electronics',
            description='Electronic devices and accessories',
            display_order=1
        )
        computers = Category.objects.create(
            name='Computers',
            description='Desktop and laptop computers',
            parent=electronics,
            display_order=1
        )
        phones = Category.objects.create(
            name='Mobile Phones',
            description='Smartphones and accessories',
            parent=electronics,
            display_order=2
        )
        
        clothing = Category.objects.create(
            name='Clothing',
            description='Apparel for men and women',
            display_order=2
        )
        mens = Category.objects.create(
            name="Men's Clothing",
            parent=clothing,
            display_order=1
        )
        womens = Category.objects.create(
            name="Women's Clothing",
            parent=clothing,
            display_order=2
        )
        
        groceries = Category.objects.create(
            name='Groceries',
            description='Food and household items',
            display_order=3
        )

        self.stdout.write(self.style.SUCCESS(f'Created {Category.objects.count()} categories'))

        # Create Brands
        apple = Brand.objects.create(
            name='Apple',
            description='Technology company',
            website='https://apple.com'
        )
        samsung = Brand.objects.create(
            name='Samsung',
            description='Electronics manufacturer',
            website='https://samsung.com'
        )
        dell = Brand.objects.create(
            name='Dell',
            description='Computer manufacturer',
            website='https://dell.com'
        )
        nike = Brand.objects.create(
            name='Nike',
            description='Sportswear brand',
            website='https://nike.com'
        )
        adidas = Brand.objects.create(
            name='Adidas',
            description='Sportswear brand',
            website='https://adidas.com'
        )

        self.stdout.write(self.style.SUCCESS(f'Created {Brand.objects.count()} brands'))

        # Create Products
        products_data = [
            {
                'name': 'iPhone 15 Pro',
                'sku': 'IP15P-001',
                'barcode': '194253396912',
                'category': phones,
                'brand': apple,
                'description': 'Latest iPhone with A17 Pro chip, titanium design, and action button.',
                'short_description': 'Premium smartphone with advanced camera system',
                'cost_price': Decimal('900.00'),
                'selling_price': Decimal('1199.00'),
                'discount_price': Decimal('1099.00'),
                'stock_quantity': 25,
                'low_stock_threshold': 10,
                'is_featured': True,
                'is_new': True,
                'weight': Decimal('0.221'),
                'dimensions': '14.67 x 7.15 x 0.83 cm'
            },
            {
                'name': 'Samsung Galaxy S24 Ultra',
                'sku': 'SGS24U-001',
                'barcode': '887276790442',
                'category': phones,
                'brand': samsung,
                'description': 'Flagship Android phone with S Pen, 200MP camera, and AI features.',
                'short_description': 'Ultra-premium Android smartphone',
                'cost_price': Decimal('1000.00'),
                'selling_price': Decimal('1299.00'),
                'stock_quantity': 30,
                'is_featured': True,
                'weight': Decimal('0.232'),
                'dimensions': '16.23 x 7.9 x 0.86 cm'
            },
            {
                'name': 'Dell XPS 15',
                'sku': 'DXPS15-001',
                'category': computers,
                'brand': dell,
                'description': 'High-performance laptop with Intel i7, 16GB RAM, 512GB SSD.',
                'short_description': 'Professional laptop for creators',
                'cost_price': Decimal('1200.00'),
                'selling_price': Decimal('1599.00'),
                'discount_price': Decimal('1499.00'),
                'stock_quantity': 15,
                'is_featured': True,
                'weight': Decimal('1.86'),
                'dimensions': '34.4 x 23.0 x 1.8 cm'
            },
            {
                'name': 'MacBook Air M3',
                'sku': 'MBA-M3-001',
                'category': computers,
                'brand': apple,
                'description': 'Lightweight laptop with M3 chip, 13.6" display, all-day battery.',
                'short_description': 'Ultra-portable laptop',
                'cost_price': Decimal('900.00'),
                'selling_price': Decimal('1199.00'),
                'stock_quantity': 20,
                'is_new': True,
                'weight': Decimal('1.24'),
                'dimensions': '30.4 x 21.5 x 1.13 cm'
            },
            {
                'name': 'Nike Air Max 90',
                'sku': 'NAM90-001',
                'category': mens,
                'brand': nike,
                'description': 'Classic Nike sneakers with visible Air cushioning.',
                'short_description': 'Iconic lifestyle sneakers',
                'cost_price': Decimal('60.00'),
                'selling_price': Decimal('129.99'),
                'stock_quantity': 50,
                'weight': Decimal('0.350'),
            },
            {
                'name': 'Adidas Ultraboost 23',
                'sku': 'AUB23-001',
                'category': mens,
                'brand': adidas,
                'description': 'Premium running shoes with Boost cushioning.',
                'short_description': 'High-performance running shoes',
                'cost_price': Decimal('80.00'),
                'selling_price': Decimal('189.99'),
                'discount_price': Decimal('159.99'),
                'stock_quantity': 40,
                'weight': Decimal('0.310'),
            },
            {
                'name': "Women's Yoga Pants",
                'sku': 'WYP-001',
                'category': womens,
                'brand': nike,
                'description': 'Comfortable and stretchy yoga pants.',
                'short_description': 'Athletic yoga pants',
                'cost_price': Decimal('20.00'),
                'selling_price': Decimal('49.99'),
                'stock_quantity': 100,
            },
            {
                'name': 'Samsung Galaxy Buds Pro',
                'sku': 'SGBP-001',
                'category': electronics,
                'brand': samsung,
                'description': 'Wireless earbuds with active noise cancellation.',
                'short_description': 'Premium wireless earbuds',
                'cost_price': Decimal('80.00'),
                'selling_price': Decimal('199.99'),
                'discount_price': Decimal('149.99'),
                'stock_quantity': 60,
                'is_featured': True,
                'weight': Decimal('0.013'),
            }
        ]

        created_products = []
        for product_data in products_data:
            product = Product.objects.create(**product_data)
            created_products.append(product)

        self.stdout.write(self.style.SUCCESS(f'Created {len(created_products)} products'))

        # Create Product Variants for some products
        # iPhone colors
        iphone = created_products[0]
        ProductVariant.objects.create(
            product=iphone,
            name='Natural Titanium',
            sku=f'{iphone.sku}-NT',
            price_adjustment=Decimal('0.00'),
            stock_quantity=10,
            is_default=True
        )
        ProductVariant.objects.create(
            product=iphone,
            name='Blue Titanium',
            sku=f'{iphone.sku}-BT',
            price_adjustment=Decimal('0.00'),
            stock_quantity=8
        )
        ProductVariant.objects.create(
            product=iphone,
            name='Black Titanium',
            sku=f'{iphone.sku}-BLT',
            price_adjustment=Decimal('0.00'),
            stock_quantity=7
        )

        # Shoe sizes
        nike_shoes = created_products[4]
        for size in ['8', '9', '10', '11', '12']:
            ProductVariant.objects.create(
                product=nike_shoes,
                name=f'US {size}',
                sku=f'{nike_shoes.sku}-{size}',
                price_adjustment=Decimal('0.00'),
                stock_quantity=10
            )

        # Yoga pants sizes
        yoga_pants = created_products[6]
        for size, adj in [('Small', 0), ('Medium', 0), ('Large', 0), ('XL', 5)]:
            ProductVariant.objects.create(
                product=yoga_pants,
                name=size,
                sku=f'{yoga_pants.sku}-{size[0]}',
                price_adjustment=Decimal(str(adj)),
                stock_quantity=25
            )

        self.stdout.write(self.style.SUCCESS(f'Created {ProductVariant.objects.count()} variants'))

        self.stdout.write(self.style.SUCCESS('Successfully seeded product data!'))
        self.stdout.write(f'Total: {Category.objects.count()} categories, {Brand.objects.count()} brands, {Product.objects.count()} products, {ProductVariant.objects.count()} variants')
