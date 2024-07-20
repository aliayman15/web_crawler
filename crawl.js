import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';

export function normalizeURL(urlString) {
    try {
        const normalizedURL = new URL(urlString.toLowerCase());
        const hostpath = `${normalizedURL.hostname}${normalizedURL.pathname}`;
        if (hostpath.length > 0 && hostpath.slice(-1) === '/') {
            return hostpath.slice(0, -1);
        }
        return hostpath;
    } catch (e) {
        throw new Error('Invalid URL');
    }
}

export function getURLsFromHTML(htmlBody, baseURL) {
    const dom = new JSDOM(htmlBody);
    const anchors = dom.window.document.querySelectorAll('a');
    const urls = new Set();

    anchors.forEach(anchor => {
        let href = anchor.getAttribute('href');
        if (href) {
            try {
                const url = new URL(href, baseURL);
                urls.add(url.href);
            } catch (e) {
                console.log(`Error processing URL: ${href} - ${e.message}`);
            }
        }
    });

    return Array.from(urls);
}

async function fetchAndParseURL(currentURL) {
    try {
        const response = await fetch(currentURL);

        if (response.status === 400) {
            console.error('Error: Bad Request (400)');
            return null;
        } else if (!response.ok) {
            console.error(`Error: ${response.status} ${response.statusText}`);
            return null;
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('text/html')) {
            console.error('Error: Response is not of type text/html');
            return null;
        }

        const htmlBody = await response.text();
        console.log(`Fetched HTML from: ${currentURL}`);
        
        return htmlBody;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return null;
    }
}

async function crawlPage(currentURL, baseURL, pages) {
    const normalizedURL = normalizeURL(currentURL);

    // Check if the URL is on the same domain as the base URL
    if (!currentURL.startsWith(baseURL)) {
        console.log(`Skipping URL not on the same domain: ${currentURL}`);
        return pages;
    }

    // Check if the URL is already in the pages map
    if (pages.has(normalizedURL)) {
        pages.set(normalizedURL, pages.get(normalizedURL) + 1);
        console.log(`URL already visited: ${normalizedURL}, Count: ${pages.get(normalizedURL)}`);
        return pages;
    }

    // Add the current URL to the pages map
    pages.set(normalizedURL, 1);

    const htmlBody = await fetchAndParseURL(currentURL);
    if (!htmlBody) {
        return pages;
    }

    const urls = getURLsFromHTML(htmlBody, baseURL);
    console.log('Extracted URLs:', urls);

    // Recursively crawl extracted URLs
    for (const url of urls) {
        await crawlPage(url, baseURL, pages);
    }

    return pages;
}

export { crawlPage };
