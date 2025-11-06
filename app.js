/**
 * Application initialization and helper functions
 */

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('JSON Viewer initialized');

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to trigger action based on current tab
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const activeTab = document.querySelector('.tab-pane.active');
            if (activeTab) {
                const tabId = activeTab.id;
                if (tabId === 'tree-view') {
                    jsonViewer.loadTreeView();
                } else if (tabId === 'beautify-view') {
                    jsonViewer.beautifyJson();
                } else if (tabId === 'compare-view') {
                    jsonViewer.compareJson();
                }
            }
        }
    });
});

// Example usage of the facade interface:
// You can interact with the JSON viewer programmatically like this:

/*
// Set data programmatically
jsonViewer.setData('{"name":"John","age":30}');

// Change view
jsonViewer.changeView('tree');
jsonViewer.changeView('beautify');
jsonViewer.changeView('compare');

// Load sample data
const sample = jsonViewer.loadSampleData();
document.getElementById('tree-input').value = JSON.stringify(sample);
jsonViewer.loadTreeView();
*/
