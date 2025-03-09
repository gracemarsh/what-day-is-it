# What Day Is It - Application Specifications

## Application Overview

"What Day Is It" is a minimalist desktop calendar application for macOS that displays the current date in a pixelated, retro Mario-style interface. The app aims to be lightweight, visually appealing, and unobtrusive while providing at-a-glance date information to the user.

## Application Requirements

### Functional Requirements

1. **Date Display**

   - Show the current day of the week (e.g., SUNDAY)
   - Show the current day of the month as a number (e.g., 01)
   - Show the current month (e.g., JANUARY)
   - Show the current year (e.g., 2025)
   - Auto-update the display without user interaction

2. **User Interface**

   - Square app window at all times (width = height)
   - Resizable window with constraints:
     - Minimum size: 200 x 200 pixels
     - Maximum size: 50% of screen height
   - Default size: 1/10 of screen width (or 50% of screen height, whichever is smaller)
   - Retro pixelated visual style inspired by original Mario games
   - Color scheme: Red background, white panels, and black text
   - Ability to drag the window around the desktop
   - No standard window frame (custom UI)

3. **System Integration**
   - System tray (menu bar) icon for quick access
   - App toggleable (show/hide) via tray icon
   - Context menu with Close and Quit options
   - Launch at startup option (future enhancement)

### Non-functional Requirements

1. **Performance**

   - Fast startup time (< 2 seconds)
   - Minimal resource usage (CPU, memory)
   - Responsive window resizing

2. **Visual Design**

   - Pixelated retro aesthetic
   - Consistent typography using pixel-style font
   - Clean, high-contrast display for readability
   - Proportional text sizing for all app dimensions

3. **User Experience**
   - Minimal user interaction required
   - Intuitive and simple interface
   - Non-intrusive desktop presence

## Technical Stack & Architecture

### Technology Choices

1. **Electron Framework**

   - **Justification**: Electron enables building cross-platform desktop applications using web technologies (HTML, CSS, JavaScript). While the app is currently targeted for macOS, using Electron provides flexibility for potential future expansion to Windows and Linux.
   - **Benefits**: Fast development cycle, rich ecosystem, familiar web technologies, easy deployment
   - **Alternatives Considered**:
     - Native Swift/AppKit (pros: better performance, native macOS integration; cons: macOS-only, longer development time)
     - Qt (pros: cross-platform, good performance; cons: steeper learning curve, less modern UI by default)

2. **Frontend Technologies**

   - **HTML/CSS**: Used for layout and styling of the calendar interface
   - **Vanilla JavaScript**: Used for date calculations and UI updates
   - **Web Fonts**: Google's "Press Start 2P" font for pixelated text rendering
   - **Justification**: Simple app requirements don't necessitate a complex framework like React

3. **Build System**
   - **Electron Builder**: Handles packaging and distribution for macOS
   - **Node.js & npm**: Dependency management and development scripts
   - **Electron Reloader**: Hot reloading during development for faster iteration

### Architecture

1. **Main Process (main.js)**

   - Electron's main process that manages the application lifecycle
   - Handles window creation, sizing, and constraints
   - Manages the system tray icon and menu
   - Controls window behavior (square aspect ratio, size limits)

2. **Renderer Process (index.html)**

   - Manages the UI rendering of the calendar
   - Contains the display logic for showing date information
   - Handles automatic date updates using JavaScript intervals
   - Controls styling and visual presentation

3. **Development Environment**
   - Hot reloading enabled for faster development iteration
   - Environment-specific configurations (development vs. production)
   - Custom NPM scripts for different operations (dev, build, start)

## Dependencies

| Dependency        | Version | Purpose                                |
| ----------------- | ------- | -------------------------------------- |
| electron          | ^35.0.0 | Core framework for desktop application |
| electron-builder  | ^25.1.8 | Packaging and distribution tool        |
| electron-reloader | ^1.2.3  | Hot reloading for development          |
| svg2png           | ^4.1.1  | Icon generation utility (development)  |

## Design Decisions

1. **Window Management**

   - **Frameless Window**: Creates a custom, minimal UI without standard OS chrome
   - **Drag Handling**: Custom drag implementation to allow window repositioning
   - **Square Aspect Ratio**: Enforced programmatically to maintain visual consistency
   - **Size Constraints**: Prevents the window from becoming too small (unreadable) or too large (intrusive)

2. **Visual Design**

   - **Pixelated Aesthetic**: Achieved through font choice and minimal UI elements
   - **High Contrast Colors**: Red, white, and black for optimal readability and retro style
   - **Proportional Sizing**: Use of vmin CSS units ensures text scales appropriately with window size
   - **Hierarchical Typography**: Larger day number provides visual focus, with supporting date elements sized accordingly

3. **System Integration**
   - **Tray-based Interface**: Minimizes desktop clutter while keeping app accessible
   - **Context Menu**: Provides essential functions without cluttering the main UI
   - **Toggling Behavior**: Allows users to show/hide the calendar as needed

## Future Enhancements

1. **User Preferences**

   - Color theme options
   - Font size adjustments
   - Position memory (remember last position)
   - Launch at startup option

2. **Additional Features**

   - Week number display
   - Holiday indicators
   - Mini month view
   - Quick note taking

3. **Performance Optimizations**
   - Reduced resource usage
   - Faster startup time
   - Optimized rendering

---

_Created: March 2025_  
_Last Updated: March 9, 2025_
