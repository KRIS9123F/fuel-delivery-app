# ⛽ FuelRescue — On-Demand Fuel Delivery App

> Ran out of fuel? Don't push your vehicle. Get fuel delivered to your doorstep in minutes.

FuelRescue is a real-time fuel delivery platform that connects customers with nearby petrol pumps. Verified **pump staff** deliver fuel directly to your location — no third-party riders, making the delivery **safe, certified, and reliable**.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🔍 **Real Pump Detection** | Detects real petrol pumps near your GPS location using **OpenStreetMap Overpass API** |
| 🗺️ **Live Tracking** | Zepto/Blinkit-style driver tracking along **real roads** using **OSRM routing** |
| 🛡️ **Pump Staff Delivery** | Fuel is delivered by verified staff from the petrol pump itself — no anonymous riders |
| 🔐 **Firebase Auth** | Google Sign-In and Email/Password authentication |
| 📍 **GPS + Search** | Auto-detect location via GPS or search 42+ Hyderabad localities |
| 📊 **Station Dashboard** | Petrol pumps can manage orders, toggle fuel availability, and track deliveries |
| 🏍️ **Delivery App** | Dedicated interface for pump staff to accept and fulfill delivery orders |
| 📱 **Mobile-First UI** | Beautiful, responsive design built with Tailwind CSS v4 |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + Vite 7 |
| **Styling** | Tailwind CSS v4 |
| **Maps** | Google Maps JavaScript API (`@vis.gl/react-google-maps`) |
| **Auth** | Firebase Authentication (Google + Email) |
| **Database** | Firebase Firestore (orders, users) + Realtime Database (live GPS tracking) |
| **Routing** | OSRM (Open Source Routing Machine) — free road-following routes |
| **Pump Discovery** | Overpass API (OpenStreetMap) — free real-world petrol pump data |
| **Icons** | Lucide React |

---

## 📁 Project Structure

```
fuel-delivery-app/
├── public/                     # Static assets
├── scripts/
│   └── importData.js           # Firebase data import script
├── data/                       # Seed data for Firebase
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── maps/
│   │   │   ├── LocationSearch.jsx    # Location search with autocomplete
│   │   │   ├── MapView.jsx           # Basic map display component
│   │   │   └── MapWithRoute.jsx      # Map with route, markers, and driver tracking
│   │   ├── modals/
│   │   │   └── QuantityModal.jsx     # Fuel quantity selection modal
│   │   ├── station/                  # Station-specific components
│   │   ├── tracking/
│   │   │   ├── DeliveryPersonCard.jsx # Driver/pump staff info card
│   │   │   └── ETADisplay.jsx        # Real-time ETA and distance display
│   │   ├── ui/
│   │   │   ├── BottomNav.jsx         # Mobile bottom navigation bar
│   │   │   ├── ErrorBoundary.jsx     # Global error boundary (prevents blank screens)
│   │   │   ├── LoadingSpinner.jsx    # Loading indicator
│   │   │   └── ...                   # Other shared UI components
│   │   └── user/                     # User-specific components
│   ├── context/
│   │   └── AuthContext.jsx           # Firebase auth state management
│   ├── firebase/
│   │   ├── config.js                 # Firebase app initialization
│   │   ├── orders.js                 # Order CRUD operations (Firestore)
│   │   ├── stations.js               # Station queries and updates
│   │   ├── tracking.js               # Delivery tracking operations
│   │   └── realtimeTracking.js       # Live GPS tracking (Realtime Database)
│   ├── hooks/
│   │   ├── useGeolocation.js         # GPS location hook
│   │   └── useOrders.js              # Orders subscription hook
│   ├── pages/
│   │   ├── LandingPage.jsx           # Public landing page
│   │   ├── LoginPage.jsx             # Email + Google sign-in
│   │   ├── RegisterPage.jsx          # New user registration
│   │   ├── HomePage.jsx              # Main dashboard — fuel selection, pump detection
│   │   ├── PaymentPage.jsx           # Order summary and payment
│   │   ├── AssignmentPage.jsx        # Driver assignment flow
│   │   ├── TrackingPage.jsx          # Live delivery tracking with OSRM routes
│   │   ├── OrdersPage.jsx            # Order history
│   │   ├── ProfilePage.jsx           # User profile management
│   │   ├── StationDashboard.jsx      # Petrol pump owner dashboard
│   │   └── DeliveryPersonApp.jsx     # Pump staff delivery interface
│   ├── utils/
│   │   ├── mockData.js               # 10 Hyderabad fuel stations, delivery persons, orders
│   │   ├── nearbyPumps.js            # ⭐ Real pump detection via Overpass API
│   │   ├── routeService.js           # ⭐ OSRM road-following route service
│   │   ├── locationSearch.js         # 42 searchable Hyderabad locations
│   │   ├── mapHelpers.js             # Map center coordinates and zoom config
│   │   ├── distanceCalculator.js     # Haversine distance calculations
│   │   └── etaCalculator.js          # ETA estimation logic
│   ├── App.jsx                       # Root app with routing
│   ├── main.jsx                      # Entry point with ErrorBoundary
│   └── index.css                     # Tailwind CSS v4 theme and utilities
├── .env                              # Environment variables (not committed)
├── .gitignore
├── index.html
├── vite.config.js
├── eslint.config.js
├── firestore.rules
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** 9+
- A **Firebase** project (free tier works)
- A **Google Maps API key** (free tier with watermark)

### 1. Clone the Repository

```bash
git clone https://github.com/KRISHNAapp123F/fuel-delivery-app.git
cd fuel-delivery-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root:

