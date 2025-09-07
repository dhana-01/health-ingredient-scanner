# Ingredia: AI-Powered Health Ingredient Scanner
![alt text](https://github.com/dhana-01/health-ingredient-scanner/actions/workflows/main.yml/badge.svg)

Ingredia is a full-stack, AI-powered mobile application designed to bring clarity to the world of food nutrition. It empowers users to scan any food product's ingredient list and receive an instant, easy-to-understand health analysis, transforming confusing labels into actionable insights.

This project was built from the ground up with a modern, professional technology stack, featuring a sophisticated "Dual LLM" AI backend, a secure and scalable serverless architecture, and a complete CI/CD pipeline for automated testing and quality assurance.

## 📸 App Demo & Screenshots

| Onboarding | Home Screen | Scan & Result |
|------------|-------------|---------------|
| ![WhatsApp Image 2025-08-31 at 7 00 10 PM](https://github.com/user-attachments/assets/ea16f80a-0b22-4fc2-9e19-fd99a3466a53)| ![WhatsApp Image 2025-08-31 at 7 00 08 PM (1)](https://github.com/user-attachments/assets/b2795960-34e1-4105-88dc-1fa0708be2ff)| ![WhatsApp Image 2025-08-31 at 7 00 08 PM](https://github.com/user-attachments/assets/62bab0bc-c3e1-4d8d-a6c5-afdb42d549e4)|

## ✨ Key Features
- 📸 **AI-Powered Ingredient Scanning:** Scan food labels in real-time using the device's camera.  
- 🧠 **Dual-LLM AI Pipeline:** Utilizes Google's Gemini 2.5 Pro for state-of-the-art OCR and Mistral 7B for detailed nutritional analysis.  
- ✅ **Health Insights:** Automatically categorizes ingredients into Beneficial, Neutral, and Harmful, with clear explanations for each.  
- 🎯 **Personalized Onboarding:** A multi-step survey to tailor the user experience based on dietary preferences and health goals.  
- 📚 **Scan History:** Securely saves all user scans to their profile for future reference, with search and filter capabilities.  
- 🔐 **Secure & Private:** Built with Supabase Row-Level Security to ensure users can only ever access their own data.  
- 🧪 **Fully Tested:** Over 75% code coverage with Jest and React Native Testing Library.  
- 🤖 **CI/CD Automated:** All tests are automatically run on every Pull Request using GitHub Actions.  

## 🏗️ Architecture & Tech Stack
This project uses a modular, microservices-inspired architecture built on a modern, scalable technology stack.

| Category        | Technology                      | Rationale |
|-----------------|--------------------------------|-----------|
| Mobile App      | React Native & Expo            | A single codebase for a seamless cross-platform experience on both iOS and Android. Expo simplifies the development workflow and native API access. |
| Backend & DB    | Supabase                       | An all-in-one BaaS providing PostgreSQL, authentication, file storage, and Edge Functions, enabling rapid development. |
| AI OCR          | Gemini 2.5 Pro (via OpenRouter)| Superior OCR from complex, real-world images. |
| AI Analysis     | Mistral 7B Instruct (via OpenRouter) | Reliable structured JSON analysis. |
| Schema Validation | Zod                          | Ensures data integrity with strict validation. |
| Testing         | Jest & React Native Testing Library | Comprehensive suite of unit and integration tests. |
| CI/CD           | GitHub Actions                 | Automated testing pipeline integrated with repository. |

## 🚀 Getting Started: How to Clone and Run Locally

### 1. Prerequisites
Make sure you have the following installed:
- Node.js (LTS version recommended)
- Git
- The Expo Go app on your iOS or Android device.

### 2. Backend Setup (Supabase)
1. **Create a Supabase Project**  
   - Go to [Supabase](https://supabase.com), create a new project, and save your Database Password.

2. **Run SQL Scripts**  
   - In Supabase project → SQL Editor.  
   - Copy content from `supabase/Ingredient Scanner Database Schema.sql` → Run it.  
   - Copy content from `supabase/User Profile Management with Auto-Creation.sql` → Run it.  

3. **Set Up Storage**  
   - Go to Supabase → Storage.  
   - Create a public bucket named `scanned-images`.  
   - Add a policy allowing `INSERT` for authenticated users.  

4. **Set Up Secrets**  
   - Go to Project Settings → Edge Functions.  
   - Add secret:  
     - `OPENROUTER_KEY = your API key from OpenRouter.ai`  

5. **Get API Keys**  
   - Go to Project Settings → API.  
   - Copy your Project URL and anon (public) API Key.  

### 3. Frontend Setup
```bash
# Clone repository
git clone https://github.com/dhana-01/health-ingredient-scanner.git
cd health-ingredient-scanner

# Install dependencies
cd app
npm install

# Configure environment variables
touch .env
# Add the following:
EXPO_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL_HERE"
EXPO_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY_HERE"

# Run the app
npx expo start
```
Scan the QR code with the Expo Go app.  

## 🧪 Testing
This project uses Jest + React Native Testing Library.

```bash
# Run tests
npm test

# Generate coverage report
npm test -- --coverage
```

## 🤖 CI/CD Pipeline
This repository uses GitHub Actions. Workflow is defined in `.github/workflows/main.yml`.  

Runs automatically on each Pull Request to `develop`:  
- Installs dependencies  
- Runs full test suite  
- Blocks merging if tests fail  

## 📜 License
This project is licensed under the MIT License. See the LICENSE file for details.
