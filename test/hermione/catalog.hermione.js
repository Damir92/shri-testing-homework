describe('(Запускать отдельно) Количество товара в корзине в шапке', () => {
    it('При нажатии на кнопку Добавить в корзину, количество в шапке изменяется', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.setViewport({
            width: 1024,
            height: 2000
        });
        await page.goto('http://localhost:3000/hw/store/catalog/0');
        await page.waitForSelector('.Product');

        await page.click('.Product .ProductDetails-AddToCart');
        
        await browser.assertView('plain', '.Application .navbar-nav');
    });

    it('При перезагрузке количество товара в шапке не меняется', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.setViewport({
            width: 1024,
            height: 2000
        });
        await page.goto('http://localhost:3000/hw/store/catalog/0');
        await page.waitForSelector('.Product');

        await page.click('.Product .ProductDetails-AddToCart');

        await page.goto('http://localhost:3000/hw/store');
        await page.waitForSelector('.Application');

        await page.goto('http://localhost:3000/hw/store/catalog/0');
        await page.waitForSelector('.Product');
        
        await browser.assertView('plain', '.Application .navbar-nav');
    });

    it('В корзине 3 одинаковых товара, в шапке только количество позиций', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.setViewport({
            width: 1024,
            height: 2000
        });
        await page.goto('http://localhost:3000/hw/store/catalog/0');
        await page.waitForSelector('.Product');

        await page.click('.Product .ProductDetails-AddToCart');
        await page.click('.Product .ProductDetails-AddToCart');
        await page.click('.Product .ProductDetails-AddToCart');
        
        await browser.assertView('plain', '.Application .navbar-nav');
    });

    it('В корзине 2 различные позиции, в шапке так же', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.setViewport({
            width: 1024,
            height: 2000
        });
        await page.goto('http://localhost:3000/hw/store/catalog/0');
        await page.waitForSelector('.Product');

        await page.click('.Product .ProductDetails-AddToCart');
        await page.click('.Product .ProductDetails-AddToCart');

        await page.goto('http://localhost:3000/hw/store/catalog/1');
        await page.waitForSelector('.Product');

        await page.click('.Product .ProductDetails-AddToCart');
        
        await browser.assertView('plain', '.Application .navbar-nav');
    });

    it('Кнопка Очистить корзину должна удалять все товары в корзине', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.setViewport({
            width: 1024,
            height: 2000
        });
        await page.goto('http://localhost:3000/hw/store/catalog/0');
        await page.waitForSelector('.Product');

        await page.click('.Product .ProductDetails-AddToCart');

        await page.goto('http://localhost:3000/hw/store/cart');
        await page.waitForSelector('.Cart-Clear');

        await page.click('.Cart .Cart-Clear');
        
        await browser.assertView('plain', '.Cart');
    });

    it('Если корзина пустая - должна отображаться ссылка на каталог', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.setViewport({
            width: 1024,
            height: 2000
        });
        await page.goto('http://localhost:3000/hw/store/catalog/0');
        await page.waitForSelector('.Product');

        await page.click('.Product .ProductDetails-AddToCart');

        await page.goto('http://localhost:3000/hw/store/cart');
        await page.waitForSelector('.Cart-Clear');

        await page.click('.Cart .Cart-Clear');

        await page.waitForSelector('.Cart a');
        
        await browser.assertView('plain', '.Cart a');
    });

    it('В корзине должна отображаться таблица с товарами', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.setViewport({
            width: 1024,
            height: 2000
        });
        await page.goto('http://localhost:3000/hw/store/catalog/0');
        await page.waitForSelector('.Product');

        await page.click('.Product .ProductDetails-AddToCart');
        await page.click('.Product .ProductDetails-AddToCart');

        await page.goto('http://localhost:3000/hw/store/catalog/1');
        await page.waitForSelector('.Product');

        await page.click('.Product .ProductDetails-AddToCart');

        await page.goto('http://localhost:3000/hw/store/cart');
        
        await browser.assertView('plain', '.Cart-Table', {
            ignoreElements: [
                '.Cart-Name',
                '.Cart-Price',
                '.Cart-Total',
                '.Cart-OrderPrice'
            ]
        });
    });
});