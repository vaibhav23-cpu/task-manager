from app import app
print('App created successfully')
with app.app_context():
    print('App context entered')
    try:
        from models import db
        db.create_all()
        print('Database tables created')
    except Exception as e:
        print(f'Database error: {e}')
print('Routes after startup:', [str(rule) for rule in app.url_map.iter_rules() if not str(rule).startswith('/static')])