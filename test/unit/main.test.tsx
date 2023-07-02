import React from 'react';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { render, waitFor } from '@testing-library/react';

import { Application } from '../../src/client/Application';
import { initStore } from '../../src/client/store';
import { CartApi, ExampleApi } from '../../src/client/api';

const basename = '/';
let store: Store;

describe('Страницы сайта', () => {
    beforeAll(() => {
        const api = new ExampleApi(basename);
        const cart = new CartApi();
        store = initStore(api, cart);
    });

    it('Возврат на главную страницу', async () => {
        const app = render(
            <BrowserRouter>
                <Provider store={store}>
                    <Application />
                </Provider>
            </BrowserRouter>
        );

        const contactsLink = app.getByText('Contacts').closest('a');
        const logoLink = app.getByText('Example store').closest('a');

        await contactsLink?.click();
        await logoLink?.click();

        expect(window.location.href).toBe('http://localhost/');
    });

    it('Переход на страницу КАТАЛОГ', async () => {
        const app = render(
            <BrowserRouter>
                <Provider store={store}>
                    <Application />
                </Provider>
            </BrowserRouter>
        );

        const catalogLink = app.getByText('Catalog').closest('a');

        await catalogLink?.click();

        expect(window.location.href).toBe('http://localhost/catalog');
    });

    it('Переход на страницу УСЛОВИЯ ДОСТАВКИ', async () => {
        const app = render(
            <BrowserRouter>
                <Provider store={store}>
                    <Application />
                </Provider>
            </BrowserRouter>
        );

        const deliveryLink = app.getByText('Delivery').closest('a');

        await deliveryLink?.click();

        expect(window.location.href).toBe('http://localhost/delivery');
    });

    it('Переход на страницу КОНТАКТЫ', async () => {
        const app = render(
            <BrowserRouter>
                <Provider store={store}>
                    <Application />
                </Provider>
            </BrowserRouter>
        );

        const contactsLink = app.getByText('Contacts').closest('a');

        await contactsLink?.click();

        expect(window.location.href).toBe('http://localhost/contacts');
    });
});

describe('Шапка сайта', () => {

    beforeAll(() => {
        const api = new ExampleApi(basename);
        const cart = new CartApi();
        store = initStore(api, cart);
    });

    it('В шапке отображаются ссылки на страницы и на корзину', async () => {
        const app = render(
            <BrowserRouter>
                <Provider store={store}>
                    <Application />
                </Provider>
            </BrowserRouter>
        );

        const logoLink = app.getByText('Example store').closest('a');
        await logoLink?.click();
        const catalogLink = app.getByText('Catalog').closest('a');
        const deliveryLink = app.getByText('Delivery').closest('a');
        const contactsLink = app.getByText('Contacts').closest('a');
        const cartLink = app.getByText('Cart').closest('a');

        expect(logoLink).toBeDefined();
        expect(catalogLink).toBeDefined();
        expect(deliveryLink).toBeDefined();
        expect(contactsLink).toBeDefined();
        expect(cartLink).toBeDefined();
    });

    it('Лого в шапке должно быть ссылкой на главную страницу', () => {
        const app = render(
            <BrowserRouter>
                <Provider store={store}>
                    <Application />
                </Provider>
            </BrowserRouter>
        );

        const logoLink = app.getByText('Example store').closest('a');

        expect(logoLink).toHaveProperty('href', `http://localhost/`);
    });

    it('При переходе по ссылке меню, бургер должен закрываться', async () => {
        const app = render(
            <BrowserRouter>
                <Provider store={store}>
                    <Application />
                </Provider>
            </BrowserRouter>
        );

        const navbar = await app.baseElement.getElementsByClassName('navbar-collapse');
        const contactsLink = await app.getAllByText('Contacts');
        const burger = await app.getByRole('button');

        expect(navbar[0].classList.contains('collapse')).toBe(true);

        await burger.click();

        expect(navbar[0].classList.contains('collapse')).toBe(false);

        contactsLink[0].click();

        expect(navbar[0].classList.contains('collapse')).toBe(true);
    })
});