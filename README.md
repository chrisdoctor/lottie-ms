# Lottie Animation Management System

This application is a Progressive Web App (PWA) built with React.js, Redux, GraphQL, TypeScript, and Tailwind CSS. This application allows users to create and search for objects containing Lottie animation JSON files with metadata such as animation descriptions and tags. The backend GraphQL API is used to save and retrieve data from a MongoDB database. The app supports offline functionality, allowing users to save data to localStorage and perform searches on cached data.

## Features

- Create and search for Lottie animation objects.
- Offline support with localStorage for saving and searching data.
- Progressive Web App capabilities for a better user experience.
- Responsive design using Tailwind CSS.
- Type-safe code with TypeScript.

## Technologies Used

- **Frontend:**

  - React.js
  - Redux
  - GraphQL
  - TypeScript
  - Tailwind CSS
  - Webpack

- **Backend:**
  - Node.js
  - Express.js
  - GraphQL
  - MongoDB
  - Docker

## Getting Started

### Prerequisites

- Node.js (latest)
- Docker (for running MongoDB)
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/chrisdoctor/lottie-ms.git
   cd lottie-ms
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Running the app

**Frontend:**

1. Start the React App:

   For running the the production build and testing offline features:

   ```bash
   serve -s dist
   ```

   For running the app in development mode:

   ```bash
   npm start
   ```

**Backend:**

1. Clone the Node.js API repository:

   ```bash
   git clone https://github.com/chrisdoctor/lottie-graphql-api
   cd lottie-graphql-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the application:

   ```bash
   npm run start
   ```

**Database:**

1. Start MongoDB using Docker Compose. It is located in a separate repository:

   ```bash
   git clone https://github.com/chrisdoctor/lottie-mongo-container
   cd lottie-mongo-container
   ```

2. Start the container.

   ```bash
   docker-compose up -d
   ```

### Offline Functionality

The app is designed to work offline, allowing users to save data to localStorage when there is no network connection. When the app becomes online, data stored in localStorage is pushed to the Mongo Db. This is performed by the event listener that waits for an online connection to occur.

Users can also search for data cached in localStorage. The data includes uploaded items while the application is offline. LocalStorage is populated by search results acquired while the application is online.
