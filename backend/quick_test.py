"""Quick test to check database connection"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    print("Testing database connection...")
    from sqlalchemy import create_engine, text
    
    DATABASE_URL = "postgresql://postgres:root@localhost:5432/StudyMaterial"
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as conn:
        result = conn.execute(text("SELECT version();"))
        version = result.fetchone()
        print(f"✅ Connected to PostgreSQL!")
        print(f"   Version: {version[0][:50]}...")
        
        # Check if tables exist
        result = conn.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """))
        tables = [row[0] for row in result]
        
        if tables:
            print(f"\n✅ Found {len(tables)} tables:")
            for table in tables:
                print(f"   - {table}")
        else:
            print("\n⚠️  No tables found. Need to run setup_db.py")
            
except Exception as e:
    print(f"\n❌ Error: {e}")
    print("\n💡 Make sure:")
    print("   1. PostgreSQL is running")
    print("   2. Database 'StudyMaterial' exists")
    print("   3. Username: postgres, Password: root")
