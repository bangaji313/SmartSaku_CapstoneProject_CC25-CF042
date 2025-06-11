/**
 * dashboard-main.js
 * File utama untuk menginisialisasi semua komponen dashboard
 */

import { initCashFlowChart, initCategoryChart } from './dashboard-charts.js';
import { setupAIChat } from './ai-chat.js';
import { formatCurrency, animateValue } from './dashboard-utils.js';
import { initSidebar } from './sidebar.js';

// Inisialisasi dashboard
export function initDashboard() {
    console.log('Initializing dashboard...');

    // Setup Chart.js
    initializeCharts();

    // Setup AI Chat
    setupAIChat();

    // Animate stats (untuk efek visual)
    animateStatNumbers();

    // Setup sidebar
    initSidebar();

    // Setup event listeners
    setupEventListeners();

    console.log('Dashboard initialized!');
}

// Fungsi untuk menginisialisasi chart
function initializeCharts() {
    // Perlu ada delay kecil untuk memastikan DOM sudah siap
    setTimeout(() => {
        initCashFlowChart();
        initCategoryChart();
    }, 100);
}

// Fungsi untuk animasi angka pada stats
function animateStatNumbers() {
    // Get semua elemen dengan angka yang perlu dianimasi
    const statElements = document.querySelectorAll('.animate-stat');

    statElements.forEach(element => {
        const targetValue = parseFloat(element.dataset.value || '0');
        const prefix = element.dataset.prefix || '';
        const suffix = element.dataset.suffix || '';
        const duration = parseInt(element.dataset.duration || '1000');

        animateValue(element, 0, targetValue, duration, prefix, suffix);
    });
}

// Fungsi untuk setup event listeners
function setupEventListeners() {
    // Toggle mobile sidebar
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('aside');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('translate-x-0');
            sidebar.classList.toggle('-translate-x-full');
        });
    }

    // Handle chart period change
    const periodSelect = document.querySelector('select');
    if (periodSelect) {
        periodSelect.addEventListener('change', (e) => {
            updateChartsForPeriod(e.target.value);
        });
    }
}

// Fungsi untuk memperbarui chart berdasarkan period yang dipilih
function updateChartsForPeriod(period) {
    console.log(`Updating charts for period: ${period}`);

    // Di aplikasi nyata, kita akan fetch data baru dari API
    // Untuk demo, kita bisa random nilai baru

    // Fetch data baru (simulasi)
    fetchDataForPeriod(period).then(data => {
        // Update chart dengan data baru
        updateCharts(data);
    }).catch(error => {
        console.error('Error updating charts:', error);
    });
}

// Fungsi simulasi untuk fetch data berdasarkan periode
function fetchDataForPeriod(period) {
    // Simulasi API request dengan Promise
    return new Promise((resolve) => {
        setTimeout(() => {
            // Generate mock data
            const months = period === '3 Bulan Terakhir' ? 3 :
                period === '6 Bulan Terakhir' ? 6 : 12;

            const data = {
                income: Array.from({ length: months }, () => Math.floor(Math.random() * 500000) + 800000),
                expense: Array.from({ length: months }, () => Math.floor(Math.random() * 300000) + 600000)
            };

            resolve(data);
        }, 500);
    });
}

// Fungsi untuk memperbarui chart dengan data baru
function updateCharts(data) {
    // Update chart (metode ini didefinisikan di dashboard-charts.js)
    // updateCashFlowChart(data);

    // Karena kita tidak mengimpor fungsi ini secara langsung, kita akan memicu event
    const event = new CustomEvent('update-charts', { detail: data });
    document.dispatchEvent(event);
}