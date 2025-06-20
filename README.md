🌊 Ocean Anomaly Prediction Application

A mobile app built with React Native, designed to predict ocean anomalies (such as temperature spikes or abnormal weather patterns). The app leverages pre-trained AI/ML models and provides a sleek and intuitive interface for real-time or historical data analysis.

🧩 Installation

1. Clone the repository

`git clone https://github.com/PanasheTapfumaneyi/OceanAnomallyPredictionApplication.git`

3. Navigate into the project
   
`cd OceanAnomallyPredictionApplication`

4. Install dependencies
`
npm install
`
5. Link native modules (if using React Native CLI)
`
npx react-native link`
iOS (macOS only)

`
cd ios && pod install && cd ..`

▶️ Usage

1. Start the Metro bundler
`
npx react-native start`

3. Launch the app

iOS Simulator:
`
npx react-native run-ios`
Android Emulator / Device:
`
npx react-native run-android`

4. Interact with the app:

- Select timestamps or regions of interest

- Fetch environmental sensor data

- View graphical charts of ocean variables (e.g., temperature, salinity)

- Tap “Predict Anomaly” to run the ML model and display the result (e.g., “Normal” vs. “Anomaly”)

5. Logging & debugging

- Use Metro console or IDE debugger for ADB/Xcode logs

- Hot reload is enabled by default for fast development

🧠 Notes for Recruiters
React Native proficiency: Combines native UI and cross-platform logic for iOS + Android.

Model integration: Demonstrates loading or communicating with an ML model—via bundled .tflite, .onnx, or API endpoints.

Data visualization: Integrates charts/graphs (e.g., using Victory, React Native Charts) to display real-world environmental data.

Architecture & extensibility: Modular codebase with clear separation between UI, data-fetching logic, and prediction routines—ideal for further MVP enhancements.

To enhance your profile, consider adding features like user authentication, caching, detailed error-handling, and deployment via CodePush or App Stores.
