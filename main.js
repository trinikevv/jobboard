function isDeadlinePassed(deadline) {
    return new Date() > new Date(deadline);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function displayJobs(jobsToDisplay) {
    const jobGrid = document.getElementById('jobGrid');
    const noResults = document.getElementById('noResults');

    jobGrid.innerHTML = '';

    if (jobsToDisplay.length === 0) {
        noResults.style.display = 'block';
        return;
    } else {
        noResults.style.display = 'none';
    }

    jobsToDisplay.forEach(job => {
        const isClosed = job.status === 'closed' || isDeadlinePassed(job.deadline);

        const cardHTML = `
            <article class="job-card ${isClosed ? 'closed' : ''}">
                <div class="job-badge ${isClosed ? 'closed-badge' : ''}">
                    ${isClosed ? 'Closed' : job.category}
                </div>
                <h3>${job.title}</h3>
                <p class="company"><i class="fas fa-building"></i> ${job.company}</p>
                <p class="location"><i class="fas fa-map-marker-alt"></i> ${job.location}</p>
                <p class="deadline">
                    ${isClosed 
                        ? '<i class="fas fa-times-circle"></i> Applications Closed' 
                        : `<i class="fas fa-clock"></i> Deadline: ${formatDate(job.deadline)}`}
                </p>
                ${isClosed 
                    ? '<button class="btn-disabled" disabled>Closed</button>'
                    : `<a href="#" onclick="requireAuth(event, 'job-details.html?id=${job.id}')" class="btn-primary">View Details</a>`
                }
            </article>
        `;

        jobGrid.innerHTML += cardHTML;
    });
}

function updateCounter() {
    const openJobs = jobs.filter(job => 
        job.status === 'open' && !isDeadlinePassed(job.deadline)
    );
    const counter = document.getElementById('jobCounter');
    if(counter) counter.textContent = openJobs.length;
}

function filterJobs() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if(!searchInput || !categoryFilter) return;

    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;

    const filtered = jobs.filter(job => {
        const matchesSearch = 
            job.title.toLowerCase().includes(searchTerm) ||
            job.company.toLowerCase().includes(searchTerm);
        
        const matchesCategory = category === '' || job.category === category;

        return matchesSearch && matchesCategory;
    });

    displayJobs(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('jobGrid')) {
        displayJobs(jobs);
        updateCounter();

        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        
        if (categoryParam) {
            const filterSelect = document.getElementById('categoryFilter');
            if (filterSelect) {
                for(let i=0; i < filterSelect.options.length; i++) {
                    if(filterSelect.options[i].value === categoryParam) {
                        filterSelect.selectedIndex = i;
                        filterJobs();
                        break;
                    }
                }
            }
        }
    }
});