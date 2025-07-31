# Development Workflow

## Feature Development Process

### 1. Planning Phase
- Analyze requirements in context of existing canvas system
- Identify integration points with current components
- Consider coordinate system and performance implications
- Plan testing strategy for canvas interactions

### 2. Implementation Phase
- Start with hook-level changes if state management is involved
- Implement component changes with proper coordinate transformation
- Maintain CSS Module patterns and naming conventions
- Ensure proper event handling and cleanup

### 3. Testing Phase
- Test across different zoom levels (10% to 500%)
- Verify pan and drag operations work correctly
- Test element selection and multi-select functionality
- Validate accessibility with keyboard navigation

### 4. Integration Phase
- Ensure no conflicts with existing canvas operations
- Verify performance with large numbers of elements
- Test Electron integration if desktop features are involved
- Validate CSS Module integration and styling

## Code Review Checklist

### React Patterns
- [ ] Uses functional components with hooks
- [ ] Proper dependency arrays in useEffect and useCallback
- [ ] Appropriate use of useMemo for expensive calculations
- [ ] No memory leaks in event listeners or timers
- [ ] Follows React 18+ concurrent features best practices

### Canvas System
- [ ] Coordinate transformations are correct and consistent
- [ ] Event handling respects canvas coordinate system
- [ ] Zoom and pan operations work smoothly
- [ ] Element bounds checking is implemented
- [ ] Performance optimizations are in place

### Code Quality
- [ ] ESLint rules are followed
- [ ] CSS Modules naming conventions maintained
- [ ] Proper TypeScript usage where beneficial
- [ ] Accessibility attributes are present
- [ ] Error handling is implemented

## Testing Strategy

### Unit Tests
```javascript
// Example test structure for canvas components
describe('CanvasElement', () => {
  test('transforms coordinates correctly', () => {
    // Test coordinate transformation logic
  });
  
  test('handles drag operations', () => {
    // Test drag event handling
  });
  
  test('manages selection state', () => {
    // Test element selection logic
  });
});
```

### Integration Tests
- Canvas and CanvasElement interaction
- Hook integration with components
- Event propagation through component tree
- State synchronization across components

### E2E Tests
- Complete user workflows (create, edit, move, delete elements)
- Zoom and pan operations
- Multi-element selection and manipulation
- Keyboard navigation and shortcuts

## Performance Monitoring

### Key Metrics
- **Render Performance**: Time to render canvas with many elements
- **Interaction Latency**: Response time for drag operations
- **Memory Usage**: Memory consumption during extended use
- **Animation Smoothness**: 60fps maintenance during zoom/pan

### Profiling Tools
- React DevTools Profiler for component performance
- Browser DevTools for memory usage
- Performance API for timing measurements
- Canvas rendering performance analysis

## Build and Deployment

### Development Commands
```bash
npm run dev          # Start development server
npm run electron     # Launch Electron app
npm run lint         # Run ESLint checks
npm run lint:fix     # Fix auto-fixable ESLint issues
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
```

### Build Optimization
- Vite build optimization for Electron
- Code splitting for better loading performance
- Asset optimization for canvas resources
- Bundle analysis and size monitoring

## Debugging Guidelines

### Canvas Issues
1. **Coordinate Problems**: Check screen-to-canvas transformation
2. **Event Issues**: Verify event delegation and propagation
3. **Performance Issues**: Profile rendering and state updates
4. **Selection Issues**: Debug hit testing logic

### React Issues
1. **State Updates**: Use React DevTools to track state changes
2. **Re-render Issues**: Check dependency arrays and memoization
3. **Hook Issues**: Verify hook rules and cleanup functions
4. **Context Issues**: Check provider hierarchy and value changes

### Electron Issues
1. **Process Communication**: Verify main/renderer communication
2. **File System**: Check file operation permissions
3. **Desktop Integration**: Test native desktop features
4. **Build Issues**: Verify Electron build configuration

## Common Patterns

### Adding New Canvas Elements
```javascript
// 1. Define element type in constants
export const ELEMENT_TYPES = {
  TEXT: 'text',
  NEW_TYPE: 'newType'
};

// 2. Update CanvasElement component
const renderElement = () => {
  switch (element.type) {
    case ELEMENT_TYPES.NEW_TYPE:
      return <NewElementComponent {...props} />;
    default:
      return <TextElement {...props} />;
  }
};

// 3. Add creation logic to Canvas component
const createElement = (type, position) => {
  const newElement = {
    id: generateId(),
    type,
    x: position.x,
    y: position.y,
    // type-specific properties
  };
  setElements(prev => [...prev, newElement]);
};
```

### Adding New Canvas Operations
```javascript
// 1. Add to canvas interactions hook
const useCanvasInteractions = () => {
  const handleNewOperation = useCallback((event) => {
    // Handle the new operation
    // Update state appropriately
    // Maintain coordinate system consistency
  }, [dependencies]);

  return { handleNewOperation };
};

// 2. Integrate with Canvas component
const Canvas = () => {
  const { handleNewOperation } = useCanvasInteractions();
  
  return (
    <div onNewEvent={handleNewOperation}>
      {/* Canvas content */}
    </div>
  );
};
```

## Best Practices Summary

1. **Always consider coordinate system implications**
2. **Maintain proper event handling and cleanup**
3. **Use React DevTools for debugging state issues**
4. **Test across all zoom levels and viewport positions**
5. **Follow CSS Modules conventions for styling**
6. **Implement accessibility from the start**
7. **Profile performance with realistic data sets**
8. **Document complex coordinate transformations**