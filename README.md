# TaskFlow - Task Management Application

## [🚀 Try TaskFlow Here!](https://danielto1231.github.io/TaskFlowDeploy/)

## Overview

TaskFlow is a modern task management application inspired by Trello, built using **React** and **Firebase**. The application allows users to create and manage tasks, organize them into boards, and collaborate with team members in real-time. The goal is to provide an intuitive and efficient way to manage projects and tasks, enhancing productivity and collaboration.

## Features

1. **User Authentication**  
   Users can sign up and log in securely using Firebase Authentication. Access to the application is restricted to authenticated users only, ensuring a secure experience.

2. **Task and Board Management**  
   Users can create boards to organize their projects and add tasks within these boards. Tasks can be customized and updated to track progress effectively.

3. **Real-Time Updates**  
   The task management system is powered by Firebase Firestore, allowing real-time updates. Any changes made by one user are instantly visible to others, ensuring seamless collaboration within teams.

4. **Team Collaboration and Comments**  
   Users can invite team members to collaborate on boards. Task-specific comment sections allow for real-time discussions and feedback, improving communication within teams.

5. **User Interface Design**  
   The user interface is designed to be clean and user-friendly, utilizing Bulma for responsive and modern styling. The application includes pages for login, register, board overview, and detailed task interaction.

## Technologies Used

- **React**: For building the user interface and managing client-side logic.
- **Firebase Authentication**: To manage user sign-up, login, and secure access to the application.
- **Firebase Firestore**: For real-time storage and retrieval of tasks and board information.
- **Firebase Storage**: For uploading and managing user profile pictures.
- **Bulma**: For designing a responsive and intuitive user interface.

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DanielTo1231/TaskFlow.git

2. Install dependencies:
   ```bash
   npm install

3. Set up Firebase:
   - Go to the Firebase Console and create a new project.
   - Set up Firebase Authentication, Firestore, and Storage.
   - Add your Firebase configuration in .env:
     ```bash
      REACT_APP_API_KEY=your-api-key
      REACT_APP_AUTH_DOMAIN=your-auth-domain
      REACT_APP_PROJECT_ID=your-project-id
      REACT_APP_STORAGE_BUCKET=your-storage-bucket
      REACT_APP_MESSAGING_SENDER_ID=your-messaging-sender-id
      REACT_APP_APP_ID=your-app-id

4. Start
   ```bash
   npx vite or npm start

## Authors 
- Daniel To
