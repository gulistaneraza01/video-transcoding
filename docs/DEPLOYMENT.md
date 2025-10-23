# Deployment Guide

## Prerequisites

### AWS Setup

1. **AWS Account** with appropriate permissions
2. **IAM User** with S3, ECS, and SQS permissions
3. **S3 Buckets** created:
   - `video-transcoding-temp` (for input videos)
   - `video-transcoding-output` (for processed HLS files)
4. **ECS Cluster** configured
5. **SQS Queue** created

### Local Requirements

- Docker & Docker Compose
- Node.js 20+
- pnpm package manager
- AWS CLI configured

## Step-by-Step Deployment

### 1. AWS Infrastructure Setup

#### Create S3 Buckets

```bash
# Create temporary bucket for uploads
aws s3 mb s3://your-video-transcoding-temp

# Create output bucket for processed videos
aws s3 mb s3://your-video-transcoding-output

# Set bucket policies for public read (output bucket)
aws s3api put-bucket-policy --bucket your-video-transcoding-output --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-video-transcoding-output/*"
    }
  ]
}'
```

#### Create SQS Queue

```bash
aws sqs create-queue --queue-name video-processing-queue
```

#### Create ECS Cluster

```bash
aws ecs create-cluster --cluster-name video-transcoding-cluster
```

### 2. Build and Push Docker Image

#### Build Image

```bash
cd server/video
docker build -t video-transcode:latest .
```

#### Tag for ECR (if using ECR)

```bash
docker tag video-transcode:latest your-account.dkr.ecr.region.amazonaws.com/video-transcode:latest
```

#### Push to ECR

```bash
aws ecr get-login-password --region your-region | docker login --username AWS --password-stdin your-account.dkr.ecr.region.amazonaws.com
docker push your-account.dkr.ecr.region.amazonaws.com/video-transcode:latest
```

### 3. Create ECS Task Definition

Create `task-definition.json`:

```json
{
  "family": "video-transcoding-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::your-account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "video-transcoder",
      "image": "your-account.dkr.ecr.region.amazonaws.com/video-transcode:latest",
      "essential": true,
      "environment": [
        {
          "name": "AWS_REGION",
          "value": "your-region"
        },
        {
          "name": "BUCKET",
          "value": "your-video-transcoding-temp"
        },
        {
          "name": "OUTPUT_BUCKET",
          "value": "your-video-transcoding-output"
        }
      ],
      "secrets": [
        {
          "name": "AWS_ACCESS_KEY_ID",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:video-transcoding/aws-credentials:access-key-id::"
        },
        {
          "name": "AWS_SECRET_ACCESS_KEY",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:video-transcoding/aws-credentials:secret-access-key::"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/video-transcoding",
          "awslogs-region": "your-region",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

#### Register Task Definition

```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

### 4. Deploy Services

#### API Service

```bash
cd server/api
npm install
# Set environment variables
export AWS_ACCESS_KEY_ID=your-key
export AWS_SECRET_ACCESS_KEY=your-secret
export AWS_REGION=your-region
export BUCKET=your-video-transcoding-temp
export OUTPUT_BUCKET=your-video-transcoding-output

# Start service
npm start
```

#### SQS Service

```bash
cd server/sqs
npm install
# Set environment variables
export AWS_ACCESS_KEY_ID=your-key
export AWS_SECRET_ACCESS_KEY=your-secret
export AWS_REGION=your-region
export SQS_QUEUE_URL=your-queue-url
export ECS_CLUSTER=video-transcoding-cluster
export ECS_TASK_DEFINITION=video-transcoding-task

# Start service
npm start
```

#### Frontend

```bash
cd client
npm install
npm run build
# Deploy build folder to your hosting service (S3, CloudFront, etc.)
```

### 5. Production Considerations

#### Security

- Use IAM roles instead of access keys
- Implement API authentication
- Enable HTTPS everywhere
- Set up proper CORS policies

#### Monitoring

- CloudWatch logs for all services
- SQS dead letter queues
- ECS service health checks
- S3 access logging

#### Scaling

- Auto-scaling groups for ECS services
- SQS visibility timeout configuration
- S3 lifecycle policies for cleanup

#### Cost Optimization

- Use Spot instances for ECS tasks
- S3 Intelligent Tiering
- CloudFront for video delivery
- SQS long polling

## Environment Variables Reference

### API Service

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
BUCKET=your_temp_bucket
OUTPUT_BUCKET=your_output_bucket
PORT=3000
```

### SQS Service

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
SQS_QUEUE_URL=your_queue_url
ECS_CLUSTER=your_cluster_name
ECS_TASK_DEFINITION=your_task_definition
SUBNET_IDS=subnet-xxx,subnet-yyy
SECURITY_GROUP_IDS=sg-xxx
```

### Video Service

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
BUCKET=your_temp_bucket
OUTPUT_BUCKET=your_output_bucket
VIDEO_KEY=path/to/video.mp4
```

## Troubleshooting

### Common Issues

#### ECS Task Fails to Start

- Check IAM permissions
- Verify task definition
- Check CloudWatch logs

#### S3 Upload Fails

- Verify presigned URL expiration
- Check bucket permissions
- Validate file size limits

#### Video Processing Errors

- Check FFmpeg installation
- Verify input format support
- Monitor memory usage

#### SQS Message Processing

- Check queue permissions
- Verify message format
- Monitor visibility timeout

### Logs and Monitoring

```bash
# View ECS logs
aws logs describe-log-groups --log-group-name-prefix /ecs/video-transcoding

# Monitor SQS queue
aws sqs get-queue-attributes --queue-url your-queue-url --attribute-names All

# Check S3 bucket metrics
aws cloudwatch get-metric-statistics --namespace AWS/S3 --metric-name BucketSizeBytes
```
