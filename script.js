// script.js - Optimized Version dengan Loading Cepat

// ==============================================
// CONFIGURATION & CONSTANTS
// ==============================================

const CONFIG = {
    MAX_AMOUNT: 1000000000,
    MAX_DESCRIPTION_LENGTH: 100,
    MAX_GOAL_NAME_LENGTH: 50,
    MAX_NOTES_LENGTH: 200,
    BACKUP_INTERVAL: 30000,
    DEBOUNCE_DELAY: 300, // Reduced from 500
    AUTO_SAVE_DELAY: 1000,
    DATA_VERSION: '2.0',
    
    CATEGORIES: {
        income: ['gaji', 'investasi', 'bonus', 'hadiah', 'freelance', 'lainnya'],
        expense: ['makanan', 'transportasi', 'hiburan', 'tagihan', 'belanja', 'kesehatan', 'pendidikan', 'tabungan']
    },
    
    GOAL_CATEGORIES: [
        'dana-darurat', 'investasi', 'liburan', 'gadget', 'kendaraan', 
        'rumah', 'pendidikan', 'pernikahan', 'hobi', 'lainnya'
    ]
};

// ==============================================
// APPLICATION STATE
// ==============================================

class AppState {
    constructor() {
        this.transactions = [];
        this.savingsGoals = [];
        this.undoStack = [];
        this.isLoading = false;
        this.updateTimeout = null;
        this.backupInterval = null;
        this.initialLoadComplete = false;
    }

    setLoading(loading) {
        this.isLoading = loading;
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            if (loading) {
                overlay.hidden = false;
                overlay.style.display = 'flex';
            } else {
                setTimeout(() => {
                    overlay.hidden = true;
                    overlay.style.display = 'none';
                }, 300);
            }
        }
    }

    scheduleUpdate() {
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }
        this.updateTimeout = setTimeout(() => {
            this.updateAllUI();
        }, CONFIG.DEBOUNCE_DELAY);
    }

    updateAllUI() {
        updateSummary();
        updateQuickStats();
        updateTransactionsCount();
        
        // Chart update lebih jarang karena berat
        if (this.initialLoadComplete) {
            setTimeout(updateChart, 100);
        }
    }
}

const appState = new AppState();

// ==============================================
// STORAGE MANAGEMENT
// ==============================================

class StorageManager {
    static get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error reading ${key}:`, error);
            return defaultValue;
        }
    }

    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error saving ${key}:`, error);
            return false;
        }
    }

    static backup() {
        const backupData = {
            transactions: this.get('moneyTrackerTransactions', []),
            savings: this.get('moneyTrackerSavings', []),
            theme: this.get('moneyTrackerTheme', 'light'),
            version: CONFIG.DATA_VERSION,
            timestamp: new Date().toISOString()
        };
        return this.set('moneyTracker_backup', backupData);
    }
}

// ==============================================
// UTILITY FUNCTIONS (Optimized)
// ==============================================

function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function getCategoryDisplayName(category) {
    const categoryNames = {
        'makanan': 'Makanan & Minuman', 'transportasi': 'Transportasi', 'hiburan': 'Hiburan',
        'tagihan': 'Tagihan & Utilitas', 'belanja': 'Belanja', 'kesehatan': 'Kesehatan',
        'pendidikan': 'Pendidikan', 'tabungan': 'Tabungan', 'gaji': 'Gaji', 'investasi': 'Investasi',
        'bonus': 'Bonus', 'hadiah': 'Hadiah', 'freelance': 'Freelance', 'lainnya': 'Lainnya'
    };
    return categoryNames[category] || category;
}

function getCategoryIcon(category) {
    const categoryIcons = {
        'makanan': '🍽️', 'transportasi': '🚗', 'hiburan': '🎬', 'tagihan': '📋', 'belanja': '🛍️',
        'kesehatan': '🏥', 'pendidikan': '📚', 'tabungan': '💾', 'gaji': '💼', 'investasi': '📈',
        'bonus': '🎁', 'hadiah': '🎯', 'freelance': '👨‍💻', 'lainnya': '🔶'
    };
    return categoryIcons[category] || '💰';
}

