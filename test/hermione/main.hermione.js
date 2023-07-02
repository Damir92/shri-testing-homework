describe('Главная страница', () => {
    it('Шапка в десктопном представлении', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.setViewport({
            width: 1024,
            height: 800
        });
        await page.goto('http://localhost:3000/hw/store');
        await page.waitForSelector('.Application');
        await browser.assertView('plain', '.Application .navbar');
    });

    it('Шапка в мобильном представлении', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.setViewport({
            width: 375,
            height: 600
        });
        await page.goto('http://localhost:3000/hw/store');
        await page.waitForSelector('.Application');
        await browser.assertView('plain', '.Application .navbar');
    });

    it('Основное содержимое в десктопном представлении', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.setViewport({
            width: 1024,
            height: 800
        });
        await page.goto('http://localhost:3000/hw/store');
        await page.waitForSelector('.Application');
        await browser.assertView('plain', '.Home');
    });

    it('Основное содержимое в мобильном представлении', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.setViewport({
            width: 375,
            height: 1500
        });
        await page.goto('http://localhost:3000/hw/store');
        await page.waitForSelector('.Application');
        await browser.assertView('plain', '.Home');
    });
});

describe('Шапка в мобильном представлении', () => {
    it('При нажатии на бургер открывается меню', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.setViewport({
            width: 375,
            height: 600
        });
        await page.goto('http://localhost:3000/hw/store');
        await page.waitForSelector('.Application');

        await page.click('.navbar .Application-Toggler');

        await browser.pause(500);

        await browser.assertView('plain', '.Application .navbar');
    });

    it('При двойном нажатии на бургер меню закрывается', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.setViewport({
            width: 375,
            height: 600
        });
        await page.goto('http://localhost:3000/hw/store');
        await page.waitForSelector('.Application');

        await page.click('.navbar .Application-Toggler');
        await page.click('.navbar .Application-Toggler');

        await browser.pause(500);
        
        await browser.assertView('plain', '.Application .navbar');
    });

    it('При выборе элемента меню, меню закрывается', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.setViewport({
            width: 375,
            height: 600
        });
        await page.goto('http://localhost:3000/hw/store');
        await page.waitForSelector('.Application');

        await page.click('.navbar .Application-Toggler');
        await page.click('.navbar .Application-Menu .nav-link:not(.active)');
        
        await browser.assertView('plain', '.Application .navbar');
    });
});
