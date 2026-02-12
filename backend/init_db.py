"""
Initialize database with tables and seed data
Run this script to create tables and add initial subjects
"""
from app.db.session import engine, SessionLocal
from app.db.base import Base
from app.models.question import Subject

def init_db():
    # Create all tables
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created successfully")
    
    # Add initial subjects
    db = SessionLocal()
    try:
        # Check if subjects already exist
        existing = db.query(Subject).first()
        if existing:
            print("✓ Subjects already exist, skipping seed data")
            return
        
        print("Adding initial subjects...")
        subjects = [
            Subject(name="History", name_mr="इतिहास", slug="history", icon="📚"),
            Subject(name="Modern History", name_mr="आधुनिक इतिहास", slug="modern-history", icon="🇮🇳"),
            Subject(name="Ancient History", name_mr="प्राचीन इतिहास", slug="ancient-history", icon="🏛️"),
            Subject(name="Medieval History", name_mr="मध्ययुगीन इतिहास", slug="medieval-history", icon="🏰"),
            Subject(name="Geography", name_mr="भूगोल", slug="geography", icon="🌍"),
            Subject(name="Polity", name_mr="राज्यशास्त्र", slug="polity", icon="⚖️"),
            Subject(name="Economy", name_mr="अर्थव्यवस्था", slug="economy", icon="💰"),
            Subject(name="Science", name_mr="विज्ञान", slug="science", icon="🔬"),
            Subject(name="Environment", name_mr="पर्यावरण", slug="environment", icon="🌱"),
            Subject(name="Current Affairs", name_mr="चालू घडामोडी", slug="current-affairs", icon="📰"),
            Subject(name="CSAT", name_mr="सीसॅट", slug="csat", icon="🧮"),
        ]
        
        db.add_all(subjects)
        db.commit()
        print(f"✓ Added {len(subjects)} subjects successfully")
        
    except Exception as e:
        print(f"✗ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
    print("\n✓ Database initialization complete!")
    print("You can now run the server with: python run.py")
