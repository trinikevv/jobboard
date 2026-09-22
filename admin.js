if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
    window.location.href = 'admin-login.html';
}

function getApplications() { return JSON.parse(localStorage.getItem('applications') || '[]'); }
function saveApplications(apps) { localStorage.setItem('applications', JSON.stringify(apps)); }
function getUsers() { return JSON.parse(localStorage.getItem('usersDB') || '[]'); }
function saveUsers(usersList) { localStorage.setItem('usersDB', JSON.stringify(usersList)); }
function getJobs() { return JSON.parse(localStorage.getItem('edoJobsDB') || '[]'); }
function saveJobs(jobsList) { localStorage.setItem('edoJobsDB', JSON.stringify(jobsList)); }

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatDateTime(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function timeAgo(dateString) {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 }
    ];
    for (const i of intervals) {
        const count = Math.floor(seconds / i.seconds);
        if (count >= 1) return `${count} ${i.label}${count > 1 ? 's' : ''} ago`;
    }
    return 'Just now';
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function isDeadlinePassed(deadline) {
    return new Date() > new Date(deadline);
}

document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.sidebar-link[data-section]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            renderSection(section);
        });
    });

    updateBadges();
    renderSection('overview');
});

function updateBadges() {
    document.getElementById('appBadge').textContent = getApplications().length;
}

function adminLogout() {
    if (confirm("Are you sure you want to logout?")) {
        sessionStorage.removeItem('adminLoggedIn');
        window.location.href = 'admin-login.html';
    }
}

function renderSection(section) {
    const content = document.getElementById('adminContent');
    const title = document.getElementById('pageTitle');
    const subtitle = document.getElementById('pageSubtitle');

    switch (section) {
        case 'overview':
            title.textContent = 'Overview';
            subtitle.textContent = 'Welcome back, Admin';
            renderOverview(content);
            break;
        case 'applications':
            title.textContent = 'Applications';
            subtitle.textContent = 'Manage student internship applications';
            renderApplications(content);
            break;
        case 'jobs':
            title.textContent = 'Jobs';
            subtitle.textContent = 'Manage internship listings';
            renderJobs(content);
            break;
        case 'students':
            title.textContent = 'Students';
            subtitle.textContent = 'View all registered students';
            renderStudents(content);
            break;
        case 'settings':
            title.textContent = 'Settings';
            subtitle.textContent = 'Manage your admin account and system data';
            renderSettings(content);
            break;
    }
}

// OVERVIEW
function renderOverview(container) {
    const apps = getApplications();
    const users = getUsers();
    const jobs = getJobs();

    const today = new Date();
    const openJobs = jobs.filter(j => j.status === 'open' && new Date(j.deadline) >= today);
    const closedJobs = jobs.filter(j => j.status === 'closed' || new Date(j.deadline) < today);
    const pendingApps = apps.filter(a => a.status === 'Pending');

    let activityTimeline = [];
    
    apps.forEach(app => {
        activityTimeline.push({
            type: 'app',
            date: app.dateApplied,
            title: app.applicantName,
            desc: `Submitted application for <strong>${app.jobTitle}</strong>`
        });
    });

    users.forEach(user => {
        if (user.joinDate) {
            activityTimeline.push({
                type: 'user',
                date: user.joinDate,
                title: user.name,
                desc: 'Created a new student account'
            });
        }
    });

    activityTimeline.sort((a, b) => new Date(b.date) - new Date(a.date));
    activityTimeline = activityTimeline.slice(0, 8);

    container.innerHTML = `
        <div class="overview-stats">
            <div class="overview-card green">
                <div class="overview-info">
                    <h3>${apps.length}</h3>
                    <p>Total Applications</p>
                </div>
                <div class="overview-icon"><i class="fas fa-file-lines"></i></div>
            </div>
            <div class="overview-card blue">
                <div class="overview-info">
                    <h3>${users.length}</h3>
                    <p>Registered Students</p>
                </div>
                <div class="overview-icon"><i class="fas fa-user-graduate"></i></div>
            </div>
            <div class="overview-card orange">
                <div class="overview-info">
                    <h3>${openJobs.length}</h3>
                    <p>Active Jobs</p>
                </div>
                <div class="overview-icon"><i class="fas fa-briefcase"></i></div>
            </div>
            <div class="overview-card red">
                <div class="overview-info">
                    <h3>${pendingApps.length}</h3>
                    <p>Pending Reviews</p>
                </div>
                <div class="overview-icon"><i class="fas fa-clock"></i></div>
            </div>
        </div>

        <div class="panel">
            <div class="panel-header">
                <h2><i class="fas fa-bell"></i> Activity Feed</h2>
            </div>
            <div class="activity-feed">
                ${activityTimeline.length === 0 
                    ? `<div class="empty-state">
                         <i class="fas fa-history"></i>
                         <p>No recent activity. Signups and applications will appear here.</p>
                       </div>`
                    : activityTimeline.map(item => `
                        <div class="activity-item">
                            <div class="activity-icon ${item.type === 'app' ? 'icon-app' : 'icon-user'}">
                                <i class="fas ${item.type === 'app' ? 'fa-file-lines' : 'fa-user-plus'}"></i>
                            </div>
                            <div class="activity-info">
                                <h4>${item.title}</h4>
                                <p>${item.desc}</p>
                            </div>
                            <div class="activity-date">${timeAgo(item.date)}</div>
                        </div>
                    `).join('')
                }
            </div>
        </div>

        <div class="panel">
            <div class="panel-header">
                <h2><i class="fas fa-info-circle"></i> Quick Info</h2>
            </div>
            <p style="color:#555; line-height:1.8;">
                <strong>Total Jobs:</strong> ${jobs.length} (${openJobs.length} open, ${closedJobs.length} closed)<br>
                <strong>Application Rate:</strong> ${users.length > 0 ? ((apps.length / users.length) * 100).toFixed(1) : 0}% of registered students have applied<br>
                <strong>Most Popular Job:</strong> ${getMostAppliedJob(apps)}
            </p>
        </div>
    `;
}

