from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
import os

app = FastAPI()

# MongoDB connection settings
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client["saath"]
customers_collection = db["customers"]

class Customer(BaseModel):
    username: str
    phone: str
    email: str

@app.post("/api/customer")
def add_customer(customer: Customer):
    # Check if customer already exists (optional, e.g., by email or phone)
    # existing = customers_collection.find_one({"email": customer.email})
    # if existing:
    #     raise HTTPException(status_code=400, detail="Customer already exists")
    customers_collection.insert_one(customer.dict())
    return {"message": "Customer added successfully"}
