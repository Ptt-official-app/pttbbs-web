import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArticlesPage from './ArticlesPage';
import { MemoryRouter as Router, Route } from "react-router-dom"

let container

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  document.body.removeChild(container)
  container = null;
})

test('rendering WhoAmI', async () => {
  const App = () => (
    <Route exact path="/board/:bid/articles" component={ArticlesPage} />
  );

  render(
    <Router initialEntries={['/board/10_WhoAmI/articles']}>
      <App />
    </Router>
  )
  await waitFor(() => screen.getByText('DevPtt'));
  await waitFor(() => screen.getByText(/還要多少費雯呢/i), {timeout: 5000});
  await waitFor(() => screen.getByText(/還有呢？/i), {timeout: 5000});
})
