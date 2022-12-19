import React from 'react';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import ArticlesPage from './ArticlesPage';
import { MemoryRouter as Router, Routes, Route } from "react-router-dom"

import setupServer from '../mockServer';
import { Server } from 'miragejs';
import { AnyFactories, AnyModels, Registry } from 'miragejs/-types';
let mockServer: Server<Registry<AnyModels, AnyFactories>> | null = null;

beforeAll(() => {
    mockServer = setupServer();
})

afterAll(() => {
    if (!mockServer) {
        return
    }
    mockServer.shutdown();
})

test('rendering WhoAmI', async () => {
    render(
        <Router initialEntries={['/board/WhoAmI/articles']}>
            <Routes>
                <Route path="/board/:bid/articles" element={<ArticlesPage />} />
            </Routes>
        </Router>
    )

    expect(screen.getByText(/DevPtt/)).toBeInTheDocument();
    expect(screen.getByText(/這個看板目前沒有文章喔/)).toBeInTheDocument();

    // Check footer
    expect(screen.getByText(/發表文章/)).toBeInTheDocument();
    expect(screen.getByText(/精華區/)).toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.queryByText(/這個看板目前沒有文章喔/));

    // Check title
    expect(screen.getByText(/呵呵，猜猜我是誰/)).toBeInTheDocument();

    const articles = screen.getAllByText(/Test-[\d]/);
    expect(articles).toHaveLength(10);

    // Check dates
    const dates = screen.getAllByText(/05\/18/);
    expect(dates).toHaveLength(13);

    // Check authors
    expect(screen.getByText("test2000")).toBeInTheDocument();
    expect(screen.getByText("test33")).toBeInTheDocument();
})
