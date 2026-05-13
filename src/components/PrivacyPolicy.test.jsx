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

  test('discloses Webvisor behavior recording in Russian policy', () => {
    render(<PrivacyPolicy locale="ru" />);
    expect(screen.getByText(/Вебвизор/i)).toBeInTheDocument();
    expect(screen.getByText(/запись поведения/i)).toBeInTheDocument();
  });

  test('renders English privacy policy', () => {
    render(<PrivacyPolicy locale="en" />);
    expect(screen.getByRole('heading', { name: 'Privacy Policy' })).toBeInTheDocument();
    expect(screen.getByText(/Yandex Metrika/i)).toBeInTheDocument();
    expect(screen.getByText(/Vercel Analytics/i)).toBeInTheDocument();
  });

  test('discloses Webvisor session replay in English policy', () => {
    render(<PrivacyPolicy locale="en" />);
    expect(screen.getByText(/Webvisor/i)).toBeInTheDocument();
    expect(screen.getByText(/session replay/i)).toBeInTheDocument();
  });

  test('falls back to Russian privacy policy for unsupported locale', () => {
    render(<PrivacyPolicy locale="de" />);
    expect(screen.getByRole('heading', { name: 'Политика конфиденциальности' })).toBeInTheDocument();
    expect(screen.getByText(/Яндекс Метрика/i)).toBeInTheDocument();
  });
});
