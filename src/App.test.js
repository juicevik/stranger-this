import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { localizedContent } from './data/siteContent';

jest.mock('@vercel/analytics/react', () => ({
  Analytics: () => null,
}), { virtual: true });

const renderAt = (path) => {
  window.history.pushState({}, '', path);
  return render(<App />);
};

describe('App routing', () => {
  test('renders game room on the root route and starts the embedded game', async () => {
    const user = userEvent.setup();

    renderAt('/');

    expect(screen.getByRole('main')).toHaveClass('game-room');
    expect(screen.getByRole('button', { name: /^START$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /выключить звук/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/game attribution/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /открыть меню/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /выключить звук/i }));
    expect(screen.getByRole('button', { name: /включить звук/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^START$/i }));

    expect(screen.getByTitle('The Final Fate browser game')).toHaveAttribute('src', '/game/final-fate/index.html');
    expect(screen.getByRole('button', { name: /выйти/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /развернуть/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /развернуть/i }));
    expect(screen.getByRole('button', { name: /свернуть/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /выйти/i }));
    expect(screen.queryByTitle('The Final Fate browser game')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^START$/i })).toBeInTheDocument();
  });

  test('renders English homepage', () => {
    renderAt('/en');
    expect(screen.getByText(/comprehensive SEO/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Contact/i })).toBeInTheDocument();
  });

  test('renders Russian about page as a separate page', () => {
    renderAt('/about');
    expect(screen.getByRole('heading', { name: 'Обо мне' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Услуги' })).toBeInTheDocument();
    expect(screen.getByText(localizedContent.ru.about.intro)).toBeInTheDocument();
    expect(screen.getByText('комплексное SEO')).toBeInTheDocument();
    expect(screen.getByText(localizedContent.ru.about.services[0])).toBeInTheDocument();
  });

  test('renders English about page as a separate page', () => {
    renderAt('/en/about');
    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Services' })).toBeInTheDocument();
    expect(screen.getByText(localizedContent.en.about.intro)).toBeInTheDocument();
    expect(screen.getByText('comprehensive SEO')).toBeInTheDocument();
    expect(screen.getByText(localizedContent.en.about.services[0])).toBeInTheDocument();
  });

  test('keeps closed menu links out of the tab order', () => {
    const { container } = renderAt('/en');
    const menuLinks = container.querySelectorAll('#site-menu a');

    expect(menuLinks).toHaveLength(6);
    menuLinks.forEach((link) => {
      expect(link).toHaveAttribute('tabindex', '-1');
    });
  });

  test('restores menu links to the tab order when menu opens', async () => {
    const user = userEvent.setup();
    const { container } = renderAt('/en');
    const menuButton = screen.getByRole('button', { name: /open menu/i });

    await user.click(menuButton);

    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    container.querySelectorAll('#site-menu a').forEach((link) => {
      expect(link).toHaveAttribute('tabindex', '0');
    });
  });

  test('Escape closes open menu and returns focus to the menu button', async () => {
    const user = userEvent.setup();
    renderAt('/en');
    const menuButton = screen.getByRole('button', { name: /open menu/i });

    await user.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard('{Escape}');

    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(menuButton).toHaveFocus();
  });
});
