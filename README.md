# ShiftMart - Frontend

## Description

ShiftMart is a **worker scheduling** application built to manage employee shifts, time-off requests, and various roles within an organization. The frontend of this application is built with **React.js** and integrates with a backend API to manage authentication, role-based access control (RBAC), employee data, shift scheduling, and chat functionalities.

This project aims to streamline employee shift management for various roles such as **Employee**, **HR**, **Manager**, **PayrollManager**, and **Admin**.

## Tech Stack

- **React.js**: Frontend library for building the user interface.
- **React-Redux**: State management for global app state and user authentication.
- **React Router**: Routing and navigation for handling different views.
- **Material UI**: A set of React components that implement Google’s Material Design.
- **Axios**: HTTP client for making API requests.
- **Socket.io**: Real-time communication for chat functionality.
- **Day.js / Date-fns**: Date handling libraries.
- **JWT (JSON Web Tokens)**: For handling authentication and securing routes.
- **dotenv**: For managing environment variables.

## Features

- **Authentication**: Users can log in, reset passwords, and manage their profiles.
- **Role-based Access Control (RBAC)**: Different dashboards and pages are accessible based on the user's role.
  - **Employee**: Can view and manage their own shift schedule and time-off requests.
  - **HR**: Can view and manage employee data and shift assignments.
  - **Manager**: Can assign shifts and manage team schedules.
  - **Payroll Manager**: Can view payroll-related data.
  - **Admin**: Has full control over the platform, including user management and system settings.
- **Protected Routes**: Access to pages is protected based on user roles using the `ProtectedRoute` component.
- **Real-time Chat**: Integration with Socket.io to provide real-time chat functionality (group and private chat).
- **Axios Integration**: Communicates with the backend for various operations like fetching schedules, managing users, etc.

## Installation

To get started with the ShiftMart frontend, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone <repository_url>
   cd worker-scheduling-frontend
   ```
2. **Install dependencies**:
    Make sure you have Node.js installed. Then run:
    ```
    npm install
    ``` 
3. **Set up environment variables**:
    In the project root directory, create a .env file (if not already created) and add the following variables:
    ```
    REACT_APP_BACKEND_URI=your_backend_uri
    ```
4. **Start the development server**:
    ```
    Start the development server
    ```

## Usage

- **Login**: Navigate to `/login` to log in to your account.

- **Profile Management**: Access and edit your profile from `/profile/view` and `/profile/edit`.

- **Dashboards**: After login, based on your role, you will be redirected to the appropriate dashboard:
  - `/employee/*`
  - `/HR/*`
  - `/Manager/*`
  - `/Payroll/*`
  - `/Admin/*`

- **Real-time Chat**: Once logged in, you can access real-time group chat and private messages via the provided chat functionality.

## Live Demo
A live demo of the application can be accessed here.

## API Integration

The frontend communicates with the backend API located at `REACT_APP_BACKEND_URI` for operations such as:

- **User Authentication**: Login, logout, and password reset.

- **Profile**: View and edit profile information.

- **Shift Management**: View, create, and manage shifts and time-off requests.

- **Role Management**: Perform actions based on the user's role (e.g., HR managing employees).

- **Real-time Chat**: Handle chat functionality for group and private chats.

### 📜 License
This project is open-source under the MIT License.

### 📧 Contact
For any queries, feel free to reach out:
- 📩 Email: meetpatel7026@gmail.com
- 🔗 LinkedIn: Meet Patel