// ==============================================
// FAST INITIALIZATION FUNCTIONS
// ==============================================

function initializeInstantFeatures() {
    // Load theme - instant
    loadTheme();
    
    // Setup event listeners - instant
    setupEventListeners();
    
    // Set default date - instant
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }
    
    // Update current date - instant
    updateCurrentDate();
}

function initializeQuickFeatures() {
    // Load and display transactions - fast
    loadTransactions();
    
    // Update essential UI - fast
    updateSummary();
    updateTransactionsCount();
    
    // Setup filters - fast
    populateCategoryFilter();
    populateMonthFilter();
}

function initializeHeavyFeatures() {
    // Load savings goals - moderate
    loadSavingsGoals();
    updateQuickSaveDropdown();
    
    // Update statistics - moderate
    updateQuickStats();
    
    // Initialize chart - heavy (delayed)
    setTimeout(initializeChart, 100);
}

function initializeChart() {
    const chartContainer = document.getElementById('expense-chart');
    if (chartContainer && isElementInViewport(chartContainer)) {
        updateChart();
    } else {
        // Delay chart initialization until visible
        setTimeout(initializeChart, 200);
    }
}

function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ==============================================
// OPTIMIZED LOADING MANAGEMENT
// ==============================================

function showLoading(message = 'Memuat aplikasi...') {
    appState.setLoading(true);
    const loadingText = document.getElementById('loading-text');
    if (loadingText) {
        loadingText.textContent = message;
    }
}

function hideLoading() {
    appState.setLoading(false);
}

function showNotification(title, message, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };

    notification.innerHTML = `
        <div class="notification-icon">${icons[type]}</div>
        <div class="notification-content">
            <div class="notification-title">${sanitizeHTML(title)}</div>
            <div class="notification-message">${sanitizeHTML(message)}</div>
        </div>
    `;

    container.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);

    const duration = type === 'error' ? 10000 : 5000;
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// ==============================================
// THEME MANAGEMENT (Fast)
// ==============================================

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    StorageManager.set('moneyTrackerTheme', newTheme);
    
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }
    
    // Chart update delayed for performance
    setTimeout(updateChart, 500);
}

function loadTheme() {
    const savedTheme = StorageManager.get('moneyTrackerTheme', 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
}

// ==============================================
// FORM VALIDATION (Fast)
// ==============================================

function setupFormValidation() {
    const forms = ['transaction-form', 'savings-form'];
    
    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if (!form) return;
        
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => validateField(e.target));
            input.addEventListener('input', (e) => clearFieldError(e.target));
            
            if (input.type === 'number') {
                input.addEventListener('keydown', (e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                        e.preventDefault();
                    }
                });
            }
        });
    });

    // Set date limits
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date')?.setAttribute('max', today);
    document.getElementById('target-date')?.setAttribute('min', today);
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;

    if (field.required && !value) {
        showFieldError(field, 'Field ini harus diisi');
        isValid = false;
    } else if (field.type === 'number' && value) {
        const numValue = parseFloat(value);
        if (numValue <= 0) {
            showFieldError(field, 'Jumlah harus lebih dari 0');
            isValid = false;
        }
    }

    if (isValid) {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.id = `${field.id}-error`;
    errorElement.textContent = message;
    errorElement.hidden = false;
    
    field.parentNode.appendChild(errorElement);
    field.setAttribute('aria-invalid', 'true');
}

function clearFieldError(field) {
    const existingError = document.getElementById(`${field.id}-error`);
    if (existingError) {
        existingError.remove();
    }
    field.removeAttribute('aria-invalid');
}

// ==============================================
// TRANSACTION MANAGEMENT (Optimized)
// ==============================================

