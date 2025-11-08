import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home hero with call to action', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /impulsa tu banca digital con finaizen/i })
  ).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /solicitar demo/i })).toBeInTheDocument();
});
