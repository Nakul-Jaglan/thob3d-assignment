const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth');
const { me, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');

router.use(protect);
router.get('/me', me);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;