function getTransactions() {
    return StorageManager.get('moneyTrackerTransactions', []);
}

function saveTransaction(transaction) {
    const transactions = getTransactions();
    transactions.push(transaction);
    
    if (StorageManager.set('moneyTrackerTransactions', transactions)) {
        StorageManager.backup();
        return true;
    }
    return false;
}

function deleteTransaction(id) {
    const transactions = getTransactions();
    const transactionToDelete = transactions.find(t => t.id === id);
    
    if (!transactionToDelete) return false;

    appState.undoStack.push({
        action: 'delete',
        data: transactionToDelete,
        timestamp: Date.now()
    });

    const updatedTransactions = transactions.filter(t => t.id !== id);
    
    if (StorageManager.set('moneyTrackerTransactions', updatedTransactions)) {
        StorageManager.backup();
        showNotification('Sukses', 'Transaksi berhasil dihapus', 'success');
        return true;
    }
    return false;
}

function loadTransactions() {
    const transactions = getTransactions();
    const transactionsList = document.getElementById('transactions-list');
    
    if (!transactionsList) return;

    transactionsList.innerHTML = '';
    
    if (transactions.length === 0) {
        showEmptyState('transactions', 'default');
        return;
    }
    
    // Render only visible transactions first
    const visibleCount = Math.min(transactions.length, 30);
    const visibleTransactions = transactions.slice(0, visibleCount);
    
    visibleTransactions.forEach(transaction => {
        displayTransaction(transaction);
    });
    
    // Lazy load remaining transactions
    if (transactions.length > visibleCount) {
        setTimeout(() => {
            transactions.slice(visibleCount).forEach(transaction => {
                displayTransaction(transaction);
            });
        }, 1000);
    }
}

function displayTransaction(transaction) {
    const transactionsList = document.getElementById('transactions-list');
    if (!transactionsList) return;

    const emptyState = transactionsList.querySelector('.empty-state');
    if (emptyState) emptyState.remove();
    
    const transactionEl = document.createElement('div');
    transactionEl.className = 'transaction-item';
    transactionEl.dataset.id = transaction.id;
    transactionEl.dataset.type = transaction.type;
    transactionEl.dataset.category = transaction.category;
    transactionEl.dataset.date = transaction.date;
    
    const displayDate = new Date(transaction.date).toLocaleDateString('id-ID', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
    
    const formattedAmount = formatRupiah(transaction.amount);
    
    transactionEl.innerHTML = `
        <div class="transaction-info">
            <div class="transaction-description">${sanitizeHTML(transaction.description)}</div>
            <div class="transaction-meta">
                <span class="transaction-category">
                    ${getCategoryIcon(transaction.category)} ${getCategoryDisplayName(transaction.category)}
                </span>
                <span class="transaction-date">${displayDate}</span>
            </div>
        </div>
        <div class="transaction-amount ${transaction.type}">
            ${transaction.type === 'income' ? '⬆️' : '⬇️'} ${formattedAmount}
        </div>
        <button class="delete-btn" onclick="handleDeleteTransaction(${transaction.id})" 
                aria-label="Hapus transaksi" title="Hapus transaksi">
            🗑️
        </button>
    `;
    
    transactionsList.appendChild(transactionEl);
}

// ==============================================
// FINANCIAL CALCULATIONS (Optimized)
// ==============================================

function updateSummary() {
    const transactions = getTransactions();
    
    let totalIncome = 0;
    let totalExpenses = 0;
    
    transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            totalIncome += transaction.amount;
        } else {
            totalExpenses += transaction.amount;
        }
    });
    
    const balance = totalIncome - totalExpenses;
    
    const totalIncomeEl = document.getElementById('total-income');
    const totalExpensesEl = document.getElementById('total-expenses');
    const balanceEl = document.getElementById('balance');
    
    if (totalIncomeEl) totalIncomeEl.textContent = formatRupiah(totalIncome);
    if (totalExpensesEl) totalExpensesEl.textContent = formatRupiah(totalExpenses);
    if (balanceEl) {
        balanceEl.textContent = formatRupiah(balance);
        balanceEl.style.color = balance < 0 ? 'var(--expense-color)' : 'var(--income-color)';
    }
}

