// Financial Goals Module
class FinancialGoals {
    constructor() {
        this.goals = [];
        this.init();
    }

    init() {
        this.loadGoals();
        this.setupEventListeners();
    }

    loadGoals() {
        // Load existing goals
        this.goals = [
            {
                id: 1,
                title: '📱 iPhone 15',
                targetAmount: 10000000,
                currentAmount: 3000000,
                category: 'gadget',
                priority: 'medium',
                deadline: new Date('2024-12-31'),
                monthlyTarget: 875000,
                createdAt: new Date('2024-01-01'),
                description: 'iPhone 15 Pro Max 256GB'
            },
            {
                id: 2,
                title: '🏍️ Motor Bekas',
                targetAmount: 15000000,
                currentAmount: 9750000,
                category: 'transport',
                priority: 'high',
                deadline: new Date('2024-09-30'),
                monthlyTarget: 1750000,
                createdAt: new Date('2024-02-01'),
                description: 'Honda Vario 150 bekas tahun 2020'
            }
        ];

        this.renderGoals();
    }

    setupEventListeners() {
        const addButton = document.querySelector('.add-goal-btn');
        if (addButton) {
            addButton.addEventListener('click', () => this.showAddGoalModal());
        }
    }

    renderGoals() {
        const container = document.querySelector('.financial-goals-container');
        if (!container) return;

        if (this.goals.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-bullseye text-gray-400 text-3xl mb-4"></i>
                    <p class="text-gray-600 mb-4">Belum ada target finansial</p>
                    <button class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors add-goal-btn">
                        <i class="fas fa-plus mr-2"></i>Tambah Target Pertama
                    </button>
                </div>
            `;
            return;
        }

        const html = this.goals.map(goal => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const remainingAmount = goal.targetAmount - goal.currentAmount;
            const monthsRemaining = this.calculateMonthsRemaining(goal);
            const progressColor = this.getProgressColor(progress);

            return `
                <div class="p-4 border border-gray-200 rounded-xl goal-item hover:shadow-md transition-shadow" data-id="${goal.id}">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="font-semibold text-gray-900">${goal.title}</h3>
                        <div class="flex items-center space-x-2">
                            <span class="text-sm text-gray-600">${Math.round(progress)}% tercapai</span>
                            <button class="text-gray-400 hover:text-red-500" onclick="financialGoals.deleteGoal(${goal.id})">
                                <i class="fas fa-trash-alt text-xs"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="w-full bg-gray-200 rounded-full h-3 mb-3">
                        <div class="bg-gradient-to-r ${progressColor} h-3 rounded-full progress-animated" style="width: ${Math.min(progress, 100)}%"></div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p class="text-gray-600">Target</p>
                            <p class="font-semibold">Rp ${goal.targetAmount.toLocaleString()}</p>
                        </div>
                        <div>
                            <p class="text-gray-600">Terkumpul</p>
                            <p class="font-semibold text-green-600">Rp ${goal.currentAmount.toLocaleString()}</p>
                        </div>
                        <div>
                            <p class="text-gray-600">Sisa</p>
                            <p class="font-semibold text-orange-600">Rp ${remainingAmount.toLocaleString()}</p>
                        </div>
                        <div>
                            <p class="text-gray-600">Estimasi</p>
                            <p class="font-semibold text-blue-600">${monthsRemaining}</p>
                        </div>
                    </div>
                    
                    <div class="mt-3 flex items-center justify-between">
                        <span class="text-xs px-2 py-1 rounded-full ${this.getPriorityColor(goal.priority)}">${this.getPriorityText(goal.priority)}</span>
                        <div class="flex space-x-2">
                            <button class="text-primary hover:text-secondary text-sm" onclick="financialGoals.addProgress(${goal.id})">
                                <i class="fas fa-plus-circle mr-1"></i>Tambah Progress
                            </button>
                            <button class="text-gray-600 hover:text-gray-800 text-sm" onclick="financialGoals.editGoal(${goal.id})">
                                <i class="fas fa-edit mr-1"></i>Edit
                            </button>
                        </div>
                    </div>
                    
                    ${goal.description ? `<p class="text-xs text-gray-500 mt-2">${goal.description}</p>` : ''}
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }

    calculateMonthsRemaining(goal) {
        const remainingAmount = goal.targetAmount - goal.currentAmount;
        if (remainingAmount <= 0) return 'Tercapai! 🎉';

        const monthsNeeded = Math.ceil(remainingAmount / goal.monthlyTarget);
        return monthsNeeded === 1 ? '~1 bulan lagi' : `~${monthsNeeded} bulan lagi`;
    }

    getProgressColor(progress) {
        if (progress >= 100) return 'from-green-400 to-green-500';
        if (progress >= 75) return 'from-blue-400 to-blue-500';
        if (progress >= 50) return 'from-yellow-400 to-yellow-500';
        if (progress >= 25) return 'from-orange-400 to-orange-500';
        return 'from-red-400 to-red-500';
    }

    getPriorityColor(priority) {
        const colors = {
            high: 'bg-red-100 text-red-600',
            medium: 'bg-yellow-100 text-yellow-600',
            low: 'bg-green-100 text-green-600'
        };
        return colors[priority] || colors.medium;
    }

    getPriorityText(priority) {
        const texts = {
            high: 'Prioritas Tinggi',
            medium: 'Prioritas Sedang',
            low: 'Prioritas Rendah'
        };
        return texts[priority] || texts.medium;
    }

    addGoal(goalData) {
        const newGoal = {
            id: Date.now(),
            ...goalData,
            currentAmount: 0,
            createdAt: new Date()
        };

        this.goals.push(newGoal);
        this.renderGoals();
        this.saveToLocalStorage();
        this.showNotification('Target finansial baru berhasil ditambahkan!');
    }

    editGoal(id) {
        const goal = this.goals.find(g => g.id === id);
        if (!goal) return;

        // Show edit modal with current values
        this.showEditGoalModal(goal);
    }

    updateGoal(id, updates) {
        const goalIndex = this.goals.findIndex(g => g.id === id);
        if (goalIndex === -1) return;

        this.goals[goalIndex] = { ...this.goals[goalIndex], ...updates };
        this.renderGoals();
        this.saveToLocalStorage();
        this.showNotification('Target finansial berhasil diperbarui!');
    }

    deleteGoal(id) {
        if (!confirm('Yakin ingin menghapus target ini?')) return;

        this.goals = this.goals.filter(g => g.id !== id);
        this.renderGoals();
        this.saveToLocalStorage();
        this.showNotification('Target finansial berhasil dihapus!');
    }

    addProgress(id) {
        const goal = this.goals.find(g => g.id === id);
        if (!goal) return;

        const amount = prompt('Masukkan jumlah progress (Rp):');
        if (!amount || isNaN(amount)) return;

        const progressAmount = parseInt(amount);
        goal.currentAmount += progressAmount;

        // Don't exceed target
        if (goal.currentAmount > goal.targetAmount) {
            goal.currentAmount = goal.targetAmount;
        }

        this.renderGoals();
        this.saveToLocalStorage();

        // Check if goal is completed
        if (goal.currentAmount >= goal.targetAmount) {
            this.showAchievementModal(goal);
        } else {
            this.showNotification(`Progress ditambahkan! +Rp ${progressAmount.toLocaleString()}`);
        }
    }

    showAddGoalModal() {
        const modal = this.createModal('Tambah Target Finansial', `
            <form id="addGoalForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nama Target</label>
                    <input type="text" name="title" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="contoh: iPhone 15">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Target Jumlah (Rp)</label>
                    <input type="number" name="targetAmount" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="10000000">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Target Bulanan (Rp)</label>
                    <input type="number" name="monthlyTarget" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="500000">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select name="category" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent">
                        <option value="">Pilih kategori</option>
                        <option value="gadget">Gadget</option>
                        <option value="transport">Transportasi</option>
                        <option value="education">Pendidikan</option>
                        <option value="travel">Travel</option>
                        <option value="emergency">Dana Darurat</option>
                        <option value="other">Lainnya</option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Prioritas</label>
                    <select name="priority" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent">
                        <option value="medium">Sedang</option>
                        <option value="high">Tinggi</option>
                        <option value="low">Rendah</option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Target Tanggal</label>
                    <input type="date" name="deadline" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi (opsional)</label>
                    <textarea name="description" rows="2" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Deskripsi detail tentang target ini..."></textarea>
                </div>
                
                <div class="flex space-x-3 pt-4">
                    <button type="submit" class="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary transition-colors">
                        Tambah Target
                    </button>
                    <button type="button" onclick="this.closest('.modal-overlay').remove()" class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors">
                        Batal
                    </button>
                </div>
            </form>
        `);

        // Handle form submission
        modal.querySelector('#addGoalForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const goalData = Object.fromEntries(formData.entries());

            // Convert numbers
            goalData.targetAmount = parseInt(goalData.targetAmount);
            goalData.monthlyTarget = parseInt(goalData.monthlyTarget);
            goalData.deadline = new Date(goalData.deadline);

            this.addGoal(goalData);
            modal.remove();
        });
    }

