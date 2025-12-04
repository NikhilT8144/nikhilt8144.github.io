        import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
        import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
        import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp, writeBatch } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

        const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app';
        const initialToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);

        // --- State ---
        let currentUser = null;
        let tasks = [];
        let currentFilter = 'all';
        let currentPriority = 'low';
        let unsubscribeTasks = null;
        let charts = { completion: null, priority: null };

        // --- Refs ---
        const taskListEl = document.getElementById('task-list');
        const inputEl = document.getElementById('new-task-input');
        const formEl = document.getElementById('add-task-form');
        const statusDot = document.getElementById('connection-status');
        const statusText = document.getElementById('connection-text');
        
        // Priority Refs
        const priorityTrigger = document.getElementById('priority-trigger');
        const priorityMenu = document.getElementById('priority-menu');
        const priorityLabel = document.getElementById('priority-label-text');
        const priorityDot = document.getElementById('priority-dot');

        // View Refs
        const viewTodos = document.getElementById('view-todos');
        const viewStats = document.getElementById('view-stats');
        const viewToggleBtn = document.getElementById('view-toggle-btn');
        const iconList = document.getElementById('icon-list');
        const iconChart = document.getElementById('icon-chart');

        // --- Auth ---
        const initAuth = async () => {
            try {
                if (initialToken) await signInWithCustomToken(auth, initialToken);
                else await signInAnonymously(auth);
            } catch (err) {
                console.error("Auth Error", err);
                statusText.innerText = "Error";
                statusDot.innerHTML = `<span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>`;
            }
        };

        onAuthStateChanged(auth, (user) => {
            if (user) {
                currentUser = user;
                statusText.innerText = "Connected";
                statusDot.innerHTML = `
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>`;
                subscribeToTasks();
            } else {
                currentUser = null;
                statusText.innerText = "Offline";
                statusDot.innerHTML = `<span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>`;
            }
        });

        // --- Logic ---
        function subscribeToTasks() {
            if (!currentUser) return;
            if (unsubscribeTasks) unsubscribeTasks();

            const q = collection(db, 'artifacts', appId, 'users', currentUser.uid, 'tasks');
            unsubscribeTasks = onSnapshot(q, (snapshot) => {
                tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Sort by Created Date Descending (Newest first)
                tasks.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
                renderTasks();
                updateStatsUI();
            });
        }

        async function addTask(text) {
            if (!currentUser) return;
            await addDoc(collection(db, 'artifacts', appId, 'users', currentUser.uid, 'tasks'), {
                text, completed: false, priority: currentPriority, createdAt: serverTimestamp()
            });
        }

        async function toggleTask(id, status) {
            if (!currentUser) return;
            await updateDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'tasks', id), { completed: !status });
        }

        async function deleteTask(id) {
            if (!currentUser) return;
            await deleteDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'tasks', id));
        }

        window.clearCompleted = async function() {
            if (!currentUser) return;
            const batch = writeBatch(db);
            const completedTasks = tasks.filter(t => t.completed);
            completedTasks.forEach(t => {
                const ref = doc(db, 'artifacts', appId, 'users', currentUser.uid, 'tasks', t.id);
                batch.delete(ref);
            });
            await batch.commit();
        }

        // --- UI ---
        
        // Priority Dropdown Logic
        priorityTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            priorityMenu.classList.toggle('hidden');
        });
        document.addEventListener('click', (e) => {
            if (!priorityTrigger.contains(e.target) && !priorityMenu.contains(e.target)) priorityMenu.classList.add('hidden');
        });
        document.querySelectorAll('.priority-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const val = e.currentTarget.dataset.value;
                currentPriority = val;
                priorityLabel.innerText = val.charAt(0).toUpperCase() + val.slice(1);
                priorityDot.className = `w-2 h-2 rounded-full shadow-lg ${val === 'high' ? 'bg-rose-500' : val === 'medium' ? 'bg-amber-400' : 'bg-cyan-400'}`;
                priorityMenu.classList.add('hidden');
            });
        });

        // Format Date
        const formatDate = (timestamp) => {
            if(!timestamp) return 'Just now';
            const date = new Date(timestamp.seconds * 1000);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        };

        function getPriorityClass(p) {
            if (p === 'high') return 'priority-high-bg';
            if (p === 'medium') return 'priority-medium-bg';
            return 'priority-low-bg';
        }

        function renderTasks() {
            if (tasks.length === 0) {
                taskListEl.innerHTML = `
                    <div class="flex flex-col items-center justify-center h-64 text-center opacity-40">
                        <div class="w-20 h-20 bg-zinc-800 rounded-3xl flex items-center justify-center mb-4 border border-zinc-700">
                            <svg class="w-10 h-10 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        </div>
                        <p class="text-base font-medium text-zinc-300">No tasks yet</p>
                        <p class="text-xs text-zinc-500 mt-1">Add a task to get started</p>
                    </div>`;
                return;
            }

            const filtered = tasks.filter(t => {
                if (currentFilter === 'pending') return !t.completed;
                if (currentFilter === 'high') return t.priority === 'high';
                return true;
            });

            if (filtered.length === 0) {
                taskListEl.innerHTML = `<div class="text-center py-20 text-zinc-500 text-sm">No tasks match filter</div>`;
                return;
            }

            taskListEl.innerHTML = filtered.map(task => `
                <div class="task-enter group relative flex items-start gap-4 p-4 rounded-2xl transition-all duration-200 border border-transparent hover:border-zinc-800 hover:bg-zinc-900/40 ${getPriorityClass(task.priority)} ${task.completed ? 'opacity-50' : 'bg-zinc-900/20'}">
                    
                    <button 
                        onclick="window.triggerToggle('${task.id}', ${task.completed})"
                        class="mt-1 relative w-6 h-6 rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                            task.completed 
                            ? 'bg-emerald-500 border-emerald-500' 
                            : 'border-zinc-600 hover:border-cyan-400'
                        }"
                    >
                        ${task.completed ? `<svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>` : ''}
                    </button>
                    
                    <div class="flex-1 min-w-0">
                        <p class="text-base leading-relaxed ${task.completed ? 'text-zinc-500 line-through decoration-zinc-700' : 'text-zinc-200'}">
                            ${escapeHtml(task.text)}
                        </p>
                        <div class="flex items-center gap-3 mt-1.5">
                            <span class="text-[10px] text-zinc-500 font-medium bg-zinc-800/50 px-1.5 py-0.5 rounded border border-zinc-800">
                                ${formatDate(task.createdAt)}
                            </span>
                            <span class="text-[10px] uppercase tracking-wider font-bold ${
                                task.priority === 'high' ? 'text-rose-400' : 
                                task.priority === 'medium' ? 'text-amber-400' : 'text-cyan-400'
                            }">${task.priority}</span>
                        </div>
                    </div>
                    
                    <button 
                        onclick="window.triggerDelete('${task.id}')"
                        class="mt-1 p-1.5 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                        title="Delete"
                    >
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            `).join('');
        }

        // --- Charts ---
        function initCharts() {
            Chart.defaults.color = '#71717a';
            Chart.defaults.font.family = "'Inter', sans-serif";
            
            charts.completion = new Chart(document.getElementById('chart-completion'), {
                type: 'doughnut',
                data: {
                    labels: ['Done', 'Left'],
                    datasets: [{
                        data: [0, 1],
                        backgroundColor: ['#10b981', '#18181b'],
                        borderWidth: 0,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '80%',
                    plugins: { legend: { display: false } }
                }
            });

            charts.priority = new Chart(document.getElementById('chart-priority'), {
                type: 'bar',
                data: {
                    labels: ['High', 'Med', 'Low'],
                    datasets: [{
                        data: [0, 0, 0],
                        backgroundColor: ['#f43f5e', '#f59e0b', '#06b6d4'],
                        borderRadius: 4,
                        barThickness: 20
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { display: false },
                        x: { grid: { display: false }, ticks: { color: '#a1a1aa' } }
                    }
                }
            });
        }

        function updateStatsUI() {
            const total = tasks.length;
            const completed = tasks.filter(t => t.completed).length;
            const pending = total - completed;
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
            
            document.getElementById('stat-total').innerText = total;
            document.getElementById('stat-pending').innerText = pending;
            document.getElementById('stat-completed').innerText = completed;
            document.getElementById('percent-text').innerText = `${percent}%`;

            if (charts.completion) {
                // Fixed: Removed the '|| 0.1' hack. 
                // Logic: If there are no tasks (total === 0), show a full grey ring [0, 1].
                // Otherwise, show the exact data [completed, pending].
                if (total === 0) {
                    charts.completion.data.datasets[0].data = [0, 1];
                    charts.completion.data.datasets[0].backgroundColor = ['#10b981', '#18181b'];
                } else {
                    charts.completion.data.datasets[0].data = [completed, pending];
                    charts.completion.data.datasets[0].backgroundColor = [percent === 100 ? '#34d399' : '#10b981', '#18181b'];
                }
                charts.completion.update();
            }

            if (charts.priority) {
                const high = tasks.filter(t => t.priority === 'high').length;
                const med = tasks.filter(t => t.priority === 'medium').length;
                const low = tasks.filter(t => t.priority === 'low').length;
                charts.priority.data.datasets[0].data = [high, med, low];
                charts.priority.update();
            }
        }

        // --- Event Listeners ---
        window.triggerToggle = (id, status) => toggleTask(id, status);
        window.triggerDelete = (id) => deleteTask(id);

        formEl.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = inputEl.value.trim();
            if (text) { addTask(text); inputEl.value = ''; }
        });

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => {
                    b.classList.remove('bg-zinc-800', 'text-white', 'shadow-sm');
                    b.classList.add('text-zinc-500');
                });
                e.target.classList.remove('text-zinc-500');
                e.target.classList.add('bg-zinc-800', 'text-white', 'shadow-sm');
                currentFilter = e.target.dataset.filter;
                renderTasks();
            });
        });

        // Toggle Views
        let isStats = false;
        viewToggleBtn.addEventListener('click', () => {
            isStats = !isStats;
            if (isStats) {
                viewTodos.classList.add('hidden');
                viewStats.classList.remove('hidden');
                setTimeout(() => viewStats.classList.add('opacity-100'), 10);
                iconList.classList.remove('hidden');
                iconChart.classList.add('hidden');
            } else {
                viewStats.classList.remove('opacity-100');
                viewStats.classList.add('hidden');
                viewTodos.classList.remove('hidden');
                iconList.classList.add('hidden');
                iconChart.classList.remove('hidden');
            }
        });

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        initAuth();
        initCharts();