function getMostAppliedJob(apps) {
    if (apps.length === 0) return 'N/A';
    const counts = {};
    apps.forEach(a => {
        counts[a.jobTitle] = (counts[a.jobTitle] || 0) + 1;
    });
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
}

// APPLICATIONS
function renderApplications(container) {
    const uniqueJobs = [...new Set(getApplications().map(a => a.jobTitle))];

    container.innerHTML = `
        <div class="admin-table-wrapper">
            <div class="admin-table-tools">
                <div class="admin-tools-left">
                    <input type="text" class="admin-search-input" id="appSearchInput" 
                           placeholder="Search by name or email..." oninput="applyAppFilters()">
                    <select class="admin-filter-select" id="appJobFilter" onchange="applyAppFilters()">
                        <option value="">All Jobs</option>
                        ${uniqueJobs.map(j => `<option value="${j}">${j}</option>`).join('')}
                    </select>
                    <select class="admin-filter-select" id="appStatusFilter" onchange="applyAppFilters()">
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
                <div class="admin-tools-right" id="appCountDisplay"></div>
            </div>
            <div class="admin-table-scroll">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Applicant</th>
                            <th>Applied For</th>
                            <th>School</th>
                            <th>Date Applied</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="appTableBody"></tbody>
                </table>
            </div>
        </div>

        <div class="admin-modal-overlay" id="appDetailModal">
            <div class="admin-modal" id="appModalContent"></div>
        </div>
    `;

    applyAppFilters();
}

function applyAppFilters() {
    const searchInput = document.getElementById('appSearchInput');
    const jobFilter = document.getElementById('appJobFilter');
    const statusFilter = document.getElementById('appStatusFilter');

    if (!searchInput) return;

    const search = searchInput.value.toLowerCase();
    const jobVal = jobFilter.value;
    const statusVal = statusFilter.value;

    let apps = getApplications();

    apps = apps.filter(a => {
        const matchesSearch = a.applicantName.toLowerCase().includes(search) || 
                             a.email.toLowerCase().includes(search);
        const matchesJob = !jobVal || a.jobTitle === jobVal;
        const matchesStatus = !statusVal || a.status === statusVal;
        return matchesSearch && matchesJob && matchesStatus;
    });

    apps.sort((a, b) => new Date(b.dateApplied) - new Date(a.dateApplied));

    renderAppTable(apps);
    document.getElementById('appCountDisplay').textContent = 
        `Showing ${apps.length} application${apps.length !== 1 ? 's' : ''}`;
}

