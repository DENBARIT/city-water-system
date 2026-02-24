import express from 'express';
const register = async (req, res) => {
  res.json({ httpmethod: 'POST', message: 'Welcome to the Movie API!' });
};
export default { register };
