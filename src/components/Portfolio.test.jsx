import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Portfolio from './Portfolio';

HTMLCanvasElement.prototype.getContext = jest.fn(() => null);

describe('Portfolio', () => {
  test('renders localized project cards without duplicates', () => {
    render(<Portfolio locale="ru" />);
    expect(screen.getByRole('heading', { name: 'мои работы' })).toBeInTheDocument();
    expect(screen.getAllByText('WorkerWP Store')).toHaveLength(1);
    expect(screen.getByText(/Витрина\/магазин/i)).toBeInTheDocument();
  });

  test('renders English labels', () => {
    render(<Portfolio locale="en" />);
    expect(screen.getByRole('heading', { name: 'portfolio' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous project' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next project' })).toBeInTheDocument();
  });

  test('carousel loops backward and forward', async () => {
    const user = userEvent.setup();
    render(<Portfolio locale="en" />);
    await user.click(screen.getByRole('button', { name: 'Previous project' }));
    expect(screen.getByText('WorkerWP Store')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next project' }));
    expect(screen.getByText('Rodina')).toBeInTheDocument();
  });
});
