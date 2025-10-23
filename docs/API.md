# API Documentation

## Overview

The Video Transcoding HLS Platform provides a RESTful API for video upload and processing management.

## Base URL

```
http://localhost:3000/api
```

## Endpoints

### 1. Generate Presigned Upload URL

**POST** `/presigned-url`

Generates a presigned URL for secure video upload to S3.

#### Request Body

```json
{
  "fileName": "video.mp4",
  "fileType": "video/mp4"
}
```

#### Response

```json
{
  "presignedURL": "https://bucket.s3.region.amazonaws.com/path/to/file?signature..."
}
```

#### Example Usage

```javascript
const response = await fetch("/api/presigned-url", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    fileName: "my-video.mp4",
    fileType: "video/mp4",
  }),
});

const { presignedURL } = await response.json();
```

## Error Responses

### 400 Bad Request

```json
{
  "error": "Invalid request body",
  "message": "fileName is required"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error",
  "message": "Failed to generate presigned URL"
}
```

## Rate Limiting

- No rate limiting currently implemented
- Consider implementing rate limiting for production use

## Authentication

- Currently no authentication required
- Consider adding API key authentication for production

## CORS

- CORS enabled for frontend domain
- Configure allowed origins in production
