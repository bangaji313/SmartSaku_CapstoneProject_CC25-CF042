/**
 * reportGenerator.js
 * 
 * Functions for generating financial reports in SmartSaku application
 * Leverages exportUtils.js for actual data export functionality
 */

import {
    exportToCSV,
    exportToExcel,
    exportToPDF,
    exportFilteredData,
    exportCategorySummary
} from './exportUtils.js';

/**
 * Generates a monthly transaction report
 * @param {Array} transactions - All transactions data
 * @param {number} month - Month number (1-12)
 * @param {number} year - Year number (e.g., 2023)
 * @param {string} format - Export format (csv, excel, pdf)
 */
export function generateMonthlyReport(transactions, month, year, format = 'pdf') {
    if (!transactions || !transactions.length) {
        alert('Tidak ada data transaksi untuk dibuat laporannya.');
        return;
    }

    // Create date range for the specified month
    const startDate = new Date(year, month - 1, 1); // Month is 0-indexed in Date
    const endDate = new Date(year, month, 0); // Last day of the month

    // Get month name in Indonesian
    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    // Create appropriate filename
    const filename = `laporan-bulanan-${monthNames[month - 1]}-${year}`;

    // Use exportFilteredData to handle the actual export
    exportFilteredData(
        transactions,
        startDate,
        endDate,
        format,
        filename
    );
}

/**
 * Generates a yearly transaction report
 * @param {Array} transactions - All transactions data
 * @param {number} year - Year number (e.g., 2023)
 * @param {string} format - Export format (csv, excel, pdf)
 */
export function generateYearlyReport(transactions, year, format = 'pdf') {
    if (!transactions || !transactions.length) {
        alert('Tidak ada data transaksi untuk dibuat laporannya.');
        return;
    }

    // Create date range for the specified year
    const startDate = new Date(year, 0, 1); // January 1st
    const endDate = new Date(year, 11, 31); // December 31st

    // Create appropriate filename
    const filename = `laporan-tahunan-${year}`;

    // Use exportFilteredData to handle the actual export
    exportFilteredData(
        transactions,
        startDate,
        endDate,
        format,
        filename
    );
}

/**
 * Generates a category-wise spending analysis report
 * @param {Array} transactions - All transactions data
 * @param {string} format - Export format (csv, excel, pdf)
 */
export function generateCategoryAnalysisReport(transactions, format = 'pdf') {
    exportCategorySummary(transactions, format);
}

/**
 * Generates a custom date range report
 * @param {Array} transactions - All transactions data
 * @param {Date} startDate - Start date for the report
 * @param {Date} endDate - End date for the report
 * @param {string} format - Export format (csv, excel, pdf)
 */
export function generateCustomRangeReport(transactions, startDate, endDate, format = 'pdf') {
    if (!startDate || !endDate || startDate > endDate) {
        alert('Rentang tanggal tidak valid. Pastikan tanggal mulai tidak lebih besar dari tanggal akhir.');
        return;
    }

    // Create appropriate filename
    const filename = `laporan-kustom`;

    // Use exportFilteredData to handle the actual export
    exportFilteredData(
        transactions,
        startDate,
        endDate,
        format,
        filename
    );
}

/**
 * Generates a cash flow summary report showing income vs expenses over time
 * @param {Array} transactions - All transactions data
 * @param {Date} startDate - Start date for the report
 * @param {Date} endDate - End date for the report
 * @param {string} groupBy - Group by 'day', 'week', 'month', or 'year'
 * @param {string} format - Export format (csv, excel, pdf)
 */
export async function generateCashFlowReport(transactions, startDate, endDate, groupBy = 'month', format = 'pdf') {
    if (!transactions || !transactions.length) {
        alert('Tidak ada data transaksi untuk dibuat laporannya.');
        return;
    }

    // Filter transactions to the date range
    const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= endDate;
    });

    if (!filteredTransactions.length) {
        alert('Tidak ada transaksi dalam rentang tanggal yang dipilih.');
        return;
    }

    // Group transactions by the specified time unit
    const groupedData = groupTransactionsByTimeUnit(filteredTransactions, groupBy);

    // Format data for export
    const reportData = Object.entries(groupedData).map(([period, data]) => ({
        'Periode': period,
        'Total Pemasukan': data.pemasukan,
        'Total Pengeluaran': data.pengeluaran,
        'Arus Kas': data.pemasukan - data.pengeluaran
    }));

    // Export based on specified format
    const filename = `arus-kas-${groupBy}`;

    switch (format.toLowerCase()) {
        case 'csv':
            exportCashFlowToCSV(reportData, filename);
            break;
        case 'excel':
            await exportCashFlowToExcel(reportData, filename);
            break;
        case 'pdf':
        default:
            await exportCashFlowToPDF(reportData, filename, startDate, endDate, groupBy);
            break;
    }
}

