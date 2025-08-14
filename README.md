# StrokeE Paramedic App

A Next.js-based mobile application designed for paramedics and emergency medical personnel to receive, manage, and respond to stroke emergency alerts in real-time. This app is part of the larger StrokeE emergency response system, enabling rapid coordination between patients, paramedics, and healthcare facilities.

## 🚨 Features

### Core Functionality

- **Real-time Emergency Alerts**: Receive instant notifications for new stroke emergencies
- **Live Patient Information**: Access critical patient data
- **Interactive Maps**: View patient location

## 🛠️ Tech Stack

- **Framework**: Next.js 15.1.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Real-time Communication**: Server-Sent Events (SSE) for live updates
- **Maps**: Leaflet for location services
- **State Management**: React Context API
- **Testing**: Jest with React Testing Library
- **Package Manager**: npm/yarn/pnpm

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Firebase project setup
- Access to StrokeE backend services

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd strokee/paramedic-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory with your configuration:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_BACKEND_URL=your_backend_url
   NEXT_PUBLIC_NOTIFICATION_BACKEND_URL=your_backend_url
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

Run the test suite using the following commands:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🏗️ Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🐳 Docker

The app includes Docker support for containerized deployment:

```bash
# Build Docker image
docker build -t strokee-paramedic-app .

# Run container
docker run -p 3000:3000 strokee-paramedic-app
```

## 📋 Key Features Explained

### Real-time Emergency Management

- Paramedics receive instant notifications for new stroke emergencies

### Patient Information Dashboard

- Access to critical patient data (age, weight, height, medications)
- Contact information for emergency coordination

### Interactive Emergency Interface

- Map showing patient location

### Clinic Integration

- View available healthcare facilities

## 🔒 Security Features

- Firebase Authentication for secure user management
- Role-based access control for paramedic personnel
- Secure API endpoints with authentication
- Encrypted communication for patient data

## 📱 Mobile-First Design

- Responsive design optimized for mobile devices
- Touch-friendly interface for field use
- Progressive Web App (PWA) capabilities

## 🔄 Real-time Communication

- Server-Sent Events (SSE) for live emergency updates
- Push notifications for critical alerts

## 🗺️ Mapping & Navigation

- Interactive maps with patient location


