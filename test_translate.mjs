import { autoTranslatePayload } from './lib/i18n/autoTranslate.js';

async function main() {
    const payload = {
        updates: [
            { id: '1', title: 'Test', status: 'Alert' }
        ]
    };

    console.log("Testing en...");
    const resEn = await autoTranslatePayload(payload, 'en');
    console.log(JSON.stringify(resEn));

    console.log("Testing ur...");
    const resUr = await autoTranslatePayload(payload, 'ur');
    console.log(JSON.stringify(resUr));
}

main();
