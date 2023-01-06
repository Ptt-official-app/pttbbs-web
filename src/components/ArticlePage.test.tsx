import React from 'react';
import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import ArticlePage from './ArticlePage';
import { MemoryRouter as Router, Route, Routes } from "react-router-dom";

import setupServer from '../mockServer';
import { AnyFactories, AnyModels, Registry } from 'miragejs/-types';
import { Server } from 'miragejs';

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

test('rendering WhoAmI Article', async () => {
    render(
        <Router initialEntries={["/board/WhoAmI/article/article123456"]}>
            <Routes>
                <Route path="/board/:bid/article/:aid" element={<ArticlePage />} />
            </Routes>
        </Router>
    )

    expect(screen.getByText(/目前無法看到文章喔/)).toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.queryByText(/目前無法看到文章喔/))

    // Check title & user bar
    expect(screen.getByText(/WhoAmI - \[討論\] 測試推文/)).toBeInTheDocument();
    expect(screen.getByText(/Guest/)).toBeInTheDocument();

    // Check footer
    expect(screen.getByText(/發信站/)).toBeInTheDocument();
    expect(screen.getByText(/文章網址/)).toBeInTheDocument();

    // Check comments
    await waitFor(() => expect(screen.getAllByText(/^噓$/)).toHaveLength(11))
    const push = screen.getAllByText(/^推$/);
    expect(push).toHaveLength(2);
})
