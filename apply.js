// js/apply.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Security Check
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // 2. Get Job Details from URL
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = parseInt(urlParams.get('jobId'));
    const job = jobs.find(j => j.id === jobId);

    if (!job) {
        alert("Invalid Job Link. Returning to home.");
        window.location.href = 'index.html';
        return;
    }

    // 3. DUPLICATE CHECK: Prevent applying twice to the same job
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const alreadyApplied = applications.some(a => a.email === currentUser.email && a.jobId === job.id);

    if (alreadyApplied) {
        document.getElementById('formWrapper').innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <i class="fas fa-exclamation-circle" style="font-size: 50px; color: #f57f17; margin-bottom: 20px;"></i>
                <h2 style="color: #333; margin-bottom: 10px;">Already Applied</h2>
                <p style="color: #666; margin-bottom: 25px;">You have already submitted an application for the <strong>${job.title}</strong> position.</p>
                <a href="student-dashboard.html" class="btn-primary">View My Dashboard</a>
            </div>
        `;
        return; // Stop the script here
    }

    // 4. Fill in UI and Auto-fill inputs
    document.title = `Apply: ${job.title} - Edo State Jobs`;
    document.getElementById('applyJobTitle').textContent = job.title;
    document.getElementById('backToJobLink').setAttribute('href', `job-details.html?id=${job.id}`);

    document.getElementById('fullname').value = currentUser.name;
    document.getElementById('email').value = currentUser.email;

    // 5. Character Counter for Cover Message
    const coverInput = document.getElementById('cover_message');
    const charCountDisplay = document.getElementById('charCount');
    
    if (coverInput && charCountDisplay) {
        coverInput.addEventListener('input', function() {
            const currentLength = this.value.length;
            charCountDisplay.textContent = currentLength;
            
            if (currentLength >= 500) {
                charCountDisplay.style.color = '#d32f2f';
                charCountDisplay.style.fontWeight = 'bold';
            } else {
                charCountDisplay.style.color = '#888';
                charCountDisplay.style.fontWeight = 'normal';
            }
        });
    }

    // 6. Form Submission Logic
    document.getElementById('applicationForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const newApplication = {
            id: Date.now(),
            jobId: job.id,
            jobTitle: job.title,
            applicantName: currentUser.name,
            email: currentUser.email,
            phone: document.getElementById('phone').value,
            school: document.getElementById('school').value,
            course: document.getElementById('course').value,
            cvLink: document.getElementById('cv_link').value,
            coverMessage: document.getElementById('cover_message').value,
            dateApplied: new Date().toISOString(),
            status: 'Pending'
        };

        applications.push(newApplication);
        localStorage.setItem('applications', JSON.stringify(applications));

        document.getElementById('formWrapper').style.display = 'none';
        
        // Show success and point to Dashboard
        const successMsg = document.getElementById('successMessage');
        successMsg.innerHTML = `
            <i class="fas fa-check-circle" style="font-size: 60px; color: #00e676; margin-bottom: 20px;"></i>
            <h2 style="color: #004d25; margin-bottom: 10px;">Application Submitted!</h2>
            <p style="color: #555; margin-bottom: 30px;">Thank you for applying for <strong>${job.title}</strong>. We will review your details shortly.</p>
            <a href="student-dashboard.html" class="btn-primary">Track My Applications</a>
        `;
        successMsg.style.display = 'block';
        
        window.scrollTo(0, 0);
    });
});