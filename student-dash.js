document.addEventListener('DOMContentLoaded', () => {
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('studentGreeting').textContent = `Welcome, ${currentUser.name.split(' ')[0]}!`;

    const allApps = JSON.parse(localStorage.getItem('applications') || '[]');
    const myApps = allApps.filter(app => app.email === currentUser.email);
    
    myApps.sort((a, b) => new Date(b.dateApplied) - new Date(a.dateApplied));

    const grid = document.getElementById('myApplicationsGrid');

    if (myApps.length === 0) {
        grid.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1;">
                <i class="fas fa-folder-open"></i>
                <h3>No Applications Yet</h3>
                <p>You haven't applied for any internships yet. Time to get started!</p>
                <a href="index.html" class="btn-primary" style="margin-top: 15px;">Find Jobs</a>
            </div>
        `;
        return;
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    grid.innerHTML = myApps.map(app => `
        <article class="job-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <div class="job-badge" style="margin: 0; background: #f4f7f6; color: #555;">
                    <i class="fas fa-calendar-alt"></i> Applied: ${formatDate(app.dateApplied)}
                </div>
                <span class="status-pill status-${app.status}">${app.status}</span>
            </div>
            
            <h3>${app.jobTitle}</h3>
            
            <div class="admin-job-info" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
                <strong>School:</strong> ${app.school}
            </div>
            <div class="admin-job-info">
                <strong>Course:</strong> ${app.course}
            </div>
            
            <a href="job-details.html?id=${app.jobId}" class="btn-primary" style="background: #e8f5e9; color: #004d25; width: 100%; text-align: center; margin-top: 15px;">
                View Job Posting
            </a>
        </article>
    `).join('');
});