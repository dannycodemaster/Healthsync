/**
 * HealthSync Nigeria - Core Logic
 * Adaptation: Digital Healthcare Nervous System
 */

const STATE = {
    currentView: 'dashboard',
    offlineMode: false,
    patients: [
        { id: 'HSN-294812', name: 'Amaka Eze', age: 28, gender: 'Female', complaint: 'Severe Malaria Symptoms', status: 'Priority', temp: 39.4, spo2: 88, bp: '110/70', arrival: '10:15 AM' },
        { id: 'HSN-882310', name: 'Babatunde Ojo', age: 45, gender: 'Male', complaint: 'Routine Hypertension Follow-up', status: 'Stable', temp: 36.8, spo2: 98, bp: '145/95', arrival: '10:30 AM' },
        { id: 'HSN-112039', name: 'Chioma Okoro', age: 5, gender: 'Female', complaint: 'Persistent Cough & Fever', status: 'Priority', temp: 39.1, spo2: 92, bp: '100/60', arrival: '10:45 AM' },
        { id: 'HSN-554218', name: 'Ibrahim Musa', age: 32, gender: 'Male', complaint: 'Injury to right hand', status: 'Stable', temp: 36.5, spo2: 99, bp: '120/80', arrival: '11:00 AM' }
    ]
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    renderView('dashboard');
});

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.getAttribute('data-view');
            
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            renderView(view);
        });
    });
}

// --- View Router ---
function renderView(view) {
    STATE.currentView = view;
    const mount = document.getElementById('content-mount');
    mount.innerHTML = ''; // Clear

    switch(view) {
        case 'dashboard':
            renderDashboard(mount);
            break;
        case 'triage':
            renderTriage(mount);
            break;
        case 'consultation':
            renderConsultation(mount);
            break;
        default:
            mount.innerHTML = `
                <div class="fade-in">
                    <h2 class="card-title">${view.charAt(0).toUpperCase() + view.slice(1)} Module</h2>
                    <p style="color: var(--text-muted); margin-top: 1rem;">This module is under development as part of Phase 2 (Financial Loop).</p>
                </div>
            `;
    }

    if (window.lucide) lucide.createIcons();
}

// --- Renderers ---

