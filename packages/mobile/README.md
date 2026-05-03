# LocalConnect Mobile App

A React Native mobile application for the LocalConnect platform - connecting local service providers with customers.

## Features

- **User Features**
  - Browse local service workers by profession
  - Search and filter workers
  - View worker profiles with ratings and reviews
  - Direct call functionality to contact workers
  - Save favorite workers
  - Request services from workers

- **Worker Features**
  - Worker dashboard with job statistics
  - Availability toggle
  - Accept/reject job requests
  - View and manage service requests
  - Worker registration flow

## Tech Stack

- **React Native** with Expo
- **Expo Router** for navigation
- **TypeScript** for type safety
- **Zustand** for state management
- **Expo Camera & Location** for verification

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Install dependencies:
   ```bash
   cd packages/mobile
   yarn install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your API URL:
   ```
   EXPO_PUBLIC_API_URL=http://localhost:3001
   ```

### Running the App

```bash
# Start the development server
yarn start

# Run on iOS
yarn ios

# Run on Android
yarn android
```

## Project Structure

```
packages/mobile/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home screen
│   │   ├── workers.tsx    # Workers listing
│   │   ├── dashboard.tsx  # Worker dashboard
│   │   ├── favorites.tsx  # Saved workers
│   │   └── profile.tsx    # User profile
│   ├── auth/              # Authentication screens
│   ├── worker/            # Worker-related screens
│   │   ├── [id].tsx       # Worker detail
│   │   └── register.tsx   # Worker registration
│   └── _layout.tsx        # Root layout
├── src/
│   ├── components/        # Reusable components
│   │   ├── ui/           # Base UI components
│   │   └── workers/      # Worker-specific components
│   ├── lib/              # Utilities and API client
│   ├── stores/           # Zustand stores
│   ├── theme/            # Design tokens
│   └── types/            # TypeScript types
├── assets/               # Images and fonts
├── app.json             # Expo configuration
└── package.json
```

## UI Components

The app includes a comprehensive UI component library:

- `Button` - Primary, secondary, outline, ghost variants
- `Card` - Elevated, outlined, filled variants
- `Input` - Text input with icons and validation
- `Avatar` - User avatars with online indicator
- `Badge` - Status badges with variants
- `Rating` - Star rating display
- `Toggle` - On/off toggle switch
- `CallButton` - Direct call functionality

## Screens

### User Screens
- **Home** - Browse popular services, top workers
- **Workers** - Search and filter workers list
- **Worker Detail** - Full worker profile with call action
- **Favorites** - Saved workers with quick call
- **Profile** - User settings and preferences

### Worker Screens
- **Dashboard** - Job stats, availability, pending requests
- **Register** - 4-step worker registration flow

### Auth Screens
- **Login/Signup** - Phone OTP authentication

## Key Features

### Direct Call Functionality
Workers' phone numbers are displayed and clickable for immediate contact:
```tsx
<CallButton
  phone={worker.user.phone}
  variant="primary"
  label="Call Now"
  showPhone
/>
```

### Worker Dashboard (from UI mockup)
- Availability toggle
- Today's statistics (jobs, earnings, completed)
- Pending job requests with accept/reject
- Quick actions

## Building for Production

### iOS
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new code
3. Add proper types for new features
4. Test on both iOS and Android

## License

Private - All rights reserved
