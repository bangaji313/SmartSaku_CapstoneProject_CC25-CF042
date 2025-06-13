// Handlers for notification features

export function setupNotifikasiHandlers() {
    // Mengelola tombol tutup notifikasi
    const closeButtons = document.querySelectorAll('#notifikasiSection button');
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const notificationItem = e.target.closest('div.p-4');
            if (notificationItem) {
                // Animasi fade out sebelum menghapus
                notificationItem.style.transition = 'opacity 300ms';
                notificationItem.style.opacity = '0';
                setTimeout(() => {
                    notificationItem.remove();
                    updateNotificationCount();
                }, 300);
            }
        });
    });

    // Initial count update
    updateNotificationCount();
}

// Update jumlah notifikasi yang ditampilkan di sidebar
export function updateNotificationCount() {
    const unreadNotifications = document.querySelectorAll('#notifikasiSection .bg-blue-50, #notifikasiSection .bg-green-50, #notifikasiSection .bg-yellow-50').length;

    // Update badge di sidebar
    const notifBadge = document.querySelector('.nav-link[data-section="notifikasi"] .bg-red-500');
    if (notifBadge) {
        if (unreadNotifications > 0) {
            notifBadge.textContent = unreadNotifications;
            notifBadge.classList.remove('hidden');
        } else {
            notifBadge.classList.add('hidden');
        }
    }

    // Update header jumlah notifikasi
    const headerBadge = document.querySelector('#notifikasiSection .bg-gray-50 .bg-red-500');
    if (headerBadge) {
        if (unreadNotifications > 0) {
            headerBadge.textContent = unreadNotifications;
            headerBadge.classList.remove('hidden');
        } else {
            headerBadge.classList.add('hidden');
        }
    }
}
