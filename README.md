# BizFIrst.Labs.JsonViewer

A lightweight JSON viewer built with vanilla JavaScript and Bootstrap that provides tree view, beautify, and compare functionality.

## Features

- **Tree View**: Display JSON data in an expandable/collapsible tree structure
- **Beautify**: Format and minify JSON with syntax highlighting
- **Compare**: Compare two JSON objects and highlight differences
- **Facade Interface**: Simple API for programmatic interaction
- **Service Class**: High-level service methods with titles and descriptions

## Getting Started

Simply open `index.html` in your web browser. No build process or dependencies required!

## Project Structure

```
.
├── index.html                # Main HTML page with root div "json-viewer-holder"
├── json-viewer.js            # Facade interface and core functionality
├── json-viewer-service.js    # Service class with high-level methods
├── app.js                    # Application initialization
├── styles.css                # Custom styles
├── demo.html                 # Facade demo examples
├── service-demo.html         # Service class demo examples
├── README.md                 # This file
└── SERVICE-USAGE.md          # Detailed service class documentation
```

## Usage

### Using the UI

1. **Tree View**
   - Paste JSON in the input textarea
   - Click "Load Tree View" to display the tree
   - Click arrows to expand/collapse nodes

2. **Beautify**
   - Paste JSON in the input textarea
   - Click "Beautify" to format with indentation
   - Click "Minify" to compress JSON
   - Click "Copy to Clipboard" to copy the result

3. **Compare**
   - Paste two JSON objects in the respective textareas
   - Click "Compare" to see differences
   - Results show added, removed, and modified fields

### Programmatic API (Facade Interface)

```javascript
// Set JSON data
jsonViewer.setData('{"name":"John","age":30}');
jsonViewer.setData({name: "John", age: 30});

// Change view
jsonViewer.changeView('tree');      // Switch to tree view
jsonViewer.changeView('beautify');  // Switch to beautify view
jsonViewer.changeView('compare');   // Switch to compare view

// Load sample data
const sample = jsonViewer.loadSampleData();

// Programmatic operations
jsonViewer.loadTreeView();
jsonViewer.beautifyJson();
jsonViewer.compareJson();
```

### Service Class API

The `JsonViewerService` provides high-level methods with built-in title and description support:

```javascript
// Render JSON as tree view
jsonViewerService.renderJsonData(
    "User Profile",
    "Displaying user information",
    {name: "John", age: 30}
);

// Beautify JSON
jsonViewerService.beautifyAndRender(
    "Formatted Output",
    "JSON with proper indentation",
    '{"compact":"json"}'
);

// Compare two JSONs
jsonViewerService.compareAndRender(
    "Version Comparison",
    "Showing differences between versions",
    {version: "1.0"},
    {version: "2.0", new: true}
);

// Convert text to JSON and render
jsonViewerService.renderTextData(
    "From Text",
    "Parsing JSON from text data",
    '{"text":"data"}'
);

// Set custom container
jsonViewerService.setContainer('#my-container');
```

For complete service documentation, see [SERVICE-USAGE.md](SERVICE-USAGE.md).

## Keyboard Shortcuts

- `Ctrl/Cmd + Enter`: Execute action for current tab (load tree, beautify, or compare)

## Technologies

- HTML5
- Vanilla JavaScript (ES6+)
- Bootstrap 5.3
- CSS3

## Browser Support

Works in all modern browsers that support ES6+ JavaScript.

## License

MIT License