function renderDashboard(container) {
    container.innerHTML = `
        <div class="fade-in">
            <div class="dashboard-grid">
                ${renderStatCard('Total Revenue', '₦2.4M', 'trending-up', 'trend-up', '+12.5%')}
                ${renderStatCard('Patient Queue', '14', 'users', '', 'Avg wait: 12m')}
                ${renderStatCard('Critical Triage', '3', 'alert-triangle', 'trend-down', 'Requires Action')}
                ${renderStatCard('Pharmacy Stock', '92%', 'package', 'trend-up', 'Low stock alert: 2')}
            </div>

            <div class="main-grid">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Live Triage Queue</h3>
                        <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.8rem;" onclick="renderView('triage')">Full View</button>
                    </div>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Vitals</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${STATE.patients.slice(0, 4).map(p => `
                                <tr>
                                    <td>
                                        <div class="patient-info">
                                            <span class="patient-name">${p.name}</span>
                                            <span class="patient-id">${p.id}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style="display: flex; gap: 0.75rem; font-size: 0.85rem; font-weight: 600;">
                                            <span style="color: ${p.temp >= 38.5 ? 'var(--danger)' : 'inherit'}">${p.temp}°C</span>
                                            <span style="color: ${p.spo2 < 94 ? 'var(--warning)' : 'inherit'}">${p.spo2}%</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="status-pill ${p.status === 'Priority' ? 'pill-priority' : 'pill-stable'}">
                                            ${p.status}
                                        </span>
                                    </td>
                                    <td><button class="icon-btn"><i data-lucide="chevron-right"></i></button></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="card">
                    <h3 class="card-title" style="margin-bottom: 1.5rem;">Resource Utilization</h3>
                    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                        ${renderProgress('Oxygen Supply', 65, 'var(--primary)')}
                        ${renderProgress('General Ward Beds', 88, 'var(--warning)')}
                        ${renderProgress('ICU Capacity', 40, 'var(--success)')}
                    </div>
                    <div style="margin-top: 2rem; padding: 1rem; background: var(--primary-soft); border-radius: var(--radius-md); border: 1px solid var(--primary);">
                        <p style="font-size: 0.85rem; font-weight: 600; color: var(--primary);">
                            <i data-lucide="info" size="16" style="vertical-align: middle; margin-right: 4px;"></i>
                            Smart Inventory: 2 units of Artemether remaining. Automated reorder triggered.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderTriage(container) {
    container.innerHTML = `
        <div class="fade-in">
            <div class="card-header">
                <div>
                    <h2 class="card-title">Triage Station (Section 3.2)</h2>
                    <p style="color: var(--text-muted);">Priority auto-routing enabled based on vital thresholds.</p>
                </div>
                <div style="display: flex; gap: 1rem;">
                    <div style="background: white; border: 1px solid var(--border); padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.85rem; display: flex; align-items: center; gap: 8px;">
                         <span style="width: 10px; height: 10px; border-radius: 50%; background: var(--danger);"></span> Critical (Temp ≥ 39°C)
                    </div>
                </div>
            </div>

            <div class="card" style="padding: 0;">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Patient Identity</th>
                            <th>Chief Complaint</th>
                            <th>Vital Stats</th>
                            <th>Priority Flag</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${STATE.patients.map(p => `
                            <tr style="${p.status === 'Priority' ? 'background: #fffafa;' : ''}">
                                <td style="font-weight: 700; color: var(--text-muted);">${p.arrival}</td>
                                <td>
                                    <div class="patient-info">
                                        <span class="patient-name">${p.name}</span>
                                        <span class="patient-id">${p.id} | ${p.age}y ${p.gender.charAt(0)}</span>
                                    </div>
                                </td>
                                <td style="max-width: 250px; font-size: 0.9rem;">${p.complaint}</td>
                                <td>
                                    <div style="display: flex; flex-direction: column; gap: 4px;">
                                        <div style="display: flex; gap: 10px; font-size: 0.85rem;">
                                            <span title="Temp"><i data-lucide="thermometer" size="14"></i> ${p.temp}°C</span>
                                            <span title="SpO2"><i data-lucide="wind" size="14"></i> ${p.spo2}%</span>
                                        </div>
                                        <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">
                                            BP: ${p.bp}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span class="status-pill ${p.status === 'Priority' ? 'pill-priority' : 'pill-stable'}">
                                        ${p.status}
                                    </span>
                                </td>
                                <td>
                                    <div style="display: flex; gap: 0.5rem;">
                                        <button class="btn btn-primary" style="padding: 0.5rem; border-radius: 8px;" onclick="renderView('consultation')"><i data-lucide="user-cog"></i></button>
                                        <button class="icon-btn" style="border: 1px solid var(--border);"><i data-lucide="more-vertical"></i></button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderConsultation(container) {
    const p = STATE.patients[0]; // Focusing on Amaka
    container.innerHTML = `
        <div class="fade-in">
            <div class="card-header">
                <div>
                    <h2 class="card-title">Clinical Consultation (Section 3.3)</h2>
                    <p style="color: var(--text-muted);">Active Patient: ${p.name}</p>
                </div>
                <div style="display: flex; gap: 1rem;">
                    <button class="btn" style="background: white; border: 1px solid var(--border);">Discard</button>
                    <button class="btn btn-primary"><i data-lucide="check-circle"></i> Finalize Visit</button>
                </div>
            </div>

            <div class="main-grid">
                <div style="display: flex; flex-direction: column; gap: 2rem;">
                    <div class="card">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem;">
                            <div>
                                <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--primary); text-transform: uppercase; margin-bottom: 0.5rem;">Chief Complaint</label>
                                <div style="font-size: 1.25rem; font-weight: 700;">${p.complaint}</div>
                            </div>
                            <div style="text-align: right;">
                                <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem;">Triage Alert</label>
                                <span class="status-pill pill-priority">High Temperature Pulse</span>
                            </div>
                        </div>

                        <div style="margin-bottom: 2rem;">
                            <label style="display: block; font-weight: 700; margin-bottom: 1rem;">Clinical Assessment</label>
                            <textarea placeholder="Document symptoms, physical exam findings, and assessment..." 
                                style="width: 100%; height: 200px; padding: 1.25rem; border-radius: var(--radius-md); border: 2px solid var(--border); font-family: inherit; font-size: 1rem; resize: none; outline: none; transition: border-color 0.2s;"
                                onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border)'"></textarea>
                        </div>

                        <div style="border-top: 1px solid var(--border); padding-top: 2rem;">
                            <div class="card-header" style="margin-bottom: 1.5rem;">
                                <h4 class="card-title" style="font-size: 1rem;">One-Click Clinical Orders</h4>
                                <div style="display: flex; gap: 8px;">
                                    <button class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">Lab</button>
                                    <button class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">Pharmacy</button>
                                </div>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div style="padding: 1rem; border: 1px dashed var(--border); border-radius: 12px;">
                                    <span style="display: block; font-size: 0.7rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.75rem;">QUICK LABS</span>
                                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                        ${renderQuickTag('Full Blood Count')}
                                        ${renderQuickTag('Malaria MP')}
                                        ${renderQuickTag('Urinalysis')}
                                    </div>
                                </div>
                                <div style="padding: 1rem; border: 1px dashed var(--border); border-radius: 12px;">
                                    <span style="display: block; font-size: 0.7rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.75rem;">QUICK PHARMACY</span>
                                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                        ${renderQuickTag('Artemether')}
                                        ${renderQuickTag('Paracetamol')}
                                        ${renderQuickTag('Amoxicillin')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <aside style="display: flex; flex-direction: column; gap: 2rem;">
                    <div class="card" style="background: var(--primary-soft); border: 1px solid var(--primary);">
                        <h4 class="card-title" style="font-size: 0.95rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 8px;">
                            <i data-lucide="history" size="18"></i> Longitudinal History
                        </h4>
                        <div style="display: flex; flex-direction: column; gap: 1.5rem; border-left: 2px solid var(--primary); padding-left: 1.25rem; margin-left: 0.5rem;">
                            <div style="position: relative;">
                                <div style="position: absolute; left: -25px; top: 4px; width: 8px; height: 8px; background: var(--primary); border-radius: 50%;"></div>
                                <div style="font-size: 0.85rem; font-weight: 700;">14 Mar 2026</div>
                                <div style="font-size: 0.75rem; color: var(--text-muted);">Treatment for suspected Malaria</div>
                            </div>
                            <div style="position: relative;">
                                <div style="position: absolute; left: -25px; top: 4px; width: 8px; height: 8px; background: var(--border); border-radius: 50%;"></div>
                                <div style="font-size: 0.85rem; font-weight: 700;">22 Jan 2026</div>
                                <div style="font-size: 0.75rem; color: var(--text-muted);">Annual Physical Exam</div>
                            </div>
                            <div style="position: relative; opacity: 0.6;">
                                <div style="position: absolute; left: -25px; top: 4px; width: 8px; height: 8px; background: var(--border); border-radius: 50%;"></div>
                                <div style="font-size: 0.85rem; font-weight: 700;">15 Oct 2025</div>
                                <div style="font-size: 0.75rem; color: var(--text-muted);">Minor Upper Respiratory Infection</div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <h4 class="card-title" style="font-size: 0.95rem; margin-bottom: 1rem;">Active Vitals</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                            ${renderVitalCompact('TEMP', p.temp + '°C', p.temp >= 39)}
                            ${renderVitalCompact('SPO2', p.spo2 + '%', p.spo2 < 94)}
                            ${renderVitalCompact('BPM', '88', false)}
                            ${renderVitalCompact('BP', p.bp, false)}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    `;
}

// --- Component Helpers ---

function renderStatCard(label, value, icon, trendClass, trendLabel) {
    return `
        <div class="stat-card">
            <div class="stat-header">
                <div class="stat-icon-box" style="background: var(--primary-soft); color: var(--primary);">
                    <i data-lucide="${icon}"></i>
                </div>
                <div class="stat-trend ${trendClass}">
                    ${trendLabel}
                </div>
            </div>
            <div>
                <span class="stat-label">${label}</span>
                <div class="stat-value">${value}</div>
            </div>
        </div>
    `;
}

function renderProgress(label, value, color) {
    return `
        <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.5rem;">
                <span>${label}</span>
                <span>${value}%</span>
            </div>
            <div style="height: 10px; background: var(--bg-app); border-radius: 5px; overflow: hidden;">
                <div style="width: ${value}%; height: 100%; background: ${color}; border-radius: 5px;"></div>
            </div>
        </div>
    `;
}

function renderQuickTag(text) {
    return `
        <button class="btn" style="padding: 0.4rem 0.75rem; font-size: 0.75rem; background: white; border: 1px solid var(--border); color: var(--text-main); font-weight: 600;"
            onclick="this.style.borderColor='var(--primary)'; this.style.background='var(--primary-soft)'; this.style.color='var(--primary)'">
            ${text}
        </button>
    `;
}

function renderVitalCompact(label, value, isAlert) {
    return `
        <div style="padding: 0.75rem; background: ${isAlert ? 'var(--danger-soft)' : 'var(--bg-app)'}; border-radius: 8px; text-align: center;">
            <div style="font-size: 0.65rem; font-weight: 700; color: var(--text-muted); margin-bottom: 4px;">${label}</div>
            <div style="font-size: 1rem; font-weight: 800; color: ${isAlert ? 'var(--danger)' : 'var(--text-main)'};">${value}</div>
        </div>
    `;
}
