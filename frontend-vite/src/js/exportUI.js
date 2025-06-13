/**
 * exportUI.js
 * 
 * UI components and handlers for data export functionality in SmartSaku
 */

import { generateMonthlyReport, generateYearlyReport, generateCategoryAnalysisReport, generateCustomRangeReport, generateCashFlowReport } from './reportGenerator.js';

/**
 * Initialize export UI elements and attach event handlers
 * @param {Object} controller - Main application controller
 */
export function initExportUI(controller) {
    // Get the transactions data from the controller
    const transactions = [...controller.dataTransaksi.pemasukan.map(t => ({ ...t, jenis: 'pemasukan' })),
    ...controller.dataTransaksi.pengeluaran.map(t => ({ ...t, jenis: 'pengeluaran' }))];

    // Attach event listeners to export buttons
    attachExportEventListeners(transactions);

    // Set up date pickers and other form elements
    setupDatePickers();
    setupExportFormatSelectors();
}

/**
 * Attach event listeners to export action buttons
 * @param {Array} transactions - Combined transactions data
 */
function attachExportEventListeners(transactions) {
    // Monthly report button
    const btnMonthlyReport = document.getElementById('btnMonthlyReport');
    if (btnMonthlyReport) {
        btnMonthlyReport.addEventListener('click', () => {
            const month = parseInt(document.getElementById('exportMonth').value);
            const year = parseInt(document.getElementById('exportYear').value);
            const format = document.querySelector('input[name="exportFormatMonthly"]:checked').value;

            generateMonthlyReport(transactions, month, year, format);
        });
    }

    // Yearly report button
    const btnYearlyReport = document.getElementById('btnYearlyReport');
    if (btnYearlyReport) {
        btnYearlyReport.addEventListener('click', () => {
            const year = parseInt(document.getElementById('exportYearOnly').value);
            const format = document.querySelector('input[name="exportFormatYearly"]:checked').value;

            generateYearlyReport(transactions, year, format);
        });
    }

    // Category analysis button
    const btnCategoryAnalysis = document.getElementById('btnCategoryAnalysis');
    if (btnCategoryAnalysis) {
        btnCategoryAnalysis.addEventListener('click', () => {
            const format = document.querySelector('input[name="exportFormatCategory"]:checked').value;

            generateCategoryAnalysisReport(transactions, format);
        });
    }

    // Custom date range button
    const btnCustomRangeReport = document.getElementById('btnCustomRangeReport');
    if (btnCustomRangeReport) {
        btnCustomRangeReport.addEventListener('click', () => {
            const startDate = new Date(document.getElementById('exportStartDate').value);
            const endDate = new Date(document.getElementById('exportEndDate').value);
            const format = document.querySelector('input[name="exportFormatCustom"]:checked').value;

            generateCustomRangeReport(transactions, startDate, endDate, format);
        });
    }

    // Cash flow report button
    const btnCashFlowReport = document.getElementById('btnCashFlowReport');
    if (btnCashFlowReport) {
        btnCashFlowReport.addEventListener('click', () => {
            const startDate = new Date(document.getElementById('cashFlowStartDate').value);
            const endDate = new Date(document.getElementById('cashFlowEndDate').value);
            const groupBy = document.getElementById('cashFlowGroupBy').value;
            const format = document.querySelector('input[name="exportFormatCashFlow"]:checked').value;

            generateCashFlowReport(transactions, startDate, endDate, groupBy, format);
        });
    }
}

/**
 * Set up date picker elements with defaults
 */
function setupDatePickers() {
    // Get current date
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-based

    // Set defaults for export month and year
    const exportMonth = document.getElementById('exportMonth');
    const exportYear = document.getElementById('exportYear');

    if (exportMonth) {
        exportMonth.value = currentMonth;
    }

    if (exportYear) {
        exportYear.value = currentYear;

        // Populate year options (last 5 years)
        for (let i = currentYear - 5; i <= currentYear; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;

            if (i === currentYear) {
                option.selected = true;
            }

            exportYear.appendChild(option);
        }
    }

    // Set up yearly export year selector
    const exportYearOnly = document.getElementById('exportYearOnly');
    if (exportYearOnly) {
        exportYearOnly.value = currentYear;

        // Populate year options (last 5 years)
        for (let i = currentYear - 5; i <= currentYear; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;

            if (i === currentYear) {
                option.selected = true;
            }

            exportYearOnly.appendChild(option);
        }
    }

    // Set up date range pickers
    const exportStartDate = document.getElementById('exportStartDate');
    const exportEndDate = document.getElementById('exportEndDate');

    if (exportStartDate && exportEndDate) {
        // Set default to first day of current month
        const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonth, 0);

        exportStartDate.valueAsDate = firstDayOfMonth;
        exportEndDate.valueAsDate = lastDayOfMonth;
    }

    // Set up cash flow date range pickers
    const cashFlowStartDate = document.getElementById('cashFlowStartDate');
    const cashFlowEndDate = document.getElementById('cashFlowEndDate');

    if (cashFlowStartDate && cashFlowEndDate) {
        // Set default to first day of year to today
        const firstDayOfYear = new Date(currentYear, 0, 1);

        cashFlowStartDate.valueAsDate = firstDayOfYear;
        cashFlowEndDate.valueAsDate = now;
    }
}

