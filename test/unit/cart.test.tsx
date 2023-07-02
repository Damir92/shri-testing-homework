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

    it('В шапке должна отображаться количество неповторяющихся товаров', async () => {
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
});