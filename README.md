# pomodoro

A Progressive Web Application implementing an advanced Pomodoro Timer system with unique features for enhanced productivity and user experience. This project showcases modern web development practices, complex state management, and offline-first architecture.

## Key Features

### Advanced Timer System
- Real-time timer with millisecond precision
- Automatic cycle progression with intelligent state management
- Dynamic work/break cycles with customizable durations (1-60 minutes)
- Background tab support 
- Audio alerts
- Visual progress indication using circular progress bar

### Smart Configuration Management
- Intuitive drag-and-drop cycle reordering using react-beautiful-dnd
- Preset configurations:
  - Classic Pomodoro (25/5)
  - 52/17 Focus Method
  - 90-Minute Deep Work
- Custom cycle labeling and note system
- Quick access configuration system with visibility toggles
- Real-time configuration editing with automatic state updates
- Cross-device synchronization with conflict resolution

### Progressive Web App Features
- Comprehensive offline functionality via Service Workers
- IndexedDB implementation for offline data persistence
- "Add to Home Screen" capability
- Background process handling
- Automatic service worker updates

### Advanced Notification System
- Service worker integration for native-like notifications
- Custom notification templates with rich content
- Browser-specific optimizations for Chrome, Firefox, Safari, and Edge
- Intelligent permission handling with graceful fallbacks
- Background notification support

## Technical Highlights


### Architecture & Implementation
- Redux Toolkit for sophisticated state management
- MongoDB with Mongoose ODM for flexible data modeling
- JWT-based authentication with automatic renewal
- IndexedDB for offline data persistence
- Service Workers with Workbox for advanced caching


### State Management
- Centralized Redux store with organized reducer logic
- Multi-layer state management:
  - Redux for application state
  - IndexedDB for offline persistence
  - Local storage for user preferences

### Offline-First Architecture
- Hybrid online/offline synchronization system
- "Last-write-wins" conflict resolution strategy
- Automatic synchronization on network reconnection
- Multiple storage layer management:
  - IndexedDB for offline data
  - Local storage for preferences
  - Service worker cache for assets

## Tech Stack

### Frontend
- React 
- Redux Toolkit for state management
- Material-UI for responsive design
- react-beautiful-dnd for drag-and-drop functionality
- Axios for API communication
- Service Workers

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- RESTful API architecture


## Getting Started

1. Clone the repository
```bash
git clone https://github.com/benjaehyun/pomodoro-timer-pwa.git
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Start the development server
```bash
npm start
```

5. Build for production
```bash
npm run build
```

## Future Enhancements
- Enhanced analytics dashboard with productivity metrics
- Social features and configuration sharing
- Advanced notification templates and actions
- Extended offline capabilities
- Integration with productivity tools



---

Developed by Benjamin Lee

