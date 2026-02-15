# 💻 Discord Clone - Frontend Client

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

> A highly interactive, responsive, and real-time Discord client built with React.

---

## 🎨 UI & Features

The frontend is a single-page application (SPA) optimized for speed and interactivity.

### Key Components
| Component | Functionality | Key Libraries |
| :--- | :--- | :--- |
| **Chat Interface** | Infinite scrolling messages, Typing indicators, Media uploads. | Framer Motion, Radix UI |
| **Server Navigation** | Sidebar for servers/channels, Context menus. | Lucide React |
| **Voice/Video** | Group calls, Screen sharing, participant management. | LiveKit React SDK |
| **Settings** | User profile, Theme switcher, Privacy controls. | React Hook Form, Zod |
| **Modals** | Create Server check, Invite Friends, Popups. | Radix Dialog |

### Client Architecture
```mermaid
graph TD
    subgraph View ["🎨 View Layer (React)"]
        Pages[Page Components]
        UI_Kit[UI Components]
        Modals[Dialogs & Overlays]
    end

    subgraph State ["📦 State Layer (Redux)"]
        AuthSlice[Auth Slice]
        ChatSlice[Chat Slice]
        ServerSlice[Server Slice]
        RTC_State[WebRTC State]
    end

    subgraph Controller ["🔌 Controller Layer"]
        Socket[Socket.io Client]
        API[Axios Interceptors]
        LiveKit[LiveKit SDK]
    end

    Pages --> State
    UI_Kit --> State
    
    State <--> Controller
    
    Controller -->|REST| Backend[Backend API]
    Controller -->|WS| SocketServer[Socket Server]
    LiveKit <-->|WebRTC| MediaServer[Media Server]
```


---

## 🛠️ Setup & Development

### 1. Prerequisites
- Node.js v18+
- Backend server running (for API calls)

### 2. Installation
```bash
# Navigate to frontend
cd Discord-FE

# Install dependencies
npm install
# or
yarn install
```

### 3. Configuration
Create a `.env` file in the root directory:

```env
VITE_API_URL="http://localhost:3000/api/v1"
VITE_SOCKET_URL="http://localhost:3000"
VITE_LIVEKIT_URL="..."
VITE_CLOUDINARY_CLOUD_NAME="..."
```

### 4. Running the Client
```bash
# Development Mode (Vite server)
npm run dev
# App will run at http://localhost:5173

# Production Build
npm run build
npm run preview
```

---

## 📦 State Management (Redux)

The application uses **Redux Toolkit** for centralized state.

- `authSlice`: User session, JWT token, User profile.
- `chatSlice`: Current channel, messages, typing status.
- `serverSlice`: List of joined servers, current server details.
- `friendSlice`: Pending requests, friend list, online status.
- `mediaChannelSlice`: Active voice/video call state.

---

## 📂 Project Structure

- `src/components`: Reusable UI components (Buttons, Inputs, Chat Bubbles).
- `src/pages`: Top-level route components (Dashboard, Login).
- `src/store`: Redux slices and configuration.
- `src/services`: API service functions (axios instances).
- `src/hooks`: Custom React hooks (useSocket, useAuth).
- `src/utils`: Helper functions and constants.
