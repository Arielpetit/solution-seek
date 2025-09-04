# Admin Page Component Documentation

## Overview

The `Admin` component, located at `src/pages/Admin.tsx`, provides a dashboard for administrators of the ProblemBoard application. It is a client-side component that allows authorized users to monitor platform statistics and manage user-generated content.

## Features

The admin dashboard is organized into several sections:

### 1. Statistics Overview

This section provides a quick glance at key platform metrics, displayed in a series of cards. The statistics shown are:
-   **Total Users**: The total number of registered users.
-   **Problems Posted**: The total number of problems submitted.
-   **Solutions Proposed**: The total number of solutions submitted.
-   **Comments**: The total number of comments made.
-   **Total Funding**: *[TODO]* A placeholder for the total amount of funding contributed to problems.
-   **Recent Activity**: *[TODO]* A placeholder for the number of actions in the last 24 hours.

### 2. Content Moderation

This is the primary feature of the admin page, organized under a "Content Reports" tab. It allows administrators to:
-   View a list of content (problems, solutions, comments) that has been reported by users.
-   For each report, view the content itself, who reported it, and when it was reported.
-   Take action on pending reports. The available actions are:
    -   **Approve**: Mark the content as reviewed and resolved.
    -   **Remove**: Mark the content for removal.
    -   **Dismiss**: Dismiss the report without taking action on the content.

### 3. User Management (Coming Soon)

A placeholder tab for managing user accounts, roles, and permissions.

### 4. Featured Content (Coming Soon)

A placeholder tab for managing which problems and solutions are highlighted on the platform.

## Authorization

Access to the admin dashboard is restricted. The component checks if the currently logged-in user is an administrator based on the following criteria from the `useAuth` context:
-   The user's email is `admin@problemboard.com`.
-   The user's metadata contains a `role` of `admin`.

If a non-admin user attempts to access this page, they will be shown a message indicating they do not have the required permissions.

## Technical Details

### State Management

The component uses React's `useState` hook to manage its state:
-   `stats`: An object (`AdminStats`) to store the platform statistics fetched from the backend.
-   `reportedContent`: An array (`ReportedContent[]`) to store the list of reported content.
-   `loading`: A boolean flag to manage the loading state while data is being fetched.

### Data Fetching

-   Data fetching is initiated in a `useEffect` hook, which runs when the component mounts, provided the user is an admin.
-   The `fetchAdminData` function communicates with a Supabase backend to retrieve statistics for users, problems, solutions, and comments.
-   Currently, the reported content is mocked with static data. In a production environment, this would be fetched from the backend.

### UI Components

The UI is built using a combination of custom and third-party components:
-   **Shadcn/UI**: The core UI is built with components like `Card`, `Tabs`, `Button`, `Badge`, `Avatar`, and `Alert`.
-   **Lucide React**: Provides the icons used throughout the dashboard.
-   **date-fns**: The `formatDistanceToNow` function is used to display human-readable timestamps for reports.
-   **Custom Components**: Uses the shared `Navigation` component.

## Future Development

Based on the `TODO` comments in the code, the following features are planned for future implementation:
-   Calculation and display of **Total Funding** and **Recent Activity**.
-   Fetching real **reported content** from the backend instead of using mock data.
-   Implementation of the **User Management** and **Featured Content** tabs.
-   Backend logic to handle the `approve`, `remove`, and `dismiss` actions for reported content.