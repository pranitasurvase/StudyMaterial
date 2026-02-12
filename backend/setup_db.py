"""
Quick setup script to initialize database
"""
import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.session import engine, SessionLocal
from app.db.base import Base
from app.models.question import Subject

def setup_database():
    try:
        print("🔄 Connecting to PostgreSQL database...")
        
        # Test connection
        with engine.connect() as conn:
            print("✅ Database connection successful!")
        
        # Create all tables
        print("\n🔄 Creating database tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ Tables created successfully!")
        
        # Add initial subjects
        db = SessionLocal()
        try:
            # Check if subjects already exist
            existing = db.query(Subject).first()
            if existing:
                print("\n✅ Subjects already exist in database")
                print(f"   Found {db.query(Subject).count()} subjects")
                return
            
            print("\n🔄 Adding initial subjects...")
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
            print(f"✅ Added {len(subjects)} subjects successfully!")
            
        except Exception as e:
            print(f"\n❌ Error adding subjects: {e}")
            db.rollback()
        finally:
            db.close()
        
        print("\n" + "="*50)
        print("✅ DATABASE SETUP COMPLETE!")
        print("="*50)
        print("\n📝 Next steps:")
        print("   1. Start backend: python backend/run.py")
        print("   2. Start frontend: npm run dev (in frontend folder)")
        print("   3. Access admin: http://localhost:5173/admin")
        print("\n")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\n💡 Make sure:")
        print("   - PostgreSQL is running")
        print("   - Database 'StudyMaterial' exists")
        print("   - Credentials in backend/.env are correct")
        sys.exit(1)

if __name__ == "__main__":
    setup_database()
