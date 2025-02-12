// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const nav = document.querySelector('nav');

mobileMenu.addEventListener('click', () => {
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
});

// Job Details Fetching
document.addEventListener('DOMContentLoaded', () => {
    const jobContainer = document.querySelector('.job-container');

    if (!jobContainer) {
        console.error('Error: .job-container not found');
        return;
    }

    fetch('jobs.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(jobs => {
            if (!Array.isArray(jobs)) {
                throw new Error('Invalid job data format');
            }

            jobContainer.innerHTML = ''; // Clear any existing content

            jobs.forEach(job => {
                // Ensure job object has required properties
                if (!job.title || !job.deadline || !job.link) {
                    console.warn('Skipping job with missing details:', job);
                    return;
                }

                const jobCard = document.createElement('div');
                jobCard.className = 'job-card';

                const jobTitle = document.createElement('div');
                jobTitle.className = 'job-title';
                jobTitle.textContent = job.title;

                const jobDeadline = document.createElement('div');
                jobDeadline.className = 'job-deadline';
                jobDeadline.textContent = `Last Date: ${job.deadline}`;

                jobCard.appendChild(jobTitle);
                jobCard.appendChild(jobDeadline);

                // Open job link in a new tab when clicked
                jobCard.addEventListener('click', () => {
                    window.open(job.link, '_blank');
                });

                jobContainer.appendChild(jobCard);
            });
        })
        .catch(error => console.error('Error fetching job data:', error));
});
