# Video Transcoding HLS Platform

A scalable, cloud-native video transcoding platform that converts uploaded videos into HLS (HTTP Live Streaming) format with multiple quality levels.

## 🚀 Quick Links

- [Live Demo](https://your-demo-url.com) - Try the platform
- [Documentation](README.md) - Complete project documentation
- [API Reference](docs/API.md) - API documentation
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment
- [Contributing](CONTRIBUTING.md) - How to contribute

## ✨ Key Features

- **Multi-Quality Transcoding**: Automatic conversion to 360p, 480p, and 720p
- **HLS Streaming**: Adaptive bitrate streaming for optimal viewing
- **Cloud-Native**: Built on AWS services (S3, ECS, SQS)
- **Custom Player**: React-based video player with quality selection
- **Asynchronous Processing**: Queue-based video processing
- **Containerized**: Docker-based deployment

## 🏗️ Architecture

```
Frontend (React) → API Gateway → SQS → ECS Task → Video Transcoder → S3 Output
```

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, HLS.js
- **Backend**: Node.js, Express.js, AWS SDK
- **Video Processing**: FFmpeg, Docker
- **Cloud**: AWS S3, ECS, SQS
- **Infrastructure**: Docker, Docker Compose

## 📊 Project Stats

- **Services**: 4 microservices
- **Languages**: JavaScript, Dockerfile
- **Dependencies**: 20+ npm packages
- **AWS Services**: 3 (S3, ECS, SQS)
- **Video Formats**: MP4, MOV, AVI, MKV, WebM

## 🎯 Use Cases

- Video streaming platforms
- Content management systems
- Educational platforms
- Media processing pipelines
- Video-on-demand services

## 📈 Performance

- **Processing Speed**: ~2-5x real-time (depending on resolution)
- **Supported Resolutions**: 360p, 480p, 720p
- **Concurrent Jobs**: Scalable with ECS
- **Storage**: S3 with CloudFront CDN

## 🔧 Getting Started

1. Clone the repository
2. Install dependencies
3. Configure AWS credentials
4. Run development servers
5. Upload and process videos

See [README.md](README.md) for detailed setup instructions.

---

**Built with ❤️ for scalable video processing**
