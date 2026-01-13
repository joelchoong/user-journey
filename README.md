# User Journey Mapping Tool

A modern, interactive tool for mapping user journeys, built with React and Vite.

## Project Overview

This application helps teams visualize and manage user journeys. It features a kanban-style board where you can define personas, user stages, and interactions.

## How to Run Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/joelchoong/user-journey.git
    ```

2.  Navigate to the project directory:
    ```bash
    cd journey-mapping
    ```

3.  Install dependencies:
    ```bash
    npm install
    ```

### Development

Start the development server with hot-reload:

```bash
npm run dev
```

Visit `http://localhost:8080/` (or the URL shown in your terminal) to view the app.

### Building for Production

To build the application for deployment:

```bash
npm run build
```

This will create a `dist` directory with the compiled assets.

## Technologies Used

- **Framework**: [Vite](https://vitejs.dev/)
- **Library**: [React](https://react.dev/) + TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State/Data**: [TanStack Query](https://tanstack.com/query/latest)
