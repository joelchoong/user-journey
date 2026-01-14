# Component Architecture

This directory contains the reusable UI components for the User Journey Mapping Tool, organized by feature area and responsibility.

## Directory Structure

### [board/](./board/)
Contains all components related to the main journey mapping board and drag-and-drop functionality.
- `JourneyBoard.tsx`: The main board container using `@hello-pangea/dnd`.
- `JourneyColumn.tsx`: Represents a vertical step in the journey.
- `ColumnHeader.tsx`: The interactive header for columns (editing, context menu).
- `JourneyCard.tsx`: Individual action cards within columns.
- `WorkflowHeader.tsx`: Visual grouping headers for columns.
- `TagBadge.tsx`: Small UI indicator for user/action tags.
- `PrintableJourney.tsx`: A specialized view optimized for PDF export.

### [header/](./header/)
Sub-components specifically for the main application header.
- `ShareDropdown.tsx`: Actions for sharing the board and exporting as PDF.

### [layout/](./layout/)
Core application layout components.
- `Sidebar.tsx`: A collapsible left navigation bar for project management and navigation.

### [persona/](./persona/)
Components for managing user personas.
- `PersonaSelector.tsx`: Dropdown for switching and managing personas.
- `PersonaList.tsx`: List of available personas with quick-edit actions.
- `PersonaDetails.tsx`: Full attribute view and editing for the active persona.

### [import/](./import/)
- `ImportSpreadsheet.tsx`: Dialog and logic for importing journey data from CSV files.

### [ui/](./ui/)
The base design system components, powered by Radix UI and Tailwind CSS (managed via shadcn/ui).

## Top-level Components
- `Header.tsx`: The global application navigation and utility bar.
- `NavLink.tsx`: A simple interactive navigation element.
