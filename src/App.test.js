import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
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
  test('renders Russian homepage without extra section blocks', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { name: /VIKTOR KALYAKIN/i })).toBeInTheDocument();
    expect(screen.getByText(/комплексное SEO/i)).toBeInTheDocument();
    expect(screen.getByText(/Python/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /открыть меню/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Услуги/i })).not.toBeInTheDocument();
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
});
