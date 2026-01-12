const prisma = require('../prismaClient');

async function me(req, res) {
    const { id } = req.user;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { id: true, email: true, name: true } });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

async function getUsers(req, res) {
    try {
        const users = await prisma.user.findMany({select: { id: true, email: true, name: true }});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

async function getUserById(req, res) {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true } });

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

async function updateUser(req, res) {
    const { id } = req.params;
    const { name, email } = req.body;

    try {
        const user = await prisma.user.update({
            where: { id },
            data: { name, email },
        });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

async function deleteUser(req, res) {
    const { id } = req.params;

    try {
        await prisma.user.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { me, getUsers, getUserById, updateUser, deleteUser };