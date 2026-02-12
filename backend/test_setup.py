"""
Quick test script to verify database setup
Run this after init_db.py to check everything is working
"""
from app.db.session import SessionLocal
from app.models.question import Subject, Question

def test_setup():
    db = SessionLocal()
    
    try:
        print("Testing database connection...")
        
        # Test 1: Check subjects
        subjects = db.query(Subject).all()
        print(f"✓ Found {len(subjects)} subjects")
        
        if subjects:
            print("\nSubjects:")
            for s in subjects:
                print(f"  - {s.name} ({s.name_mr}) - {s.icon}")
        
        # Test 2: Check questions
        questions = db.query(Question).all()
        print(f"\n✓ Found {len(questions)} questions")
        
        if questions:
            print("\nSample questions:")
            for q in questions[:3]:  # Show first 3
                print(f"  - {q.question[:50]}...")
        
        print("\n" + "="*60)
        print("✓ Database setup is working correctly!")
        print("="*60)
        print("\nNext steps:")
        print("1. Start backend: python run.py")
        print("2. Open admin: http://localhost:5173/admin")
        print("3. Add your first question!")
        
    except Exception as e:
        print(f"✗ Error: {e}")
        print("\nMake sure you have:")
        print("1. Created PostgreSQL database")
        print("2. Updated .env file with correct DATABASE_URL")
        print("3. Run: python init_db.py")
    finally:
        db.close()

if __name__ == "__main__":
    test_setup()
