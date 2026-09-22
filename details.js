document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = parseInt(urlParams.get('id'));

    const job = jobs.find(j => j.id === jobId);

    const jobContent = document.getElementById('jobContent');
    const errorContent = document.getElementById('errorContent');

    if (!job) {
        if(jobContent) jobContent.style.display = 'none';
        if(errorContent) errorContent.style.display = 'block';
        return;
    }

    if(jobContent) jobContent.style.display = 'block';
    
    document.title = `${job.title} - Edo State Intern Board`;
    document.getElementById('detailTitle').textContent = job.title;
    document.getElementById('detailCompany').textContent = job.company;
    document.getElementById('detailLocation').textContent = job.location;
    document.getElementById('detailType').textContent = job.type;

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    document.getElementById('detailDeadline').textContent = new Date(job.deadline).toLocaleDateString('en-US', options);
    document.getElementById('detailPosted').textContent = new Date(job.postedDate).toLocaleDateString('en-US', options);
    document.getElementById('detailCategory').textContent = job.category;
    document.getElementById('detailDuration').textContent = job.duration;
    document.getElementById('detailStipend').textContent = job.stipend;
    document.getElementById('detailDescription').textContent = job.description;

    const respList = document.getElementById('detailResponsibilities');
    job.responsibilities.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        respList.appendChild(li);
    });

    const reqList = document.getElementById('detailRequirements');
    job.requirements.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        reqList.appendChild(li);
    });

    const isClosed = job.status === 'closed' || new Date() > new Date(job.deadline);
    const btnHeader = document.getElementById('btnApplyHeader');
    const btnSidebar = document.getElementById('btnApplySidebar');

    if (isClosed) {
        document.getElementById('detailType').textContent = 'Closed';
        document.getElementById('detailType').style.backgroundColor = '#ffebee';
        document.getElementById('detailType').style.color = '#c62828';
        
        btnHeader.className = 'btn-disabled';
        btnHeader.textContent = 'Applications Closed';
        btnHeader.removeAttribute('href');

        btnSidebar.className = 'btn-disabled';
        btnSidebar.textContent = 'Applications Closed';
        btnSidebar.removeAttribute('href');
    } else {
        const applyUrl = `apply.html?jobId=${job.id}`;
        btnHeader.setAttribute('href', applyUrl);
        btnSidebar.setAttribute('href', applyUrl);
    }
});