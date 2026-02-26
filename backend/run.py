import uvicorn
from app.db.session import init_db

if __name__ == "__main__":
    # Initialize database tables
    print("Initializing database...")
    init_db()
    print("Database initialized!")
    
    # Run the application
    print("Starting MPSC Revision AI Backend...")
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )
