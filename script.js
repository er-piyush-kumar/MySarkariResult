// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function () {
  // 1. Fetch the Header and Initialize the Mobile Menu
  fetch("../Header/header.html") // Adjust this path to match your actual folder structure
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      // Insert the header HTML into the container
      document.getElementById("header-container").innerHTML = data;

      // Initialize the mobile menu toggle
      const mobileMenu = document.getElementById('mobile-menu');
      const nav = document.querySelector('nav');

      if (mobileMenu && nav) {
        mobileMenu.addEventListener('click', () => {
          nav.classList.toggle('active-nav'); // Toggle the 'active-nav' class
        });
      }
    })
    .catch(error => console.error("Error loading header:", error));

  // 2. Fetch the Footer
  fetch("../Footer/footer.html") // Adjust path if needed
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      // Insert the footer HTML into the container
      document.getElementById("footer-container").innerHTML = data;
    })
    .catch(error => console.error("Error loading footer:", error));

  // 3. Fetch and Display Job Details
  const jobContainer = document.querySelector('.job-container');

  if (!jobContainer) {
    console.error('Error: .job-container not found');
    return;
  }

  fetch('../jobs.json') // Adjust path if jobs.json is elsewhere
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

        // Create job card
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';

        // Add job title
        const jobTitle = document.createElement('div');
        jobTitle.className = 'job-title';
        jobTitle.textContent = job.title;

        // Add job deadline
        const jobDeadline = document.createElement('div');
        jobDeadline.className = 'job-deadline';
        jobDeadline.textContent = `Last Date: ${job.deadline}`;

        // Append title and deadline to the job card
        jobCard.appendChild(jobTitle);
        jobCard.appendChild(jobDeadline);

        // Open job link in a new tab when clicked
        jobCard.addEventListener('click', () => {
          window.open(job.link, '_blank');
        });

        // Append job card to the container
        jobContainer.appendChild(jobCard);
      });
    })
    .catch(error => console.error('Error fetching job data:', error));
});