/**
 * Set up the export format radio buttons
 */
function setupExportFormatSelectors() {
    // Set PDF as default option for all format selectors
    const formatSelectorGroups = [
        'exportFormatMonthly',
        'exportFormatYearly',
        'exportFormatCategory',
        'exportFormatCustom',
        'exportFormatCashFlow'
    ];

    formatSelectorGroups.forEach(groupName => {
        const pdfOption = document.querySelector(`input[name="${groupName}"][value="pdf"]`);
        if (pdfOption) {
            pdfOption.checked = true;
        }
    });
}

/**
 * Create and insert the export UI into the reports section
 * This function dynamically creates the UI if it doesn't already exist
 */
export function createExportUI() {
    const laporanSection = document.getElementById('laporanSection');

    if (!laporanSection) {
        console.error('Laporan section not found');
        return;
    }

    // Check if the export UI already exists
    if (document.getElementById('exportUIContainer')) {
        return; // Already created
    }

    // Create the export UI container
    const exportUIContainer = document.createElement('div');
    exportUIContainer.id = 'exportUIContainer';
    exportUIContainer.className = 'mt-6';

    // Build the HTML for the export UI
    exportUIContainer.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Monthly Report Export -->
      <div class="bg-white p-6 rounded-xl shadow-sm">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Laporan Bulanan</h3>
        
        <form class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
              <select id="exportMonth" class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                <option value="1">Januari</option>
                <option value="2">Februari</option>
                <option value="3">Maret</option>
                <option value="4">April</option>
                <option value="5">Mei</option>
                <option value="6">Juni</option>
                <option value="7">Juli</option>
                <option value="8">Agustus</option>
                <option value="9">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
              <select id="exportYear" class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                <!-- Will be populated by JavaScript -->
              </select>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <div class="flex space-x-4">
              <label class="inline-flex items-center">
                <input type="radio" name="exportFormatMonthly" value="pdf" class="form-radio h-4 w-4 text-primary">
                <span class="ml-2 text-sm text-gray-700">PDF</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" name="exportFormatMonthly" value="excel" class="form-radio h-4 w-4 text-primary">
                <span class="ml-2 text-sm text-gray-700">Excel</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" name="exportFormatMonthly" value="csv" class="form-radio h-4 w-4 text-primary">
                <span class="ml-2 text-sm text-gray-700">CSV</span>
              </label>
            </div>
          </div>
          
          <div class="pt-2">
            <button 
              type="button" 
              id="btnMonthlyReport"
              class="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 text-white p-2 rounded-md hover:shadow-lg transition-all duration-300 focus:outline-none"
            >
              Download Laporan Bulanan
            </button>
          </div>
        </form>
      </div>
      
      <!-- Yearly Report Export -->
      <div class="bg-white p-6 rounded-xl shadow-sm">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Laporan Tahunan</h3>
        
        <form class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
            <select id="exportYearOnly" class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
              <!-- Will be populated by JavaScript -->
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <div class="flex space-x-4">
              <label class="inline-flex items-center">
                <input type="radio" name="exportFormatYearly" value="pdf" class="form-radio h-4 w-4 text-primary">
                <span class="ml-2 text-sm text-gray-700">PDF</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" name="exportFormatYearly" value="excel" class="form-radio h-4 w-4 text-primary">
                <span class="ml-2 text-sm text-gray-700">Excel</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" name="exportFormatYearly" value="csv" class="form-radio h-4 w-4 text-primary">
                <span class="ml-2 text-sm text-gray-700">CSV</span>
              </label>
            </div>
          </div>
          
          <div class="pt-2">
            <button 
              type="button" 
              id="btnYearlyReport"
              class="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 text-white p-2 rounded-md hover:shadow-lg transition-all duration-300 focus:outline-none"
            >
              Download Laporan Tahunan
            </button>
          </div>
        </form>
      </div>
      
      <!-- Category Analysis Export -->
      <div class="bg-white p-6 rounded-xl shadow-sm">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Analisis Kategori</h3>
        
        <form class="space-y-4">
          <div>
            <p class="text-sm text-gray-600 mb-4">
              Laporan ini akan menampilkan ringkasan pengeluaran dan pemasukan berdasarkan kategori untuk membantu Anda menganalisis pola keuangan.
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <div class="flex space-x-4">
              <label class="inline-flex items-center">
                <input type="radio" name="exportFormatCategory" value="pdf" class="form-radio h-4 w-4 text-primary">
                <span class="ml-2 text-sm text-gray-700">PDF</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" name="exportFormatCategory" value="excel" class="form-radio h-4 w-4 text-primary">
                <span class="ml-2 text-sm text-gray-700">Excel</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" name="exportFormatCategory" value="csv" class="form-radio h-4 w-4 text-primary">
                <span class="ml-2 text-sm text-gray-700">CSV</span>
              </label>
            </div>
          </div>
          
          <div class="pt-2">
            <button 
              type="button" 
              id="btnCategoryAnalysis"
              class="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 text-white p-2 rounded-md hover:shadow-lg transition-all duration-300 focus:outline-none"
            >
              Download Analisis Kategori
            </button>
          </div>
        </form>
      </div>
      
      <!-- Custom Date Range Export -->
      <div class="bg-white p-6 rounded-xl shadow-sm">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Laporan Rentang Waktu Kustom</h3>
        
        <form class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
              <input 
                type="date" 
                id="exportStartDate" 
                class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
              <input 
                type="date" 
                id="exportEndDate" 
                class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <div class="flex space-x-4">
              <label class="inline-flex items-center">
                <input type="radio" name="exportFormatCustom" value="pdf" class="form-radio h-4 w-4 text-primary">
                <span class="ml-2 text-sm text-gray-700">PDF</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" name="exportFormatCustom" value="excel" class="form-radio h-4 w-4 text-primary">
                <span class="ml-2 text-sm text-gray-700">Excel</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" name="exportFormatCustom" value="csv" class="form-radio h-4 w-4 text-primary">
                <span class="ml-2 text-sm text-gray-700">CSV</span>
              </label>
            </div>
          </div>
          
          <div class="pt-2">
            <button 
              type="button" 
              id="btnCustomRangeReport"
              class="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 text-white p-2 rounded-md hover:shadow-lg transition-all duration-300 focus:outline-none"
            >
              Download Laporan Kustom
            </button>
          </div>
        </form>
      </div>
      
      <!-- Cash Flow Analysis -->
      <div class="bg-white p-6 rounded-xl shadow-sm">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Laporan Arus Kas</h3>
        
        <form class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
              <input 
                type="date" 
                id="cashFlowStartDate" 
                class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
              <input 
                type="date" 
                id="cashFlowEndDate" 
                class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kelompokkan Berdasarkan</label>
            <select id="cashFlowGroupBy" class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
              <option value="day">Harian</option>
              <option value="week">Mingguan</option>
              <option value="month" selected>Bulanan</option>
              <option value="year">Tahunan</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <div class="flex space-x-4">
              <label class="inline-flex items-center">
                <input type="radio" name="exportFormatCashFlow" value="pdf" class="form-radio h-4 w-4 text-primary">
                <span class="ml-2 text-sm text-gray-700">PDF</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" name="exportFormatCashFlow" value="excel" class="form-radio h-4 w-4 text-primary">
                <span class="ml-2 text-sm text-gray-700">Excel</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" name="exportFormatCashFlow" value="csv" class="form-radio h-4 w-4 text-primary">
                <span class="ml-2 text-sm text-gray-700">CSV</span>
              </label>
            </div>
          </div>
          
          <div class="pt-2">
            <button 
              type="button" 
              id="btnCashFlowReport"
              class="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 text-white p-2 rounded-md hover:shadow-lg transition-all duration-300 focus:outline-none"
            >
              Download Laporan Arus Kas
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

    // Insert into the laporan section
    // Find the existing content in the laporan section
    const existingContent = laporanSection.querySelector('.bg-white');

    if (existingContent) {
        // Replace the "under development" message with our export UI
        existingContent.innerHTML = `
      <div class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Laporan Keuangan
        </h3>
        <p class="text-gray-600 mb-6">
          Pilih salah satu jenis laporan di bawah ini untuk mengekspor data transaksi Anda.
        </p>
        ${exportUIContainer.outerHTML}
      </div>
    `;
    } else {
        // If we can't find the existing content wrapper, append to the section itself
        laporanSection.appendChild(exportUIContainer);
    }
}