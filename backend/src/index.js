const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');

const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const assetRouter = require('./routes/assetRoutes');

dotenv.config();

app.use(express.json());

app.use(cors({ origin: "*" }));

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/assets', assetRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});