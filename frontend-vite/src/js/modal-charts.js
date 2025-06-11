/**
 * modal-charts.js
 * Handles charts in modal windows
 */

import Chart from 'chart.js/auto';

/**
 * Initialize chart for report modal
 */
export function initReportMonthlyChart() {
    const ctx = document.getElementById('reportMonthlyChart');
    if (!ctx) return;

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Januari', 'Februari', 'Maret', 'April', 'Mei'],
            datasets: [
                {
                    label: 'Pemasukan',
                    data: [1200000, 1300000, 1250000, 1400000, 1450000],
                    backgroundColor: '#4F46E5',
                    borderColor: '#4F46E5',
                    borderWidth: 1
                },
                {
                    label: 'Pengeluaran',
                    data: [800000, 950000, 900000, 880000, 850000],
                    backgroundColor: '#EF4444',
                    borderColor: '#EF4444',
                    borderWidth: 1
                },
                {
                    label: 'Tabungan',
                    data: [400000, 350000, 350000, 520000, 600000],
                    backgroundColor: '#10B981',
                    borderColor: '#10B981',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return 'Rp' + value / 1000 + 'k';
                        }
                    }
                }
            }
        }
    });

    return chart;
}

/**
 * Initialize savings simulation calculator
 */
export function initSavingsSimulator() {
    const amountInput = document.getElementById('savingsAmount');
    const yearsInput = document.getElementById('savingsYears');
    const interestInput = document.getElementById('interestRate');

    if (!amountInput || !yearsInput || !interestInput) return;

    const updateResults = () => {
        const amount = parseFloat(amountInput.value) || 0;
        const years = parseInt(yearsInput.value) || 1;
        const interest = parseFloat(interestInput.value) || 0;

        // Show years value
        const yearsValue = document.querySelector('#savingsYears + div span:nth-child(2)');
        if (yearsValue) yearsValue.textContent = years;

        // Calculate savings
        const monthlyAmount = amount;
        const months = years * 12;
        const monthlyRate = interest / 100 / 12;

        let totalSavings = 0;
        let totalInterest = 0;

        // Calculate compound interest with monthly addition
        for (let i = 0; i < months; i++) {
            totalSavings += monthlyAmount;
            totalInterest += totalSavings * monthlyRate;
            totalSavings += totalSavings * monthlyRate;
        }

        // Update UI
        const totalSavingsEl = document.querySelector('.bg-white.rounded-xl.p-6.border.border-gray-200.flex.flex-col.justify-center .space-y-3 div:nth-child(1) span:nth-child(2)');
        const totalInterestEl = document.querySelector('.bg-white.rounded-xl.p-6.border.border-gray-200.flex.flex-col.justify-center .space-y-3 div:nth-child(2) span:nth-child(2)');
        const finalValueEl = document.querySelector('.bg-white.rounded-xl.p-6.border.border-gray-200.flex.flex-col.justify-center .space-y-3 div:nth-child(3) span:nth-child(2)');

        if (totalSavingsEl) totalSavingsEl.textContent = `Rp ${(monthlyAmount * months).toLocaleString('id')}`;
        if (totalInterestEl) totalInterestEl.textContent = `Rp ${Math.round(totalInterest).toLocaleString('id')}`;
        if (finalValueEl) finalValueEl.textContent = `Rp ${Math.round(totalSavings).toLocaleString('id')}`;
    };

    // Add event listeners
    amountInput.addEventListener('input', updateResults);
    yearsInput.addEventListener('input', updateResults);
    interestInput.addEventListener('input', updateResults);

    // Initial calculation
    updateResults();
}

/**
 * Initialize loan simulation calculator
 */
export function initLoanSimulator() {
    const amountInput = document.getElementById('loanAmount');
    const termInput = document.getElementById('loanTerm');
    const interestInput = document.getElementById('loanInterest');

    if (!amountInput || !termInput || !interestInput) return;

    const updateResults = () => {
        const amount = parseFloat(amountInput.value) || 0;
        const term = parseInt(termInput.value) || 12;
        const interest = parseFloat(interestInput.value) || 0;

        // Show term value
        const termValue = document.querySelector('#loanTerm + div span:nth-child(2)');
        if (termValue) termValue.textContent = term;

        // Calculate loan
        const monthlyRate = interest / 100 / 12;
        const monthlyPayment = amount * monthlyRate * Math.pow(1 + monthlyRate, term) / (Math.pow(1 + monthlyRate, term) - 1);
        const totalPayment = monthlyPayment * term;
        const totalInterest = totalPayment - amount;

        // Update UI
        const monthlyPaymentEl = document.querySelector('.bg-white.rounded-xl.p-6.border.border-gray-200.flex.flex-col.justify-center .space-y-3 div:nth-child(1) span:nth-child(2)');
        const totalInterestEl = document.querySelector('.bg-white.rounded-xl.p-6.border.border-gray-200.flex.flex-col.justify-center .space-y-3 div:nth-child(2) span:nth-child(2)');
        const totalPaymentEl = document.querySelector('.bg-white.rounded-xl.p-6.border.border-gray-200.flex.flex-col.justify-center .space-y-3 div:nth-child(3) span:nth-child(2)');

        if (monthlyPaymentEl) monthlyPaymentEl.textContent = `Rp ${Math.round(monthlyPayment).toLocaleString('id')}`;
        if (totalInterestEl) totalInterestEl.textContent = `Rp ${Math.round(totalInterest).toLocaleString('id')}`;
        if (totalPaymentEl) totalPaymentEl.textContent = `Rp ${Math.round(totalPayment).toLocaleString('id')}`;
    };

    // Add event listeners
    amountInput.addEventListener('input', updateResults);
    termInput.addEventListener('input', updateResults);
    interestInput.addEventListener('input', updateResults);

    // Initial calculation
    updateResults();
}

/**
 * Initialize all modal functionality
 */
export function initModalCharts() {
    // Setup event listeners for modal opens
    document.getElementById('sidebarReportBtn')?.addEventListener('click', () => {
        setTimeout(() => {
            initReportMonthlyChart();
        }, 300); // Small delay to ensure DOM is ready
    });

    document.getElementById('sidebarSimulationBtn')?.addEventListener('click', () => {
        setTimeout(() => {
            initSavingsSimulator();
            initLoanSimulator();
        }, 300); // Small delay to ensure DOM is ready
    });
}
