<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=35&pause=1000&color=F97316&center=true&vCenter=true&width=700&lines=⛽+FuelRescue;On-Demand+Fuel+Delivery;Team+Hacksena+%40+HackSavvy-26+🏆" alt="FuelRescue Typing SVG" />

<br/>

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/Firebase-Enabled-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
<img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />

<br/><br/>

> **Ran out of fuel? Don't push your vehicle.**
> Get fuel delivered to your exact location in minutes — by verified pump staff.

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Click_Here-F97316?style=for-the-badge)](https://fuel-delivery-app-github.vercel.app)

</div>

---

## 📖 Table of Contents

- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🌐 How to Open Our Website](#-how-to-open-our-website)
- [🚀 Run Locally](#-run-locally)
- [📁 Project Structure](#-project-structure)
- [🔌 Free APIs Used](#-free-apis-used)
- [🔒 Safety Model](#-safety-model)
- [📸 App Pages](#-app-pages)
- [👥 Contributors](#-contributors)

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🔍 **Real Pump Detection** | Detects real petrol pumps near your GPS location using **OpenStreetMap Overpass API** |
| 🗺️ **Live Tracking** | Zepto/Blinkit-style driver tracking along **real roads** using **OSRM routing** |
| 🛡️ **Pump Staff Delivery** | Fuel delivered by verified staff from the petrol pump — no anonymous riders |
| 🔐 **Firebase Auth** | Google Sign-In and Email/Password authentication |
| 📍 **GPS + Search** | Auto-detect location via GPS or search 42+ Hyderabad localities |
| 📊 **Station Dashboard** | Petrol pumps can manage orders, toggle availability, and track deliveries |
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
| **Database** | Firebase Firestore + Realtime Database (live GPS) |
| **Routing** | OSRM (Open Source Routing Machine) |
| **Pump Discovery** | Overpass API (OpenStreetMap) |
| **Icons** | Lucide React |

---

## 🌐 How to Open Our Website

> **The easiest way — no setup required!**

### ▶️ Option 1: Visit the Live Website (Recommended)

1. Open any modern browser (Chrome, Firefox, Edge, Safari)
2. Go to: **[https://fuel-delivery-app-github.vercel.app](https://fuel-delivery-app-github.vercel.app)**
3. Click **"Get Started"** on the landing page
4. Sign in using **Google** or create an account with your **email**
5. Allow location access when prompted — the app will detect real petrol pumps near you
6. Select fuel type, quantity, confirm & track your delivery in real time! 🎉

> 💡 **Tip:** For the best experience, open on **mobile** or use Chrome's mobile view (`F12 → Toggle Device Toolbar`)

---

### 🖥️ Option 2: Run Locally (For Developers)

#### Prerequisites

- **Node.js** 18+ and **npm** 9+
- A **Firebase** project (free tier)
- A **Google Maps API key** (free tier)

#### Step 1 — Clone the Repository

```bash
git clone https://github.com/KRIS9123F/fuel-delivery-app.git
cd fuel-delivery-app
```

#### Step 2 — Install Dependencies

```bash
npm install
```

#### Step 3 — Configure Environment Variables

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

#### Step 4 — Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Enable **Authentication** → Sign-in methods → Google + Email/Password
4. Create a **Firestore Database** (start in test mode)
5. Create a **Realtime Database** (for live GPS tracking)
6. Copy config values into your `.env` file

#### Step 5 — Start the Dev Server

```bash
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser. You're live! 🚀

#### Step 6 — Build for Production (Optional)

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

---

## 📁 Project Structure

```
fuel-delivery-app/
├── public/                         # Static assets
├── scripts/
│   └── importData.js               # Firebase data import script
├── data/                           # Seed data for Firebase
├── src/
│   ├── components/
│   │   ├── maps/
│   │   │   ├── LocationSearch.jsx  # Location search with autocomplete
│   │   │   ├── MapView.jsx         # Basic map display
│   │   │   └── MapWithRoute.jsx    # Map with route & driver tracking
│   │   ├── modals/
│   │   │   └── QuantityModal.jsx   # Fuel quantity selection modal
│   │   ├── tracking/
│   │   │   ├── DeliveryPersonCard.jsx
│   │   │   └── ETADisplay.jsx      # Real-time ETA display
│   │   └── ui/
│   │       ├── BottomNav.jsx
│   │       ├── ErrorBoundary.jsx
│   │       └── LoadingSpinner.jsx
│   ├── context/
│   │   └── AuthContext.jsx         # Firebase auth state
│   ├── firebase/
│   │   ├── config.js
│   │   ├── orders.js
│   │   ├── stations.js
│   │   ├── tracking.js
│   │   └── realtimeTracking.js
│   ├── hooks/
│   │   ├── useGeolocation.js
│   │   └── useOrders.js
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── HomePage.jsx            # Main dashboard
│   │   ├── TrackingPage.jsx        # Live delivery tracking
│   │   ├── StationDashboard.jsx    # Pump owner dashboard
│   │   └── DeliveryPersonApp.jsx   # Pump staff interface
│   ├── utils/
│   │   ├── nearbyPumps.js          # ⭐ Real pump detection (Overpass API)
│   │   ├── routeService.js         # ⭐ OSRM road-following routes
│   │   └── distanceCalculator.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env                            # Environment variables (not committed)
├── index.html
├── vite.config.js
└── package.json
```

---

## 🔌 Free APIs Used

| API | Purpose | Cost |
|-----|---------|------|
| [Overpass API](https://overpass-api.de/) | Find real petrol pumps from OpenStreetMap | **Free**, unlimited |
| [OSRM](http://project-osrm.org/) | Road-following route polylines | **Free**, unlimited |
| [Google Maps JS](https://developers.google.com/maps) | Map display and markers | **Free tier** |
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
| **Login / Register** | Firebase auth — Google or Email |
| **Home** | GPS detect → find pumps → select fuel type & quantity |
| **Payment** | Order summary with price breakdown |
| **Tracking** | Live map with road-following animation and ETA |
| **Orders** | Order history with status |
| **Profile** | User profile management |
| **Station Dashboard** | Pump owner: manage orders & toggle availability |
| **Delivery App** | Pump staff: accept and complete deliveries |

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com) → Import your repository
3. Add all `VITE_*` environment variables
4. Deploy — your site will be live in ~60 seconds ⚡

> **Important:** After deploying, add your Vercel domain to **Firebase Console → Auth → Authorized Domains**

### Netlify

1. Visit [netlify.com](https://netlify.com) → Import from GitHub
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables in Site Settings

---

## 👥 Contributors

<div align="center">

Built with ❤️ by **Team Hacksena** at **HackSavvy-26** 🏆

<br/>

| # | Name | Role |
|---|------|------|
| 🔥 | **Krishna** | Team Lead & Full Stack Developer |
| ⚡ | **Harshavardhan** | Backend & Firebase Integration |
| 🗺️ | **Dhanush** | Maps & Location Services |
| 🎨 | **Gowtham** | UI/UX Design & Frontend |
| 🚀 | **Gowtham Vivek** | API Integration & Testing |
| 🛡️ | **Rakshith Sai** | Auth, Security & Deployment |

<br/>

![Team](https://img.shields.io/badge/Team_Size-6_Members-F97316?style=for-the-badge)
![Hackathon](https://img.shields.io/badge/Event-HackSavvy--26_🏆-purple?style=for-the-badge)
![Built With](https://img.shields.io/badge/Built_With-❤️_&_☕-red?style=for-the-badge)

</div>

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

<div align="center">

---

*Made with ❤️ by Team Hacksena at HackSavvy-26*

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=14&pause=1000&color=F97316&center=true&vCenter=true&width=500&lines=Thanks+for+checking+out+FuelRescue!+⛽;Star+⭐+the+repo+if+you+found+it+useful!" alt="Footer Typing SVG" />

</div>
