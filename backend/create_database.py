"""Create StudyMaterial database"""
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

try:
    print("Connecting to PostgreSQL...")
    # Connect to default postgres database
    conn = psycopg2.connect(
        host="localhost",
        user="postgres",
        password="root",
        database="postgres"  # Connect to default database first
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    
    # Check if database exists
    cursor.execute("SELECT 1 FROM pg_database WHERE datname='StudyMaterial'")
    exists = cursor.fetchone()
    
    if exists:
        print("✅ Database 'StudyMaterial' already exists!")
    else:
        print("Creating database 'StudyMaterial'...")
        cursor.execute('CREATE DATABASE "StudyMaterial"')
        print("✅ Database 'StudyMaterial' created successfully!")
    
    cursor.close()
    conn.close()
    
    print("\n✅ Ready to initialize tables!")
    print("   Run: python backend/setup_db.py")
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    print("\n💡 Make sure:")
    print("   1. PostgreSQL is running")
    print("   2. Username: postgres")
    print("   3. Password: root")
