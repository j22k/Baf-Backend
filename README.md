# BAF Backend API

This is the backend API for the BAF (Bab Al Faouz) project. It provides endpoints for retrieving home page content, partners, brands, and events.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/baf_db
```

## Database Setup

1. Make sure MongoDB is running on your system
2. Seed the database with initial data:
```bash
cd seed
node seedData.js
```

## Running the Server

### Development mode:
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

## API Endpoints

### GET /
Returns all data including:
- Home page content
- Partners list
- Brands list
- Events list

Response format:
```json
{
  "home": {
    "page_name": "home",
    "about_section": {},
    "testimonials": []
  },
  "partners": [],
  "brands": [],
  "events": []
}
```

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Successful request
- 404: Home page not found
- 500: Server error

## Dependencies

- express: Web framework
- mongoose: MongoDB object modeling
- dotenv: Environment variable management
- cors: Cross-origin resource sharing

## Development Dependencies

- nodemon: Development server with hot reload