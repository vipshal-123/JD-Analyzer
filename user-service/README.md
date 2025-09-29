# 🤖 AI-Powered Resume Analyzer - User Service

A robust, scalable authentication microservice built with Node.js, TypeScript, and Express.js. This service handles user registration, authentication, session management, and real-time communication features.

![Node.js](https://img.shields.io/badge/node.://img.shields.io/badge/typescript-v5.9badge/express-v5.1.0-light

## 🚀 Features
- **Secure Authentication**: JWT-based authentication with refresh token support
- **User Registration**: Complete registration flow with email verification
- **Password Management**: Secure password hashing and reset functionality
- **Email Services**: Email Otp verification using Nodemailer
- **Session Management**: Comprehensive session handling and validation
- **Security Middleware**: CORS, Frameguard, and other security measures
- **TypeScript**: Full TypeScript support with strict typing
- **MongoDB Integration**: Mongoose ODM for data management

## 🛠️ Tech Stack

- **Runtime**: Node.js 22+
- **Language**: TypeScript 5.9.2
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Email**: Nodemailer 7.0+
- **Validation**: Yup schema validation
- **Development**: Nodemon with ts-node

## 📋 Prerequisites

- Node.js 18.0 or higher
- MongoDB 6.0 or higher
- npm or yarn package manager
- SMTP server for email functionality (Gmail, SendGrid, etc.)

## 🔧 Installation

1. **Clone the repository**
[git clone https://github.com/vipshal-123/JD-Analyzer/tree/main/agent-service](https://github.com/vipshal-123/JD-Analyzer.git)

```bash
cd user-service
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration (local.env)**
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/ai-jd-analyzer-user
API_HOST=http://localhost:5001
CRYPTO_SECRET=
FRONTEND_USER=http://localhost:3000

SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASS=
SMTP_MAIL=
```

4. **Start development server**
```bash
npm run dev #local server
docker compose -f docker-compose.dev.yml up --build #docker server

- If you are using local docker then please replace localhost to mongo in MONGO_URI 
```


5. **Add the email template to your database**
```bash
{
  "identifier": "verification_mail",
  "subject": "Verify Otp",
  "content": "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\" />\n    <title>Static Template</title>\n    <link\n      href=\"https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap\"\n      rel=\"stylesheet\"\n    />\n  </head>\n  <body\n    style=\"\n      margin: 0;\n      font-family: 'Poppins', sans-serif;\n      background: #ffffff;\n      font-size: 14px;\n    \"\n  >\n    <div\n      style=\"\n        max-width: 680px;\n        margin: 0 auto;\n        padding: 45px 30px 60px;\n        background: #f4f7ff;\n        background-image: url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner);\n        background-repeat: no-repeat;\n        background-size: 800px 452px;\n        background-position: top center;\n        font-size: 14px;\n        color: #434343;\n      \"\n    >\n      <header>\n        <table style=\"width: 100%;\">\n          <tbody>\n            <tr style=\"height: 0;\">\n            </tr>\n          </tbody>\n        </table>\n      </header>\n\n      <main>\n        <div\n          style=\"\n            margin: 0;\n            margin-top: 70px;\n            padding: 92px 30px 115px;\n            background: #ffffff;\n            border-radius: 30px;\n            text-align: center;\n          \"\n        >\n          <div style=\"width: 100%; max-width: 489px; margin: 0 auto;\">\n            <h1\n              style=\"\n                margin: 0;\n                font-size: 24px;\n                font-weight: 500;\n                color: #1f1f1f;\n              \"\n            >\n              Your OTP\n            </h1>\n            <p\n              style=\"\n                margin: 0;\n                margin-top: 17px;\n                font-size: 16px;\n                font-weight: 500;\n              \"\n            >\n              Dear ##USER_NAME##,\n            </p>\n            <p\n              style=\"\n                margin: 0;\n                margin-top: 17px;\n                font-weight: 500;\n                letter-spacing: 0.56px;\n              \"\n            >\n              Use the following OTP to complete the procedure. The OTP is valid for\n              <span style=\"font-weight: 600; color: #1f1f1f;\">2 minutes</span>.\n              Do not share this code with others.\n            </p>\n            <p\n              style=\"\n                margin: 0;\n                margin-top: 60px;\n                font-size: 40px;\n                font-weight: 600;\n                letter-spacing: 25px;\n                color: #ba3d4f;\n              \"\n            >\n              ##OTP##\n            </p>\n          </div>\n        </div>\n\n        <p\n          style=\"\n            max-width: 400px;\n            margin: 0 auto;\n            margin-top: 90px;\n            text-align: center;\n            font-weight: 500;\n            color: #8c8c8c;\n          \"\n        >\n          Need help? Ask at\n          <a\n            href=\"mailto:vipshal@gmail.com\"\n            style=\"color: #499fb6; text-decoration: none;\"\n            >vipshal@gmail.com</a\n          >\n          or visit our\n          <a\n            href=\"\"\n            target=\"_blank\"\n            style=\"color: #499fb6; text-decoration: none;\"\n            >Help Center</a\n          >\n        </p>\n      </main>\n    </div>\n  </body>\n</html>\n"
}
```
