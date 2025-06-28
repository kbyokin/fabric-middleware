# Fabric Middleware API

A TypeScript Express.js middleware application for interacting with Hyperledger Fabric blockchain network. This API provides endpoints for managing medicines, requests, sharing, returns, mail, and services in a healthcare/pharmaceutical context.

## Features

- 🏥 **Medicine Management**: Create, query, and manage medicine inventory
- 📋 **Request Handling**: Create and manage medicine requests between hospitals
- 🤝 **Sharing System**: Facilitate medicine sharing between organizations
- 📦 **Returns Management**: Handle medicine returns and tracking
- 📧 **Mail Integration**: Send notifications and communications
- 🔧 **Services**: Additional utility services
- 📊 **Request Logging**: Automatic logging of all API requests with timestamps and IP addresses

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Hyperledger Fabric Network** (running and accessible)
- **Access to Fabric crypto materials** (certificates and keys)

## Project Structure

```
fabric-middleware/
├── routes/                 # API route handlers
│   ├── medicines.ts       # Medicine management endpoints
│   ├── requests.ts        # Request handling endpoints
│   ├── sharing.ts         # Sharing system endpoints
│   ├── returns.ts         # Returns management endpoints
│   ├── mail.ts           # Mail service endpoints
│   └── services.ts       # Additional services endpoints
├── fabricClient.ts        # Hyperledger Fabric client configuration
├── server.ts             # Main Express server
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## Installation

1. **Clone the repository** (if not already done)
   ```bash
   git clone <repository-url>
   cd fabric-middleware
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Configuration

### Hyperledger Fabric Network Setup

1. **Update Fabric Network Path**: 
   Edit `fabricClient.ts` and update the `cryptoPath` variable to point to your Hyperledger Fabric network location:
   
   ```typescript
   const cryptoPath = "/path/to/your/test_network_lending_med/organizations/peerOrganizations/hospitala.example.com";
   ```

2. **Environment Variables** (Optional):
   You can override default configurations using environment variables:
   
   ```bash
   export CHANNEL_NAME="main-channel"
   export CHAINCODE_NAME="basic"
   export MSP_ID="hospitalaMSP"
   export PEER_ENDPOINT="localhost:7051"
   export PEER_HOST_ALIAS="peer0.hospitala.example.com"
   ```

### Required Fabric Components

Ensure your Hyperledger Fabric network has:
- Channel named `main-channel` (or set `CHANNEL_NAME`)
- Chaincode deployed named `basic` (or set `CHAINCODE_NAME`)
- Organization MSP `hospitalaMSP` (or set `MSP_ID`)
- Peer running on `localhost:7051` (or set `PEER_ENDPOINT`)

## Running the Project

### Development Mode

1. **Start the server using ts-node**:
   ```bash
   npx ts-node server.ts
   ```

2. **Alternative using npm script**:
   ```bash
   npm start
   ```

### Production Mode

1. **Compile TypeScript**:
   ```bash
   npx tsc
   ```

2. **Run compiled JavaScript**:
   ```bash
   node dist/server.js
   ```

## API Endpoints

The server runs on **port 8000** and provides the following endpoints:

### Health & Info
- `GET /` - API information
- `GET /health` - Health check with status and available routes

### Medicine Management
- `GET /api/medicines` - Get medicines
- `GET /api/medicines/all` - Get all medicines
- `POST /api/medicines/create` - Create new medicine
- `POST /api/medicines/query-by-id` - Query medicine by ID
- `POST /api/medicines/borrow` - Borrow medicine
- `DELETE /api/medicines/:id` - Delete medicine

### Request Management
- `POST /api/requests/create` - Create medicine request
- `POST /api/requests/query-by-status` - Query requests by status
- `POST /api/requests/query` - Query requests
- `POST /api/requests/update` - Update request

### Sharing System
- `POST /api/sharing/create` - Create sharing entry
- `POST /api/sharing/query` - Query sharing entries
- `POST /api/sharing/query-by-status` - Query sharing by status
- `POST /api/sharing/update` - Update sharing entry

### Returns Management
- `POST /api/returns/create` - Create return entry

### Mail Service
- `POST /api/mail/send` - Send mail/notification

### Additional Services
- `POST /api/services/*` - Various utility services

## Request Logging

The API automatically logs all incoming requests with:
- **Timestamp**: ISO format timestamp
- **HTTP Method**: GET, POST, DELETE, etc.
- **Request URL**: Full path being accessed
- **Client IP**: IP address of the requesting client

Example log output:
```
[2024-01-15T10:30:45.123Z] POST /api/medicines/create - IP: 192.168.1.100
[2024-01-15T10:30:47.456Z] GET /api/requests/query - IP: 10.0.0.25
```

## Troubleshooting

### Common Issues

1. **Fabric Connection Error**:
   - Ensure your Hyperledger Fabric network is running
   - Verify the `cryptoPath` in `fabricClient.ts` points to the correct location
   - Check that crypto materials (certificates and keys) are accessible

2. **Port Already in Use**:
   - Change the port in `server.ts` if port 8000 is occupied
   - Or stop the process using port 8000: `lsof -ti:8000 | xargs kill`

3. **TypeScript Compilation Errors**:
   - Ensure all dependencies are installed: `npm install`
   - Check TypeScript version compatibility

4. **Certificate/Key Issues**:
   - Verify the Fabric network crypto materials are properly generated
   - Ensure the application has read access to the certificate directories

## Development

### Adding New Routes

1. Create a new route file in the `routes/` directory
2. Import and register the route in `server.ts`
3. Update the API endpoints list in this README

### Environment Configuration

The application supports environment-based configuration. Key variables:
- `CHANNEL_NAME`: Fabric channel name
- `CHAINCODE_NAME`: Deployed chaincode name
- `MSP_ID`: Organization MSP identifier
- `PEER_ENDPOINT`: Peer connection endpoint
- `PEER_HOST_ALIAS`: Peer hostname for SSL

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Hyperledger Fabric documentation
3. Create an issue in the repository 