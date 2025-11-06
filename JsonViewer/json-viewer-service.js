/**
 * JsonViewerService - Service class for rendering JSON data with titles and descriptions
 * This class provides high-level methods to render JSON data in various formats
 */
class JsonViewerService {
    constructor(containerSelector = '.json-viewer-holder') {
        this.containerSelector = containerSelector;
        this.jsonViewer = jsonViewer; // Reference to the facade
    }

    /**
     * Set the container where content will be rendered
     * @param {string} selector - CSS selector for the container
     */
    setContainer(selector) {
        this.containerSelector = selector;
        return this;
    }

    /**
     * Get the container element
     * @returns {HTMLElement|null}
     */
    getContainer() {
        return document.querySelector(this.containerSelector);
    }

    /**
     * Create a header section with title and description
     * @param {string} title - The title
     * @param {string} description - The description
     * @returns {HTMLElement}
     */
    createHeader(title, description) {
        const header = document.createElement('div');
        header.className = 'json-viewer-header mb-3';

        if (title) {
            const titleElement = document.createElement('h4');
            titleElement.className = 'json-viewer-title';
            titleElement.textContent = title;
            header.appendChild(titleElement);
        }

        if (description) {
            const descElement = document.createElement('p');
            descElement.className = 'json-viewer-description text-muted';
            descElement.textContent = description;
            header.appendChild(descElement);
        }

        return header;
    }

    /**
     * Clear the container
     */
    clearContainer() {
        const container = this.getContainer();
        if (container) {
            container.innerHTML = '';
        }
    }

    /**
     * Show error message in the container
     * @param {string} message - Error message
     */
    showError(message) {
        const container = this.getContainer();
        if (container) {
            container.innerHTML = `<div class="alert alert-danger" role="alert">${message}</div>`;
        }
    }

