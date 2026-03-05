import type { Request, Response } from 'express';
import UserService from './user.service.js';
import type { UserIdParams } from './user.validation.js';

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // GET /users/me - Get current user profile
  getProfile = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.getProfile(req.user.id);
      res.status(200).json({ user });
    } catch (error: any) {
      console.error('Get profile error:', error);
      res.status(400).json({ error: error.message });
    }
  };

  // PUT /users/me - Update own profile
  updateOwnProfile = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.updateOwnProfile(req.user.id, req.validated.body);
      res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error: any) {
      console.error('Update profile error:', error);
      res.status(400).json({ error: error.message });
    }
  };

  // PATCH /users/me/change-password - Change own password
  changePassword = async (req: Request, res: Response) => {
    try {
      const { oldPassword, newPassword } = req.validated.body;
      const result = await this.userService.changePassword(req.user.id, oldPassword, newPassword);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Change password error:', error);
      res.status(400).json({ error: error.message });
    }
  };

  // DELETE /users/me - Deactivate own account
  deactivateAccount = async (req: Request, res: Response) => {
    try {
      await this.userService.deactivateAccount(req.user.id);
      res.status(200).json({ message: 'Account deactivated successfully' });
    } catch (error: any) {
      console.error('Deactivate account error:', error);
      res.status(400).json({ error: error.message });
    }
  };

  // GET /users - List users
  listUsers = async (req: Request, res: Response) => {
    try {
      console.log('List users filters:', req.validated.query);
      const result = await this.userService.listUsers(req.validated.query);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('List users error:', error);
      res.status(403).json({ error: error.message });
    }
  };

  // GET /users/:id - Get user by ID
  getUserById = async (req: Request, res: Response) => {
    try {
      const params = req.validated.params as UserIdParams;
      const user = await this.userService.getUserById(params.id);
      res.status(200).json({ user });
    } catch (error: any) {
      console.error('Get user error:', error);
      res.status(error.message === 'User not found' ? 404 : 403).json({ error: error.message });
    }
  };

  // PATCH /users/:id/role - Update user role
  updateUserRole = async (req: Request, res: Response) => {
    try {
      const params = req.validated.params as UserIdParams;
      const user = await this.userService.updateUserRole(req.user, params.id, req.validated.body.role);
      res.status(200).json({ message: 'User role updated successfully', user });
    } catch (error: any) {
      console.error('Update user role error:', error);
      res.status(error.message === 'User not found' ? 404 : 403).json({ error: error.message });
    }
  };

  // PATCH /users/:id/status - Suspend/Reactivate user
  updateUserStatus = async (req: Request, res: Response) => {
    try {
      const params = req.validated.params as UserIdParams;
      const active = req.validated.body.active;
      const user = await this.userService.updateUserStatus(req.user, params.id, active);
      res.status(200).json({
        message: active ? 'User reactivated successfully' : 'User suspended successfully',
        user
      });
    } catch (error: any) {
      console.error('Update user status error:', error);
      res.status(error.message === 'User not found' ? 404 : 403).json({ error: error.message });
    }
  };

  // DELETE /users/:id - Restore user
  restoreUser = async (req: Request, res: Response) => {
    try {
      const params = req.validated.params as UserIdParams;
      await this.userService.restoreUser(req.user, params.id);
      res.status(200).json({ message: 'User restored successfully' });
    } catch (error: any) {
      console.error('Restore user error:', error);
      res.status(error.message === 'User not found' ? 404 : 403).json({ error: error.message });
    }
  };
}

export default UserController;
