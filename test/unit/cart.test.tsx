import React from 'react';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { rest } from "msw";
import { setupServer } from "msw/node";

import { render, waitFor } from '@testing-library/react';

import { initStore } from '../../src/client/store';
import { CartApi, ExampleApi } from '../../src/client/api';
import { localStorageMock, productMock } from './mock';
import { Application } from '../../src/client/Application';
import { Cart } from '../../src/client/pages/Cart';

const basename = '/';
const keyLS = 'example-store-cart';
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

window.localStorage.setItem(keyLS, JSON.stringify(localStorageMock));

describe('Корзина', () => {
    beforeAll(() => {
        const api = new ExampleApi(basename);
        const cart = new CartApi();
        store = initStore(api, cart);
        server.listen();
    });

    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    it('В шапке должно отображаться количество неповторяющихся товаров', async () => {
        const app = render(
            <BrowserRouter>
                <Provider store={store}>
                    <Application />
                </Provider>
            </BrowserRouter>
        );

        await waitFor(() => {
            const cart = app.findByText(`Cart (${Object.keys(localStorageMock).length})`)
            expect(cart).toBeDefined();
        });
    });

    it('Для каждого товара отображаются Название, Цена, Количество, Стоимость и Общая стоимость', async () => {
        const app = render(
            <BrowserRouter>
                <Provider store={store}>
                    <Cart />
                </Provider>
            </BrowserRouter>
        );

        await waitFor(() => {
            const names = app.container.getElementsByClassName('Cart-Name');
            const prices = app.container.getElementsByClassName('Cart-Price');
            const counts = app.container.getElementsByClassName('Cart-Count');
            const totals = app.container.getElementsByClassName('Cart-Total');

            expect(names).toHaveLength(Object.keys(localStorageMock).length);
            expect(prices).toHaveLength(Object.keys(localStorageMock).length);
            expect(counts).toHaveLength(Object.keys(localStorageMock).length);
            expect(totals).toHaveLength(Object.keys(localStorageMock).length);

            let total = 0;

            Object.values(localStorageMock).forEach((item, index) => {
                expect(prices[index].textContent).toBe(`$${item.price}`);
                expect(counts[index].textContent).toBe(`${item.count}`);
                total += parseInt(totals[index].textContent?.replace('$', '') as string);
            });

            expect(total).toBe(Object.values(localStorageMock).reduce((acc, cur) => {
                return (cur.price as number) * (cur.count as number) + acc;
            }, 0));
        });
    });
});