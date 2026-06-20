Enter// ===== DATA =====
let projects = [];
let tickets = [];
let announcement = "";

// ===== LOAD DATA FROM JSON =====
async function loadData() {
    try {
        const res = await fetch('data.json');
        const data = await res.json();
        projects = data.projects || [];
        tickets = data.tickets || [];
        announcement = data.announcement || "";
        renderAll();
    } catch {
        // fallback data
        projects = [
            { id: 'fucker', name: 'Fucker Bot', icon: '🖐🏻🤓🖐🏻', desc: 'ربات فحاشی هدفمند با پنل مدیریت شیشه‌ای', status: 'online' },
            { id: 'jojobala', name: 'JoJobala Bot', icon: '🧠', desc: 'ربات هوش مصنوعی با قابلیت پاسخگویی پیشرفته', status: 'offline' }
        ];
        renderAll();
    }
}

// ===== RENDER =====
function renderAll() {
    renderProjects();
    renderAnnouncement();
    renderAdminProjects();
    renderAdminTickets();
}

function renderProjects() {
    const container = document.getElementById('projects-container');
    container.innerHTML = projects.map(p => `
        <div class="project-item">
            <div class="project-left">
                <span class="project-icon">${p.icon}</span>
                <div>
                    <div class="project-name">${p.name}</div>
                    <div class="project-desc">${p.desc}</div>
                </div>
            </div>
            <div class="status-badge">
                <span class="status-dot ${p.status}"></span>
                <span>${p.status === 'online' ? 'فعال' : 'خاموش'}</span>
            </div>
        </div>
    `).join('');
}

function renderAnnouncement() {
    const el = document.getElementById('announcement');
    if (announcement) {
        el.style.display = 'block';
        el.textContent = announcement;
    } else {
        el.style.display = 'none';
    }
}

function renderAdminProjects() {
    const container = document.getElementById('admin-projects');
    if (!container) return;
    container.innerHTML = projects.map(p => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #222;">
            <span>${p.icon} ${p.name}</span>
            <div>
                <button onclick="toggleStatus('${p.id}')" style="background:${p.status === 'online' ? '#00ff8866' : '#ff444466'};border:none;border-radius:8px;padding:4px 12px;color:#fff;cursor:pointer;">
                    ${p.status === 'online' ? '✅ فعال' : '❌ خاموش'}
                </button>
            </div>
        </div>
    `).join('');
}

function renderAdminTickets() {
    const container = document.getElementById('admin-tickets');
    if (!container) return;
    if (tickets.length === 0) {
        container.innerHTML = '<p style="color:#888;">هیچ تیکتی دریافت نشده است.</p>';
        return;
    }
    container.innerHTML = tickets.map((t, i) => `
        <div style="background:#111;border-radius:12px;padding:12px 16px;margin-bottom:10px;border-right:3px solid #ff6b6b;">
            <div style="display:flex;justify-content:space-between;">
                <strong style="color:#fff;">${t.name}</strong>
                <span style="color:#666;font-size:0.8rem;">${t.date || ''}</span>
            </div>
            <div style="color:#aaa;font-size:0.9rem;margin-top:4px;">${t.message}</div>
            <div style="color:#666;font-size:0.8rem;margin-top:4px;">پروژه: ${t.project || 'عمومی'}</div>
            <button onclick="deleteTicket(${i})" style="background:#ff444466;border:none;border-radius:6px;padding:2px 10px;color:#fff;cursor:pointer;margin-top:6px;">🗑️ حذف</button>
        </div>
    `).join('');
}

// ===== TICKET =====
document.getElementById('ticket-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('ticket-name').value.trim();
    const project = document.getElementById('ticket-project').value.trim();
    const message = document.getElementById('ticket-message').value.trim();
    if (!name || !message) return;
    tickets.push({
        name,
        project: project || 'عمومی',
        message,
        date: new Date().toLocaleDateString('fa-IR')
    });
    document.getElementById('ticket-status').textContent = '✅ تیکت شما با موفقیت ارسال شد!';
    this.reset();
    renderAdminTickets();
    saveData();
});

// ===== ADMIN =====
let isAdmin = false;

function loginAdmin() {
    const pass = prompt('🔐 لطفاً رمز پنل مدیریت را وارد کنید:');
    if (pass === 'Tentacion') {
        isAdmin = true;
        document.getElementById('admin-panel').style.display = 'block';
        document.getElementById('admin-login').style.display = 'none';
        renderAdminProjects();
        renderAdminTickets();
    } else {
        alert('❌ رمز اشتباه است!');
    }
}

function logoutAdmin() {
    isAdmin = false;
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('admin-login').style.display = 'block';
}

function toggleStatus(projectId) {
    const p = projects.find(pr => pr.id === projectId);
    if (p) {
        p.status = p.status === 'online' ? 'offline' : 'online';
        renderAll();
        saveData();
    }
}

function setAnnouncement() {
    const input = document.getElementById('announcement-input');
    if (input) {
        announcement = input.value.trim();
        input.value = '';
        renderAnnouncement();
        saveData();
    }
}

function deleteTicket(index) {
    tickets.splice(index, 1);
    renderAdminTickets();
    saveData();
}

// ===== SAVE DATA (mock) =====
function saveData() {
    // در محیط واقعی، این داده‌ها رو به سرور یا localStorage ذخیره کن
    try {
        localStorage.setItem('taakaa_data', JSON.stringify({ projects, tickets, announcement }));
    } catch {}
}

// ===== LOAD FROM localStorage =====
function loadFromLocal() {
    try {
        const raw = localStorage.getItem('taakaa_data');
        if (raw) {
            const data = JSON.parse(raw);
            if (data.projects) projects = data.projects;
            if (data.tickets) tickets = data.tickets;
            if (data.announcement) announcement = data.announcement;
        }
    } catch {}
}

// ===== SCROLL ANIMATION =====
function handleScroll() {
    document.querySelectorAll('.box').forEach(box => {
        const rect = box.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            box.classList.add('visible');
        }
    });
}

// ===== INIT =====
loadFromLocal();
loadData();
handleScroll();
window.addEventListener('scroll', handleScroll);
