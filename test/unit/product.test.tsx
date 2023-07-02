import React from 'react';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { rest } from "msw";
import { setupServer } from "msw/node";

import { render, waitFor } from '@testing-library/react';

import { initStore } from '../../src/client/store';
import { CartApi, ExampleApi } from '../../src/client/api';
import { Product } from '../../src/client/pages/Product';
import { productMock } from './mock';

const basename = '/';
const index = 0;
let store: Store;

const server = setupServer(
    rest.get(`http://api/products/${index}`, (_req, res, ctx) => {
        return res(ctx.json(productMock));
    })
);

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: () => ({ id: `${index}` }),
}));

interface cartInterface {
    name: string,
    count: number,
    price: number,
};

interface localStorageInterface {
    0: cartInterface,
};

describe('Карточка товара', () => {
    beforeAll(() => {
        const api = new ExampleApi(basename);
        const cart = new CartApi();
        store = initStore(api, cart);
        server.listen();
    });

    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    it('На странице с подробной информацией отображается: название, описание, цена, цвет, материал и кнопка В корзину', async () => {
        const catalog = render(
            <BrowserRouter>
                <Provider store={store}>
                    <Product />
                </Provider>
            </BrowserRouter>
        );

        await waitFor(() => {
            const title = catalog.getByText(productMock.name);
            const description = catalog.getByText(productMock.description);
            const price = catalog.getByText(`$${productMock.price}`);
            const color = catalog.getByText(productMock.color);
            const material = catalog.getByText(productMock.material);
            const button = catalog.container.getElementsByClassName('btn-lg');

            expect(title).toBeDefined();
            expect(description).toBeDefined();
            expect(price).toBeDefined();
            expect(color).toBeDefined();
            expect(material).toBeDefined();
            expect(button).toBeDefined();
        });
    });

    it('Если товар уже добавлен в корзину, то рядом с кнопкой есть сообщение об этом', async () => {
        const catalog = render(
            <BrowserRouter>
                <Provider store={store}>
                    <Product />
                </Provider>
            </BrowserRouter>
        );

        await waitFor(() => {
            const button = catalog.getByText('Add to Cart');
            button.click();

            const label = catalog.getByText('Item in cart');

            expect(label).toBeDefined();
        });
    });

    it('Повторное добавление товара в корзину должно увеличивать его количество', async () => {
        const catalog = render(
            <BrowserRouter>
                <Provider store={store}>
                    <Product />
                </Provider>
            </BrowserRouter>
        );

        await waitFor(() => {
            const button = catalog.getByText('Add to Cart');
            button.click();
            let ls: localStorageInterface = JSON.parse(window.localStorage.getItem('example-store-cart') as string);
            
            const count = ls[0].count;

            expect(ls[0].count).toBe(count);

            button.click();
            ls = JSON.parse(window.localStorage.getItem('example-store-cart') as string);
            expect(ls[0].count).toBe(count + 1);
        });
    });
});