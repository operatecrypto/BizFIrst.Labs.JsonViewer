# JsonViewerService - Usage Guide

The `JsonViewerService` class provides a high-level API for rendering JSON data with titles and descriptions.

## Installation

Include the scripts in your HTML file:

```html
<script src="json-viewer.js"></script>
<script src="json-viewer-service.js"></script>
```

The service is automatically initialized as `jsonViewerService`.

## Basic Usage

### Setting the Container

By default, the service renders to elements with class `.json-viewer-holder`. You can change the target container:

```javascript
// Use a specific container
jsonViewerService.setContainer('#my-container');

// Or chain it
jsonViewerService.setContainer('#output').renderJsonData('Title', 'Description', data);
```

## Methods

### 1. renderJsonData(title, description, dataJ)

Renders JSON data as an expandable/collapsible tree view.

**Parameters:**
- `title` (string): Title for the view
- `description` (string): Description text
- `dataJ` (Object|string): JSON object or JSON string

**Returns:** `boolean` - Success status

**Example:**

```javascript
const userData = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    address: {
        street: "123 Main St",
        city: "New York"
    }
};

jsonViewerService.renderJsonData(
    "User Profile",
    "Complete user information with nested address data",
    userData
);
```

**Output:**
- Header with title and description
- Tree view with expandable/collapsible nodes
- Color-coded data types (strings, numbers, booleans, null)

---

### 2. beautifyAndRender(title, description, data)

Beautifies JSON and displays it with proper indentation.

**Parameters:**
- `title` (string): Title for the view
- `description` (string): Description text
- `data` (Object|string): JSON object or JSON string to beautify

**Returns:** `boolean` - Success status

**Example:**

```javascript
const minifiedJson = '{"name":"Product","price":99.99,"inStock":true}';

jsonViewerService.beautifyAndRender(
    "Product Data - Beautified",
    "Formatted JSON with proper indentation for better readability",
    minifiedJson
);
```

**Features:**
- Formats JSON with 2-space indentation
- Displays in monospace font
- Includes "Copy to Clipboard" button
- Shows success notification on copy

---

### 3. compareAndRender(title, description, data1, data2)

Compares two JSON objects and highlights differences.

**Parameters:**
- `title` (string): Title for the comparison
- `description` (string): Description text
- `data1` (Object|string): First JSON object or string
- `data2` (Object|string): Second JSON object or string

**Returns:** `boolean` - Success status

**Example:**

```javascript
const before = {
    product: "Widget",
    price: 19.99,
    quantity: 100,
    available: true
};

const after = {
    product: "Widget",
    price: 24.99,    // Modified
    quantity: 75,     // Modified
    available: false, // Modified
    discount: 10      // Added
};

jsonViewerService.compareAndRender(
    "Product Update",
    "Comparing product data before and after price update",
    before,
    after
);
```

**Output:**
- Side-by-side preview of both JSONs
- Differences table showing:
  - **Added** fields (green badge)
  - **Removed** fields (red badge)
  - **Modified** fields (yellow badge)
- Path to each changed field
- Old and new values for modified fields

---

### 4. renderTextData(title, description, dataText)

Converts text data to JSON and renders it as a tree view.

**Parameters:**
- `title` (string): Title for the view
- `description` (string): Description text
- `dataText` (string): Text data that should be valid JSON

**Returns:** `boolean` - Success status

**Example:**

```javascript
const textFromFile = `{
    "order": {
        "id": "ORD-001",
        "items": [
            {"name": "Book", "qty": 2},
            {"name": "Pen", "qty": 5}
        ],
        "total": 44.48
    }
}`;

jsonViewerService.renderTextData(
    "Order Details",
    "JSON data parsed from text file or log output",
    textFromFile
);
```

**Notes:**
- If text is not valid JSON, displays error message
- Shows raw text if parsing fails
- Useful for parsing JSON from logs, files, or API responses

---

### 5. renderMultiple(datasets)

**BONUS METHOD** - Renders multiple datasets in separate tabs.

**Parameters:**
- `datasets` (Array): Array of dataset objects

Dataset object structure:
```javascript
{
    title: "Tab Title",           // Required
    description: "Description",   // Optional
    type: "tree|beautify|compare", // Required
    data: {...},                   // For tree/beautify
    data1: {...},                  // For compare (first object)
    data2: {...}                   // For compare (second object)
}
```

**Example:**

```javascript
const datasets = [
    {
        title: "User Data",
        description: "User profile information",
        data: {name: "Alice", age: 28},
        type: "tree"
    },
    {
        title: "Configuration",
        description: "App settings",
        data: {theme: "dark", lang: "en"},
        type: "beautify"
    },
    {
        title: "Version Comparison",
        description: "Config changes between versions",
        data1: {version: "1.0", debug: false},
        data2: {version: "2.0", debug: true, env: "prod"},
        type: "compare"
    }
];

jsonViewerService.renderMultiple(datasets);
```

**Output:**
- Tab navigation with dataset titles
- Each tab shows appropriate view type
- Automatic handling of container switching

---

## Utility Methods

### clearContainer()

Clears the current container content.

```javascript
jsonViewerService.clearContainer();
```

### showError(message)

Displays an error message in the container.

```javascript
jsonViewerService.showError('Failed to load data');
```

### getContainer()

Returns the current container element.

```javascript
const container = jsonViewerService.getContainer();
```

---

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container mt-4">
        <button onclick="showUserData()">Show User</button>
        <button onclick="showComparison()">Show Comparison</button>

        <div class="json-viewer-holder" id="output"></div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="json-viewer.js"></script>
    <script src="json-viewer-service.js"></script>
    <script>
        // Set container
        jsonViewerService.setContainer('#output');

        function showUserData() {
            const user = {
                id: 123,
                name: "Jane Smith",
                email: "jane@example.com"
            };

            jsonViewerService.renderJsonData(
                "User Information",
                "Details about the current user",
                user
            );
        }

        function showComparison() {
            const old = {version: "1.0", active: true};
            const new = {version: "2.0", active: true, beta: false};

            jsonViewerService.compareAndRender(
                "Version Comparison",
                "Changes between v1.0 and v2.0",
                old,
                new
            );
        }
    </script>
</body>
</html>
```

---

## Error Handling

All methods return `boolean` indicating success/failure:

```javascript
const success = jsonViewerService.renderJsonData(
    "Title",
    "Description",
    invalidData
);

if (!success) {
    console.error('Failed to render data');
}
```

Error messages are automatically displayed in the container.

---

## Styling

The service uses these CSS classes:

- `.json-viewer-holder` - Main container
- `.json-viewer-header` - Header section
- `.json-viewer-title` - Title styling
- `.json-viewer-description` - Description styling
- `.json-tree-container` - Tree view container
- `.json-beautified` - Beautified JSON output
- `.json-preview` - JSON preview in comparison
- `.differences-section` - Comparison differences section

You can customize these in `styles.css`.

---

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires ES6 support
- Uses Clipboard API for copy functionality

---

## Demo Files

- `service-demo.html` - Interactive demos of all methods
- `index.html` - Full application with service integrated
- `demo.html` - Basic facade and service examples
