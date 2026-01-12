const prisma = require('../prismaClient');

async function getAssets(req, res) {
    try {
        const assets = await prisma.asset.findMany();
        res.status(200).json(assets);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

async function getAssetById(req, res) {
    const { id } = req.params;

    try {
        const asset = await prisma.asset.findUnique({ where: { id } });

        if (asset) {
            res.status(200).json(asset);
        } else {
            res.status(404).json({ message: 'Asset not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

async function createAsset(req, res) {
    const { name, description, image, url, category, format, size, tags } = req.body;

    if (!name || !url) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const tagsArray = Array.isArray(tags)
        ? tags
        : (typeof tags === 'string' && tags.length ? tags.split(',').map(t => t.trim()) : []);

    const parsedSize = size ? Number(size) : null;

    try {
        const asset = await prisma.asset.create({
            data: {
                ownerId: req.user.id,
                name,
                description,
                image,
                url,
                category,
                format,
                size: parsedSize,
                tags: tagsArray,
            },
        });

        res.status(201).json(asset);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

async function updateAsset(req, res) {
    const { id } = req.params;
    const { name, description, image, url, category, format, size, tags } = req.body;

    try {
        const asset = await prisma.asset.update({
            where: { id },
            data: { name, description, image, url, category, format, size, tags },
        });

        res.status(200).json(asset);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

async function deleteAsset(req, res) {
    const { id } = req.params;

    try {
        await prisma.asset.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { getAssets, getAssetById, createAsset, updateAsset, deleteAsset };