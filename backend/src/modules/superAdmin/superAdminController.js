import SuperAdminService from './superAdminService.js';
import { validateCreateSuperAdmin } from './superAdminValidators.js';

class SuperAdminController {
  // 1) Add new SuperAdmin
  static async createSuperAdmin(req, res) {
    try {
      const { error } = validateCreateSuperAdmin(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const result = await SuperAdminService.createSuperAdmin(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // 2) SuperAdmin login
  static async login(req, res) {
    try {
      const { phoneOrEmail, password } = req.body;
      const token = await SuperAdminService.login(phoneOrEmail, password);
      res.json({ token });
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }

  // 3) CRUD SubCities
  static async createSubCity(req, res) {
    try {
      const result = await SuperAdminService.createSubCity(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async updateSubCity(req, res) {
    try {
      const result = await SuperAdminService.updateSubCity(req.params.id, req.body);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async deleteSubCity(req, res) {
    try {
      const result = await SuperAdminService.deleteSubCity(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // 4) CRUD Woredas
  static async createWoreda(req, res) {
    try {
      const result = await SuperAdminService.createWoreda(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async updateWoreda(req, res) {
    try {
      const result = await SuperAdminService.updateWoreda(req.params.id, req.body);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async deleteWoreda(req, res) {
    try {
      const result = await SuperAdminService.deleteWoreda(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // 5) Get users/admins
  static async getAllAdmins(req, res) {
    try {
      const role = req.query.role; // e.g., SUBCITY_ADMIN, WOREDA_ADMINS
      const result = await SuperAdminService.getAllAdmins(role);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getAdminsByLocation(req, res) {
    try {
      const { subCityId, woredaId } = req.query;
      const result = await SuperAdminService.getAdminsByLocation(subCityId, woredaId);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // 6) Get all users
  static async getAllUsers(req, res) {
    try {
      const result = await SuperAdminService.getAllUsers();
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getUsersByLocation(req, res) {
    try {
      const { subCityId, woredaId } = req.query;
      const result = await SuperAdminService.getUsersByLocation(subCityId, woredaId);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  // 7)CRUD subcity/woreda admins
  // Create SubCity or Woreda Admin
  async createAdmin(req, res) {
    try {
      const data = req.body; // {fullName, email, phone, role, subCityId?, woredaId?}
      const admin = await SuperAdminService.createAdmin(data);
      res.status(201).json(admin);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Update Admin
  async updateAdmin(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const admin = await SuperAdminService.updateAdmin(id, data);
      res.json(admin);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Delete Admin
  async deleteAdmin(req, res) {
    try {
      const { id } = req.params;
      const result = await SuperAdminService.deleteAdmin(id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Get All Admins (SubCity or Woreda)
  async getAdmins(req, res) {
    try {
      const { role, subCityId, woredaId } = req.query;
      const admins = await SuperAdminService.getAdmins({ role, subCityId, woredaId });
      res.json(admins);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
  // Add more endpoints here as needed (billing, complaints, etc.)
}

export default SuperAdminController;
