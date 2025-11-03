# KPI Platform - Monitoring and Tracking System

A comprehensive KPI (Key Performance Indicator) monitoring and tracking platform built with Node.js, Express, React, and MongoDB.

## Features

- **Dashboard Overview**: Real-time visualization of all KPIs and performance metrics
- **KPI Management**: Create, update, and track KPIs with customizable targets
- **Metrics Tracking**: Record and visualize metric data over time
- **Categories**: Organize KPIs into custom categories
- **Trends Analysis**: Track performance trends with interactive charts
- **Performance Monitoring**: Automatic calculation of KPI performance against targets
- **Flexible Units**: Support for numbers, percentages, currency, time, and custom units
- **Data Visualization**: Interactive charts and graphs using Recharts
- **RESTful API**: Comprehensive API for programmatic access

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS, Helmet for security
- Morgan for logging

### Frontend
- React 18
- React Router for navigation
- Axios for API calls
- Recharts for data visualization
- date-fns for date formatting

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kpi-platform
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/kpi-platform
   NODE_ENV=development
   ```

5. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running
   mongod
   ```

6. **Run the application**

   Development mode (both frontend and backend):
   ```bash
   npm run dev:full
   ```

   Or run separately:
   ```bash
   # Terminal 1 - Backend
   npm run dev

   # Terminal 2 - Frontend
   npm run client
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health check: http://localhost:5000/health

## Project Structure

```
kpi-platform/
├── server/                 # Backend application
│   ├── config/            # Configuration files
│   │   └── database.js    # MongoDB connection
│   ├── controllers/       # Route controllers
│   │   ├── categoryController.js
│   │   ├── dashboardController.js
│   │   ├── kpiController.js
│   │   └── metricController.js
│   ├── models/           # Mongoose models
│   │   ├── Category.js
│   │   ├── KPI.js
│   │   └── Metric.js
│   ├── routes/           # API routes
│   │   ├── categoryRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── kpiRoutes.js
│   │   └── metricRoutes.js
│   └── index.js          # Server entry point
├── client/               # Frontend React application
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # React components
│   │   │   ├── Dashboard.js
│   │   │   ├── KPIList.js
│   │   │   ├── KPIForm.js
│   │   │   ├── KPIDetail.js
│   │   │   ├── MetricForm.js
│   │   │   └── CategoryList.js
│   │   ├── services/    # API services
│   │   │   └── api.js
│   │   ├── App.js       # Main app component
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── .env.example         # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## API Documentation

See [API.md](./API.md) for detailed API documentation.

### Quick API Reference

**KPIs**
- `GET /api/kpis` - Get all KPIs
- `POST /api/kpis` - Create KPI
- `GET /api/kpis/:id` - Get KPI by ID
- `PUT /api/kpis/:id` - Update KPI
- `DELETE /api/kpis/:id` - Delete KPI
- `GET /api/kpis/:id/stats` - Get KPI statistics

**Metrics**
- `GET /api/metrics` - Get all metrics
- `POST /api/metrics` - Create metric
- `POST /api/metrics/bulk` - Bulk create metrics
- `GET /api/metrics/kpi/:kpiId` - Get metrics by KPI
- `GET /api/metrics/:id` - Get metric by ID
- `PUT /api/metrics/:id` - Update metric
- `DELETE /api/metrics/:id` - Delete metric

**Categories**
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `GET /api/categories/:id` - Get category by ID
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

**Dashboard**
- `GET /api/dashboard/overview` - Get dashboard overview
- `GET /api/dashboard/trends` - Get trends data
- `GET /api/dashboard/performance` - Get performance summary

## Usage

### Creating a Category

1. Navigate to "Categories" in the navigation menu
2. Click "+ Add Category"
3. Fill in the category name, description, and select a color
4. Click "Create"

### Creating a KPI

1. Navigate to "KPIs" or click "+ Add KPI" from the dashboard
2. Fill in the KPI details:
   - Name and description
   - Select a category
   - Choose unit type (number, percentage, currency, time, or custom)
   - Set target value and target type (maximize, minimize, or maintain)
   - Select frequency (daily, weekly, monthly, quarterly, yearly)
   - Add tags (optional)
3. Click "Create KPI"

### Adding Metrics

1. Go to a KPI detail page
2. Click "+ Add Metric"
3. Enter the metric value
4. Select the period and date range
5. Add notes (optional)
6. Click "Add Metric"

The KPI will automatically update its current value and trend based on new metrics.

## Docker Support

See [Docker documentation](./DOCKER.md) for containerized deployment.

Quick start with Docker:
```bash
docker-compose up -d
```

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

### Code Style
The project follows standard JavaScript/React conventions. Ensure code is properly formatted before committing.

## Features in Detail

### KPI Types
- **Number**: Simple numeric values
- **Percentage**: Values displayed as percentages
- **Currency**: Monetary values
- **Time**: Time-based measurements
- **Custom**: Define your own unit

### Target Types
- **Maximize**: Higher values are better
- **Minimize**: Lower values are better
- **Maintain**: Target a specific value

### Automatic Trend Detection
The system automatically calculates trends by comparing current and previous values:
- **Up**: Current value > Previous value
- **Down**: Current value < Previous value
- **Stable**: Current value = Previous value

### Performance Calculation
Performance is automatically calculated as:
```
Performance (%) = (Current Value / Target Value) × 100
```

### Data Visualization
- Line charts for trend analysis
- Bar charts for category comparisons
- Real-time performance indicators
- Historical data tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on the GitHub repository.

## Roadmap

- [ ] User authentication and authorization
- [ ] Role-based access control
- [ ] Email notifications and alerts
- [ ] Export data to CSV/Excel
- [ ] Advanced filtering and search
- [ ] Mobile responsive improvements
- [ ] API rate limiting
- [ ] Webhook integrations
- [ ] Custom dashboard widgets
- [ ] Multi-language support