    showEditGoalModal(goal) {
        // Similar to addGoalModal but pre-filled with current values
        // Implementation would be similar to showAddGoalModal
    }

    showAchievementModal(goal) {
        const modal = this.createModal('🎉 Selamat!', `
            <div class="text-center py-6">
                <div class="text-6xl mb-4">🎯</div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Target Tercapai!</h3>
                <p class="text-gray-600 mb-4">Anda berhasil mencapai target "${goal.title}"</p>
                <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p class="text-green-800 font-semibold">Rp ${goal.targetAmount.toLocaleString()}</p>
                    <p class="text-green-600 text-sm">Target berhasil dicapai!</p>
                </div>
                <button onclick="this.closest('.modal-overlay').remove()" class="bg-primary text-white py-2 px-6 rounded-lg hover:bg-secondary transition-colors">
                    Tutup
                </button>
            </div>
        `);
    }

    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-md w-full mx-4 max-h-screen overflow-y-auto">
                <div class="p-6">
                    <h2 class="text-xl font-bold text-gray-900 mb-4">${title}</h2>
                    ${content}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        return modal;
    }

    saveToLocalStorage() {
        localStorage.setItem('smartsaku_goals', JSON.stringify(this.goals));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('smartsaku_goals');
        if (saved) {
            this.goals = JSON.parse(saved);
            // Convert date strings back to Date objects
            this.goals.forEach(goal => {
                goal.deadline = new Date(goal.deadline);
                goal.createdAt = new Date(goal.createdAt);
            });
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    getGoalsByCategory(category) {
        return this.goals.filter(goal => goal.category === category);
    }

    getGoalsByPriority(priority) {
        return this.goals.filter(goal => goal.priority === priority);
    }

    getTotalProgress() {
        const totalTarget = this.goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
        const totalCurrent = this.goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
        return totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;
    }
}

// Export for use in other modules
window.FinancialGoals = FinancialGoals;