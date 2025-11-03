# KPI Platform API Documentation

Base URL: `http://localhost:5000/api`

All responses are in JSON format.

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "count": 10  // For list endpoints
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## Endpoints

### Health Check

#### GET /health
Check if the server is running.

**Response:**
```json
{
  "status": "OK",
  "message": "KPI Platform is running"
}
```

---

## KPIs

### Get All KPIs

#### GET /api/kpis

Get a list of all KPIs.

**Query Parameters:**
- `status` (optional): Filter by status (active, inactive, archived)
- `category` (optional): Filter by category ID

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Monthly Revenue",
      "description": "Total monthly revenue",
      "category": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Finance"
      },
      "unit": "currency",
      "targetValue": 100000,
      "targetType": "maximize",
      "frequency": "monthly",
      "status": "active",
      "currentValue": 85000,
      "previousValue": 80000,
      "trend": "up",
      "performance": "85.00",
      "tags": ["revenue", "important"],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

### Get KPI by ID

#### GET /api/kpis/:id

Get a single KPI by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Monthly Revenue",
    "description": "Total monthly revenue",
    "category": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Finance"
    },
    "unit": "currency",
    "targetValue": 100000,
    "targetType": "maximize",
    "frequency": "monthly",
    "status": "active",
    "currentValue": 85000,
    "previousValue": 80000,
    "trend": "up",
    "performance": "85.00",
    "tags": ["revenue", "important"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

### Create KPI

#### POST /api/kpis

Create a new KPI.

**Request Body:**
```json
{
  "name": "Monthly Revenue",
  "description": "Total monthly revenue",
  "category": "507f1f77bcf86cd799439012",
  "unit": "currency",
  "targetValue": 100000,
  "targetType": "maximize",
  "frequency": "monthly",
  "status": "active",
  "tags": ["revenue", "important"]
}
```

**Required Fields:**
- `name` (string)
- `category` (ObjectId)
- `unit` (string): one of [number, percentage, currency, time, custom]

**Optional Fields:**
- `description` (string)
- `customUnit` (string): required if unit is "custom"
- `targetValue` (number)
- `targetType` (string): one of [minimize, maximize, maintain], default: "maximize"
- `frequency` (string): one of [daily, weekly, monthly, quarterly, yearly], default: "daily"
- `status` (string): one of [active, inactive, archived], default: "active"
- `tags` (array of strings)

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

### Update KPI

#### PUT /api/kpis/:id

Update an existing KPI.

**Request Body:** Same as Create KPI (all fields optional)

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

### Delete KPI

#### DELETE /api/kpis/:id

Delete a KPI and all associated metrics.

**Response:**
```json
{
  "success": true,
  "data": {}
}
```

### Get KPI Statistics

#### GET /api/kpis/:id/stats

Get statistics for a specific KPI.

**Response:**
```json
{
  "success": true,
  "data": {
    "kpi": { ... },
    "statistics": {
      "average": "82500.00",
      "minimum": 75000,
      "maximum": 90000,
      "dataPoints": 12
    },
    "recentMetrics": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "value": 85000,
        "timestamp": "2024-01-15T00:00:00.000Z",
        "period": "monthly"
      }
    ]
  }
}
```

---

## Metrics

### Get All Metrics

#### GET /api/metrics

Get a list of all metrics.

**Query Parameters:**
- `kpi` (optional): Filter by KPI ID
- `startDate` (optional): Filter by start date (ISO format)
- `endDate` (optional): Filter by end date (ISO format)
- `period` (optional): Filter by period (daily, weekly, monthly, quarterly, yearly)

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "kpi": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Monthly Revenue"
      },
      "value": 85000,
      "timestamp": "2024-01-15T00:00:00.000Z",
      "period": "monthly",
      "periodStart": "2024-01-01T00:00:00.000Z",
      "periodEnd": "2024-01-31T23:59:59.999Z",
      "notes": "Strong month",
      "createdBy": "system",
      "createdAt": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

### Get Metric by ID

#### GET /api/metrics/:id

Get a single metric by ID.

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

### Get Metrics by KPI

#### GET /api/metrics/kpi/:kpiId

Get all metrics for a specific KPI.

