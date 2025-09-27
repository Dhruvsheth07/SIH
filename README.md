# Patient Portal - Multilingual Offline-First PWA

A comprehensive multilingual, offline-first Patient Portal frontend built with React, TypeScript, and modern web technologies. Designed to serve rural patients, daily-wage workers, farmers, and community health workers with a simple, intuitive interface that works even without internet connectivity.

## Features

### 🌐 Multilingual Support
- **English, Hindi, and Punjabi** language support
- Dynamic language switching with persistent preferences
- RTL support for better accessibility

### 📱 Progressive Web App (PWA)
- **Offline-first architecture** with IndexedDB storage
- Service Worker with Background Sync API
- Installable on mobile devices
- Responsive design for all screen sizes

### 🔐 Registration & eKYC
- Phone number + OTP authentication (demo mode)
- Aadhaar card OCR using Tesseract.js
- Face verification using face-api.js
- Encrypted storage of sensitive data

### 📋 Health Records Management
- **Offline health records** with automatic sync
- Support for consultations, prescriptions, lab results, vaccinations
- File attachments and document management
- Sync status tracking and conflict resolution

### 🤖 AI Symptom Checker
- **Offline AI analysis** using TensorFlow.js Lite
- Symptom severity and duration tracking
- Possible condition suggestions with probability scores
- Urgency level assessment and recommendations

### 📹 Video Consultation
- **WebRTC video/audio calls** with adaptive bitrate
- Doctor appointment booking system
- Consent modal for recording permissions
- Meeting room management

### 🚨 Emergency SOS
- **Persistent SOS button** on all screens
- GPS location tracking and sharing
- Automatic SMS fallback when offline
- Emergency type classification and history

### 💊 Medicine Stock & Prescriptions
- **Offline medicine database** with stock tracking
- E-prescription display and management
- Nearby pharmacy finder with real-time availability
- Price comparison and expiry date tracking

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **Headless UI** for accessible components

### Offline & Storage
- **Dexie.js** for IndexedDB management
- **Service Worker** with Workbox
- **Background Sync API** for data synchronization
- **Crypto-js** for data encryption

### AI & Computer Vision
- **TensorFlow.js** for symptom analysis
- **Tesseract.js** for Aadhaar OCR
- **face-api.js** for face verification

### Communication
- **WebRTC** for video calls
- **Simple-peer** for peer-to-peer connections
- **React Webcam** for camera access

### Internationalization
- **i18next** for translation management
- **React-i18next** for React integration
- **Language detection** with browser preferences

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Modern web browser with IndexedDB support
- HTTPS for PWA features (required for Service Worker)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd patient-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Navigation.tsx  # Sidebar navigation
│   ├── LanguageSelector.tsx
│   ├── SOSButton.tsx   # Emergency SOS button
│   └── OfflineIndicator.tsx
├── pages/              # Page components
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── HealthRecordsPage.tsx
│   ├── SymptomCheckerPage.tsx
│   ├── VideoConsultationPage.tsx
│   ├── MedicineStockPage.tsx
│   ├── EmergencyPage.tsx
│   └── ProfilePage.tsx
├── store/              # Redux store and slices
│   ├── index.ts
│   └── slices/
├── services/           # External services
│   ├── database.ts     # IndexedDB configuration
│   └── i18n.ts         # Internationalization setup
├── types/              # TypeScript type definitions
├── locales/            # Translation files
│   ├── en.json
│   ├── hi.json
│   └── pa.json
└── hooks/              # Custom React hooks
```

## Key Features Implementation

### Offline-First Architecture
- All data is stored locally in IndexedDB
- Changes are queued for sync when online
- Background sync handles data synchronization
- Conflict resolution for concurrent edits

### Multilingual Support
- Complete UI translation in 3 languages
- Dynamic language switching
- Persistent language preferences
- RTL layout support for Hindi/Punjabi

### Security & Privacy
- Encrypted storage of sensitive data
- Aadhaar hash storage (never raw data)
- Secure face verification process
- GDPR-compliant data handling

### Performance Optimization
- Lazy loading of components
- Image optimization and caching
- Bundle splitting for faster loading
- Service Worker caching strategies

## API Integration

The application includes mock API endpoints for development:

- `/api/auth/login` - User authentication
- `/api/records` - Health records management
- `/api/consultations` - Video consultation booking
- `/api/sos` - Emergency SOS requests
- `/api/pharmacy/stock` - Medicine stock data

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Note**: This is a demo application with mock data and APIs. For production use, integrate with real backend services and implement proper security measures.