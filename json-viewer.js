/**
 * JSON Viewer - Facade Interface
 * This class provides a simple interface to interact with the JSON viewer
 */
class JsonViewer {
    constructor() {
        this.currentView = 'tree';
        this.jsonData = null;
    }

    /**
     * Set JSON data programmatically
     * @param {Object|string} data - JSON object or string
     */
    setData(data) {
        try {
            if (typeof data === 'string') {
                this.jsonData = JSON.parse(data);
            } else {
                this.jsonData = data;
            }
            return true;
        } catch (error) {
            this.showError('Invalid JSON: ' + error.message);
            return false;
        }
    }

    /**
     * Change the active view
     * @param {string} view - View name: 'tree', 'beautify', or 'compare'
     */
    changeView(view) {
        const validViews = ['tree', 'beautify', 'compare'];
        if (validViews.includes(view)) {
            this.currentView = view;
            const tab = document.getElementById(`${view}-tab`);
            if (tab) {
                tab.click();
            }
        }
    }

    /**
     * Load and display tree view
     */
    loadTreeView() {
        const input = document.getElementById('tree-input').value.trim();
        if (!input) {
            this.showError('Please enter JSON data');
            return;
        }

        if (this.setData(input)) {
            const holder = document.getElementById('tree-holder');
            holder.innerHTML = '';
            this.renderTree(this.jsonData, holder);
        }
    }

    /**
     * Render JSON as a tree structure
     * @param {*} data - Data to render
     * @param {HTMLElement} container - Container element
     * @param {string} key - Key name
     */
    renderTree(data, container, key = null) {
        const ul = document.createElement('ul');
        ul.className = 'json-tree';

        if (key !== null) {
            const li = document.createElement('li');
            const keySpan = document.createElement('span');
            keySpan.className = 'json-key';
            keySpan.textContent = key + ': ';
            li.appendChild(keySpan);
            ul.appendChild(li);
        }

        if (Array.isArray(data)) {
            const arrayLi = document.createElement('li');
            const toggle = this.createToggle();
            const typeSpan = document.createElement('span');
            typeSpan.className = 'json-type';
            typeSpan.textContent = `Array[${data.length}]`;

            arrayLi.appendChild(toggle);
            arrayLi.appendChild(typeSpan);

            const childUl = document.createElement('ul');
            childUl.className = 'json-tree-children';
            data.forEach((item, index) => {
                this.renderTree(item, childUl, `[${index}]`);
            });
            arrayLi.appendChild(childUl);
            ul.appendChild(arrayLi);
        } else if (typeof data === 'object' && data !== null) {
            const objLi = document.createElement('li');
            const toggle = this.createToggle();
            const typeSpan = document.createElement('span');
            typeSpan.className = 'json-type';
            typeSpan.textContent = `Object{${Object.keys(data).length}}`;

            objLi.appendChild(toggle);
            objLi.appendChild(typeSpan);

            const childUl = document.createElement('ul');
            childUl.className = 'json-tree-children';
            Object.keys(data).forEach(objKey => {
                this.renderTree(data[objKey], childUl, objKey);
            });
            objLi.appendChild(childUl);
            ul.appendChild(objLi);
        } else {
            const valueLi = document.createElement('li');
            const valueSpan = document.createElement('span');
            valueSpan.className = this.getValueClass(data);
            valueSpan.textContent = this.formatValue(data);

            if (key !== null) {
                valueLi.innerHTML = '';
                const keySpan = document.createElement('span');
                keySpan.className = 'json-key';
                keySpan.textContent = key + ': ';
                valueLi.appendChild(keySpan);
            }

            valueLi.appendChild(valueSpan);
            ul.appendChild(valueLi);
        }

        container.appendChild(ul);
    }

    /**
     * Create toggle button for collapsible tree nodes
     */
    createToggle() {
        const toggle = document.createElement('span');
        toggle.className = 'json-toggle';
        toggle.textContent = '▼';
        toggle.onclick = function() {
            const parent = this.parentElement;
            const children = parent.querySelector('.json-tree-children');
            if (children) {
                children.classList.toggle('collapsed');
                this.textContent = children.classList.contains('collapsed') ? '▶' : '▼';
            }
        };
        return toggle;
    }

    /**
     * Get CSS class for value type
     */
    getValueClass(value) {
        if (value === null) return 'json-null';
        if (typeof value === 'string') return 'json-string';
        if (typeof value === 'number') return 'json-number';
        if (typeof value === 'boolean') return 'json-boolean';
        return 'json-value';
    }

    /**
     * Format value for display
     */
    formatValue(value) {
        if (value === null) return 'null';
        if (typeof value === 'string') return `"${value}"`;
        return String(value);
    }

    /**
     * Clear tree view
     */
    clearTreeView() {
        document.getElementById('tree-input').value = '';
        document.getElementById('tree-holder').innerHTML = '';
    }

