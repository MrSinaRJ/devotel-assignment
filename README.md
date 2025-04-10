![Test and Build (master)](https://github.com/MrSinaRJ/devotel-assignment/actions/workflows/ci.yml/badge.svg?branch=master)

![Hamravesh Build and Deploy](https://github.com/MrSinaRJ/devotel-assignment/actions/workflows/hamravesh.yml/badge.svg?branch=master)

# Job Scraper API

A NestJS application that scrapes job offers from multiple providers, stores them in a PostgreSQL database, and provides a RESTful API for accessing the aggregated job data.

## 📋 Project Overview

This project serves as a centralized job aggregation service that:

1. Periodically scrapes job listings from multiple provider websites 
2. Normalizes the data into a consistent format
3. Stores the unified job listings in a PostgreSQL database
4. Provides a RESTful API with filtering capabilities for retrieving job offers

### 🔑 Key Features

- **Automated Scraping**: Configurable scheduled scraping from multiple job listing providers
- **Data Normalization**: Transforms provider-specific formats into a standardized job offer structure 
- **Data Persistence**: Stores job listings in PostgreSQL with conflict resolution
- **RESTful API**: Comprehensive endpoints to access and filter job offers
- **Pagination**: Built-in pagination support for large result sets
- **Health Monitoring**: Endpoints for service health checking
- **Swagger Documentation**: Auto-generated API documentation
- **Docker Support**: Containerized deployment

## 🏗️ Architecture

The application is built with NestJS and follows a modular architecture:

| Module | Description |
| ------ | ----------- |
| `JobOffersModule` | Handles API endpoints for retrieving job offers with filtering |
| `ScraperModule` | Contains services for fetching and processing job data from providers | 
| `SchedulerModule` | Manages scheduled and manual execution of scraping tasks |
| `HealthModule` | Provides health check endpoints for monitoring |

## 🛠️ Technical Implementation

### Data Model

The core entity is the `JobOffer` which has the following structure:

```typescript
class JobOffer {
  id: number;
  provider: number;         // Provider identifier (1, 2, etc.)
  providerId: string;       // Original ID from the provider
  position: string;         // Job title/position
  company: {
    name: string;
    website: string | null;
    industry: string | null;
  };
  compensation: {
    min: number;
    max: number;
    currency: string;
  };
  skills: string[];         // Required skills for the position
  experience: number | null; // Required years of experience
  city: string;             // Job location city
  state: string;            // Job location state
  remote: boolean | null;   // Whether remote work is allowed
  postDate: Date;           // Date when the job was posted
}
```

### Scraping Process

The application implements a scalable scraping architecture:

1. **Provider-specific processors**: Each job provider has a dedicated processor service that understands its specific data format
2. **Scheduled execution**: A configurable cron job triggers scraping at regular intervals
3. **Parallel processing**: Simultaneous scraping from multiple providers using Promise.allSettled
4. **Data normalization**: Converting provider-specific formats to a unified JobOfferDto
5. **Efficient storage**: Using upsert operations to handle duplicates based on provider and providerId

### API Endpoints

#### Job Offers API (v1)

| Endpoint | Method | Description | Query Parameters |
| -------- | ------ | ----------- | --------------- |
| `/api/job-offers` | GET | Retrieve job offers with optional filtering | `city`, `state`, `remote`, `position`, `company`, `skills`, `page`, `size` |
| `/api/job-offers/:id` | GET | Retrieve a specific job offer by ID | - |

#### Scheduler API

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| `/api/scheduler/run` | POST | Manually trigger the scraping process |

#### Health API

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| `/api/health` | GET | Check service health status |

## 🔍 Filtering Options

The API supports the following query parameters for filtering job offers:

| Parameter | Type | Description | Example |
| --------- | ---- | ----------- | ------- |
| `city` | string | Filter by city name (case-insensitive, partial match) | `?city=New York` |
| `state` | string | Filter by state name (case-insensitive, partial match) | `?state=CA` |
| `remote` | boolean | Filter by remote work possibility | `?remote=true` |
| `position` | string | Filter by job position/title (case-insensitive, partial match) | `?position=Software Engineer` |
| `company` | string | Filter by company name (case-insensitive, partial match) | `?company=Google` |
| `skills` | string | Filter by required skills (comma-separated) | `?skills=JavaScript,React,Node.js` |
| `page` | number | Page number for pagination (min: 1) | `?page=2` |
| `size` | number | Number of items per page (min: 1) | `?size=20` |

### Example API Requests (version in header is required)

```
# Get all job offers (paginated)
GET /api/job-offers

# Get remote job offers with JavaScript skills
GET /api/job-offers?remote=true&skills=JavaScript

# Get software engineering positions in New York
GET /api/job-offers?position=Software%20Engineer&city=New%20York

# Get the second page with 10 items per page
GET /api/job-offers?page=2&size=10
```

## 📊 API Response Format

### Job Offer List Response

```json
{
  "data": [
    {
      "id": 123,
      "provider": 1,
      "providerId": "abc123",
      "position": "Senior Software Engineer",
      "company": {
        "name": "Devotel Inc.",
        "website": "https://example.com",
        "industry": "Technology"
      },
      "compensation": {
        "min": 90000,
        "max": 120000,
        "currency": "USD"
      },
      "skills": ["JavaScript", "TypeScript", "Node.js"],
      "experience": 5,
      "city": "San Francisco",
      "state": "CA",
      "remote": true,
      "postDate": "2025-01-15T14:30:00Z"
    },
    // More job offers...
  ],
  "total": 157,
  "page": 1,
  "size": 20
}
```

### Single Job Offer Response

```json
{
  "id": 123,
  "provider": 1,
  "providerId": "abc123",
  "position": "Senior Software Engineer",
  "company": {
    "name": "Devotel Inc.",
    "website": "https://example.com",
    "industry": "Technology"
  },
  "compensation": {
    "min": 90000,
    "max": 120000,
    "currency": "USD"
  },
  "skills": ["JavaScript", "TypeScript", "Node.js"],
  "experience": 5,
  "city": "San Francisco",
  "state": "CA",
  "remote": true,
  "postDate": "2025-01-15T14:30:00Z"
}
```

## ⚙️ Configuration

The application uses environment variables for configuration:

| Variable | Description | Default |
| -------- | ----------- | ------- |
| `FIRST_PROVIDER_URL` | URL for the first job provider API | (required) |
| `SECOND_PROVIDER_URL` | URL for the second job provider API | (required) |
| `SCRAPE_CRON` | Cron expression for scheduled scraping | `* * * * *` (every minute) |
| `PORT` | Application port | 3000 |
| `NODE_ENV` | Environment (dev, prod, etc.) | dev |
| `POSTGRESQL_HOST` | PostgreSQL host | (required) |
| `POSTGRESQL_PORT` | PostgreSQL port | (required) |
| `POSTGRESQL_USER` | PostgreSQL username | (required) |
| `POSTGRESQL_PASSWORD` | PostgreSQL password | (required) |
| `POSTGRESQL_DATABASE_NAME` | PostgreSQL database name | (required) |
| `PAGE` | Default page number for pagination | 1 |
| `SIZE` | Default page size for pagination | 20 |

## 🚀 Getting Started

### Prerequisites

- Node.js LTS
- PostgreSQL 13+
- Docker (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MrSinaRJ/devotel-assignment.git
   cd devotel-assignment
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set up environment variables (create a `.env` file based on the configuration table above)

4. Start the application:
   ```bash
   yarn start:dev
   ```

### Docker Deployment

```bash
docker build -t job-scraper .
docker run -p 3000:3000 --env-file .env job-scraper
```

## 📚 API Documentation

Swagger UI is available at `/api/docs` when the application is running. It provides interactive documentation for all available endpoints.

## 🧪 Testing

```bash
# Run unit tests
yarn test

# Generate test coverage
yarn test:cov
```

## 🔄 CI/CD Pipeline

The project uses GitHub Actions for CI/CD:

- Automated testing and building on pull requests and merges to master
- Automated deployment to Hamravesh cloud platform
