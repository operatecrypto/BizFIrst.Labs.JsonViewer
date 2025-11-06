# JsonViewerService - Quick Reference Card

## Setup

```html
<script src="json-viewer.js"></script>
<script src="json-viewer-service.js"></script>
```

## Service Instance

```javascript
// Global instance ready to use
jsonViewerService
```

## Methods

### 1. renderJsonData(title, description, dataJ)
Render JSON as expandable tree view

```javascript
jsonViewerService.renderJsonData(
    "User Data",
    "User profile information",
    {name: "John", email: "john@example.com"}
);
```

**Use when:** Displaying structured JSON data

---

### 2. beautifyAndRender(title, description, data)
Format and beautify JSON with copy button

```javascript
jsonViewerService.beautifyAndRender(
    "Formatted JSON",
    "Beautified with 2-space indentation",
    '{"compact":"json","data":true}'
);
```

**Use when:** Making JSON readable, formatting minified JSON

---

### 3. compareAndRender(title, description, data1, data2)
Compare two JSONs and show differences

```javascript
jsonViewerService.compareAndRender(
    "API Comparison",
    "v1 vs v2 response differences",
    {version: 1, old: true},
    {version: 2, new: true}
);
```

**Use when:** Comparing configurations, versions, or responses

---

### 4. renderTextData(title, description, dataText)
Parse text as JSON and render tree

```javascript
const textData = '{"from":"log","message":"data"}';

jsonViewerService.renderTextData(
    "Log Data",
    "Parsed from log file",
    textData
);
```

**Use when:** Processing JSON from logs, files, or text input

---

### 5. renderMultiple(datasets)
Render multiple datasets in tabs

```javascript
jsonViewerService.renderMultiple([
    {
        title: "Users",
        description: "User list",
        data: [{id: 1}, {id: 2}],
        type: "tree"
    },
    {
        title: "Config",
        description: "Settings",
        data: {debug: true},
        type: "beautify"
    }
]);
```

**Use when:** Displaying multiple related datasets

---

## Container Management

```javascript
// Set container
jsonViewerService.setContainer('#my-div');

// Get container
const element = jsonViewerService.getContainer();

// Clear container
jsonViewerService.clearContainer();

// Show error
jsonViewerService.showError('Something went wrong');
```

---

## Return Values

All render methods return `boolean`:
- `true` = Success
- `false` = Error (automatically displayed)

```javascript
if (!jsonViewerService.renderJsonData("Title", "Desc", data)) {
    console.error('Render failed');
}
```

---

## HTML Container

Default container class:
```html
<div class="json-viewer-holder"></div>
```

Custom container:
```html
<div id="custom-output"></div>
<script>
    jsonViewerService.setContainer('#custom-output');
</script>
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
        <div class="json-viewer-holder" id="viewer"></div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="json-viewer.js"></script>
    <script src="json-viewer-service.js"></script>
    <script>
        // Initialize
        jsonViewerService.setContainer('#viewer');

        // Use it
        const data = {user: "Jane", role: "admin"};
        jsonViewerService.renderJsonData(
            "Current User",
            "Authenticated user details",
            data
        );
    </script>
</body>
</html>
```

---

## Data Type Support

- **Objects**: `{key: "value"}`
- **Arrays**: `[1, 2, 3]`
- **Strings**: Both JSON strings and objects
- **Primitives**: Numbers, booleans, null
- **Nested**: Deeply nested structures

---

## Comparison Output

| Type | Badge Color | Meaning |
|------|-------------|---------|
| Added | Green | Field exists in data2 only |
| Removed | Red | Field exists in data1 only |
| Modified | Yellow | Field exists in both but values differ |

---

## Tips

1. **Always set container first** if not using default
2. **Check return value** for error handling
3. **Use appropriate method** for the task:
   - Tree view → `renderJsonData()`
   - Format → `beautifyAndRender()`
   - Diff → `compareAndRender()`
   - Parse text → `renderTextData()`
4. **Method chaining** works: `service.setContainer('#out').renderJsonData(...)`

---

## Demo Files

- `service-demo.html` - Interactive demos
- `index.html` - Full application
- `SERVICE-USAGE.md` - Complete documentation
