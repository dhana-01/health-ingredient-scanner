# Roadmap: Health Ingredient Scanner App

This document outlines the development plan for the Health Ingredient Scanner application. We will follow this roadmap step-by-step.

---

### Phase 0: Professional Environment & Automation Setup

- [x] Configure Linting & Formatting (ESLint, Prettier)
- [x] Automate Git Commits with Git Hooks (`husky`)
- [x] Enforce Commit Message Policies (`commitlint`)
- [x] Create `ROADMAP.md` and `.cursor-rules.json`

---

### Phase 1: Frontend Development - From Figma to Interactive App

- [x] **Create Core Folder Structure:** Inside the `app/` directory, create `screens`, `components`, `navigation`, `lib`, and `assets`.
- [x] **Setup App Navigator:**
  - Create `app/navigation/AppNavigator.js`.
  - Use `@react-navigation/native-stack` to define a stack navigator.
  - The initial stack should manage an `Auth` screen and a main `App` stack (which will be accessible after login).
  - Render the `AppNavigator` in the main `App.js`.
- [x] **Build the Authentication Screen:**
  - Create `app/screens/AuthScreen.js`.
  - Build the UI with static components for email input, password input, a "Sign In" button, and a "Sign Up" button, based on the Figma design.
- [x] **Connect Auth to Supabase:**
  - Import the Supabase client into `AuthScreen.js`.
  - Wire the "Sign Up" button to `supabase.auth.signUp()`.
  - Wire the "Sign In" button to `supabase.auth.signInWithPassword()`.
  - Implement logic to navigate to the main app upon successful login.
- [x] **Build Multi-Screen Survey & Onboarding Flow:**
  - Create `app/navigation/OnboardingNavigator.js` with stack navigation.
  - Build reusable components: `PreferenceItem.js` and `GoalItem.js`.
  - Create survey screens: `BasicInfoScreen.js`, `DietaryPrefsScreen.js`, `GoalsScreen.js`.
  - Create onboarding screen: `IntroOnboardingScreen.js` with horizontal scrolling slides.
  - Implement navigation flow: Basic Info → Dietary Preferences → Goals → Onboarding → Main App.
- [ ] **Build Static App Screens (from Figma):**
  - Create placeholder files for `ScanScreen.js` and `ResultScreen.js`....
  - Build the static UI for these screens with hardcoded data to match the Figma design.

---

### Phase 2: AI Core - Camera, Microservice #1, and Results

- [ ] **Implement Camera Feature:** In `ScanScreen.js`, add `expo-camera` and functionality to take a picture.
- [ ] **Implement Image Upload:** Upload the captured picture to the Supabase Storage bucket.
- [ ] **Develop Supabase Edge Function (`analyze-ingredient-image`):** This is our first microservice.
  - It will receive an image URL.
  - It will call the Google Vision API for OCR.
  - It will call the OpenAI API for analysis.
  - It will store the results in the database.
- [ ] **Connect Frontend to AI Core:** Call the Edge Function from the app and receive the analysis.
- [ ] **Display Dynamic Results:** Populate the `ResultScreen.js` with the real data from the AI function.

---

### Phase 3 & Beyond (High-Level)

- [ ] **Open-Source Integration:** Research and integrate two external libraries.
- [ ] **Testing & QA:** Write unit, integration, and end-to-end tests.
- [ ] **CI/CD Pipeline:** Automate testing and builds with GitHub Actions.
