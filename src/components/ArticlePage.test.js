import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArticlePage from './ArticlePage';
import { MemoryRouter as Router, Route } from "react-router-dom";

test('rendering WhoAmI Article', async () => {
  const App = () => (
    <Route exact path="/board/:bid/article/:aid" component={ArticlePage} />
  );

  render(
    <Router initialEntries={['/board/10_WhoAmI/article/1VtW-QXTSYSOP']}>
      <App />
    </Router>
  )
  await waitFor(() => screen.getByText('DevPtt'));
  await waitFor(() => screen.getByText(/作者/i), {timeout: 5000});
})