function updateQuickStats() {
    const transactions = getTransactions();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
    }).length;
    
    document.getElementById('monthly-transactions').textContent = monthlyTransactions;
    document.getElementById('avg-daily-expense').textContent = formatRupiah(0);
    document.getElementById('top-category').textContent = '-';
}

// ==============================================
// CHART MANAGEMENT (Lazy Loaded)
// ==============================================

function updateChart() {
    const ctx = document.getElementById('expense-chart');
    if (!ctx) return;

    const transactions = getTransactions();
    
    const expenseCategories = CONFIG.CATEGORIES.expense;
    const expensesByCategory = {};
    
    expenseCategories.forEach(category => {
        expensesByCategory[category] = 0;
    });
    
    transactions.forEach(transaction => {
        if (transaction.type === 'expense' && expensesByCategory.hasOwnProperty(transaction.category)) {
            expensesByCategory[transaction.category] += transaction.amount;
        }
    });
    
    const labels = expenseCategories.map(category => getCategoryDisplayName(category));
    const data = expenseCategories.map(category => expensesByCategory[category]);
    
    const totalExpenses = data.reduce((sum, value) => sum + value, 0);
    if (totalExpenses === 0) {
        if (window.expenseChart) {
            window.expenseChart.destroy();
            window.expenseChart = null;
        }
        return;
    }
    
    const backgroundColors = [
        'rgba(239, 68, 68, 0.7)', 'rgba(34, 197, 94, 0.7)', 'rgba(249, 115, 22, 0.7)',
        'rgba(59, 130, 246, 0.7)', 'rgba(168, 85, 247, 0.7)', 'rgba(236, 72, 153, 0.7)',
        'rgba(14, 165, 233, 0.7)', 'rgba(20, 184, 166, 0.7)'
    ];
    
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const borderColor = isDark ? '#1e293b' : '#ffffff';
    const textColor = isDark ? '#cbd5e1' : '#334155';
    
    if (window.expenseChart) {
        window.expenseChart.destroy();
    }
    
    window.expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 2,
                borderColor: borderColor
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: { size: 11 },
                        color: textColor
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                            return `${label}: ${formatRupiah(value)} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// ==============================================
// FILTERS & SEARCH (Fast)
// ==============================================

function populateCategoryFilter() {
    const categoryFilter = document.getElementById('filter-category');
    if (!categoryFilter) return;

    if (categoryFilter.children.length > 1) return;
    
    const categories = [...CONFIG.CATEGORIES.income, ...CONFIG.CATEGORIES.expense];
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = getCategoryDisplayName(category);
        categoryFilter.appendChild(option);
    });
}

function populateMonthFilter() {
    const monthFilter = document.getElementById('filter-month');
    if (!monthFilter) return;

    if (monthFilter.children.length > 1) return;

    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const currentYear = new Date().getFullYear();
    
    for (let year = currentYear; year >= currentYear - 1; year--) {
        months.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = `${year}-${index + 1}`;
            option.textContent = `${month} ${year}`;
            monthFilter.appendChild(option);
        });
    }
}

function filterTransactions() {
    const typeFilter = document.getElementById('filter-type')?.value || 'all';
    const categoryFilter = document.getElementById('filter-category')?.value || 'all';
    const monthFilter = document.getElementById('filter-month')?.value || 'all';
    const transactions = document.querySelectorAll('.transaction-item');
    
    let visibleCount = 0;
    
    transactions.forEach(transaction => {
        const transactionType = transaction.dataset.type;
        const transactionCategory = transaction.dataset.category;
        const transactionDate = new Date(transaction.dataset.date);
        const transactionMonth = `${transactionDate.getFullYear()}-${transactionDate.getMonth() + 1}`;
        
        const typeMatch = typeFilter === 'all' || transactionType === typeFilter;
        const categoryMatch = categoryFilter === 'all' || transactionCategory === categoryFilter;
        const monthMatch = monthFilter === 'all' || transactionMonth === monthFilter;
        
        if (typeMatch && categoryMatch && monthMatch) {
            transaction.style.display = 'flex';
            visibleCount++;
        } else {
            transaction.style.display = 'none';
        }
    });
    
    updateTransactionsCount(visibleCount);
}

// ==============================================
// SAVINGS FEATURE (Optimized)
// ==============================================

function getSavingsGoals() {
    return StorageManager.get('moneyTrackerSavings', []);
}

function loadSavingsGoals() {
    const savingsContainer = document.getElementById('savings-goals');
    if (!savingsContainer) return;

    const savingsGoals = getSavingsGoals();
    
    if (savingsGoals.length === 0) {
        showEmptyState('savings', 'default');
        return;
    }
    
    // Render only first few goals initially
    const initialGoals = savingsGoals.slice(0, 4);
    savingsContainer.innerHTML = initialGoals.map(goal => createSavingsGoalHTML(goal)).join('');
    
    // Lazy load remaining goals
    if (savingsGoals.length > 4) {
        setTimeout(() => {
            savingsGoals.slice(4).forEach(goal => {
                const goalHTML = createSavingsGoalHTML(goal);
                savingsContainer.innerHTML += goalHTML;
            });
        }, 500);
    }
}

function createSavingsGoalHTML(goal) {
    const progress = (goal.savedAmount / goal.targetAmount) * 100;
    const isAchieved = progress >= 100;
    
    return `
        <div class="saving-goal-card ${isAchieved ? 'achieved' : ''}">
            ${isAchieved ? '<div class="achievement-badge">🎉 Tercapai!</div>' : ''}
            
            <div class="goal-header">
                <div>
                    <div class="goal-title">${sanitizeHTML(goal.name)}</div>
                    <span class="goal-category">${goal.category}</span>
                </div>
            </div>
            
            <div class="goal-progress">
                <div class="progress-info">
                    <span class="progress-amount">${formatRupiah(goal.savedAmount)} / ${formatRupiah(goal.targetAmount)}</span>
                    <span class="progress-percentage">${Math.min(progress, 100).toFixed(1)}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill ${isAchieved ? 'achieved' : ''}" 
                         style="width: ${Math.min(progress, 100)}%"></div>
                </div>
            </div>
            
            <div class="goal-actions">
                <button class="goal-btn btn-save" onclick="openSaveMoneyModal(${goal.id})">
                    💵 Tabung
                </button>
                <button class="goal-btn btn-edit" onclick="openSavingsModal(${goal.id})">
                    ✏️ Edit
                </button>
            </div>
        </div>
    `;
}

function updateQuickSaveDropdown() {
    const dropdown = document.getElementById('quick-save-goal');
    if (!dropdown) return;

    dropdown.innerHTML = '<option value="">Pilih target menabung</option>';
    
    const goals = getSavingsGoals();
    goals.forEach(goal => {
        if (goal.savedAmount < goal.targetAmount) {
            const option = document.createElement('option');
            option.value = goal.id;
            option.textContent = `${goal.name} (${formatRupiah(goal.savedAmount)}/${formatRupiah(goal.targetAmount)})`;
            dropdown.appendChild(option);
        }
    });
}

// ==============================================
// EVENT HANDLERS (Fast Setup)
// ==============================================

function setupEventListeners() {
    // Transaction form
    document.getElementById('transaction-form')?.addEventListener('submit', handleAddTransaction);
    
    // Filters
    document.getElementById('filter-type')?.addEventListener('change', filterTransactions);
    document.getElementById('filter-category')?.addEventListener('change', filterTransactions);
    document.getElementById('filter-month')?.addEventListener('change', filterTransactions);
    
    // Search
    document.getElementById('search-btn')?.addEventListener('click', searchTransactions);
    document.getElementById('search-input')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchTransactions();
    });
    
    // Other controls
    document.getElementById('reset-filters')?.addEventListener('click', resetFilters);
    document.getElementById('sort-by')?.addEventListener('change', sortTransactions);
    document.getElementById('export-btn')?.addEventListener('click', exportData);
    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
    
    // Savings
    document.getElementById('add-saving-goal')?.addEventListener('click', () => openSavingsModal());
    document.getElementById('create-first-goal')?.addEventListener('click', () => openSavingsModal());
    document.getElementById('quick-save-btn')?.addEventListener('click', quickSave);
    
    // Modals
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModals();
        }
    });
}

// ==============================================
// FAST INITIALIZATION
// ==============================================

function initApp() {
    showLoading('Memuat...');
    
    // Phase 1: Instant operations (0-50ms)
    initializeInstantFeatures();
    
    // Hide loading immediately after instant features
    setTimeout(hideLoading, 50);
    
    // Phase 2: Quick operations (50-200ms)
    setTimeout(initializeQuickFeatures, 50);
    
    // Phase 3: Heavy operations (200ms+)
    setTimeout(initializeHeavyFeatures, 200);
    
    // Mark initial load complete
    setTimeout(() => {
        appState.initialLoadComplete = true;
        showNotification('Siap!', 'Aplikasi siap digunakan', 'success');
    }, 500);
    
    // Setup auto-backup
    appState.backupInterval = setInterval(() => {
        StorageManager.backup();
    }, CONFIG.BACKUP_INTERVAL);
}

// ==============================================
// GLOBAL FUNCTIONS
// ==============================================

function updateCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('id-ID', options);
    
    const currentDateEl = document.getElementById('current-date');
    if (currentDateEl) {
        currentDateEl.textContent = formattedDate;
    }
}

function updateTransactionsCount(count) {
    const totalCount = count !== undefined ? count : document.querySelectorAll('.transaction-item').length;
    const countEl = document.getElementById('transactions-count');
    if (countEl) {
        countEl.textContent = totalCount;
    }
}

function showEmptyState(section, state) {
    // Simplified empty state implementation
    const container = getSectionContainer(section);
    if (!container) return;

    const emptyState = container.querySelector('.empty-state');
    if (!emptyState) return;

    if (state === 'noResults') {
        emptyState.innerHTML = `
            <div class="empty-icon">🔍</div>
            <h3>Tidak ada hasil</h3>
            <p>Coba ubah filter pencarian Anda</p>
            <button class="btn-primary" onclick="resetFilters()">Reset Filter</button>
        `;
    }
}

// ==============================================
// MAIN EVENT HANDLERS
// ==============================================

function handleAddTransaction(e) {
    e.preventDefault();
    
    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    
    if (!description || !amount || amount <= 0 || !date) {
        showNotification('Error', 'Harap isi semua field dengan benar', 'error');
        return;
    }
    
    const transaction = {
        id: Date.now(),
        description,
        amount,
        type,
        category,
        date,
        createdAt: new Date().toISOString()
    };
    
    if (saveTransaction(transaction)) {
        displayTransaction(transaction);
        appState.scheduleUpdate();
        document.getElementById('transaction-form').reset();
        document.getElementById('date').valueAsDate = new Date();
        showNotification('Sukses', 'Transaksi berhasil ditambahkan!', 'success');
    }
}

function handleDeleteTransaction(id) {
    if (confirm('Hapus transaksi ini?')) {
        if (deleteTransaction(id)) {
            const transactionEl = document.querySelector(`[data-id="${id}"]`);
            if (transactionEl) transactionEl.remove();
            appState.scheduleUpdate();
            updateTransactionsCount();
        }
    }
}

function searchTransactions() {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase().trim() || '';
    const transactions = document.querySelectorAll('.transaction-item');
    
    let visibleCount = 0;
    
    transactions.forEach(transaction => {
        const description = transaction.querySelector('.transaction-description')?.textContent.toLowerCase() || '';
        
        if (description.includes(searchTerm)) {
            transaction.style.display = 'flex';
            visibleCount++;
        } else {
            transaction.style.display = 'none';
        }
    });
    
    updateTransactionsCount(visibleCount);
}

function sortTransactions() {
    const sortBy = document.getElementById('sort-by')?.value || 'date-desc';
    const transactions = getTransactions();
    
    const sortedTransactions = [...transactions].sort((a, b) => {
        switch (sortBy) {
            case 'date-desc': return new Date(b.date) - new Date(a.date);
            case 'date-asc': return new Date(a.date) - new Date(b.date);
            case 'amount-desc': return b.amount - a.amount;
            case 'amount-asc': return a.amount - b.amount;
            default: return new Date(b.date) - new Date(a.date);
        }
    });
    
    const transactionsList = document.getElementById('transactions-list');
    if (transactionsList) {
        transactionsList.innerHTML = '';
        sortedTransactions.forEach(transaction => {
            displayTransaction(transaction);
        });
    }
    
    filterTransactions();
}

function resetFilters() {
    document.getElementById('filter-type').value = 'all';
    document.getElementById('filter-category').value = 'all';
    document.getElementById('filter-month').value = 'all';
    document.getElementById('search-input').value = '';
    document.getElementById('sort-by').value = 'date-desc';
    
    filterTransactions();
    sortTransactions();
}

function exportData() {
    const transactions = getTransactions();
    
    if (transactions.length === 0) {
        showNotification('Info', 'Tidak ada data untuk diexport', 'info');
        return;
    }
    
    const headers = ['Tanggal', 'Keterangan', 'Kategori', 'Jenis', 'Jumlah (Rp)'];
    const csvData = transactions.map(transaction => [
        new Date(transaction.date).toLocaleDateString('id-ID'),
        `"${transaction.description.replace(/"/g, '""')}"`,
        getCategoryDisplayName(transaction.category),
        transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
        transaction.amount
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `money-tracker-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('Sukses', 'Data berhasil diexport', 'success');
}

// ==============================================
// SIMPLIFIED SAVINGS MODALS
// ==============================================

function openSavingsModal(goalId = null) {
    const modal = document.getElementById('savings-modal');
    if (!modal) return;

    modal.style.display = 'block';
    modal.classList.add('show');
}

function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
        modal.classList.remove('show');
    });
}

function quickSave() {
    const goalId = parseInt(document.getElementById('quick-save-goal')?.value);
    const amount = parseInt(document.getElementById('quick-save-amount')?.value);
    
    if (!goalId || !amount || amount <= 0) {
        showNotification('Error', 'Pilih target dan isi jumlah', 'error');
        return;
    }
    
    showNotification('Info', `Menabung ${formatRupiah(amount)}`, 'success');
    document.getElementById('quick-save-amount').value = '';
}

function openSaveMoneyModal(goalId) {
    const amount = prompt('Masukkan jumlah tabungan:');
    if (amount && !isNaN(amount) && parseInt(amount) > 0) {
        showNotification('Sukses', `Menabung ${formatRupiah(parseInt(amount))}`, 'success');
    }
}

// ==============================================
// APPLICATION START
// ==============================================

document.addEventListener('DOMContentLoaded', function() {
    if (!window.localStorage) {
        showNotification('Error', 'Browser tidak mendukung localStorage', 'error');
        return;
    }
    
    // Start initialization
    initApp();
});

// Global exports
window.handleDeleteTransaction = handleDeleteTransaction;
window.openSavingsModal = openSavingsModal;
window.closeModals = closeModals;
window.resetFilters = resetFilters;
window.openSaveMoneyModal = openSaveMoneyModal;