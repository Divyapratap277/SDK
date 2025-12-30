from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create the FastAPI app instance
app = FastAPI(
    title="Bargad.AI Tracking API",
    description="API to receive and process user behavior data.",
    version="1.0.0"
)

# A list of allowed origins (your frontend URL)
# For development, we'll allow the default React port
origins = [
    "http://localhost:3000",
]

# Add CORS middleware to the application
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Root"])
async def read_root():
    """
    Root endpoint to confirm the server is running.
    """
    return {"message": "Welcome to the Bargad.AI Tracking API"}
