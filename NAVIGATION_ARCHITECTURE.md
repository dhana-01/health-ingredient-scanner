# 🚀 Navigation Architecture - Simplified & Optimized

## 📱 **User Journey Flow**

### **Scenario 1: New User (First-Time Sign Up)**

1. **App Launch** → `SplashScreen` (loading state)
2. **No Session** → `AuthNavigator` → `WelcomeScreen`
3. **User Signs Up** → `SignUpScreen` → Supabase creates user + profile
4. **Auth State Change** → AppNavigator detects session → `OnboardingNavigator`
5. **User Completes Survey** → `BasicInfo` → `DietaryPrefs` → `Goals` → `IntroOnboarding`
6. **Final Step** → `completeOnboarding()` → Profile updated → `MainStackNavigator`
7. **Success** → `HomeScreen` (TabNavigator)

### **Scenario 2: Returning User (Already Onboarded)**

1. **App Launch** → `SplashScreen` (loading state)
2. **Session Found** → Profile fetched → `has_completed_onboarding: true`
3. **Direct Path** → `MainStackNavigator` → `HomeScreen` (TabNavigator)

### **Scenario 3: Returning User (Logged Out)**

1. **App Launch** → `SplashScreen` (loading state)
2. **No Session** → `AuthNavigator` → `WelcomeScreen`
3. **User Logs In** → Profile fetched → `has_completed_onboarding: true`
4. **Skip Onboarding** → `MainStackNavigator` → `HomeScreen` (TabNavigator)

## 🏗️ **Architecture Components**

### **1. AppNavigator.js (Root Navigator)**

- **Single State Variable**: `appState` ('loading' | 'auth' | 'onboarding' | 'main')
- **Centralized Logic**: All navigation decisions in one place
- **Profile Refresh**: Global function for onboarding completion
- **Error Handling**: Graceful fallbacks for edge cases

### **2. MainStackNavigator.js**

- **Tab Navigation**: Home, Scan, History, Profile
- **Result Screen**: Modal screen for scan results
- **Sibling Structure**: Tabs and Result are at the same level

### **3. OnboardingNavigator.js**

- **Survey Flow**: BasicInfo → DietaryPrefs → Goals → IntroOnboarding
- **Completion Function**: `completeOnboarding()` utility
- **Auto-Navigation**: Triggers profile refresh and app state change

### **4. AuthNavigator.js**

- **Welcome Screen**: App introduction
- **Login/SignUp**: Authentication flows
- **Consistent Styling**: Dark theme with proper headers

## 🔧 **Key Features**

### **✅ Eliminated Bottlenecks:**

- **Single State Management**: One `appState` instead of multiple useState hooks
- **Efficient Profile Fetching**: Only when needed, with proper caching
- **No Complex Conditionals**: Simple switch statement for navigation
- **Global Profile Refresh**: Centralized function for onboarding completion

### **✅ Performance Improvements:**

- **useCallback**: Prevents unnecessary re-renders
- **Optimized Auth Listener**: Single subscription with proper cleanup
- **Reduced Re-renders**: Minimal state changes trigger navigation updates

### **✅ Error Handling:**

- **Graceful Fallbacks**: App continues working even with profile errors
- **User-Friendly Messages**: Clear error logging for debugging
- **Recovery Mechanisms**: Automatic retry and fallback navigation

## 🎯 **Usage Examples**

### **Completing Onboarding:**

```javascript
import { completeOnboarding } from '../navigation/OnboardingNavigator';

const handleGetStarted = async () => {
  const result = await completeOnboarding();
  if (result.success) {
    // AppNavigator automatically navigates to main app
    console.log('Onboarding completed!');
  }
};
```

### **Using User Context:**

```javascript
import { useUser } from '../context/UserContext';

const { user, profile, hasCompletedOnboarding } = useUser();
```

## 🚦 **Navigation Rules**

1. **No Manual Navigation**: Let AppNavigator handle all major navigation
2. **Profile-Driven**: Navigation decisions based on `has_completed_onboarding`
3. **State-Based**: Single source of truth for app state
4. **Error-Resilient**: App continues working even with backend issues

## 🔄 **State Transitions**

```
Loading → Auth (no session)
Loading → Onboarding (session + profile, onboarding incomplete)
Loading → Main (session + profile, onboarding complete)
Auth → Onboarding (user signs up/logs in)
Onboarding → Main (user completes survey)
Main → Auth (user logs out)
```

This architecture ensures smooth, predictable navigation with minimal complexity and maximum performance! 🎉
