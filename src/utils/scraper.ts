import Cheerio from "cheerio";
import {Product} from "./type"
import {fetchHtml, delay, PROVIDER_NAME} from "./util"

export async function scrapePage(url: string, retries = 1): Promise<{ result: Product[] }> {
    try {
        const htmlBody = await fetchHtml(url);
        let $ = Cheerio.load(htmlBody);
        const products = $('div.product-items div.product-item');
        let result: Product[] = [];
        for (let i = 0; i < products.length; i++) {
            const product = $(products[i]);
            const name:string = getProductName(product);
            const product_id:string = getProductId(product);
            const url:string = getProductURL(product);
            let originalPrice = getProductOriginalPrice(product);
            let promoPrice = getProductPromoPrice(product);
            let priceRaw = getProductPrice(product);
            const stockBtn = getProductStock(product);

            let stock: number;
            let price: number;
            let promotion_price: number;
            let original_price: number;

            if (isNaN(promoPrice && originalPrice)) {
                price = priceRaw;
                promotion_price = null;
                original_price = null;
            } else {
                price = promoPrice;
                promotion_price = promoPrice;
                original_price = originalPrice;
            }

            if (stockBtn == 'Out of stock') {
                stock = 0;
            }

            const promotion = original_price ? original_price !== promotion_price : false;            
            const productDetails: Product = {
                provider_name: PROVIDER_NAME,
                url,
                product_id,
                name,
                currency: 'MYR',
                price,
                promotion,
                original_price,
                promotion_price,
                stock,
                unit: 'each',
                is_assorted: false,
            };
            result.push(productDetails);
        }
        return {result};
    } catch (e) {
        if (retries <= 3) {
            await delay(1000);
            console.log('retrying at scrapePage', retries);
            return await scrapePage(url, retries + 1);
        }
    }
}

function getProductName($: cheerio.Cheerio): string {
    return $.find('strong.product-item-name a.product-item-link').text().trim();
}

function getProductStock($: cheerio.Cheerio): string {
    return $.find('div.unavailable span').text().trim();
}

function getProductId($: cheerio.Cheerio): string {
    return $.find('div.price-final_price').attr('data-product-id');
}

function getProductPrice($: cheerio.Cheerio): number {
    return parseFloat($.find('span.price-final_price span.price').text().trim().substr(2));
}

function getProductPromoPrice($: cheerio.Cheerio): number {
    return parseFloat($.find('span.special-price span.price').text().trim().substr(2));
}

function getProductOriginalPrice($: cheerio.Cheerio): number {
    return parseFloat($.find('span.old-price span.price').text().trim().substr(2));
}

function getProductURL($: cheerio.Cheerio): any {
    return $.find('div.product-item-details a.product-item-link').attr('href');
}