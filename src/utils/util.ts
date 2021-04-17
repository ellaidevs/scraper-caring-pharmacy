import Cheerio from "cheerio";
import fetch from "node-fetch";
import {Product} from "./type"
import {scrapePage} from "./scraper"

export const PROVIDER_NAME = 'caring';

export async function fetchHtml(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        return await response.text();
    } catch (err) {
        console.log(`Error on URL: ${url}`, err);
        throw err;
    }
}

export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

//get all category url
export async function getCategoryUrl(url: string) {
    try {
        const htmlBody = await fetchHtml(url);
        const $ = Cheerio.load(htmlBody);
        const categorySelector = $('section.side-menu-primary ul.list-unstyled li a.side-menu-body-link');
        const CATEGORIES: string[] = [];

        for (let i = 0; i < categorySelector.length; i++) {
            const cat = $(categorySelector[i]);
            const url = cat.attr('href');
            CATEGORIES.push(url);
        }
        return CATEGORIES;
    } catch (e) {
        console.log('Error on getCategoryUrl', e);
    }
}

//scrape multiple pages
export async function scrapeMultiPage(url: string) {
    try {
        let res: Product[] = [];

        let i = 0;
        let scrapeUrl;
        do {
            i++;
            if (i > 1) {
                scrapeUrl = `${url}?p=${i}`;
            } else {
                scrapeUrl = `${url}`;
            }
            console.log('Current Page:', scrapeUrl);
            const {result} = await scrapePage(scrapeUrl);
            res = res.concat(result);
        } while (i <= await checkLastPage(scrapeUrl));
        return res = null;
    } catch (err) {
        console.log('Error on scrapeMultiPage', url, err);
    }
}

//check pagination status
export async function checkLastPage(url: string) {
    const htmlBody = await fetchHtml(url);
    const $ = Cheerio.load(htmlBody);
    const lastChild = $('div.toolbar-products ul.pages-items').children('li.item:nth-last-child(1)').text().replace("Page\n", "").trim();
    let lastPage;

    if (lastChild == 'Next') {
        lastPage = parseInt($('div.toolbar-products ul.pages-items').children('li.item:nth-last-child(2)').text().replace("Page\n", "").trim());
    } else {
        lastPage = parseInt(lastChild);
    }
    return lastPage;
}
