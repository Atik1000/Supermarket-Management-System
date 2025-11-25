apps = ['inventory', 'pos', 'ecommerce', 'customers', 'payments', 'delivery', 'reports', 'notifications', 'settings']
for app in apps:
    app_title = app.capitalize()
    content = f"""from django.apps import AppConfig


class {app_title}Config(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.{app}'
    label = '{app}'
"""
    with open(f'apps/{app}/apps.py', 'w') as f:
        f.write(content)
    print(f"Created {app}/apps.py")
