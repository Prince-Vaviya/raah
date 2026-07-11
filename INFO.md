# Raah Public Transit Ecosystem

The `raah` project is a comprehensive, dual-application public transit solution built using **React Native** and **Expo**. It aims to digitize and improve the experience for both daily commuters and bus operators through two dedicated applications:

## 1. Raah Commuter (`raah-commuter`)
This application is designed for the passengers (commuters). 
- **Purpose:** To revolutionize the daily public transit experience by providing real-time data and contextual alerts.
- **Key Features:**
  - **Smart Search & Routing:** Search for buses and destinations.
  - **Real-Time Live Tracking:** Context-aware tracking of active journeys with delay statuses.
  - **Dynamic Alerts:** Global alerts for route diversions and weather updates.
  - **Saved & History:** Access favorite places and view past trips.
  - **Gamified Profile:** Track environmental impact (CO₂ saved) and unlock achievements.
- **Tech Stack:** React Native, Expo Router v3 (for file-based routing), React Context API (state management), and `react-native-maps`.

## 2. Raah Conductor (`raah-conductor`)
This application is designed for bus conductors and public transit operators.
- **Purpose:** To replace manual ticketing/reporting systems, empowering conductors to focus on passenger safety and service quality while staying connected with the central control room.
- **Key Features:**
  - **Live Dashboard:** Real-time tracking of the current journey and ETAs.
  - **Operator Commands:** Receive and respond to high-priority commands from the control room.
  - **Incident Reporting:** Report delays, skip stops, and chat with operators.
  - **Passenger Management:** Input forms to update passenger counts at stops.
  - **Trip Summaries:** Automated generation of trip statistics at the end of a shift.
- **Tech Stack:** React Native, React Navigation (Stack and Bottom Tabs), and Lucide React Native (for icons).

## Summary
Together, these two apps form a complete ecosystem. The **Conductor** app provides the live operational data and management capabilities, while the **Commuter** app consumes this data to provide passengers with a modern, reliable, and engaging travel experience.
