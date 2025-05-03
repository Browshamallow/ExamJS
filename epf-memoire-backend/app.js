const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const memoireRoutes = require('./routes/memoires');
const encadrementRoutes = require('./routes/encadrements');
const userRoutes = require('./routes/users');
const encadreurRoutes = require('./routes/encadreurs');
const suivisRoutes = require('./routes/suivis');
const sessionRoutes = require('./routes/sessions');
const path = require('path');
const sessionJuryRoutes = require('./routes/sessionJurys');
const adminRoutes = require("./routes/admin");


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/memoires', memoireRoutes);
app.use('/api/encadreur', memoireRoutes);
app.use('/api/encadrements', encadrementRoutes);
app.use('/api/encadreur', encadreurRoutes);
app.use('/api/users', userRoutes);
app.use('/api/suivis', suivisRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/sessions/encadreur', sessionRoutes);
app.use('/api/session-jurys', sessionJuryRoutes);
app.use("/api/admin", adminRoutes);




app.use('/uploads/memoires', express.static(path.join(__dirname, 'uploads/memoires')));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
