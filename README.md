# Saath - Backend Server

This is the Node.js backend server for the Saath mobile application, handling OTP generation and verification.

## Features

- RESTful API endpoints for OTP generation and verification
- MongoDB integration for storing OTPs
- Secure OTP generation with expiration
- CORS support for cross-origin requests
- Environment-based configuration

## Prerequisites

- Node.js v14 or later
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Getting Started

### 1. Installation

1. Clone the repository and navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### 2. Environment Setup

1. Create a `.env` file in the server root directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   ```

   For local development, you can use:
   ```env
   MONGODB_URI=mongodb://localhost:27017/saath
   PORT=5000
   ```

### 3. Running the Server

#### Development Mode
```bash
# Using nodemon for auto-restart on file changes
npm run dev

# Or directly with Node
npm start
```

#### Production Mode
```bash
NODE_ENV=production npm start
```

The server will be available at `http://localhost:5000` by default.

## API Endpoints

### 1. Generate OTP
- **Endpoint**: `POST /api/otp`
- **Request Body**:
  ```json
  {
    "phone": "+1234567890"
  }
  ```
- **Success Response**:
  ```json
  {
    "message": "OTP sent successfully",
    "otp": "123456"
  }
  ```

### 2. Verify OTP
- **Endpoint**: `POST /api/verify-otp`
- **Request Body**:
  ```json
  {
    "phone": "+1234567890",
    "otp": "123456"
  }
  ```
- **Success Response**:
  ```json
  {
    "message": "OTP verified successfully"
  }
  ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Port the server listens on | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/saath |
| NODE_ENV | Application environment (development/production) | development |

## Development

### Project Structure

```
server/
├── node_modules/    # Dependencies
├── .env             # Environment variables
├── index.js         # Main application file
└── package.json     # Project configuration
```

### Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with nodemon

## Security Considerations

1. **OTP Expiration**: OTPs are set to expire after 5 minutes
2. **CORS**: Configure allowed origins in production
3. **Rate Limiting**: Consider implementing rate limiting in production
4. **SMS Integration**: In production, integrate with an SMS service to send OTPs

## Troubleshooting

- **MongoDB Connection Issues**:
  - Ensure MongoDB is running
  - Check your connection string in `.env`
  - Verify network connectivity to MongoDB server

- **Port Already in Use**:
  ```bash
  # Find and kill the process
  lsof -i :5000
  kill -9 <PID>
  ```

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