    /**
     * Beautify JSON
     */
    beautifyJson() {
        const input = document.getElementById('beautify-input').value.trim();
        if (!input) {
            this.showError('Please enter JSON data');
            return;
        }

        try {
            const parsed = JSON.parse(input);
            const beautified = JSON.stringify(parsed, null, 2);
            document.getElementById('beautify-output').textContent = beautified;
        } catch (error) {
            this.showError('Invalid JSON: ' + error.message);
        }
    }

    /**
     * Minify JSON
     */
    minifyJson() {
        const input = document.getElementById('beautify-input').value.trim();
        if (!input) {
            this.showError('Please enter JSON data');
            return;
        }

        try {
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            document.getElementById('beautify-output').textContent = minified;
        } catch (error) {
            this.showError('Invalid JSON: ' + error.message);
        }
    }

    /**
     * Clear beautify view
     */
    clearBeautify() {
        document.getElementById('beautify-input').value = '';
        document.getElementById('beautify-output').textContent = '';
    }

    /**
     * Copy beautified JSON to clipboard
     */
    copyBeautified() {
        const output = document.getElementById('beautify-output').textContent;
        if (!output) {
            this.showError('No output to copy');
            return;
        }

        navigator.clipboard.writeText(output).then(() => {
            alert('Copied to clipboard!');
        }).catch(err => {
            this.showError('Failed to copy: ' + err.message);
        });
    }

    /**
     * Compare two JSON objects
     */
    compareJson() {
        const input1 = document.getElementById('compare-input1').value.trim();
        const input2 = document.getElementById('compare-input2').value.trim();

        if (!input1 || !input2) {
            this.showError('Please enter both JSON objects to compare');
            return;
        }

        try {
            const json1 = JSON.parse(input1);
            const json2 = JSON.parse(input2);
            const differences = this.findDifferences(json1, json2);
            this.displayComparison(differences);
        } catch (error) {
            this.showError('Invalid JSON: ' + error.message);
        }
    }

    /**
     * Find differences between two objects
     */
    findDifferences(obj1, obj2, path = '') {
        const differences = [];

        const keys1 = new Set(Object.keys(obj1 || {}));
        const keys2 = new Set(Object.keys(obj2 || {}));
        const allKeys = new Set([...keys1, ...keys2]);

        allKeys.forEach(key => {
            const currentPath = path ? `${path}.${key}` : key;
            const val1 = obj1?.[key];
            const val2 = obj2?.[key];

            if (!keys1.has(key)) {
                differences.push({
                    path: currentPath,
                    type: 'added',
                    value: val2
                });
            } else if (!keys2.has(key)) {
                differences.push({
                    path: currentPath,
                    type: 'removed',
                    value: val1
                });
            } else if (typeof val1 === 'object' && typeof val2 === 'object' && val1 !== null && val2 !== null) {
                differences.push(...this.findDifferences(val1, val2, currentPath));
            } else if (val1 !== val2) {
                differences.push({
                    path: currentPath,
                    type: 'modified',
                    oldValue: val1,
                    newValue: val2
                });
            }
        });

        return differences;
    }

    /**
     * Display comparison results
     */
    displayComparison(differences) {
        const holder = document.getElementById('compare-holder');
        holder.innerHTML = '';

        if (differences.length === 0) {
            holder.innerHTML = '<div class="alert alert-success">The JSON objects are identical!</div>';
            return;
        }

        const table = document.createElement('table');
        table.className = 'table table-bordered';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Path</th>
                    <th>Type</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;

        const tbody = table.querySelector('tbody');
        differences.forEach(diff => {
            const row = document.createElement('tr');
            row.className = `diff-${diff.type}`;

            let details = '';
            if (diff.type === 'modified') {
                details = `Old: ${JSON.stringify(diff.oldValue)}<br>New: ${JSON.stringify(diff.newValue)}`;
            } else if (diff.type === 'added') {
                details = `Value: ${JSON.stringify(diff.value)}`;
            } else if (diff.type === 'removed') {
                details = `Value: ${JSON.stringify(diff.value)}`;
            }

            row.innerHTML = `
                <td><code>${diff.path}</code></td>
                <td><span class="badge bg-${this.getDiffBadgeColor(diff.type)}">${diff.type}</span></td>
                <td>${details}</td>
            `;
            tbody.appendChild(row);
        });

        holder.appendChild(table);
    }

    /**
     * Get badge color for difference type
     */
    getDiffBadgeColor(type) {
        switch(type) {
            case 'added': return 'success';
            case 'removed': return 'danger';
            case 'modified': return 'warning';
            default: return 'secondary';
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        alert('Error: ' + message);
    }

    /**
     * Load sample data for testing
     */
    loadSampleData() {
        const sample = {
            name: "John Doe",
            age: 30,
            email: "john@example.com",
            address: {
                street: "123 Main St",
                city: "New York",
                country: "USA"
            },
            hobbies: ["reading", "gaming", "coding"],
            active: true
        };
        return sample;
    }
}

// Initialize the facade
const jsonViewer = new JsonViewer();
