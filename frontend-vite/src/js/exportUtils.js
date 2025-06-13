/**
 * exportUtils.js
 * 
 * Utility functions for exporting data from SmartSaku application
 * Supports exports to CSV, Excel and PDF formats
 */

/**
 * Formats a date object to Indonesian date format (DD/MM/YYYY)
 * @param {Date} date - Date object to format
 * @returns {string} - Formatted date string
 */
export function formatDateForExport(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

/**
 * Formats a number as Indonesian Rupiah
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Exports transaction data to CSV format
 * @param {Array} transactions - Array of transaction objects
 * @param {string} filename - Name for the downloaded file
 */
export function exportToCSV(transactions, filename = 'transaksi-smartsaku') {
    if (!transactions || !transactions.length) {
        console.error('No transactions to export');
        return;
    }

    // Prepare CSV headers
    const headers = ['Tanggal', 'Kategori', 'Jenis', 'Deskripsi', 'Nominal'];

    // Convert transactions to CSV rows
    const rows = transactions.map(transaction => [
        formatDateForExport(transaction.date),
        transaction.kategori,
        transaction.jenis === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran',
        transaction.deskripsi || '-',
        transaction.nominal
    ]);

    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    // Set download attributes
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${formatDateForExport(new Date())}.csv`);
    link.style.visibility = 'hidden';

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Exports transaction data to Excel format
 * Requires the SheetJS library (xlsx)
 * @param {Array} transactions - Array of transaction objects
 * @param {string} filename - Name for the downloaded file
 */
export async function exportToExcel(transactions, filename = 'transaksi-smartsaku') {
    if (!transactions || !transactions.length) {
        console.error('No transactions to export');
        return;
    }

    try {
        // Dynamically import SheetJS
        const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.19.3/package/xlsx.mjs');

        // Prepare data for Excel
        const excelData = transactions.map(transaction => ({
            'Tanggal': formatDateForExport(transaction.date),
            'Kategori': transaction.kategori,
            'Jenis': transaction.jenis === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran',
            'Deskripsi': transaction.deskripsi || '-',
            'Nominal': transaction.nominal
        }));

        // Create workbook and worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Transaksi');

        // Generate Excel file and trigger download
        XLSX.writeFile(workbook, `${filename}_${formatDateForExport(new Date())}.xlsx`);
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        alert('Gagal mengekspor ke Excel. Pastikan koneksi internet Anda aktif.');
    }
}

/**
 * Exports transaction data to PDF format
 * Requires the jsPDF library
 * @param {Array} transactions - Array of transaction objects
 * @param {string} filename - Name for the downloaded file
 */
export async function exportToPDF(transactions, filename = 'transaksi-smartsaku') {
    if (!transactions || !transactions.length) {
        console.error('No transactions to export');
        return;
    }

    try {
        // Dynamically import jsPDF and autotable plugin
        const { jsPDF } = await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.29/jspdf.plugin.autotable.min.js');

        // Initialize PDF document
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.text('Laporan Transaksi SmartSaku', 14, 22);
        doc.setFontSize(11);
        doc.text(`Diekspor pada: ${formatDateForExport(new Date())}`, 14, 30);

        // Prepare table data
        const tableColumn = ['Tanggal', 'Kategori', 'Jenis', 'Deskripsi', 'Nominal'];
        const tableRows = transactions.map(transaction => [
            formatDateForExport(transaction.date),
            transaction.kategori,
            transaction.jenis === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran',
            transaction.deskripsi || '-',
            formatCurrency(transaction.nominal)
        ]);

        // Generate table
        doc.autoTable({
            startY: 35,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: {
                fillColor: [79, 70, 229], // Indigo color to match the app's theme
                textColor: 255
            },
            styles: {
                cellWidth: 'wrap',
                fontSize: 10
            }
        });

        // Add summary
        const totalPemasukan = transactions
            .filter(t => t.jenis === 'pemasukan')
            .reduce((sum, t) => sum + t.nominal, 0);

        const totalPengeluaran = transactions
            .filter(t => t.jenis === 'pengeluaran')
            .reduce((sum, t) => sum + t.nominal, 0);

        const finalY = doc.lastAutoTable.finalY + 10;
        doc.text(`Total Pemasukan: ${formatCurrency(totalPemasukan)}`, 14, finalY);
        doc.text(`Total Pengeluaran: ${formatCurrency(totalPengeluaran)}`, 14, finalY + 7);
        doc.text(`Saldo: ${formatCurrency(totalPemasukan - totalPengeluaran)}`, 14, finalY + 14);

        // Save PDF file
        doc.save(`${filename}_${formatDateForExport(new Date())}.pdf`);
    } catch (error) {
        console.error('Error exporting to PDF:', error);
        alert('Gagal mengekspor ke PDF. Pastikan koneksi internet Anda aktif.');
    }
}

/**
 * Creates a filtered export for a specific date range
 * @param {Array} transactions - Array of transaction objects
 * @param {Date} startDate - Start date for filtering
 * @param {Date} endDate - End date for filtering
 * @param {string} format - Export format ('csv', 'excel', or 'pdf')
 * @param {string} filename - Base filename for export
 */
export function exportFilteredData(transactions, startDate, endDate, format = 'csv', filename = 'transaksi-smartsaku') {
    // Filter transactions by date range
    const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= endDate;
    });

    if (!filteredTransactions.length) {
        alert('Tidak ada transaksi dalam rentang tanggal yang dipilih.');
        return;
    }

    // Generate filename with date range
    const rangedFilename = `${filename}_${formatDateForExport(startDate)}_to_${formatDateForExport(endDate)}`;

    // Export based on selected format
    switch (format.toLowerCase()) {
        case 'csv':
            exportToCSV(filteredTransactions, rangedFilename);
            break;
        case 'excel':
            exportToExcel(filteredTransactions, rangedFilename);
            break;
        case 'pdf':
            exportToPDF(filteredTransactions, rangedFilename);
            break;
        default:
            exportToCSV(filteredTransactions, rangedFilename);
    }
}

/**
 * Generates a summary report of transactions grouped by category
 * @param {Array} transactions - Array of transaction objects
 * @param {string} format - Export format ('csv', 'excel', or 'pdf')
 */
export function exportCategorySummary(transactions, format = 'pdf') {
    if (!transactions || !transactions.length) {
        console.error('No transactions to export');
        return;
    }

    // Group transactions by category
    const categorySummary = transactions.reduce((acc, transaction) => {
        const category = transaction.kategori;
        const type = transaction.jenis;

        if (!acc[category]) {
            acc[category] = { pemasukan: 0, pengeluaran: 0 };
        }

        acc[category][type] += transaction.nominal;
        return acc;
    }, {});

    // Convert to array for export
    const summaryData = Object.entries(categorySummary).map(([category, data]) => ({
        'Kategori': category,
        'Total Pemasukan': data.pemasukan,
        'Total Pengeluaran': data.pengeluaran,
        'Selisih': data.pemasukan - data.pengeluaran
    }));

    // Prepare filename
    const filename = `ringkasan-kategori-smartsaku_${formatDateForExport(new Date())}`;

    // Export based on selected format
    if (format === 'csv') {
        // Implement CSV export for summary
        const headers = ['Kategori', 'Total Pemasukan', 'Total Pengeluaran', 'Selisih'];
        const rows = summaryData.map(item => [
            item.Kategori,
            item['Total Pemasukan'],
            item['Total Pengeluaran'],
            item.Selisih
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
    } else {
        // For other formats, call the corresponding export function
        switch (format) {
            case 'excel':
                exportSummaryToExcel(summaryData, filename);
                break;
            case 'pdf':
            default:
                exportSummaryToPDF(summaryData, filename);
                break;
        }
    }
}

/**
 * Helper function to export category summary to Excel
 * @param {Array} summaryData - Processed category summary data
 * @param {string} filename - Name for the file
 */
async function exportSummaryToExcel(summaryData, filename) {
    try {
        const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.19.3/package/xlsx.mjs');

        // Create workbook and worksheet
        const worksheet = XLSX.utils.json_to_sheet(summaryData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Ringkasan Kategori');

        // Generate Excel file and trigger download
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    } catch (error) {
        console.error('Error exporting summary to Excel:', error);
        alert('Gagal mengekspor ringkasan ke Excel. Pastikan koneksi internet Anda aktif.');
    }
}

/**
 * Helper function to export category summary to PDF
 * @param {Array} summaryData - Processed category summary data
 * @param {string} filename - Name for the file
 */
async function exportSummaryToPDF(summaryData, filename) {
    try {
        // Dynamically import jsPDF and autotable plugin
        const { jsPDF } = await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.29/jspdf.plugin.autotable.min.js');

        // Initialize PDF document
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.text('Ringkasan Transaksi per Kategori', 14, 22);
        doc.setFontSize(11);
        doc.text(`Diekspor pada: ${formatDateForExport(new Date())}`, 14, 30);

        // Convert data for autotable
        const tableColumn = ['Kategori', 'Total Pemasukan', 'Total Pengeluaran', 'Selisih'];
        const tableRows = summaryData.map(item => [
            item.Kategori,
            formatCurrency(item['Total Pemasukan']),
            formatCurrency(item['Total Pengeluaran']),
            formatCurrency(item.Selisih)
        ]);

        // Generate table
        doc.autoTable({
            startY: 35,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: {
                fillColor: [79, 70, 229], // Indigo color to match the app's theme
                textColor: 255
            }
        });

        // Calculate totals
        const totalPemasukan = summaryData.reduce((sum, item) => sum + item['Total Pemasukan'], 0);
        const totalPengeluaran = summaryData.reduce((sum, item) => sum + item['Total Pengeluaran'], 0);
        const totalSelisih = totalPemasukan - totalPengeluaran;

        // Add summary
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.text(`Total Keseluruhan Pemasukan: ${formatCurrency(totalPemasukan)}`, 14, finalY);
        doc.text(`Total Keseluruhan Pengeluaran: ${formatCurrency(totalPengeluaran)}`, 14, finalY + 7);
        doc.text(`Saldo: ${formatCurrency(totalSelisih)}`, 14, finalY + 14);

        // Save PDF file
        doc.save(`${filename}.pdf`);
    } catch (error) {
        console.error('Error exporting summary to PDF:', error);
        alert('Gagal mengekspor ringkasan ke PDF. Pastikan koneksi internet Anda aktif.');
    }
}