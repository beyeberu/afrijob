# JobPostPro

JobPostPro is a web application designed for posting job vacancies and managing job applications. This project is built using React for the frontend and utilizes Firebase for hosting and backend services.

## Project Structure

The project is organized as follows:

```
jobpostpro
├── frontend
│   ├── public
│   │   └── index.html          # Main HTML file for the frontend application
│   ├── src
│   │   ├── components
│   │   │   └── JobPostForm.jsx # Component for rendering the job posting form
│   │   ├── contexts
│   │   │   └── AuthContext.js  # Context for managing authentication state
│   │   ├── services
│   │   │   └── Api.js          # API service for making network requests
│   │   ├── App.js              # Main application component
│   │   └── index.js            # Entry point for the React application
│   ├── package.json            # npm configuration file
│   └── README.md               # Documentation for the frontend application
├── firebase.json               # Firebase configuration for deployment
├── .firebaserc                 # Firebase project configuration
└── README.md                   # Overall project documentation
```

## Getting Started

To get started with the project, follow these steps:

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd jobpostpro
   ```

2. **Navigate to the frontend directory:**
   ```
   cd frontend
   ```

3. **Install dependencies:**
   ```
   npm install
   ```

4. **Run the application:**
   ```
   npm start
   ```

5. **Deploy to Firebase:**
   Ensure you have the Firebase CLI installed and configured. Then run:
   ```
   firebase deploy
   ```

## Features

- User authentication and management
- Job posting form with validation
- Dynamic fetching of job categories and locations
- Responsive design for various devices

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.