    /**
     * Compare two JSON objects and render the results
     * @param {string} title - Title for the comparison
     * @param {string} description - Description of the comparison
     * @param {Object|string} data1 - First JSON object or string
     * @param {Object|string} data2 - Second JSON object or string
     * @returns {boolean} - Success status
     */
    compareAndRender(title, description, data1, data2) {
        try {
            const container = this.getContainer();
            if (!container) {
                console.error('Container not found:', this.containerSelector);
                return false;
            }

            this.clearContainer();

            // Add header
            container.appendChild(this.createHeader(title, description));

            // Parse JSON if strings
            let json1, json2;
            try {
                json1 = typeof data1 === 'string' ? JSON.parse(data1) : data1;
                json2 = typeof data2 === 'string' ? JSON.parse(data2) : data2;
            } catch (parseError) {
                this.showError('Invalid JSON data: ' + parseError.message);
                return false;
            }

            // Create side-by-side view
            const row = document.createElement('div');
            row.className = 'row mb-3';

            const col1 = document.createElement('div');
            col1.className = 'col-md-6';
            col1.innerHTML = '<h6>Data 1</h6><pre class="json-preview">' +
                JSON.stringify(json1, null, 2) + '</pre>';

            const col2 = document.createElement('div');
            col2.className = 'col-md-6';
            col2.innerHTML = '<h6>Data 2</h6><pre class="json-preview">' +
                JSON.stringify(json2, null, 2) + '</pre>';

            row.appendChild(col1);
            row.appendChild(col2);
            container.appendChild(row);

            // Find and display differences
            const differences = this.jsonViewer.findDifferences(json1, json2);

            const diffSection = document.createElement('div');
            diffSection.className = 'differences-section mt-3';
            diffSection.innerHTML = '<h6>Differences</h6>';

            if (differences.length === 0) {
                diffSection.innerHTML += '<div class="alert alert-success">The JSON objects are identical!</div>';
            } else {
                const table = document.createElement('table');
                table.className = 'table table-bordered table-sm';
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>Path</th>
                            <th>Type</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                `;

                const tbody = table.querySelector('tbody');
                differences.forEach(diff => {
                    const row = document.createElement('tr');
                    row.className = `diff-${diff.type}`;

                    let details = '';
                    if (diff.type === 'modified') {
                        details = `<strong>Old:</strong> ${JSON.stringify(diff.oldValue)}<br><strong>New:</strong> ${JSON.stringify(diff.newValue)}`;
                    } else if (diff.type === 'added') {
                        details = `<strong>Value:</strong> ${JSON.stringify(diff.value)}`;
                    } else if (diff.type === 'removed') {
                        details = `<strong>Value:</strong> ${JSON.stringify(diff.value)}`;
                    }

                    row.innerHTML = `
                        <td><code>${diff.path}</code></td>
                        <td><span class="badge bg-${this.getDiffBadgeColor(diff.type)}">${diff.type}</span></td>
                        <td>${details}</td>
                    `;
                    tbody.appendChild(row);
                });

                diffSection.appendChild(table);
            }

            container.appendChild(diffSection);
            return true;

        } catch (error) {
            console.error('Error in compareAndRender:', error);
            this.showError('Error comparing JSON: ' + error.message);
            return false;
        }
    }

    /**
     * Beautify JSON and render with title and description
     * @param {string} title - Title for the beautified view
     * @param {string} description - Description
     * @param {Object|string} data - JSON object or string to beautify
     * @returns {boolean} - Success status
     */
    beautifyAndRender(title, description, data) {
        try {
            const container = this.getContainer();
            if (!container) {
                console.error('Container not found:', this.containerSelector);
                return false;
            }

            this.clearContainer();

            // Add header
            container.appendChild(this.createHeader(title, description));

            // Parse JSON if string
            let jsonData;
            try {
                jsonData = typeof data === 'string' ? JSON.parse(data) : data;
            } catch (parseError) {
                this.showError('Invalid JSON data: ' + parseError.message);
                return false;
            }

            // Create beautified view
            const beautified = JSON.stringify(jsonData, null, 2);

            const preElement = document.createElement('pre');
            preElement.className = 'json-beautified';
            preElement.textContent = beautified;

            const outputDiv = document.createElement('div');
            outputDiv.className = 'json-output-section';
            outputDiv.appendChild(preElement);

            // Add copy button
            const copyButton = document.createElement('button');
            copyButton.className = 'btn btn-sm btn-success mt-2';
            copyButton.textContent = 'Copy to Clipboard';
            copyButton.onclick = () => {
                navigator.clipboard.writeText(beautified).then(() => {
                    const originalText = copyButton.textContent;
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => {
                        copyButton.textContent = originalText;
                    }, 2000);
                }).catch(err => {
                    alert('Failed to copy: ' + err.message);
                });
            };

            outputDiv.appendChild(copyButton);
            container.appendChild(outputDiv);

            return true;

        } catch (error) {
            console.error('Error in beautifyAndRender:', error);
            this.showError('Error beautifying JSON: ' + error.message);
            return false;
        }
    }

    /**
     * Render JSON data as a tree view
     * @param {string} title - Title for the view
     * @param {string} description - Description
     * @param {Object|string} dataJ - JSON object or string to render
     * @returns {boolean} - Success status
     */
    renderJsonData(title, description, dataJ) {
        try {
            const container = this.getContainer();
            if (!container) {
                console.error('Container not found:', this.containerSelector);
                return false;
            }

            this.clearContainer();

            // Add header
            container.appendChild(this.createHeader(title, description));

            // Parse JSON if string
            let jsonData;
            try {
                jsonData = typeof dataJ === 'string' ? JSON.parse(dataJ) : dataJ;
            } catch (parseError) {
                this.showError('Invalid JSON data: ' + parseError.message);
                return false;
            }

            // Create tree view container
            const treeContainer = document.createElement('div');
            treeContainer.className = 'json-tree-container';

            // Render tree using the facade
            this.jsonViewer.renderTree(jsonData, treeContainer);

            container.appendChild(treeContainer);

            return true;

        } catch (error) {
            console.error('Error in renderJsonData:', error);
            this.showError('Error rendering JSON data: ' + error.message);
            return false;
        }
    }

    /**
     * Convert text data to JSON and render as tree view
     * @param {string} title - Title for the view
     * @param {string} description - Description
     * @param {string} dataText - Text data to convert to JSON and render
     * @returns {boolean} - Success status
     */
    renderTextData(title, description, dataText) {
        try {
            const container = this.getContainer();
            if (!container) {
                console.error('Container not found:', this.containerSelector);
                return false;
            }

            this.clearContainer();

            // Add header
            container.appendChild(this.createHeader(title, description));

            // Try to parse as JSON
            let jsonData;
            try {
                jsonData = JSON.parse(dataText);
            } catch (parseError) {
                this.showError('Unable to convert text to JSON: ' + parseError.message);

                // Show the raw text instead
                const textContainer = document.createElement('div');
                textContainer.className = 'text-data-container alert alert-warning';
                textContainer.innerHTML = `
                    <strong>Raw Text (Not valid JSON):</strong>
                    <pre class="mt-2">${this.escapeHtml(dataText)}</pre>
                `;
                container.appendChild(textContainer);

                return false;
            }

            // Create tree view container
            const treeContainer = document.createElement('div');
            treeContainer.className = 'json-tree-container';

            // Render tree using the facade
            this.jsonViewer.renderTree(jsonData, treeContainer);

            container.appendChild(treeContainer);

            return true;

        } catch (error) {
            console.error('Error in renderTextData:', error);
            this.showError('Error rendering text data: ' + error.message);
            return false;
        }
    }

    /**
     * Get badge color for difference type
     * @param {string} type - Difference type
     * @returns {string} - Bootstrap color class
     */
    getDiffBadgeColor(type) {
        switch (type) {
            case 'added': return 'success';
            case 'removed': return 'danger';
            case 'modified': return 'warning';
            default: return 'secondary';
        }
    }

    /**
     * Escape HTML entities
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Render multiple data sets in tabs
     * @param {Array} datasets - Array of objects with {title, description, data, type}
     * @returns {boolean} - Success status
     */
    renderMultiple(datasets) {
        try {
            const container = this.getContainer();
            if (!container) {
                console.error('Container not found:', this.containerSelector);
                return false;
            }

            this.clearContainer();

            // Create tabs
            const tabsContainer = document.createElement('div');
            tabsContainer.className = 'json-viewer-tabs';

            const tabNav = document.createElement('ul');
            tabNav.className = 'nav nav-tabs';
            tabNav.setAttribute('role', 'tablist');

            const tabContent = document.createElement('div');
            tabContent.className = 'tab-content mt-3';

            datasets.forEach((dataset, index) => {
                const tabId = `dataset-tab-${index}`;
                const isActive = index === 0 ? 'active' : '';

                // Create tab navigation
                const tabItem = document.createElement('li');
                tabItem.className = 'nav-item';
                tabItem.setAttribute('role', 'presentation');

                const tabButton = document.createElement('button');
                tabButton.className = `nav-link ${isActive}`;
                tabButton.setAttribute('data-bs-toggle', 'tab');
                tabButton.setAttribute('data-bs-target', `#${tabId}`);
                tabButton.setAttribute('type', 'button');
                tabButton.setAttribute('role', 'tab');
                tabButton.textContent = dataset.title || `Dataset ${index + 1}`;

                tabItem.appendChild(tabButton);
                tabNav.appendChild(tabItem);

                // Create tab pane
                const tabPane = document.createElement('div');
                tabPane.className = `tab-pane fade show ${isActive}`;
                tabPane.id = tabId;
                tabPane.setAttribute('role', 'tabpanel');

                // Create a temporary container for this dataset
                const tempContainer = document.createElement('div');
                tempContainer.className = 'json-viewer-holder';
                tabPane.appendChild(tempContainer);

                // Store original container
                const originalContainer = this.containerSelector;

                // Temporarily set to this tab's container
                this.containerSelector = `#${tabId} .json-viewer-holder`;

                // Render based on type
                switch (dataset.type) {
                    case 'tree':
                        this.renderJsonData(dataset.title, dataset.description, dataset.data);
                        break;
                    case 'beautify':
                        this.beautifyAndRender(dataset.title, dataset.description, dataset.data);
                        break;
                    case 'compare':
                        this.compareAndRender(dataset.title, dataset.description, dataset.data1, dataset.data2);
                        break;
                    default:
                        this.renderJsonData(dataset.title, dataset.description, dataset.data);
                }

                // Restore original container
                this.containerSelector = originalContainer;

                tabContent.appendChild(tabPane);
            });

            tabsContainer.appendChild(tabNav);
            container.appendChild(tabsContainer);
            container.appendChild(tabContent);

            return true;

        } catch (error) {
            console.error('Error in renderMultiple:', error);
            this.showError('Error rendering multiple datasets: ' + error.message);
            return false;
        }
    }
}

// Create a global instance
const jsonViewerService = new JsonViewerService();
