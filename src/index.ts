import fs from 'fs';
import * as _ from 'lodash';
import moment from 'moment';
import {Product} from './utils/type';
import {getCategoryUrl, scrapeMultiPage} from './utils/util';

async function main() {
    try {
        const fileName: string = `caring${moment().format('YYYYMMDD_HHmmss')}.jsonl`;
        console.log(fileName);
        let result:Product[] = [];
    
        const CATEGORIES:string[] = await getCategoryUrl('https://estore.caring2u.com/');
        console.log(CATEGORIES);

        for (let i = 0; i <= CATEGORIES.length; i++) {
            if (CATEGORIES[i] === undefined) {
                break;
            }
            result = result.concat(await scrapeMultiPage(CATEGORIES[i]));
        }

        result = [{"provider_name":"caring","url":"https://estore.caring2u.com/jom-kurang-manis/nfa-insulle-complete-nutrition-850g.html","product_id":"13801","name":"NFA INSULLE COMPLETE NUTRITION 850G","currency":"MYR","price":82.9,"promotion":false,"original_price":null,"promotion_price":null,"unit":"each","is_assorted":false}];

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