function renderAppTable(apps) {
    const tbody = document.getElementById('appTableBody');
    
    if (apps.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="6">
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>No applications match your filters.</p>
                </div>
            </td></tr>
        `;
        return;
    }

    tbody.innerHTML = apps.map(app => `
        <tr>
            <td>
                <div class="applicant-cell">
                    <div class="applicant-avatar">${getInitials(app.applicantName)}</div>
                    <div class="applicant-info">
                        <h4>${app.applicantName}</h4>
                        <p>${app.email}</p>
                    </div>
                </div>
            </td>
            <td><strong style="color:#004d25;">${app.jobTitle}</strong></td>
            <td>${app.school}</td>
            <td>${formatDate(app.dateApplied)}</td>
            <td><span class="status-pill status-${app.status}">${app.status}</span></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn view" onclick="viewApplication(${app.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteApplication(${app.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function viewApplication(appId) {
    const apps = getApplications();
    const app = apps.find(a => a.id === appId);
    if (!app) return;

    const modal = document.getElementById('appDetailModal');
    const modalContent = document.getElementById('appModalContent');

    modalContent.innerHTML = `
        <div class="admin-modal-header">
            <div>
                <h2>${app.applicantName}</h2>
                <p>Applied for ${app.jobTitle}</p>
            </div>
            <button class="admin-modal-close" onclick="closeAppModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>

        <div class="admin-modal-body">
            <div class="detail-row">
                <div class="detail-label">Full Name</div>
                <div class="detail-value">${app.applicantName}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Email</div>
                <div class="detail-value"><a href="mailto:${app.email}">${app.email}</a></div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Phone</div>
                <div class="detail-value"><a href="tel:${app.phone}">${app.phone}</a></div>
            </div>
            <div class="detail-row">
                <div class="detail-label">School</div>
                <div class="detail-value">${app.school}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Course</div>
                <div class="detail-value">${app.course}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">CV Link</div>
                <div class="detail-value">
                    <a href="${app.cvLink}" target="_blank">
                        <i class="fas fa-external-link-alt"></i> View CV
                    </a>
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Applied On</div>
                <div class="detail-value">${formatDateTime(app.dateApplied)}</div>
            </div>
            <div class="detail-row" style="flex-direction:column; gap:6px;">
                <div class="detail-label">Cover Message</div>
                <div class="cover-message-box">${app.coverMessage}</div>
            </div>
        </div>

        <div class="admin-modal-footer">
            <div class="status-change-group">
                <button class="status-btn ${app.status === 'Pending' ? 'active' : ''}" 
                        onclick="changeAppStatus(${app.id}, 'Pending')">Pending</button>
                <button class="status-btn ${app.status === 'Reviewed' ? 'active' : ''}" 
                        onclick="changeAppStatus(${app.id}, 'Reviewed')">Reviewed</button>
                <button class="status-btn ${app.status === 'Shortlisted' ? 'active' : ''}" 
                        onclick="changeAppStatus(${app.id}, 'Shortlisted')">Shortlisted</button>
                <button class="status-btn ${app.status === 'Rejected' ? 'active' : ''}" 
                        onclick="changeAppStatus(${app.id}, 'Rejected')">Rejected</button>
            </div>
            <button class="btn-delete-app" onclick="deleteApplication(${app.id})">
                <i class="fas fa-trash"></i> Delete Application
            </button>
        </div>
    `;

    modal.classList.add('show');
}

function closeAppModal() {
    document.getElementById('appDetailModal').classList.remove('show');
}

function changeAppStatus(appId, newStatus) {
    const apps = getApplications();
    const idx = apps.findIndex(a => a.id === appId);
    if (idx === -1) return;
    
    apps[idx].status = newStatus;
    saveApplications(apps);
    
    viewApplication(appId);
    applyAppFilters();
    updateBadges();
}

function deleteApplication(appId) {
    if (!confirm("Are you sure you want to delete this application? This cannot be undone.")) return;
    
    let apps = getApplications();
    apps = apps.filter(a => a.id !== appId);
    saveApplications(apps);
    
    closeAppModal();
    applyAppFilters();
    updateBadges();
    
    if (document.getElementById('pageTitle').textContent === 'Overview') {
        renderSection('overview');
    }
}

// JOBS MANAGER
function renderJobs(container) {
    const jobs = getJobs();
    const openCount = jobs.filter(j => j.status === 'open' && !isDeadlinePassed(j.deadline)).length;
    const closedCount = jobs.length - openCount;

    container.innerHTML = `
        <div class="jobs-toolbar">
            <div class="jobs-toolbar-left">
                <div class="jobs-count-info">
                    <strong>${jobs.length}</strong> Total Jobs · 
                    <span style="color:#2e7d32;">${openCount} Open</span> · 
                    <span style="color:#c62828;">${closedCount} Closed</span>
                </div>
            </div>
            <button class="btn-add-job" onclick="openJobForm()">
                <i class="fas fa-plus"></i> Add New Job
            </button>
        </div>

        <div class="admin-job-grid" id="adminJobGrid"></div>

        <div class="admin-modal-overlay" id="jobFormModal">
            <div class="admin-modal job-form-modal" id="jobFormContent"></div>
        </div>
    `;

    renderJobsGrid();
}

function renderJobsGrid() {
    const grid = document.getElementById('adminJobGrid');
    const jobs = getJobs();
    const apps = getApplications();

    if (jobs.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-briefcase"></i>
                <p>No jobs posted yet. Click "Add New Job" to create the first one.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = jobs.map(job => {
        const closed = job.status === 'closed' || isDeadlinePassed(job.deadline);
        const appCount = apps.filter(a => a.jobId === job.id).length;

        return `
            <div class="admin-job-card ${closed ? 'closed' : ''}">
                <div class="admin-job-card-header">
                    <span class="admin-job-badge ${closed ? 'closed' : ''}">
                        ${closed ? 'Closed' : job.category}
                    </span>
                    <span class="admin-app-count" title="${appCount} applications">
                        <i class="fas fa-users"></i> ${appCount}
                    </span>
                </div>
                <h3>${job.title}</h3>
                <div class="admin-job-info"><i class="fas fa-building"></i> ${job.company}</div>
                <div class="admin-job-info"><i class="fas fa-map-marker-alt"></i> ${job.location}</div>
                <div class="admin-job-info admin-job-deadline">
                    <i class="fas fa-clock"></i> Deadline: ${formatDate(job.deadline)}
                </div>
                <div class="admin-job-card-actions">
                    <button class="job-action-btn edit" onclick="openJobForm(${job.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="job-action-btn toggle" onclick="toggleJobStatus(${job.id})">
                        <i class="fas fa-${closed ? 'lock-open' : 'lock'}"></i> 
                        ${closed ? 'Reopen' : 'Close'}
                    </button>
                    <button class="job-action-btn delete" onclick="deleteJob(${job.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function openJobForm(jobId = null) {
    const jobs = getJobs();
    const editingJob = jobId ? jobs.find(j => j.id === jobId) : null;
    const isEditing = !!editingJob;

    const modal = document.getElementById('jobFormModal');
    const content = document.getElementById('jobFormContent');
    const today = new Date().toISOString().split('T')[0];

    content.innerHTML = `
        <div class="admin-modal-header">
            <div>
                <h2>${isEditing ? 'Edit Job' : 'Add New Job'}</h2>
                <p>${isEditing ? 'Update the job details below' : 'Fill in the details for the new internship position'}</p>
            </div>
            <button class="admin-modal-close" onclick="closeJobForm()">
                <i class="fas fa-times"></i>
            </button>
        </div>

        <div class="admin-modal-body">
            <form id="jobForm" class="job-form" onsubmit="saveJobForm(event, ${jobId})">
                <div class="job-form-row">
                    <div class="job-form-group">
                        <label>Job Title *</label>
                        <input type="text" id="jobTitle" required 
                               value="${editingJob?.title || ''}" 
                               placeholder="e.g. Frontend Developer Intern">
                    </div>
                    <div class="job-form-group">
                        <label>Company *</label>
                        <input type="text" id="jobCompany" required 
                               value="${editingJob?.company || 'Edo State ICT Agency'}" 
                               placeholder="e.g. Edo State ICT Agency">
                    </div>
                </div>

                <div class="job-form-row">
                    <div class="job-form-group">
                        <label>Location *</label>
                        <input type="text" id="jobLocation" required 
                               value="${editingJob?.location || 'Benin City, Edo State'}" 
                               placeholder="e.g. Benin City, Edo State">
                    </div>
                    <div class="job-form-group">
                        <label>Category *</label>
                        <select id="jobCategory" required>
                            <option value="">-- Select --</option>
                            <option value="Software Development" ${editingJob?.category === 'Software Development' ? 'selected' : ''}>Software Development</option>
                            <option value="Design" ${editingJob?.category === 'Design' ? 'selected' : ''}>Design</option>
                            <option value="Data & Infrastructure" ${editingJob?.category === 'Data & Infrastructure' ? 'selected' : ''}>Data & Infrastructure</option>
                            <option value="Cybersecurity" ${editingJob?.category === 'Cybersecurity' ? 'selected' : ''}>Cybersecurity</option>
                            <option value="IT Support" ${editingJob?.category === 'IT Support' ? 'selected' : ''}>IT Support</option>
                            <option value="Digital Marketing" ${editingJob?.category === 'Digital Marketing' ? 'selected' : ''}>Digital Marketing</option>
                        </select>
                    </div>
                </div>

                <div class="job-form-row">
                    <div class="job-form-group">
                        <label>Application Deadline *</label>
                        <input type="date" id="jobDeadline" required 
                               value="${editingJob?.deadline || ''}" 
                               min="${today}">
                    </div>
                    <div class="job-form-group">
                        <label>Duration</label>
                        <input type="text" id="jobDuration" 
                               value="${editingJob?.duration || '6 Months'}" 
                               placeholder="e.g. 6 Months">
                    </div>
                    <div class="job-form-group">
                        <label>Stipend</label>
                        <input type="text" id="jobStipend" 
                               value="${editingJob?.stipend || 'Competitive'}" 
                               placeholder="e.g. Competitive">
                    </div>
                </div>

                <div class="job-form-group full">
                    <label>Job Description *</label>
                    <textarea id="jobDescription" rows="4" required 
                              placeholder="Describe the role...">${editingJob?.description || ''}</textarea>
                </div>

                <div class="job-form-group full">
                    <label>Key Responsibilities *</label>
                    <textarea id="jobResponsibilities" rows="5" required 
                              placeholder="Enter one responsibility per line">${editingJob?.responsibilities?.join('\n') || ''}</textarea>
                    <span class="job-form-hint">Enter each responsibility on a new line</span>
                </div>

                <div class="job-form-group full">
                    <label>Requirements & Qualifications *</label>
                    <textarea id="jobRequirements" rows="5" required 
                              placeholder="Enter one requirement per line">${editingJob?.requirements?.join('\n') || ''}</textarea>
                    <span class="job-form-hint">Enter each requirement on a new line</span>
                </div>
            </form>
        </div>

        <div class="admin-modal-footer">
            <button class="btn-cancel" onclick="closeJobForm()">Cancel</button>
            <button class="btn-save-job" onclick="document.getElementById('jobForm').requestSubmit()">
                <i class="fas fa-save"></i> ${isEditing ? 'Update Job' : 'Create Job'}
            </button>
        </div>
    `;

    modal.classList.add('show');
}

function closeJobForm() {
    document.getElementById('jobFormModal').classList.remove('show');
}

function saveJobForm(event, jobId) {
    event.preventDefault();
    
    const jobs = getJobs();
    const isEditing = !!jobId;

    const responsibilities = document.getElementById('jobResponsibilities').value
        .split('\n').map(r => r.trim()).filter(r => r.length > 0);
    
    const requirements = document.getElementById('jobRequirements').value
        .split('\n').map(r => r.trim()).filter(r => r.length > 0);

    const jobData = {
        id: isEditing ? jobId : Date.now(),
        title: document.getElementById('jobTitle').value.trim(),
        company: document.getElementById('jobCompany').value.trim(),
        location: document.getElementById('jobLocation').value.trim(),
        type: 'Internship',
        category: document.getElementById('jobCategory').value,
        deadline: document.getElementById('jobDeadline').value,
        status: isEditing ? jobs.find(j => j.id === jobId).status : 'open',
        postedDate: isEditing ? jobs.find(j => j.id === jobId).postedDate : new Date().toISOString().split('T')[0],
        duration: document.getElementById('jobDuration').value.trim() || '6 Months',
        stipend: document.getElementById('jobStipend').value.trim() || 'Competitive',
        description: document.getElementById('jobDescription').value.trim(),
        responsibilities: responsibilities,
        requirements: requirements
    };

    if (isEditing) {
        const idx = jobs.findIndex(j => j.id === jobId);
        jobs[idx] = jobData;
    } else {
        jobs.push(jobData);
    }

    saveJobs(jobs);
    closeJobForm();
    renderJobs(document.getElementById('adminContent'));
    
    alert(isEditing ? 'Job updated successfully!' : 'New job created successfully!');
}

function toggleJobStatus(jobId) {
    const jobs = getJobs();
    const idx = jobs.findIndex(j => j.id === jobId);
    if (idx === -1) return;

    const newStatus = jobs[idx].status === 'open' ? 'closed' : 'open';
    const action = newStatus === 'closed' ? 'close' : 'reopen';
    
    if (!confirm(`Are you sure you want to ${action} this job?`)) return;
    
    jobs[idx].status = newStatus;
    saveJobs(jobs);
    renderJobsGrid();
}

function deleteJob(jobId) {
    const apps = getApplications();
    const appCount = apps.filter(a => a.jobId === jobId).length;

    let message = "Are you sure you want to delete this job? This cannot be undone.";
    if (appCount > 0) {
        message = `⚠️ WARNING: This job has ${appCount} application${appCount > 1 ? 's' : ''}. Deleting the job will NOT delete the applications. Continue?`;
    }

    if (!confirm(message)) return;

    let jobs = getJobs();
    jobs = jobs.filter(j => j.id !== jobId);
    saveJobs(jobs);
    renderJobs(document.getElementById('adminContent'));
    
    alert('Job deleted successfully!');
}

// STUDENTS MANAGER
function renderStudents(container) {
    const users = getUsers();

    container.innerHTML = `
        <div class="jobs-toolbar">
            <div class="jobs-toolbar-left">
                <div class="jobs-count-info">
                    <strong>${users.length}</strong> Registered Student${users.length !== 1 ? 's' : ''}
                </div>
            </div>
            <div class="admin-tools-left">
                <input type="text" class="admin-search-input" id="studentSearchInput" 
                       placeholder="Search students by name or email..." oninput="applyStudentFilters()">
            </div>
        </div>
        <div class="student-grid" id="adminStudentGrid"></div>
    `;

    renderStudentGrid(users);
}

function applyStudentFilters() {
    const searchInput = document.getElementById('studentSearchInput');
    if (!searchInput) return;

    const search = searchInput.value.toLowerCase();
    let users = getUsers();

    if (search) {
        users = users.filter(u => 
            u.name.toLowerCase().includes(search) || 
            u.email.toLowerCase().includes(search)
        );
    }

    renderStudentGrid(users);
}

function renderStudentGrid(usersToRender) {
    const grid = document.getElementById('adminStudentGrid');
    const apps = getApplications();

    if (usersToRender.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-user-graduate"></i>
                <p>No students found.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = usersToRender.map(user => {
        const userApps = apps.filter(a => a.email === user.email);
        const appCount = userApps.length;

        return `
            <div class="student-card">
                <div class="applicant-avatar">${getInitials(user.name)}</div>
                <h3>${user.name}</h3>
                <p><a href="mailto:${user.email}" style="color:#666; text-decoration:none;">${user.email}</a></p>
                <div class="student-app-count">
                    <i class="fas fa-file-lines"></i> ${appCount} Application${appCount !== 1 ? 's' : ''}
                </div>
                <button class="btn-delete-student" onclick="deleteStudent('${user.email}')">
                    <i class="fas fa-user-minus"></i> Remove Student
                </button>
            </div>
        `;
    }).join('');
}

function deleteStudent(email) {
    const apps = getApplications();
    const userApps = apps.filter(a => a.email === email);
    
    let message = `Are you sure you want to delete this student account?`;
    if (userApps.length > 0) {
        message += `\n\n⚠️ WARNING: This will also delete their ${userApps.length} application(s).`;
    }

    if (!confirm(message)) return;

    let users = getUsers();
    users = users.filter(u => u.email !== email);
    saveUsers(users);

    let remainingApps = apps.filter(a => a.email !== email);
    saveApplications(remainingApps);

    applyStudentFilters();
    updateBadges();
    
    alert('Student and their applications deleted successfully.');
}

// SETTINGS
function renderSettings(container) {
    const currentQuestion = localStorage.getItem('adminSecurityQuestion') || 'Not set';

    container.innerHTML = `
        <div class="settings-grid">
            <div class="settings-panel">
                <div class="settings-panel-header">
                    <h2><i class="fas fa-lock"></i> Change Password</h2>
                    <p>Update your administrator login password.</p>
                </div>
                <form id="formUpdatePassword" class="settings-form" onsubmit="updateAdminPassword(event)">
                    <div class="job-form-group full">
                        <label>Current Password</label>
                        <input type="password" id="setCurrPass" required placeholder="Enter current password">
                    </div>
                    <div class="job-form-group full">
                        <label>New Password</label>
                        <input type="password" id="setNewPass" required minlength="6" placeholder="Enter new password">
                    </div>
                    <div class="job-form-group full">
                        <label>Confirm New Password</label>
                        <input type="password" id="setConfirmPass" required minlength="6" placeholder="Re-enter new password">
                    </div>
                    <button type="submit" class="btn-save-job">Update Password</button>
                </form>
            </div>

            <div style="display: flex; flex-direction: column; gap: 30px;">
                <div class="settings-panel">
                    <div class="settings-panel-header">
                        <h2><i class="fas fa-shield-alt"></i> Security Question</h2>
                        <p>Used to recover your password if you forget it.</p>
                        <p style="margin-top:8px; font-size:12px; color:#1976d2;">
                            <strong>Current:</strong> ${currentQuestion}
                        </p>
                    </div>
                    <form id="formUpdateSecurity" class="settings-form" onsubmit="updateSecurityQuestion(event)">
                        <div class="job-form-group full">
                            <label>New Security Question</label>
                            <select id="setNewQuestion" required>
                                <option value="">-- Select a question --</option>
                                <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                                <option value="What was the name of your first school?">What was the name of your first school?</option>
                                <option value="What is your favorite color?">What is your favorite color?</option>
                                <option value="What city were you born in?">What city were you born in?</option>
                                <option value="What is your pet's name?">What is your pet's name?</option>
                            </select>
                        </div>
                        <div class="job-form-group full">
                            <label>New Answer</label>
                            <input type="text" id="setNewAnswer" required placeholder="Type your answer">
                        </div>
                        <button type="submit" class="btn-save-job">Update Security Settings</button>
                    </form>
                </div>

                <div class="danger-zone">
                    <h3><i class="fas fa-exclamation-triangle"></i> Danger Zone</h3>
                    <p>Wipe all student accounts and internship applications from the system. <strong>Jobs will not be deleted.</strong> Use this to clean up test data.</p>
                    <button class="btn-danger-outline" onclick="wipeSystemData()">Wipe Test Data</button>
                </div>
            </div>
        </div>

        <div id="settingsToast" class="settings-toast">
            <i class="fas fa-check-circle"></i> <span id="settingsToastMsg">Settings saved!</span>
        </div>
    `;
}

function showSettingsToast(message) {
    const toast = document.getElementById('settingsToast');
    document.getElementById('settingsToastMsg').textContent = message;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

function updateAdminPassword(e) {
    e.preventDefault();
    
    const currentInput = document.getElementById('setCurrPass').value;
    const newPass = document.getElementById('setNewPass').value;
    const confirmPass = document.getElementById('setConfirmPass').value;
    
    const actualCurrentPass = localStorage.getItem('adminPassword');

    if (currentInput !== actualCurrentPass) {
        alert("Incorrect current password.");
        return;
    }

    if (newPass !== confirmPass) {
        alert("New passwords do not match.");
        return;
    }

    localStorage.setItem('adminPassword', newPass);
    document.getElementById('formUpdatePassword').reset();
    showSettingsToast("Password updated successfully!");
}

function updateSecurityQuestion(e) {
    e.preventDefault();
    
    const question = document.getElementById('setNewQuestion').value;
    const answer = document.getElementById('setNewAnswer').value.toLowerCase().trim();
    
    localStorage.setItem('adminSecurityQuestion', question);
    localStorage.setItem('adminSecurityAnswer', answer);
    
    document.getElementById('formUpdateSecurity').reset();
    showSettingsToast("Security question updated!");
    
    setTimeout(() => { renderSection('settings'); }, 1500);
}

function wipeSystemData() {
    const message = "🚨 EXTREME WARNING 🚨\n\nThis will delete ALL registered students and ALL applications permanently.\n\nType 'CONFIRM' to proceed:";
    const input = prompt(message);
    
    if (input === 'CONFIRM') {
        localStorage.setItem('usersDB', JSON.stringify([]));
        localStorage.setItem('applications', JSON.stringify([]));
        localStorage.removeItem('currentUser');
        
        updateBadges();
        showSettingsToast("System data wiped successfully.");
    } else if (input !== null) {
        alert("Action canceled. You didn't type 'CONFIRM'.");
    }
}