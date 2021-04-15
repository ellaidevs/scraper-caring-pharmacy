import fs from 'fs';
import * as _ from 'lodash';
import moment from 'moment';

async function main() {
    try {
        const fileName: string = `caring${moment().format('YYYYMMDD_HHmmss')}.jsonl`;
        console.log(fileName);

        const result = [{"provider_name":"caring","url":"https://estore.caring2u.com/jom-kurang-manis/nfa-insulle-complete-nutrition-850g.html","product_id":"13801","name":"NFA INSULLE COMPLETE NUTRITION 850G","currency":"MYR","price":82.9,"promotion":false,"original_price":null,"promotion_price":null,"unit":"each","is_assorted":false}];

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
