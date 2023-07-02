describe('Главная страница', () => {
    it('Должна отрисоваться', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.setViewport({
            width: 375,
            height: 480,
            deviceScaleFactor: 1,
        })
        await page.goto('http://localhost:3000/hw/store');
        // await browser.pause(15000);
        // await page.keyboard.type('Курс доллара к рублю');
        // await page.keyboard.press('Enter');

        await page.waitForSelector('.Home .row', { timeout: 5000 });
        await browser.assertView('plain', '.Home .row');
        // await browser.assertView('plain', '.Converter-Inputs', {
        //     ignoreElements: [
        //         '.ConverterHeader'
        //     ],
        // });
    });
});
