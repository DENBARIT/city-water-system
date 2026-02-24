import express from 'express';
import authController from '../src/controllers/Auth & security domain';
const router = express.Router();

// Define your auth routes
router.get('/', (req, res) => {
  res.json({ httpmethod: 'GET', message: 'Welcome Addis Ababa!' });
});
router.post('/register', authController.register);
router.put('/', (req, res) => {
  res.json({ httpmethod: 'PUT', message: 'Welcome to the Movie API!' });
});
router.delete('/', (req, res) => {
  res.json({ httpmethod: 'DELETE', message: 'Welcome to the Movie API!' });
});
export default router;
