# Canvas System Architecture

## Coordinate System

### Virtual Canvas
- **Dimensions**: 5000x5000px virtual space
- **Origin**: Top-left corner (0, 0)
- **Units**: Pixels in virtual coordinate space
- **Bounds**: Elements constrained within virtual boundaries

### Screen-to-Canvas Transformation
```javascript
// Screen coordinates to canvas coordinates
const canvasX = (screenX - panX) / zoom;
const canvasY = (screenY - panY) / zoom;

// Canvas coordinates to screen coordinates  
const screenX = (canvasX * zoom) + panX;
const screenY = (canvasY * zoom) + panY;
```

### Zoom System
- **Range**: 10% to 500% (0.1 to 5.0 scale factor)
- **Default**: 100% (1.0 scale factor)
- **Increment**: 10% steps for UI controls
- **Center Point**: Zoom focuses on viewport center or mouse position

## Component Architecture

### Canvas.jsx - Main Container
**Responsibilities**:
- Viewport management (pan, zoom, bounds)
- Element selection and multi-select
- Background grid rendering
- Event coordination between child elements
- Context menu and toolbar integration

**State Management**:
- `zoom`: Current zoom level (0.1 - 5.0)
- `panX, panY`: Viewport offset in screen pixels  
- `selectedElements`: Array of selected element IDs
- `canvasElements`: Array of all canvas element data

### CanvasElement.jsx - Interactive Elements
**Responsibilities**:
- Individual element rendering and positioning
- Drag-and-drop functionality with proper coordinate transformation
- Resize handle rendering and interaction
- Selection state visualization
- Element-specific context menus

**Props Interface**:
- `element`: Element data (id, x, y, width, height, content)
- `zoom`: Current zoom level for coordinate transformation
- `panX, panY`: Viewport offset for positioning
- `isSelected`: Selection state for visual feedback
- `onUpdate`: Callback for element data changes

### EditableTextBox.jsx - Text Editing
**Responsibilities**:
- In-place text editing with auto-focus
- Text content validation and formatting
- Keyboard event handling (Enter, Escape, Tab)
- Text measurement for auto-sizing
- Integration with canvas coordinate system

## Hook System

### useCanvasInteractions
**Purpose**: Centralized mouse and keyboard event handling

**Managed State**:
- Mouse position tracking
- Drag state and operation type
- Selection rectangle for multi-select
- Keyboard modifier states (Ctrl, Shift, Alt)

**Event Handlers**:
- `onMouseDown`: Initiate drag, selection, or element interaction
- `onMouseMove`: Update drag position, selection rectangle
- `onMouseUp`: Complete drag operation, finalize selection
- `onKeyDown`: Keyboard shortcuts and navigation

### useCanvasMovement  
**Purpose**: Pan and drag operations with coordinate transformation

**Managed State**:
- Pan operation state and delta tracking
- Drag operation with element position updates
- Viewport bounds enforcement
- Smooth animation state for programmatic movements

**Key Functions**:
- `startPan()`: Initialize pan operation
- `updatePan(deltaX, deltaY)`: Update pan with delta values
- `startDrag(elementId)`: Begin element drag operation
- `updateDrag(newX, newY)`: Update element position with bounds checking

### useCanvasZoom
**Purpose**: Zoom functionality with proper viewport management

**Managed State**:
- Current zoom level with bounds enforcement
- Zoom center point (mouse position or viewport center)
- Smooth zoom animation state
- Zoom history for undo/redo functionality

**Key Functions**:
- `zoomIn()`: Increase zoom by standard increment
- `zoomOut()`: Decrease zoom by standard increment  
- `zoomToFit()`: Calculate zoom to fit all elements
- `zoomToPoint(x, y, newZoom)`: Zoom to specific point

## Performance Optimizations

### Rendering Efficiency
- **Virtual Scrolling**: Only render elements in viewport
- **Transform Optimization**: Use CSS transforms for positioning
- **Event Delegation**: Single event listener on canvas container
- **Memoization**: React.memo for element components with proper comparison

### State Updates
- **Batched Updates**: Group related state changes
- **Throttling**: Limit high-frequency events (mousemove, scroll)
- **Debouncing**: Delay expensive operations (auto-save, validation)
- **Immutable Updates**: Prevent unnecessary re-renders

### Memory Management
- **Event Cleanup**: Remove listeners in useEffect cleanup
- **Reference Management**: Avoid memory leaks in closures
- **Canvas Recycling**: Reuse DOM elements when possible
- **Image Caching**: Efficient asset loading and management

## Event Flow Architecture

### Mouse Event Propagation
1. **Canvas Container**: Captures all mouse events
2. **Coordinate Transformation**: Convert screen to canvas coordinates
3. **Hit Testing**: Determine target element or background
4. **Event Routing**: Route to appropriate handler (pan, drag, select)
5. **State Updates**: Update relevant state with proper batching

### Keyboard Event Handling
1. **Global Capture**: Document-level keyboard event listeners
2. **Context Awareness**: Different behavior based on active element
3. **Shortcut Processing**: Handle application shortcuts
4. **Text Input**: Route text input to active text editor
5. **Accessibility**: Maintain focus and navigation support

## Grid and Snapping System

### Background Grid
- **Size**: 20px grid spacing at 100% zoom
- **Scaling**: Grid scales with zoom level
- **Visibility**: Grid visibility based on zoom level
- **Style**: Subtle dotted or dashed grid lines

### Element Snapping
- **Grid Snap**: Snap element positions to grid intersections
- **Element Snap**: Snap to other element edges and centers
- **Guide Lines**: Visual feedback during drag operations
- **Tolerance**: Configurable snap distance in canvas pixels

## Accessibility Considerations

### Keyboard Navigation
- **Tab Order**: Logical tab sequence through elements
- **Arrow Keys**: Navigate between canvas elements
- **Enter/Space**: Activate element editing
- **Escape**: Cancel operations and return to selection

### Screen Reader Support
- **ARIA Labels**: Descriptive labels for canvas elements
- **Live Regions**: Announce state changes and operations
- **Role Attributes**: Proper semantic markup
- **Focus Management**: Maintain focus during interactions

### High Contrast Support
- **Color Independence**: Visual cues beyond color alone
- **Focus Indicators**: High contrast focus outlines
- **Selection Feedback**: Multiple selection indicators
- **Text Contrast**: Sufficient contrast ratios throughout