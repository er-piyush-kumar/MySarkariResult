const fs = require('fs');
const path = require('path');

const HOMEPAGE_URL = 'https://mysarkariresult.in/';
const SITEMAP_PATH = path.join(__dirname, 'sitemap.xml');
const JOBS_JSON_PATH = path.join(__dirname, 'jobs.json');

function generateSitemap() {
  console.log('Generating sitemap...');

  // Read the job data from jobs.json
  fs.readFile(JOBS_JSON_PATH, 'utf8', (err, data) => {
    if (err) {
      console.error('❌ Error reading jobs.json:', err.message);
      return;
    }

    let jobs;
    try {
      jobs = JSON.parse(data);
    } catch (parseErr) {
      console.error('❌ Error parsing jobs.json:', parseErr.message);
      return;
    }

    // Use the current date/time as the last modified date
    const today = new Date().toISOString();

    // Start building the sitemap content
    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemapContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n`;

    // Add the homepage entry
    sitemapContent += `  <url>\n`;
    sitemapContent += `    <loc>${HOMEPAGE_URL}</loc>\n`;
    sitemapContent += `    <lastmod>${today}</lastmod>\n`;
    sitemapContent += `    <changefreq>daily</changefreq>\n`;
    sitemapContent += `    <priority>1.0</priority>\n`;
    sitemapContent += `  </url>\n\n`;

    // Loop over each job entry and add it to the sitemap
    jobs.forEach(job => {
      if (!job.link) {
        console.warn(`⚠️ Skipping job entry without a link:`, job);
        return;
      }

      // Ensure job.link is a valid URL or relative path
      const jobUrl = job.link.startsWith('http') ? job.link : `${HOMEPAGE_URL}${job.link}`;

      sitemapContent += `  <url>\n`;
      sitemapContent += `    <loc>${jobUrl}</loc>\n`;
      sitemapContent += `    <lastmod>${today}</lastmod>\n`;
      sitemapContent += `    <changefreq>weekly</changefreq>\n`;
      sitemapContent += `    <priority>0.8</priority>\n`;
      sitemapContent += `  </url>\n\n`;
    });

    sitemapContent += `</urlset>\n`;

    // Write the generated sitemap content to sitemap.xml
    fs.writeFile(SITEMAP_PATH, sitemapContent, 'utf8', err => {
      if (err) {
        console.error('❌ Error writing sitemap.xml:', err.message);
        return;
      }
      console.log('✅ sitemap.xml has been updated successfully.');
    });
  });
}

// Generate the sitemap initially
generateSitemap();

// Automatically watch for changes in jobs.json and update sitemap.xml accordingly
fs.watchFile(JOBS_JSON_PATH, { interval: 5000 }, () => {
  console.log('🔄 Detected changes in jobs.json. Updating sitemap.xml...');
  generateSitemap();
});
