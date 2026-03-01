import AuthService from './authService.js';
class AuthController {
  /**
   * POST /api/auth/register
   * Register a new customer
   */
  async register(req, res, next) {
    try {
      const userData = req.body;
      const user = await AuthService.register(userData);
      // Remove sensitive fields if any (password hash not returned by service)
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: user,
      });
    } catch (error) {
      // Pass to error handling middleware
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   * Login with phone and password
   */
  async login(req, res, next) {
    try {
      const { phoneE164, password } = req.body;
      const tokens = await AuthService.login(phoneE164, password);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   * Get current authenticated user profile
   */
  async getMe(req, res, next) {
    try {
      const userId = req.user.userId; // from auth middleware
      const user = await AuthService.getMe(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/auth/change-password
   * Change password for authenticated user
   */
  async changePassword(req, res, next) {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Old password and new password are required',
        });
      }

      await AuthService.changePassword(userId, oldPassword, newPassword);
      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/auth/update-location
   * Update user's subCity and woreda after password confirmation
   */
  async updateLocation(req, res, next) {
    try {
      const userId = req.user.userid;
      const { subCityId, woredaId, password } = req.body;

      if (!subCityId || !woredaId || !password) {
        return res.status(400).json({
          success: false,
          message: 'subCityId, woredaId, and password are required',
        });
      }

      const updatedUser = await AuthService.updateLocation(
        userId,
        { subCityId, woredaId },
        password
      );
      res.status(200).json({
        success: true,
        message: 'Location updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
