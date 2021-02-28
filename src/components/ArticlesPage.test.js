import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArticlesPage from './ArticlesPage';
import { MemoryRouter as Router, Route } from "react-router-dom"

test('rendering WhoAmI', async () => {
  const App = () => (
    <Route exact path="/board/:bid/articles" component={ArticlesPage} />
  );

  render(
    <Router initialEntries={['/board/10_WhoAmI/articles']}>
      <App />
    </Router>
  )
  await screen.findByText('DevPtt');
  await screen.findByText(/還要多少費雯呢/i);
  await screen.findByText(/還有呢？/i);
})
