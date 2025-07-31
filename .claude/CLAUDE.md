# Noting - Canvas-Based Text Editor

## Project Overview
Electron-React application featuring an interactive canvas with draggable, resizable text elements. Built with modern React patterns using custom hooks and Context API for state management.

## Technology Stack
- **Frontend**: React 18.3.1 with Vite 6.0.1 and SWC
- **Desktop**: Electron 33.2.1  
- **State Management**: React Context + Zustand 5.0.3
- **Interactions**: react-draggable 4.4.6
- **Build Tools**: Vite with React SWC plugin
- **Code Quality**: ESLint with React-specific rules

## Architecture Patterns
- **Component Structure**: Functional components with hooks
- **State Management**: React Context API with potential Zustand integration
- **Styling**: CSS Modules with BEM-like naming conventions
- **Canvas Logic**: Custom hooks for interactions, movement, and zoom
- **Event Handling**: Comprehensive mouse/keyboard interaction system

## Key Components
- `Canvas.jsx`: Main canvas component with pan/zoom/selection functionality
- `CanvasElement.jsx`: Individual draggable text elements with resize handles
- `EditableTextBox.jsx`: In-place text editing component with auto-focus
- **Custom Hooks**: 
  - `useCanvasInteractions`: Mouse event handling and element selection
  - `useCanvasMovement`: Pan and drag operations
  - `useCanvasZoom`: Zoom functionality and viewport management

## Canvas System Architecture
- **Virtual Canvas Size**: 5000x5000px coordinate space
- **Zoom Range**: 10%-500% with smooth scaling
- **Grid System**: 20px spacing for element alignment
- **Coordinate Transformation**: Screen-to-canvas coordinate mapping
- **Element Constraints**: Bounds checking and collision detection
- **Performance**: Optimized rendering for large element counts

## Development Guidelines

### React Patterns
- Use functional components with hooks exclusively
- Implement custom hooks for complex logic separation
- Utilize useCallback and useMemo for performance optimization
- Follow React 18+ concurrent features and best practices
- Maintain proper component lifecycle patterns

### Code Style
- Follow ESLint rules with React-specific configurations
- Use const/let over var consistently
- Prefer arrow functions for callbacks and event handlers
- Implement proper TypeScript when needed
- Maintain accessibility in all interactive elements

### CSS Modules Conventions
- Use BEM-like naming: `ComponentName.module.css`
- Maintain consistent class naming patterns
- Separate layout, theme, and component-specific styles
- Use CSS custom properties for theming

### Canvas Development
- Preserve coordinate system consistency across components
- Implement proper event cleanup in useEffect hooks
- Use requestAnimationFrame for smooth animations
- Optimize canvas operations for performance
- Maintain viewport state synchronization

## Testing Strategy
- **Unit Tests**: Component isolation testing with Jest/Vitest
- **Integration Tests**: Canvas interaction testing
- **E2E Tests**: Full user workflow testing with Playwright
- **Performance Tests**: Canvas rendering and interaction benchmarks

## Build and Development

### Commands
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run electron`: Launch Electron app
- `npm run lint`: Run ESLint checks
- `npm run test`: Run test suite

### File Structure
```
app/src/
├── Pages/home/          # Main application page
├── components/
│   ├── Canvas/          # Canvas-related components
│   └── test/           # Test/utility components
├── hooks/              # Custom React hooks
├── constants/          # Application constants
├── lib/               # Utility libraries and helpers
└── main.jsx           # Application entry point
```

## Performance Considerations
- Canvas rendering optimization for large element counts
- Efficient event handling with debouncing/throttling
- Memory management for drag/resize operations
- Smooth zoom and pan interactions
- Electron-specific performance optimizations

## Accessibility Features
- Keyboard navigation support
- Screen reader compatibility
- Focus management for text editing
- High contrast mode support
- Proper ARIA labels and roles

## Future Enhancements
- File save/load functionality
- Collaborative editing features
- Advanced text formatting options
- Plugin system for extensions
- Cloud synchronization capabilities