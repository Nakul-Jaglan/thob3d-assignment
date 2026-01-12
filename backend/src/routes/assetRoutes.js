const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth');
const { getAssets, getAssetById, createAsset, updateAsset, deleteAsset } = require('../controllers/assetController');

router.use(protect);
router.get('/', getAssets);
router.get('/:id', getAssetById);
router.post('/', createAsset);
router.put('/:id', updateAsset);
router.delete('/:id', deleteAsset);

module.exports = router;