```env
# Firebase Core
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Realtime Database
VITE_FIREBASE_DATABASE_URL=https://your_project.firebasedatabase.app

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Enable **Authentication** → Sign-in methods → Google + Email/Password
4. Create a **Firestore Database** (start in test mode)
5. Create a **Realtime Database** (for live GPS tracking)
6. Copy the config values into your `.env` file

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 6. Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com) → Import your repository
3. Add all `VITE_*` environment variables from your `.env`
4. Deploy — your site will be live in ~60 seconds

> **Important:** After deploying, add your Vercel domain to **Firebase Console → Auth → Authorized Domains**

### Netlify

1. Visit [netlify.com](https://netlify.com) → Import from GitHub
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables in Site Settings → Environment Variables

---

## 🔌 Free APIs Used

| API | Purpose | Cost |
|-----|---------|------|
| [Overpass API](https://overpass-api.de/) | Find real petrol pumps from OpenStreetMap | **Free**, unlimited |
| [OSRM](http://project-osrm.org/) | Road-following route polylines | **Free**, unlimited |
| [Google Maps JS](https://developers.google.com/maps) | Map display and markers | **Free tier** (watermark) |
| [Firebase](https://firebase.google.com/) | Auth, database, real-time sync | **Free tier** (Spark plan) |

---

## 🔒 Safety Model

FuelRescue uses a **pump staff delivery model**:

- ✅ Delivery person is a **verified employee** of the petrol pump
- ✅ No anonymous third-party riders
- ✅ Each delivery is traceable to a **specific petrol station**
- ✅ Fuel quality is guaranteed by the source pump

---

## 📸 App Pages

| Page | Description |
|------|-------------|
| **Landing** | Public marketing page with app features |
| **Login/Register** | Firebase authentication (Google + Email) |
| **Home** | GPS detection → find real pumps → select fuel type + quantity |
| **Payment** | Order summary with price breakdown |
| **Tracking** | Live map tracking with road-following animation + ETA |
| **Orders** | Order history with status |
| **Profile** | User profile management |
| **Station Dashboard** | Pump owner: manage orders, toggle availability |
| **Delivery App** | Pump staff: accept/complete deliveries |

---

## 👥 Team

Built for **Hacksena Hackathon** 🏆

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
