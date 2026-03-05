import type { Request, Response } from 'express';
import AuthService from './auth.service.js';
import {
  ACCESS_TOKEN_EXPIRY_MS,
  REFRESH_TOKEN_EXPIRY_MS,
  COOKIE_OPTIONS
} from '../../constants/auth.constants.js';

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response) => {
    try {
      const result = await this.authService.register(req.validated.body);
      res.status(201).json(result);
    } catch (error: any) {
      console.error('Register error:', error);
      res.status(400).json({ error: error.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const result = await this.authService.login(req.validated.body);

      // Set access token in http-only cookie
      res.cookie('accessToken', result.accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: ACCESS_TOKEN_EXPIRY_MS
      });

      // Set refresh token in http-only cookie
      res.cookie('refreshToken', result.refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: REFRESH_TOKEN_EXPIRY_MS
      });

      res.status(200).json({
        message: result.message,
        user: result.user,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(401).json({ error: error.message });
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      await this.authService.logout(req.user.id, req.cookies.refreshToken, req.sessionId);

      // Clear cookies
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      res.status(200).json({ message: 'Logout successful' });
    } catch (error: any) {
      console.error('Logout error:', error);
      res.status(500).json({ error: error.message });
    }
  };

  forgotPassword = async (req: Request, res: Response) => {
    try {
      const result = await this.authService.forgotPassword(req.validated.body);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: error.message });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const result = await this.authService.resetPassword(req.validated.body);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Reset password error:', error);
      res.status(400).json({ error: error.message });
    }
  };

  verifyEmail = async (req: Request, res: Response) => {
    try {
      const result = await this.authService.verifyEmail(req.validated.query);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Email verification error:', error);
      res.status(400).json({ error: error.message });
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    try {
      const result = await this.authService.refreshToken(req.cookies.refreshToken);

      // Set new access token in http-only cookie
      res.cookie('accessToken', result.accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: ACCESS_TOKEN_EXPIRY_MS
      });

      // Set new refresh token in http-only cookie
      res.cookie('refreshToken', result.refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: REFRESH_TOKEN_EXPIRY_MS
      });

      res.status(200).json({
        message: 'Token refreshed successfully',
        user: result.user,
      });
    } catch (error: any) {
      console.error('Refresh token error:', error);
      res.status(401).json({ error: error.message });
    }
  };
}

export default AuthController;
