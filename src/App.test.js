import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders welcome state', () => {
  const { getByText } = render(<App />);
  const text = getByText(/Welcome/i);
  expect(text).toBeInTheDocument();
});
