import { crawlPage } from './crawl.js';

function main(){
    
    const testURL = process.argv[2];
    if (!testURL) {
        console.error('Please provide a URL as a command line argument');
        process.exit(1);
    }
    
    const baseURL = new URL(testURL).origin;
    const pages = new Map();
    
    crawlPage(testURL, baseURL, pages)
        .then(pages => {
            console.log('Crawling complete. Pages:', Array.from(pages.entries()));
        })
        .catch(error => {
            console.error('Error during crawling:', error);
        });
    
}
main()