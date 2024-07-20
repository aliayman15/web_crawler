// crawl.test.js

const {normalizeURL} = require('./crawl.js')
const {test,expect} = require('@jest/globals')
const { getURLsFromHTML } = require('./crawl');

test('should normalize https URLs', () => {
    const input = 'HTTPS://example.com/path';
    const actual = normalizeURL(input);
    const expected = 'example.com/path';
    expect(actual).toEqual(expected);
  });
  
  test('should normalize https URLs', () => {
    const input = 'HTTPS://example.com/path/';
    const actual = normalizeURL(input);
    const expected = 'example.com/path';
    expect(actual).toEqual(expected);
  });
  test('should normalize https URLs', () => {
    const input = 'HTTPS://EXample.com/path/';
    const actual = normalizeURL(input);
    const expected = 'example.com/path';
    expect(actual).toEqual(expected);
  });
    
test('extracts absolute URLs from HTML', () => {
    const inputHTML = `
        <html>
            <body>
                <a href="http://example.com/page1">Page 1</a>
                <a href="http://example.com/page2">Page 2</a>
            </body>
        </html>
    `;
    const baseURL = 'http://example.com';
    const actual = getURLsFromHTML(inputHTML, baseURL);
    const expected = [
        'http://example.com/page1',
        'http://example.com/page2'
    ];
    expect(actual).toEqual(expected);
});


test('ignores non-anchor elements', () => {
    const inputHTML = `
        <html>
            <body>
                <div>Just a div</div>
                <p>Just a paragraph</p>
            </body>
        </html>
    `;
    const baseURL = 'http://example.com';
    const actual = getURLsFromHTML(inputHTML, baseURL);
    const expected = [];
    expect(actual).toEqual(expected);
});

test('converts relative URLs to absolute URLs', () => {
    const inputHTML = `
        <html>
            <body>
                <a href="/page1">Page 1</a>
                <a href="/page2">Page 2</a>
            </body>
        </html>
    `;
    const baseURL = 'http://example.com';
    const actual = getURLsFromHTML(inputHTML, baseURL);
    const expected = [
        'http://example.com/page1',
        'http://example.com/page2'
    ];
    expect(actual).toEqual(expected);
});