/**
 * Helper function to group transactions by time unit
 * @param {Array} transactions - Transaction data
 * @param {string} timeUnit - 'day', 'week', 'month', or 'year'
 * @returns {Object} Grouped transactions data
 */
function groupTransactionsByTimeUnit(transactions, timeUnit) {
    return transactions.reduce((acc, transaction) => {
        const date = new Date(transaction.date);
        let period;

        switch (timeUnit) {
            case 'day':
                period = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                break;
            case 'week':
                // Calculate the week number in the year
                const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
                const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
                const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
                period = `Minggu ${weekNum}, ${date.getFullYear()}`;
                break;
            case 'year':
                period = date.getFullYear().toString();
                break;
            case 'month':
            default:
                const monthNames = [
                    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
                ];
                period = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                break;
        }

        if (!acc[period]) {
            acc[period] = { pemasukan: 0, pengeluaran: 0 };
        }

        if (transaction.jenis === 'pemasukan') {
            acc[period].pemasukan += transaction.nominal;
        } else {
            acc[period].pengeluaran += transaction.nominal;
        }

        return acc;
    }, {});
}

/**
 * Helper function to export cash flow data to CSV
 * @param {Array} reportData - Processed cash flow data
 * @param {string} filename - Name for the file
 */
function exportCashFlowToCSV(reportData, filename) {
    const headers = ['Periode', 'Total Pemasukan', 'Total Pengeluaran', 'Arus Kas'];

    const rows = reportData.map(item => [
        item.Periode,
        item['Total Pemasukan'],
        item['Total Pengeluaran'],
        item['Arus Kas']
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Helper function to export cash flow data to Excel
 * @param {Array} reportData - Processed cash flow data
 * @param {string} filename - Name for the file
 */
async function exportCashFlowToExcel(reportData, filename) {
    try {
        const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.19.3/package/xlsx.mjs');

        // Create workbook and worksheet
        const worksheet = XLSX.utils.json_to_sheet(reportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Arus Kas');

        // Generate Excel file and trigger download
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        alert('Gagal mengekspor ke Excel. Pastikan koneksi internet Anda aktif.');
    }
}

/**
 * Helper function to export cash flow data to PDF with chart visualization
 * @param {Array} reportData - Processed cash flow data
 * @param {string} filename - Name for the file
 * @param {Date} startDate - Start date of the report
 * @param {Date} endDate - End date of the report
 * @param {string} groupBy - Grouping method used
 */
async function exportCashFlowToPDF(reportData, filename, startDate, endDate, groupBy) {
    try {
        // Import required libraries
        const { jsPDF } = await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.29/jspdf.plugin.autotable.min.js');

        // Format dates for display
        const formatDate = (date) => {
            return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        };

        // Initialize PDF document
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.text('Laporan Arus Kas', 14, 22);

        // Add subtitle with date range
        doc.setFontSize(11);
        doc.text(`Periode: ${formatDate(startDate)} - ${formatDate(endDate)}`, 14, 30);
        doc.text(`Dikelompokkan berdasarkan: ${getGroupByLabel(groupBy)}`, 14, 36);

        // Create data for table
        const tableColumn = ['Periode', 'Total Pemasukan', 'Total Pengeluaran', 'Arus Kas'];
        const tableRows = reportData.map(item => [
            item.Periode,
            formatCurrency(item['Total Pemasukan']),
            formatCurrency(item['Total Pengeluaran']),
            formatCurrency(item['Arus Kas'])
        ]);

        // Generate table
        doc.autoTable({
            startY: 42,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: {
                fillColor: [79, 70, 229],
                textColor: 255
            }
        });

        // Calculate totals
        const totalIncome = reportData.reduce((sum, item) => sum + item['Total Pemasukan'], 0);
        const totalExpense = reportData.reduce((sum, item) => sum + item['Total Pengeluaran'], 0);
        const netCashFlow = totalIncome - totalExpense;

        // Add summary
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.text(`Total Pemasukan: ${formatCurrency(totalIncome)}`, 14, finalY);
        doc.text(`Total Pengeluaran: ${formatCurrency(totalExpense)}`, 14, finalY + 7);
        doc.text(`Arus Kas Bersih: ${formatCurrency(netCashFlow)}`, 14, finalY + 14);

        // Save PDF file
        doc.save(`${filename}.pdf`);
    } catch (error) {
        console.error('Error exporting to PDF:', error);
        alert('Gagal mengekspor ke PDF. Pastikan koneksi internet Anda aktif.');
    }
}

/**
 * Get a readable label for the groupBy option
 * @param {string} groupBy - Grouping method
 * @returns {string} Human-readable grouping label
 */
function getGroupByLabel(groupBy) {
    switch (groupBy) {
        case 'day': return 'Harian';
        case 'week': return 'Mingguan';
        case 'month': return 'Bulanan';
        case 'year': return 'Tahunan';
        default: return 'Periode';
    }
}

/**
 * Format a number as Indonesian Rupiah
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}