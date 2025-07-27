# JobPostPro Frontend

This is the frontend application for the JobPostPro project, which allows users to post job listings and manage their job post history.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Components](#components)
- [API Services](#api-services)
- [Authentication Context](#authentication-context)
- [Deployment](#deployment)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the frontend directory:
   ```
   cd jobpostpro/frontend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the development server, run:
```
npm start
```
This will launch the application in your default web browser at `http://localhost:3000`.

## Components

- **JobPostForm**: A component for rendering the job posting form, managing form state, and handling submissions.

## API Services

The application interacts with a backend API for job postings. The API services are defined in `src/services/Api.js`, which includes functions for fetching locations and adding new locations.

## Authentication Context

User authentication state is managed through the `AuthContext` defined in `src/contexts/AuthContext.js`. This context provides authentication information to components that require it.

## Deployment

This application is configured to be deployed on Firebase. Ensure you have the Firebase CLI installed and configured. To deploy, run:
```
firebase deploy
```

Make sure to set up your Firebase project and configure the `firebase.json` file accordingly.