/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const mockUseAuthSession = vi.fn();

vi.mock('@/components/auth/AuthSessionProvider', () => ({
  useAuthSession: () => mockUseAuthSession(),
}));

function renderWithRouter(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<p>Dashboard</p>} />
        </Route>
        <Route path="/login" element={<p>Login Page</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockUseAuthSession.mockReset();
  });

  it('shows loading while session is being validated', () => {
    mockUseAuthSession.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });
    renderWithRouter('/dashboard');
    expect(screen.getByLabelText('Checking session')).toBeInTheDocument();
  });

  it('redirects to /login when not authenticated', () => {
    mockUseAuthSession.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });
    renderWithRouter('/dashboard');
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('allows access when authenticated', () => {
    mockUseAuthSession.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });
    renderWithRouter('/dashboard');
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
