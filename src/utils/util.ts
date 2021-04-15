import Cheerio from "cheerio";
import fetch from "node-fetch";

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
        console.log('Error on getCategoryUrl', e)
    }
}

export async function fetchHtml(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        return await response.text();
    } catch (err) {
        console.log(`Error on URL: ${url}`, err);
        throw err;
    }
}
