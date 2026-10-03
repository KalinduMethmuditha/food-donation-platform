# Food Donation Mobile App

React Native + Expo SDK 57 + TypeScript, using Expo Router, Zustand, and React Native StyleSheet.

## Run

From this `mobile` directory, with an existing compatible Node installation available:

```sh
npm install
npm run typecheck
npm start
```

Use `npm run android`, `npm run ios`, or `npm run web` to start the corresponding Expo development target. Native testing requires a compatible emulator, simulator, or device.

`npm run lint` invokes Expo's ESLint setup when ESLint is not configured. The current project does not include ESLint or `eslint-config-expo`; accepting that setup installs additional development dependencies. Type checking is available independently through `npm run typecheck`.

## Restaurant Donor module

Routes live in `src/app/restaurant/`. The app entry redirects to `/restaurant/dashboard`.

- Main navigation: Dashboard, Donations, Notifications, and Profile.
- Donation creation: Food Details → Pickup Details → Preview.
- Donation status: `/restaurant/donations/[id]`.
- Active and Completed donations share one screen with local tab and search state.

Reusable presentation components live in `src/components/ui/` and `src/components/shared/`; restaurant-specific components live in `src/components/restaurant/`. Shared colors come from `src/constants/colors.ts`.

`src/stores/donationDraft.store.ts` holds wizard values across navigation. Search, selected tabs, filters, and validation belong to their respective screens.

Restaurant donation data and publishing remain frontend demonstrations. No Laravel API, authentication, real map, or push notification service is connected. Mock data and simulated publishing should be replaced when the API is available.

## Manual verification

1. Open the dashboard, then select Create Donation.
2. Submit empty Food Details and verify required-field errors.
3. Enter `Rice & Curry`, `10`, and `Freshly prepared meals`; continue.
4. Verify Pickup Details validates empty fields, then enter `Green Leaf Restaurant, Main Entrance` and `Today, 3:00 PM`.
5. Continue to Preview and verify all entered values appear.
6. Use Back and both Edit actions; confirm draft values remain populated.
7. Confirm & Publish; verify donation details, quantity, pickup details, and timeline.
8. Open My Donations; switch Active/Completed, search by name, and open cards. Verify a nonmatching search shows an empty state.
9. Use Home, Donations, Notifications, and Profile in the bottom navigation; confirm selected states and destinations.
10. Verify Notifications' All and Unread filters, scrolling on a small screen, keyboard access to form fields, and device safe areas.

The original Expo starter components and reset-project script were removed after confirming no application imports depended on them.
