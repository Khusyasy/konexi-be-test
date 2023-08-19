# Konexi Backend Test Project

API Documentation Link: https://documenter.getpostman.com/view/15921073/2s9Y5SW5nT
Deployed Link: http://13.239.57.177:3000/api/v1/

## Deployment Instructions

Pre-requisites:

- AWS S3 Bucket
- AWS IAM User with S3 Full Access
- AWS IAM User Access Key and Secret Key
- AWS EC2 Instance configured with selected Port open (default: 3000)
- MongoDB Database (Atlas or Local)

Steps:

1. Connect to your EC2 instance using SSH
2. Install git, node v18.17.1 (recommended using nvm), mongodb (if using local db)
3. Clone the repository
4. Create a '.env' file in the root directory by copying the '.env.example' file
5. Fill in the environment variables in the '.env' file

```env
MONGODB_URI: MongoDB connection string
JWT_SECRET: Secret token for JWT (recommended to be generated using a cryptographically secure random generator)
AWS_BUCKET_NAME: Name of the S3 bucket
AWS_REGION: Region of the S3 bucket
AWS_ACCESS_KEY: Access key of the IAM user
AWS_SECRET_ACCESS_KEY: Secret access key of the IAM user
```

6. Run `npm install` to install all the dependencies
7. Run `npm start` to start the server
8. The server will be running on port 3000 by default