**Query Parameters:**
- `limit` (optional): Limit number of results (default: 50)
- `period` (optional): Filter by period

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [ ... ]
}
```

### Create Metric

#### POST /api/metrics

Create a new metric for a KPI.

**Request Body:**
```json
{
  "kpi": "507f1f77bcf86cd799439011",
  "value": 85000,
  "period": "monthly",
  "periodStart": "2024-01-01T00:00:00.000Z",
  "periodEnd": "2024-01-31T23:59:59.999Z",
  "notes": "Strong month"
}
```

**Required Fields:**
- `kpi` (ObjectId)
- `value` (number)
- `period` (string): one of [daily, weekly, monthly, quarterly, yearly]
- `periodStart` (Date)
- `periodEnd` (Date)

**Optional Fields:**
- `notes` (string)
- `metadata` (object)
- `createdBy` (string)

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Note:** Creating a metric automatically updates the associated KPI's current and previous values.

### Bulk Create Metrics

#### POST /api/metrics/bulk

Create multiple metrics at once.

**Request Body:**
```json
{
  "metrics": [
    {
      "kpi": "507f1f77bcf86cd799439011",
      "value": 85000,
      "period": "monthly",
      "periodStart": "2024-01-01T00:00:00.000Z",
      "periodEnd": "2024-01-31T23:59:59.999Z"
    },
    {
      "kpi": "507f1f77bcf86cd799439011",
      "value": 90000,
      "period": "monthly",
      "periodStart": "2024-02-01T00:00:00.000Z",
      "periodEnd": "2024-02-29T23:59:59.999Z"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [ ... ]
}
```

### Update Metric

#### PUT /api/metrics/:id

Update an existing metric.

**Request Body:** Same as Create Metric (all fields optional)

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

### Delete Metric

#### DELETE /api/metrics/:id

Delete a metric.

**Response:**
```json
{
  "success": true,
  "data": {}
}
```

---

## Categories

### Get All Categories

#### GET /api/categories

Get a list of all categories with KPI counts.

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Finance",
      "description": "Financial metrics",
      "color": "#3B82F6",
      "icon": "chart-bar",
      "kpiCount": 5,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Category by ID

#### GET /api/categories/:id

Get a single category with associated KPIs.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Finance",
    "description": "Financial metrics",
    "color": "#3B82F6",
    "icon": "chart-bar",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "kpis": [ ... ]
  }
}
```

### Create Category

#### POST /api/categories

Create a new category.

**Request Body:**
```json
{
  "name": "Finance",
  "description": "Financial metrics",
  "color": "#3B82F6",
  "icon": "chart-bar"
}
```

**Required Fields:**
- `name` (string, unique)

**Optional Fields:**
- `description` (string)
- `color` (string, hex color, default: "#3B82F6")
- `icon` (string, default: "chart-bar")

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

### Update Category

#### PUT /api/categories/:id

Update an existing category.

**Request Body:** Same as Create Category (all fields optional)

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

### Delete Category

#### DELETE /api/categories/:id

Delete a category. Cannot delete if the category has associated KPIs.

**Response:**
```json
{
  "success": true,
  "data": {}
}
```

**Error if KPIs exist:**
```json
{
  "success": false,
  "error": "Cannot delete category with 5 associated KPIs"
}
```

---

## Dashboard

### Get Dashboard Overview

#### GET /api/dashboard/overview

Get comprehensive dashboard overview with statistics and insights.

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalKPIs": 15,
      "activeKPIs": 12,
      "totalCategories": 4,
      "totalMetrics": 450,
      "recentMetrics": 35
    },
    "kpisByStatus": [
      { "_id": "active", "count": 12 },
      { "_id": "inactive", "count": 2 },
      { "_id": "archived", "count": 1 }
    ],
    "kpisByCategory": [
      { "_id": "507f...", "name": "Finance", "count": 5 },
      { "_id": "607f...", "name": "Operations", "count": 7 }
    ],
    "topKPIs": [ ... ],
    "needsAttention": [ ... ]
  }
}
```

### Get Trends

#### GET /api/dashboard/trends

Get trend data for all active KPIs.

**Query Parameters:**
- `period` (optional): Filter by period (default: "daily")
- `days` (optional): Number of days to look back (default: 30)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "kpi": { ... },
      "data": [
        { "timestamp": "2024-01-01T00:00:00.000Z", "value": 75000 },
        { "timestamp": "2024-01-02T00:00:00.000Z", "value": 78000 }
      ]
    }
  ]
}
```

### Get Performance Summary

#### GET /api/dashboard/performance

Get performance summary for all active KPIs.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "kpi": {
        "id": "507f1f77bcf86cd799439011",
        "name": "Monthly Revenue",
        "category": { ... },
        "unit": "currency"
      },
      "currentValue": 85000,
      "targetValue": 100000,
      "trend": "up",
      "performancePercent": "85.00",
      "performanceStatus": "on-track"
    }
  ]
}
```

**Performance Statuses:**
- `excellent`: ≥100% for maximize, ≤100% for minimize
- `on-track`: 80-99% for maximize, 100-120% for minimize
- `at-risk`: 60-79% for maximize, 120-150% for minimize
- `critical`: <60% for maximize, >150% for minimize

---

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

Currently no rate limiting is implemented. This will be added in future versions.

## Authentication

Currently no authentication is required. User authentication will be added in future versions.
