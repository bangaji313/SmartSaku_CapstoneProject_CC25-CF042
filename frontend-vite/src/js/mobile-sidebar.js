/**
 * Mobile Sidebar Navigation Controller
 * Handles the mobile responsive behavior for the dashboard sidebar
 */

// Create a function that can be called after template loading
export function initMobileSidebar() {
    console.log('Initializing mobile sidebar...');

    // Clean up any existing elements to prevent duplicates
    const existingButton = document.querySelector('.mobile-menu-btn');
    if (existingButton) {
        existingButton.remove();
    }

    const existingOverlay = document.querySelector('.sidebar-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }

    // Now set up the sidebar navigation
    setupMobileSidebar();
}

// Function to set up mobile navigation
function setupMobileNavigation() {
    if (!document.querySelector('.mobile-menu-btn')) {
        console.log('Creating mobile menu button');
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn shadow-md bg-white text-gray-700 rounded-md';
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars text-lg"></i>';
        mobileMenuBtn.setAttribute('aria-label', 'Toggle Menu');
        mobileMenuBtn.style.position = 'fixed';
        mobileMenuBtn.style.top = '1rem';
        mobileMenuBtn.style.left = '1rem';
        mobileMenuBtn.style.zIndex = '150';
        mobileMenuBtn.style.padding = '0.5rem 0.75rem';
        document.body.appendChild(mobileMenuBtn);

        // Create overlay for closing sidebar
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.style.display = 'none';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '49';
        document.body.appendChild(overlay);

        // Get sidebar element
        const sidebar = document.querySelector('aside.w-64');
        const mainContent = document.querySelector('.ml-64');

        console.log('Sidebar element found:', !!sidebar);
        console.log('Main content element found:', !!mainContent);

        // Toggle sidebar visibility
        mobileMenuBtn.addEventListener('click', () => {
            // Re-query to make sure we have the current sidebar
            const currentSidebar = document.querySelector('aside.w-64');
            if (currentSidebar) {
                console.log('Toggle sidebar menu');
                currentSidebar.classList.toggle('mobile-open');

                if (currentSidebar.classList.contains('mobile-open')) {
                    currentSidebar.style.transform = 'translateX(0)';
                    overlay.style.display = 'block';
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                    mobileMenuBtn.classList.add('open');
                } else {
                    currentSidebar.style.transform = 'translateX(-100%)';
                    overlay.style.display = 'none';
                    document.body.style.overflow = ''; // Enable scrolling
                    mobileMenuBtn.classList.remove('open');
                }
            } else {
                console.warn('Sidebar element not found when trying to toggle');
            }
        });

        // Close sidebar when clicking on overlay
        overlay.addEventListener('click', () => {
            const currentSidebar = document.querySelector('aside.w-64');
            if (currentSidebar) {
                currentSidebar.style.transform = 'translateX(-100%)';
                currentSidebar.classList.remove('mobile-open');
                overlay.style.display = 'none';
                mobileMenuBtn.classList.remove('open');
                document.body.style.overflow = '';
            }
        });

        // Close sidebar when clicking on main content area (if it exists)
        if (mainContent) {
            mainContent.addEventListener('click', () => {
                const currentSidebar = document.querySelector('aside.w-64');
                if (currentSidebar && currentSidebar.classList.contains('mobile-open') && window.innerWidth <= 768) {
                    currentSidebar.style.transform = 'translateX(-100%)';
                    currentSidebar.classList.remove('mobile-open');
                    overlay.style.display = 'none';
                    mobileMenuBtn.classList.remove('open');
                    document.body.style.overflow = '';
                }
            });
        }

        // Close sidebar when window resizes above mobile breakpoint
        window.addEventListener('resize', () => {
            const currentSidebar = document.querySelector('aside.w-64');
            if (currentSidebar && window.innerWidth > 768 && currentSidebar.classList.contains('mobile-open')) {
                currentSidebar.style.transform = 'translateX(-100%)';
                currentSidebar.classList.remove('mobile-open');
                overlay.style.display = 'none';
                mobileMenuBtn.classList.remove('open');
                document.body.style.overflow = '';
            }
        });

        // Setup click handling on navigation links
        function setupNavLinkListeners() {
            const navLinks = document.querySelectorAll('aside.w-64 a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    const currentSidebar = document.querySelector('aside.w-64');
                    if (currentSidebar && window.innerWidth <= 768) {
                        currentSidebar.style.transform = 'translateX(-100%)';
                        currentSidebar.classList.remove('mobile-open');
                        overlay.style.display = 'none';
                        mobileMenuBtn.classList.remove('open');
                        document.body.style.overflow = '';
                    }
                });
            });
        }

        // Initial setup
        if (sidebar) {
            setupNavLinkListeners();

            // Also watch for changes to the sidebar (in case links are added dynamically)
            const observer = new MutationObserver(() => {
                setupNavLinkListeners();
            });

            observer.observe(sidebar, {
                childList: true,
                subtree: true
            });
        }
    } else {
        console.log('Mobile menu button already exists');
    }
}

// The main setup function
function setupMobileSidebar() {
    console.log('Setting up mobile sidebar...');

    // Apply mobile styles to existing sidebar
    const sidebar = document.querySelector('aside.w-64');
    if (sidebar) {
        console.log('Found sidebar, setting up mobile styles');

        // Ensure the sidebar has the right CSS for mobile
        if (window.innerWidth <= 768) {
            sidebar.style.transition = 'transform 0.3s ease';
            sidebar.style.transform = 'translateX(-100%)';
        }

        // Setup the menu button and other mobile navigation
        setupMobileNavigation();
    } else {
        console.warn('Sidebar with class "w-64" not found. Setting up observer...');

        // Set up a mutation observer to detect when the sidebar is added to the DOM
        const observer = new MutationObserver((mutations, obs) => {
            const sidebar = document.querySelector('aside.w-64');
            if (sidebar) {
                console.log('Sidebar found in DOM, setting up mobile navigation');
                obs.disconnect(); // Stop observing once we found the sidebar

                // Ensure the sidebar has the right CSS for mobile
                if (window.innerWidth <= 768) {
                    sidebar.style.transition = 'transform 0.3s ease';
                    sidebar.style.transform = 'translateX(-100%)';
                }

                setupMobileNavigation();
            }
        });

        // Start observing the document body for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Set a timeout to stop observing after a reasonable time
        setTimeout(() => {
            observer.disconnect();
        }, 10000);
    }
}

// Listen for DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add a small delay to ensure templates are loaded
    setTimeout(() => {
        setupMobileSidebar();
    }, 500);
});

export default {};
