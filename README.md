# Raah Application

Raah is a unified mobile application containing both the Commuter and Conductor modules. It is built using React Native and Expo. This guide provides comprehensive, step-by-step instructions on how to run and test the application across different platforms (iOS, Android, Simulators, and Physical Devices) using various methods.

---

## 🚀 1. The Fastest Way: Testing via Expo Go (Mac & Windows)

**Expo Go** is a generic testing app that allows you to instantly run the JavaScript bundle on your physical phone without needing to compile any native code.

> [!NOTE] 
> This method works on both Mac and Windows PCs. You just need your computer and phone on the same Wi-Fi network.

### Steps:
1. Download the **Expo Go** app from the App Store (iOS) or Google Play Store (Android).
2. Ensure your phone and computer are connected to the **same Wi-Fi network**.
3. Open your terminal in the root of the project and start the server:
   ```bash
   npm start
   ```
4. A large QR code will appear in the terminal.
   - **For iPhone:** Open the default Camera app, point it at the QR code, and tap "Open in Expo Go".
   - **For Android:** Open the Expo Go app directly and tap "Scan QR Code".

> [!TIP]
> If your terminal says `Using development build`, simply press `s` on your keyboard in the terminal to switch back to Expo Go mode!

---

## 💻 2. Testing on a Simulator/Emulator (Mac Only for iOS)

If you don't want to use your physical phone, you can run virtual devices directly on your computer screen.

### 🍎 iOS Simulator (Requires a Mac)
1. Ensure you have **Xcode** installed from the Mac App Store.
2. Open your terminal in the project root and run:
   ```bash
   npm run ios
   ```
   *(Alternatively: `npx expo start` and then press `i` on your keyboard).*
3. Expo will automatically launch a virtual iPhone on your screen and open the app.

### 🤖 Android Emulator (Mac or Windows)
1. Install **Android Studio** and create a Virtual Device (AVD) through the Device Manager.
2. Launch the Android Emulator from Android Studio so it is running on your screen.
3. Open your terminal in the project root and run:
   ```bash
   npm run android
   ```
   *(Alternatively: `npx expo start` and then press `a` on your keyboard).*
4. Expo will install the app on your running emulator.

---

## 📱 3. Native Testing on a Physical Device (Mac Required for iOS)

If you are using custom native code or if Expo Go does not support your SDK version, you must compile a **Development Build** directly onto your phone via USB.

### 🍎 Testing on a Physical iPhone (Requires a Mac + Xcode)

1. **Generate the native iOS code:**
   ```bash
   npx expo prebuild -p ios
   ```
   *(This creates an `ios/` folder in your project).*
2. **Open the project in Xcode:**
   ```bash
   open ios/Raah.xcworkspace
   ```
   *(Make sure to open the `.xcworkspace` file, NOT the `.xcodeproj` file).*
3. **Configure Xcode:**
   - Plug your iPhone into your Mac via USB.
   - At the top center of Xcode, select your physical iPhone from the device dropdown list.
   - In the left sidebar, click on the **Raah** project file (blue icon at the very top).
   - In the main window, click the **Signing & Capabilities** tab.
   - Check "Automatically manage signing".
   - Under "Team", select your Personal Apple ID account.
4. **Run the App:**
   - Press the large **Play (▶)** button in the top left corner of Xcode.
   - The app will be compiled and installed on your iPhone.
5. **Start the Bundler:**
   - Once the app is installed, go back to your terminal and run:
     ```bash
     npx expo start
     ```
   - The app on your iPhone will automatically connect to this server!

### 🤖 Testing on a Physical Android (Mac or Windows)

1. Enable **Developer Options** and **USB Debugging** on your Android phone's settings.
2. Plug your Android phone into your computer via USB.
3. Open your terminal in the project root and run:
   ```bash
   npx expo run:android -d
   ```
4. Use your keyboard arrows to select your connected physical device from the list that appears.
5. Expo will automatically compile the APK and install it directly onto your phone!

---

## 🛠 Useful Terminal Commands Summary

- `npm start` or `npx expo start`: Start the development bundler server.
- `npx expo start -c`: Clear the bundler cache and start the server (fixes weird bugs).
- `npm run ios` / `npx expo run:ios`: Run the app on an iOS Simulator.
- `npm run android` / `npx expo run:android`: Run the app on an Android Emulator.
- `npx expo prebuild`: Generate the native `ios/` and `android/` folders.
- `open ios/Raah.xcworkspace`: Open the iOS project in Xcode (Mac only).

> [!WARNING]
> Because `ios/` and `android/` folders are currently excluded in `.gitignore`, if you ever delete them, you can safely recreate them by running `npx expo prebuild` again.
