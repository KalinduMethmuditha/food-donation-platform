# Food Donation Platform

A mobile surplus food donation platform that connects restaurants, household donors, NGOs, and volunteers to reduce food waste and improve the distribution of surplus food to communities in need.

The application is being developed as part of a Human-Computer Interaction (HCI) project, with emphasis on user-centered design, usability, accessibility, and efficient donation workflows.

---

## Project Overview

Large amounts of usable food are discarded by restaurants and households while many communities continue to experience food insecurity.

The Food Donation Platform provides a mobile solution where donors can publish available surplus food, NGOs can discover and accept donations, volunteers can manage collections, and all involved users can track the donation process.

The system is designed around a simple workflow:

**Donor publishes food → NGO accepts donation → Volunteer is assigned → Food is collected → Donation is completed**

---

## User Roles

The application supports four main user groups:

- **Household Donor** – Posts surplus food available for donation.
- **Restaurant Donor** – Publishes larger or recurring surplus food donations and tracks their collection status.
- **NGO / Charity** – Finds available donations, accepts or rejects them, and coordinates collection.
- **Volunteer** – Receives assigned collection tasks and updates pickup progress.

---

## Core Features

### Authentication
- User registration and login
- Role-based access and navigation

### Food Donation Management
- Create and publish food donations
- Add food type, quantity, description, location, and pickup deadline
- Upload food images
- Preview donation information before publishing

### NGO Operations
- Discover available donations
- View complete donation information
- Accept or reject donations
- Assign volunteers for collection

### Volunteer Operations
- View assigned collections
- Access pickup information
- Update collection progress
- Confirm completed pickups

### Donation Tracking
Donation progress can be tracked through stages such as:

`Published → NGO Accepted → Volunteer Assigned → Pickup in Progress → Collected`

### Donation History
- View active donations
- View completed donations
- Search and review previous donation records

### Notifications
Users receive updates for important events such as:

- Donation published
- Donation accepted
- Volunteer assigned
- Pickup started
- Food collected

### Location Support
- Donation pickup locations
- Map-based location display
- Nearby NGO and volunteer discovery

---

## Technology Stack

### Mobile Application

- React Native
- Expo
- TypeScript
- Expo Router
- NativeWind
- TanStack Query
- React Hook Form
- Zod
- Lucide React Native

### Backend

- Laravel REST API
- Laravel Sanctum
- MySQL

### Mobile Services

- Expo SecureStore
- Expo ImagePicker
- Expo Location
- Expo Notifications
- React Native Maps

### Development Tools

- Git
- GitHub
- Postman
- Figma
- Visual Studio Code
- Expo Go / Expo EAS

---

## Planned Project Structure

```text
food-donation-platform/
│
├── mobile/
│   ├── app/
│   ├── components/
│   ├── services/
│   ├── hooks/
│   ├── types/
│   └── assets/
│
├── backend/
│   ├── app/
│   ├── routes/
│   ├── database/
│   └── tests/
│
├── docs/
│
└── README.md
