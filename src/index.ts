import fs from 'fs';
import * as _ from 'lodash';
import moment from 'moment';
import {Product} from './utils/type';
import {getCategoryUrl, scrapeMultiPage, PROVIDER_NAME} from './utils/util';


async function main() {
    try {
        const fileName: string = `${PROVIDER_NAME}${moment().format('YYYYMMDD_HHmmss')}.jsonl`;
        console.log(fileName);
        let result:Product[] = [];
    
        const CATEGORIES:string[] = await getCategoryUrl('https://estore.caring2u.com/');
        console.log('Categories to crawl:', CATEGORIES);

        for (let i = 0; i <= CATEGORIES.length; i++) {
            if (CATEGORIES[i] === undefined) {
                break;
            }
            result = result.concat(await scrapeMultiPage(CATEGORIES[i]));
        }
        
        const data = result.map((r) => JSON.stringify(r)).join('\n');
        fs.appendFileSync(fileName, data, 'utf8');
    } catch (e) {
        console.log('Error on Main', e);
    }
}

if (require.main === module) {
    main().then(() => {
        console.log("Executed");
    });
}
