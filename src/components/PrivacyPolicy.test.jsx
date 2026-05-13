import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PrivacyPolicy from './PrivacyPolicy';

describe('PrivacyPolicy', () => {
  test('renders Russian privacy policy', () => {
    render(<PrivacyPolicy locale="ru" />);
    expect(screen.getByRole('heading', { name: 'Политика конфиденциальности' })).toBeInTheDocument();
    expect(screen.getByText(/Яндекс Метрика/i)).toBeInTheDocument();
    expect(screen.getByText(/Vercel Analytics/i)).toBeInTheDocument();
  });

  test('renders English privacy policy', () => {
    render(<PrivacyPolicy locale="en" />);
    expect(screen.getByRole('heading', { name: 'Privacy Policy' })).toBeInTheDocument();
    expect(screen.getByText(/Yandex Metrika/i)).toBeInTheDocument();
    expect(screen.getByText(/Vercel Analytics/i)).toBeInTheDocument();
  });
});
