const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
// const cors = require('cors');

// app.use(cors({
//   origin: 'https://ticketsystem-klq3.onrender.com', // ✅ your frontend domain
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true // if you're using cookies/auth tokens
// }));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer config for attachments
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + file.originalname;
    cb(null, unique);
  }
});
const upload = multer({ storage });

// DB connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'welcome123',
  database: 'raise_ticket',
});

// JWT Auth Middleware
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'secretkey', (err, user) => {
    if (err) {
      console.log('JWT Error:', err.message);
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token. Please login again.' });
      }
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired. Please login again.' });
      }
      return res.status(403).json({ message: 'Token verification failed' });
    }
    req.user = user;
    next();
  });
}

function authorize(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }

    next();
  };
}

// User Registration
app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ message: 'Email already exists' });
    await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashed, role || 'customer']);
    res.json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// User Login

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const [[user]] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, role: user.role }, 'secretkey', { expiresIn: '1d' });
  res.json({ token, role: user.role, username: user.name });
});
// app.post('/api/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password required' });
//     }

//     const [[user]] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });

//     res.json({ token, role: user.role, username: user.name });

//   } catch (err) {
//     console.error('Login Error:', err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


// Create Ticket (customer)
app.post('/api/tickets', authenticate, async (req, res) => {
  const { subject, category, priority, description } = req.body;
  try {
    await pool.query(
      'INSERT INTO tickets (subject, category, priority, description, created_by) VALUES (?, ?, ?, ?, ?)',
      [subject, category, priority, description, req.user.id]
    );
    res.json({ message: 'Ticket created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Tickets (admin) or User's Tickets (customer)
app.get('/api/tickets', authenticate, async (req, res) => {
  const sql = req.user.role === 'admin'
    ? 'SELECT * FROM tickets'
    : 'SELECT * FROM tickets WHERE created_by = ?';
  const [rows] = await pool.query(sql, req.user.role === 'admin' ? [] : [req.user.id]);
  res.json(rows);
});

// Get Tickets Count
app.get('/api/tickets/count', authenticate, async (req, res) => {
  try {
    const [total] = await pool.query('SELECT COUNT(*) AS count FROM tickets');
    const [open] = await pool.query("SELECT COUNT(*) AS count FROM tickets WHERE status = 'open'");
    const [closed] = await pool.query("SELECT COUNT(*) AS count FROM tickets WHERE status = 'closed'");
    const [my] = await pool.query('SELECT COUNT(*) AS count FROM tickets WHERE created_by = ?', [req.user.id]);
    
    res.json({ 
      total: total[0].count,
      open: open[0].count,
      closed: closed[0].count,
      my: my[0].count
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Tickets Stats by Priority (Admin only)
app.get('/api/tickets/stats', authenticate, authorize('admin'), async (req, res) => {
  try {
    const [priority] = await pool.query(`
      SELECT priority, COUNT(*) as count 
      FROM tickets 
      GROUP BY priority
    `);
    
    res.json({ priority });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Latest Ticket (Admin only)
app.get('/api/tickets/latest', authenticate, authorize('admin'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM tickets ORDER BY created_at DESC LIMIT 1'
    );
    
    if (rows.length === 0) {
      return res.json(null);
    }
    
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/tickets/top-creator', authenticate, authorize('admin'), async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT users.name, COUNT(tickets.id) as ticket_count
      FROM users
      JOIN tickets ON users.id = tickets.created_by
      GROUP BY users.id
      ORDER BY ticket_count DESC
      LIMIT 1
    `);

    if (rows.length === 0) {
      return res.json(null);
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single Ticket by ID
app.get('/api/tickets/:id', authenticate, async (req, res) => {
  try {
    const sql = req.user.role === 'admin'
      ? 'SELECT * FROM tickets WHERE id = ?'
      : 'SELECT * FROM tickets WHERE id = ? AND created_by = ?';
    const params = req.user.role === 'admin' ? [req.params.id] : [req.params.id, req.user.id];
    const [rows] = await pool.query(sql, params);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Ticket (admin)
app.put('/api/tickets/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { subject, category, priority, status } = req.body;
    
    const [result] = await pool.query(
      'UPDATE tickets SET subject=?, category=?, priority=?, status=? WHERE id=?',
      [subject, category, priority, status?.toLowerCase(), req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    res.json({ message: 'Ticket updated successfully' });
  } catch (err) {
    console.error('Update ticket error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete Ticket (admin)
app.delete('/api/tickets/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM tickets WHERE id=?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    res.json({ message: 'Ticket deleted successfully' });
  } catch (err) {
    console.error('Delete ticket error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add Comment + Attachment
app.post('/api/comments/:ticketId', authenticate, upload.single('attachment'), async (req, res) => {
  const { comment } = req.body;
  const attachment = req.file?.filename || null;
  await pool.query(
    'INSERT INTO comments (ticket_id, user_id, comment, attachment) VALUES (?, ?, ?, ?)',
    [req.params.ticketId, req.user.id, comment, attachment]
  );
  res.json({ message: 'Comment added' });
});

// Get Comments for Ticket
app.get('/api/comments/:ticketId', authenticate, async (req, res) => {
  const [comments] = await pool.query('SELECT * FROM comments WHERE ticket_id = ?', [req.params.ticketId]);
  res.json(comments);
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});