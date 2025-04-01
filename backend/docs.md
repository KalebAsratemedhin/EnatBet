# Project Structure

Follow this folder structure
backend/
├── .gitignore
├── .env
├── package.json
├── package-lock.json
├── server.js
├── models/
│   └── user.js
├── routes/
│   └── userRoutes.js
├── controllers/
│   └── userController.js
├── middleware/
│   └── authMiddleware.js
└── config/
    └── db.js


# Models

## 1. User 
- **Fields**:
  - `UserID` (Primary Key)
  - `Name`
  - `Email` (Unique)
  - `Password`
  - `Role`
  - `PhoneNumber`
  - `Address`
- **Indexes**:
  - `UserID` (Primary Key)
  - `Email` (Unique)

## 2. Customer 
- **Fields**:
  - `CustomerID` (Primary Key)
  - `UserID` (Foreign Key)
  - `PaymentMethods`
  - `OrderHistory`
- **Indexes**:
  - `CustomerID` (Primary Key)
  - `UserID` (Foreign Key)

## 3. Restaurant 
- **Fields**:
  - `RestaurantID` (Primary Key)
  - `Name`
  - `Location`
  - `Menu`
  - `Rating`
  - `DeliveryAreas`
  - `Promotions`
- **Indexes**:
  - `RestaurantID` (Primary Key)
  - `Location` (Geospatial Index)

## 4. Order 
- **Fields**:
  - `OrderID` (Primary Key)
  - `CustomerID` (Foreign Key)
  - `RestaurantID` (Foreign Key)
  - `OrderDetails`
  - `Status`
  - `TotalAmount`
  - `PaymentMethod`
- **Indexes**:
  - `OrderID` (Primary Key)
  - `CustomerID` (Foreign Key)
  - `RestaurantID` (Foreign Key)

## 5. Delivery 
- **Fields**:
  - `DeliveryID` (Primary Key)
  - `OrderID` (Foreign Key)
  - `DeliveryPersonID`
  - `Status`
  - `EstimatedDeliveryTime`
- **Indexes**:
  - `DeliveryID` (Primary Key)
  - `OrderID` (Foreign Key)

## 6. Payment 
- **Fields**:
  - `PaymentID` (Primary Key)
  - `OrderID` (Foreign Key)
  - `Amount`
  - `PaymentMethod`
  - `Status`
- **Indexes**:
  - `PaymentID` (Primary Key)
  - `OrderID` (Foreign Key)
