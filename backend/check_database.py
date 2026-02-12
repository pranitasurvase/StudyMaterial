"""Check database and show all data"""
import psycopg2

try:
    conn = psycopg2.connect(
        host="localhost",
        user="postgres",
        password="root",
        database="StudyMaterial"
    )
    cursor = conn.cursor()
    
    print("=" * 60)
    print("📊 DATABASE: StudyMaterial")
    print("=" * 60)
    
    # Check subjects
    cursor.execute("SELECT COUNT(*) FROM subjects")
    subject_count = cursor.fetchone()[0]
    print(f"\n✅ Subjects Table: {subject_count} subjects")
    
    cursor.execute("SELECT id, name, name_mr FROM subjects ORDER BY id")
    subjects = cursor.fetchall()
    for s in subjects:
        print(f"   {s[0]}. {s[1]} ({s[2]})")
    
    # Check questions
    cursor.execute("SELECT COUNT(*) FROM questions")
    question_count = cursor.fetchone()[0]
    print(f"\n✅ Questions Table: {question_count} questions")
    
    if question_count > 0:
        cursor.execute("""
            SELECT q.id, s.name, q.question 
            FROM questions q 
            JOIN subjects s ON q.subject_id = s.id 
            LIMIT 5
        """)
        questions = cursor.fetchall()
        print("\n   Recent questions:")
        for q in questions:
            print(f"   {q[0]}. [{q[1]}] {q[2][:50]}...")
    
    # Check users
    cursor.execute("SELECT COUNT(*) FROM users")
    user_count = cursor.fetchone()[0]
    print(f"\n✅ Users Table: {user_count} users")
    
    print("\n" + "=" * 60)
    print("✅ Database is working perfectly!")
    print("=" * 60)
    print("\n💡 To view in pgAdmin:")
    print("   1. Open pgAdmin 4")
    print("   2. Expand 'Servers' → 'PostgreSQL'")
    print("   3. Right-click 'Databases' → 'Refresh'")
    print("   4. You'll see 'StudyMaterial' database")
    print("\n")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"❌ Error: {e}")
