/**
 * sidebar.js
 * Handle all sidebar navigation functionality
 */

/**
 * Initialize sidebar functionality
 */
function initSidebar() {
    console.log('Initializing sidebar navigation...');

    // Setup sidebar active state based on current page
    setupSidebarActiveState();
}

/**
 * Setup sidebar active state for current page
 */
function setupSidebarActiveState() {
    // Get current path
    const currentPath = window.location.pathname;
    console.log('Current path:', currentPath);

    // Select all sidebar navigation items
    const sidebarItems = document.querySelectorAll('nav ul li a');

    // Remove active class from all items
    sidebarItems.forEach(item => {
        item.classList.remove('bg-indigo-100', 'text-indigo-600');
        item.classList.add('hover:bg-gray-100', 'text-gray-700');

        // Find icon container and update its color
        const iconContainer = item.querySelector('i');
        if (iconContainer) {
            iconContainer.classList.remove('text-indigo-600');
            iconContainer.classList.add('text-gray-600');
        }
    });

    // Add active class based on current path
    sidebarItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && (currentPath.includes(href) ||
            (href.includes('dashboard') && (currentPath === '/' || currentPath === '')))) {
            item.classList.remove('hover:bg-gray-100', 'text-gray-700');
            item.classList.add('bg-indigo-100', 'text-indigo-600');

            // Find icon container and update its color
            const iconContainer = item.querySelector('i');
            if (iconContainer) {
                iconContainer.classList.remove('text-gray-600');
                iconContainer.classList.add('text-indigo-600');
            }
        }
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    initSidebar();
});

// Export the function for module use
export { initSidebar };
