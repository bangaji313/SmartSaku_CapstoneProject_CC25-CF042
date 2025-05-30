/**
 * Component Loader
 * Modul untuk memuat komponen HTML ke dalam halaman
 */

export async function loadComponent(selector, componentPath) {
    try {
        const container = document.querySelector(selector);
        if (!container) {
            console.error(`Container ${selector} tidak ditemukan`);
            return;
        }

        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Failed to fetch component: ${response.status} ${response.statusText}`);
        }

        const html = await response.text();
        container.innerHTML = html;

        return true;
    } catch (error) {
        console.error('Error loading component:', error);
        return false;
    }
}

export async function loadHeaderAndSidebar() {
    const pageContent = document.querySelector('#app');
    if (!pageContent) return false;

    // Cek apakah halaman saat ini merupakan login, register, atau home
    const currentPath = window.location.pathname;
    const publicPages = ['/', '/login', '/register', '/index.html', '/login.html', '/register.html'];
    const isPublicPage = publicPages.some(page =>
        currentPath === page ||
        currentPath.endsWith(page)
    );

    // Jika halaman adalah login, register, atau home, jangan tampilkan sidebar dan header mobile
    if (isPublicPage) {
        console.log('Halaman publik terdeteksi, tidak menampilkan sidebar:', currentPath);
        return false;
    }

    try {
        // Cek apakah header mobile sudah ada
        if (!document.querySelector('.mobile-header')) {
            // Fetch mobile-header.html
            const headerResponse = await fetch('/src/components/mobile-header.html');
            const headerHtml = await headerResponse.text();

            // Insert header as first child
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = headerHtml;

            while (tempDiv.firstChild) {
                pageContent.insertBefore(tempDiv.firstChild, pageContent.firstChild);
            }
        }

        // Cek apakah sidebar sudah ada
        if (!document.querySelector('aside#sidebar')) {
            // Fetch sidebar.html
            const sidebarResponse = await fetch('/src/components/sidebar.html');
            const sidebarHtml = await sidebarResponse.text();

            // Insert sidebar after header
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = sidebarHtml;

            const mobileOverlay = document.querySelector('.mobile-overlay');
            if (mobileOverlay) {
                while (tempDiv.firstChild) {
                    pageContent.insertBefore(tempDiv.firstChild, mobileOverlay.nextSibling);
                }
            } else {
                while (tempDiv.firstChild) {
                    pageContent.insertBefore(tempDiv.firstChild, pageContent.firstChild.nextSibling);
                }
            }
        }

        // Memastikan script mobile-menu.js berjalan
        await ensureMobileMenuFunctions();

        return true;
    } catch (error) {
        console.error('Error loading header and sidebar:', error);
        return false;
    }
}

async function ensureMobileMenuFunctions() {
    // Pastikan fungsi showSidebar dan hideSidebar tersedia secara global
    if (typeof window.showSidebar !== 'function') {
        window.showSidebar = function () {
            console.log('Show sidebar fallback from components-loader');
            const sidebar = document.querySelector('aside#sidebar');
            const mobileOverlay = document.querySelector('.mobile-overlay');

            if (sidebar && mobileOverlay) {
                sidebar.classList.add('active');
                mobileOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                console.error('Sidebar or overlay not found:', { sidebar, mobileOverlay });
            }
        };
    }

    if (typeof window.hideSidebar !== 'function') {
        window.hideSidebar = function () {
            console.log('Hide sidebar fallback from components-loader');
            const sidebar = document.querySelector('aside#sidebar');
            const mobileOverlay = document.querySelector('.mobile-overlay');

            if (sidebar && mobileOverlay) {
                sidebar.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
            } else {
                console.error('Sidebar or overlay not found:', { sidebar, mobileOverlay });
            }
        };
    }

    // Cek apakah elemen-elemen sudah ada dan tambahkan event listeners
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const closeMenu = document.getElementById('closeMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');

    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', function () {
            console.log('Hamburger clicked');
            window.showSidebar();
        });
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', function () {
            console.log('Close button clicked');
            window.hideSidebar();
        });
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', function () {
            console.log('Overlay clicked');
            window.hideSidebar();
        });
    }
}

// Highlight active menu item berdasarkan path saat ini
export function highlightActiveMenu() {
    const path = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (path.includes(href) && href !== '/') {
            link.classList.add('bg-indigo-100', 'text-indigo-600');
            link.classList.remove('hover:bg-gray-100', 'text-gray-700');

            // Ganti warna icon
            const icon = link.querySelector('i');
            if (icon) {
                icon.classList.remove('text-gray-600');
                icon.classList.add('text-indigo-600');
            }
        }
    });
}