        const API_URL = 'https://nikhilt8144.serv00.net/api/todo/data.php';
        let USERNAME = '';
        let SESSION_PASSWORD = '';

        // --- Refs ---
        const loginOverlay = document.getElementById('login-overlay');
        const loginForm = document.getElementById('login-form');
        const appContainer = document.getElementById('app-container');
        const statusDot = document.getElementById('connection-status');
        const statusText = document.getElementById('connection-text');
        const errorMsg = document.getElementById('login-error');

        // --- API ---
        async function callApi(action, payload = {}) {
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action,
                        username: USERNAME,
                        password: SESSION_PASSWORD,
                        ...payload
                    })
                });
                return await response.json();
            } catch (err) {
                console.error(err);
                return { success: false, message: 'Connection Failed' };
            }
        }

        // --- Login ---
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userIn = document.getElementById('login-username').value.trim();
            const passIn = document.getElementById('login-password').value;
            const btn = e.target.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Decrypting...';
            btn.disabled = true;
            errorMsg.classList.add('hidden');

            const res = await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'login', username: userIn, password: passIn })
            }).then(r => r.json()).catch(() => ({ success: false }));

            if (res.success) {
                // Success
                USERNAME = userIn;
                SESSION_PASSWORD = passIn;
                
                // Hide Login
                loginOverlay.classList.add('opacity-0', 'pointer-events-none');
                setTimeout(() => loginOverlay.remove(), 700); // Remove from DOM after fade

                // Show App
                appContainer.classList.remove('hidden'); // Remove display:none
                // Force reflow
                void appContainer.offsetWidth; 
                appContainer.classList.remove('opacity-0'); // Fade in
                
                statusText.innerText = "Online";
                statusDot.innerHTML = `<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>`;
                loadTasks();
            } else {
                // Fail
                errorMsg.classList.remove('hidden');
                errorMsg.innerText = "Incorrect credentials";
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });

        // --- Tasks ---
        let tasks = [];
        let currentFilter = 'all';
        let currentPriority = 'low';
        let charts = { completion: null, priority: null };

        async function loadTasks() {
            const res = await callApi('load');
            if (res.success) {
                tasks = res.data.tasks || [];
                renderTasks();
                updateStatsUI();
            }
        }

        async function saveTasks() {
            statusText.innerText = "Saving...";
            const res = await callApi('save', { tasks });
            if (res.success) setTimeout(() => statusText.innerText = "Online", 1000);
            else statusText.innerText = "Error";
        }

        function addTask(text) {
            tasks.unshift({ id: Date.now().toString(), text, completed: false, priority: currentPriority, createdAt: Date.now() });
            renderTasks(); updateStatsUI(); saveTasks();
        }

        function toggleTask(id) {
            const t = tasks.find(x => x.id === id);
            if(t) { t.completed = !t.completed; renderTasks(); updateStatsUI(); saveTasks(); }
        }

        function deleteTask(id) {
            tasks = tasks.filter(x => x.id !== id);
            renderTasks(); updateStatsUI(); saveTasks();
        }

        window.clearCompleted = function() {
            if(confirm("Clear completed?")) { tasks = tasks.filter(t => !t.completed); renderTasks(); updateStatsUI(); saveTasks(); }
        }

        // --- Render Helpers ---
        const formatDate = (ts) => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const getPriorityClass = (p) => p==='high'?'priority-high-bg':p==='medium'?'priority-medium-bg':'priority-low-bg';
        window.triggerToggle = toggleTask; window.triggerDelete = deleteTask;

        // UI Event Listeners
        document.getElementById('add-task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const inp = document.getElementById('new-task-input');
            if(inp.value.trim()) { addTask(inp.value.trim()); inp.value = ''; }
        });

        // Priority Dropdown
        const pTrig = document.getElementById('priority-trigger');
        const pMenu = document.getElementById('priority-menu');
        const pLabel = document.getElementById('priority-label-text');
        const pDot = document.getElementById('priority-dot');
        
        pTrig.addEventListener('click', (e) => { e.stopPropagation(); pMenu.classList.toggle('hidden'); });
        document.addEventListener('click', (e) => { if(!pTrig.contains(e.target)) pMenu.classList.add('hidden'); });
        document.querySelectorAll('.priority-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const val = e.currentTarget.dataset.value;
                currentPriority = val;
                pLabel.innerText = val.charAt(0).toUpperCase() + val.slice(1);
                pDot.className = `w-1.5 h-1.5 rounded-full ${val==='high'?'bg-rose-500':val==='medium'?'bg-amber-400':'bg-cyan-400'}`;
                pMenu.classList.add('hidden');
            });
        });

        // Filter Tabs
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => { b.classList.remove('bg-zinc-800','text-white','shadow-sm'); b.classList.add('text-zinc-500'); });
                e.target.classList.remove('text-zinc-500'); e.target.classList.add('bg-zinc-800','text-white','shadow-sm');
                currentFilter = e.target.dataset.filter;
                renderTasks();
            });
        });

        // View Toggle
        const vTodos = document.getElementById('view-todos');
        const vStats = document.getElementById('view-stats');
        const vBtn = document.getElementById('view-toggle-btn');
        let isStats = false;
        vBtn.addEventListener('click', () => {
            isStats = !isStats;
            if(isStats) {
                vTodos.classList.add('hidden');
                vStats.classList.remove('hidden');
                setTimeout(() => vStats.classList.add('opacity-100'), 10);
                document.getElementById('icon-list').classList.remove('hidden'); document.getElementById('icon-chart').classList.add('hidden');
            } else {
                vStats.classList.remove('opacity-100'); vStats.classList.add('hidden');
                vTodos.classList.remove('hidden');
                document.getElementById('icon-list').classList.add('hidden'); document.getElementById('icon-chart').classList.remove('hidden');
            }
        });

        function renderTasks() {
            const el = document.getElementById('task-list');
            const filtered = tasks.filter(t => {
                if(currentFilter === 'pending') return !t.completed;
                if(currentFilter === 'high') return t.priority === 'high';
                return true;
            });

            if(tasks.length === 0) { el.innerHTML = `<div class="flex flex-col items-center justify-center h-48 opacity-40"><p class="text-sm font-medium text-zinc-300">No tasks</p></div>`; return; }
            if(filtered.length === 0) { el.innerHTML = `<div class="text-center py-10 text-zinc-500 text-xs">No matches</div>`; return; }

            el.innerHTML = filtered.map(task => `
                <div class="task-enter group relative flex items-start gap-3 p-3 rounded-xl border border-transparent hover:border-zinc-800 hover:bg-zinc-900/40 ${getPriorityClass(task.priority)} ${task.completed ? 'opacity-50' : 'bg-zinc-900/20'}">
                    <button onclick="triggerToggle('${task.id}')" class="mt-0.5 relative w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600 hover:border-cyan-400'}">
                        ${task.completed ? `<svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>` : ''}
                    </button>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm leading-snug ${task.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'}">${task.text}</p>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="text-[9px] text-zinc-500 font-medium bg-zinc-800/50 px-1 py-0.5 rounded">${formatDate(task.createdAt)}</span>
                            <span class="text-[9px] uppercase font-bold ${task.priority==='high'?'text-rose-400':task.priority==='medium'?'text-amber-400':'text-cyan-400'}">${task.priority}</span>
                        </div>
                    </div>
                    <button onclick="triggerDelete('${task.id}')" class="p-1 rounded text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
            `).join('');
        }

        function initCharts() {
            Chart.defaults.color = '#71717a'; Chart.defaults.font.family = "'Inter', sans-serif";
            charts.completion = new Chart(document.getElementById('chart-completion'), { type: 'doughnut', data: { labels: ['Done','Left'], datasets: [{ data: [0, 1], backgroundColor: ['#10b981', '#18181b'], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '80%', plugins: { legend: { display: false } } } });
            charts.priority = new Chart(document.getElementById('chart-priority'), { type: 'bar', data: { labels: ['High','Med','Low'], datasets: [{ data: [0, 0, 0], backgroundColor: ['#f43f5e', '#f59e0b', '#06b6d4'], borderRadius: 3, barThickness: 16 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false }, ticks: { color: '#a1a1aa', font: {size:9} } } } } });
        }
        function updateStatsUI() {
            const total = tasks.length, completed = tasks.filter(t => t.completed).length, pending = total - completed, percent = total > 0 ? Math.round((completed / total) * 100) : 0;
            document.getElementById('stat-total').innerText = total; document.getElementById('stat-pending').innerText = pending; document.getElementById('stat-completed').innerText = completed; document.getElementById('percent-text').innerText = `${percent}%`;
            if(charts.completion) { charts.completion.data.datasets[0].data = total===0 ? [0,1] : [completed, pending]; charts.completion.data.datasets[0].backgroundColor = [percent===100?'#34d399':'#10b981', '#18181b']; charts.completion.update(); }
            if(charts.priority) { charts.priority.data.datasets[0].data = [tasks.filter(t=>t.priority==='high').length, tasks.filter(t=>t.priority==='medium').length, tasks.filter(t=>t.priority==='low').length]; charts.priority.update(); }
        }
        initCharts();
