import React from 'react';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { rest } from "msw";
import { setupServer } from "msw/node";

import { render, waitFor } from '@testing-library/react';

import { initStore } from '../../src/client/store';
import { CartApi, ExampleApi } from '../../src/client/api';
import { Catalog } from '../../src/client/pages/Catalog';
import { catalogMock } from './mock';

const basename = '/';
let store: Store;

const server = setupServer(
    rest.get("http://api/products", (_req, res, ctx) => {
        return res(ctx.json(catalogMock));
    })
);

describe('Страница Каталог', () => {
    beforeAll(() => {
        const api = new ExampleApi(basename);
        const cart = new CartApi();
        store = initStore(api, cart);
        server.listen();
    });

    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    it('Отображается список товаров запрошенных с сервера', async () => {
        const catalog = render(
            <BrowserRouter>
                <Provider store={store}>
                    <Catalog />
                </Provider>
            </BrowserRouter>
        );

        await waitFor(() => {
            const titles = catalog.container.getElementsByClassName('card-title');
            expect(titles).toHaveLength(catalogMock.length);
        });
    });

    it('Для каждого товара отображается название, цена и ссылка Подробнее', async () => {
        const catalog = render(
            <BrowserRouter>
                <Provider store={store}>
                    <Catalog />
                </Provider>
            </BrowserRouter>
        );

        await waitFor(() => {
            const title = catalog.container.getElementsByClassName('card-title');
            const price = catalog.container.getElementsByClassName('card-text');
            const link = catalog.container.getElementsByClassName('card-link');

            expect(title).toHaveLength(catalogMock.length);
            expect(price).toHaveLength(catalogMock.length);
            expect(link).toHaveLength(catalogMock.length);
        });
    });

    it('Если нажать на ссылку Подробнее то перейдет на страницу товара', async () => {
        const catalog = render(
            <BrowserRouter>
                <Provider store={store}>
                    <Catalog />
                </Provider>
            </BrowserRouter>
        );

        const index = 0;

        await waitFor(async () => {
            const link = catalog.getAllByText('Details');
            await link[index].click();

            expect(window.location.href).toBe(`http://localhost/catalog/${index}`);
        });
    });
});
