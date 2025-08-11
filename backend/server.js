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
// app.use(cors({
//   origin: 'http://localhost:4200',
//   credentials: true // only if you're using tokens/cookies
// }));
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
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'welcome123',
//   database: 'raise_ticket',
//   port:4000
  // host: process.env.DB_HOST,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_NAME,
  // port: process.env.DB_PORT || 4000,
// });
// async function testConnection() {
//   try {
//     const pool = mysql.createPool({
//       host: 'localhost',
//       user: 'root',
//       password: 'welcome123',
//       database: 'raise_ticket',
//       port: 3306,
//     });
//     await pool.query('SELECT 1');
//     console.log('✅ MySQL connected successfully');
//   } catch (err) {
//     console.error('❌ DB Connection failed:', err.message);
//   }
// }
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'raise_ticket',
});

async function testConnection() {
  try {
    await pool.query('SELECT 1');
    console.log('✅ MySQL connected successfully');
  } catch (err) {
    console.error('❌ DB Connection failed:', err.message);
  }
}

testConnection();

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
//old code
app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ message: 'Email already exists' });
    await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashed, role || 'customer']);
    res.json({ message: 'User registered' });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: err.message });
  }
});
// admin register
app.post('/api/adminregister', async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ message: 'Email already exists' });
    await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashed, role || 'Admin']);
    res.json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//update code(admin,customer)
// app.post('/api/register', async (req, res) => {
//   const { name, email, password, role } = req.body;

//   // Validate role
//   if (!['admin', 'customer'].includes(role)) {
//     return res.status(400).json({ message: 'Invalid or missing role. Must be "admin" or "customer".' });
//   }

//   try {
//     // Hash password
//     const hashed = await bcrypt.hash(password, 10);

//     // Check if email already exists
//     const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
//     if (existing.length > 0) {
//       return res.status(400).json({ message: 'Email already exists' });
//     }

//     // Insert user
//     await pool.query(
//       'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
//       [name, email, hashed, role]
//     );

//     res.json({ message: 'User registered successfully' });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

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

// admin login 
app.post('/api/adminlogin', async (req, res) => {
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
  try{
  const sql = req.user.role === 'admin'
    ? 'SELECT * FROM tickets'
    : 'SELECT * FROM tickets WHERE created_by = ?';
  const [rows] = await pool.query(sql, req.user.role === 'admin' ? [] : [req.user.id]);
  res.json(rows);
}catch(err){
  console.log('fetching data error');
  res.status(500).json({ error: err.message });
}
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
      SELECT users.id as user_id, users.name, COUNT(tickets.id) as ticket_count
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

// Get Tickets by User ID (Admin only)
app.get('/api/tickets/user/:userId', authenticate, authorize('admin'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM tickets WHERE created_by = ? ORDER BY created_at DESC',
      [req.params.userId]
    );
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Tickets by Status (Admin only)
app.get('/api/tickets/status/:status', authenticate, authorize('admin'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM tickets WHERE status = ? ORDER BY created_at DESC',
      [req.params.status]
    );
    
    res.json(rows);
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
//old code
app.put('/api/tickets/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { subject, category, priority, status } = req.body;
    console.log(req.params.id);
    
     console.log(status);
    const [result] = await pool.query(
      'UPDATE tickets SET status=? WHERE id=?',
      [status, req.params.id]
    );
    console.log(result);
    
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    res.json({ message: 'Ticket updated successfully' });
  } catch (err) {
    console.error('Update ticket error:', err);
    res.status(500).json({ error: err.message });
  }
});

// const cleanValue = (val) => typeof val === 'string' ? val.trim() : val;

// ✅ Allowed ENUM values
// const allowedStatuses = ['open', 'in progress', 'closed', 'resolved'];
// const allowedPriorities = ['Low', 'Medium', 'High'];

// app.put('/api/tickets/:id', authenticate, async (req, res) => {
//   const {
//     subject,
//     category,
//     priority,
//     status,
//     description,
//     created_by,
//     created_at
//   } = req.body;

//   const fields = [];
//   const values = [];

//   if (subject !== undefined) {
//     fields.push("subject = ?");
//     values.push(cleanValue(subject));
//   }

//   if (category !== undefined) {
//     fields.push("category = ?");
//     values.push(cleanValue(category));
//   }

//   if (priority !== undefined) {
//     const cleaned = cleanValue(priority);
//     if (!allowedPriorities.includes(cleaned)) {
//       return res.status(400).json({ error: 'Invalid priority value' });
//     }
//     fields.push("priority = ?");
//     values.push(cleaned);
//   }

//   if (status !== undefined) {
//     const cleaned = cleanValue(status);
//     if (!allowedStatuses.includes(cleaned)) {
//       return res.status(400).json({ error: 'Invalid status value' });
//     }
//     fields.push("status = ?");
//     values.push(cleaned);
//   }

//   if (description !== undefined) {
//     fields.push("description = ?");
//     values.push(cleanValue(description));
//   }

//   if (created_by !== undefined) {
//     fields.push("created_by = ?");
//     values.push(created_by);
//   }

//   if (created_at !== undefined) {
//     fields.push("created_at = ?");
//     values.push(created_at);
//   }

//   if (fields.length === 0) {
//     return res.status(400).json({ error: 'No fields provided for update.' });
//   }

//   values.push(req.params.id); // for WHERE clause

//   try {
//     const [result] = await pool.query(
//       `UPDATE tickets SET ${fields.join(', ')} WHERE id = ?`,
//       values
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'Ticket not found' });
//     }

//     res.json({ message: 'Ticket updated successfully' });
//   } catch (error) {
//     console.error('Update ticket error:', error);
//     res.status(500).json({ error: error.message });
//   }
// });




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

// // Add Comment + Attachment
//old code
app.post('/api/comments/:ticketId', authenticate, upload.single('attachment'), async (req, res) => {
  const { comment } = req.body;
  const attachment = req.file?.filename || null;
  await pool.query(
    'INSERT INTO comments (ticket_id, user_id, comment, attachment) VALUES (?, ?, ?, ?)',
    [req.params.ticketId, req.user.id, comment, attachment]
  );
  res.json({ message: 'Comment added' });
});

// Add Comment + Attachment (Auto-close if admin)
// app.post('/api/comments/:ticketId', authenticate, upload.single('attachment'), async (req, res) => {
//   const { comment } = req.body;
//   const attachment = req.file?.filename || null;
//   const ticketId = req.params.ticketId;
//   const userId = req.user.id;
//   const role = req.user.role;

//   try {
//     if (!comment || !ticketId) {
//       return res.status(400).json({ error: 'Comment and Ticket ID are required' });
//     }

//     // Insert the comment
//     await pool.query(
//       'INSERT INTO comments (ticket_id, user_id, comment, attachment) VALUES (?, ?, ?, ?)',
//       [ticketId, userId, comment, attachment]
//     );

//     // Auto-close the ticket if admin writes "closed" (case-insensitive)
//     if (role === 'admin' && comment.toLowerCase().includes('closed')) {
//       await pool.query(
//         "UPDATE tickets SET status = 'closed' WHERE id = ?",
//         [ticketId]
//       );
//       console.log(`🔒 Ticket #${ticketId} marked as CLOSED by admin`);
//     }

//     res.json({ message: 'Comment added successfully' });
//   } catch (err) {
//     console.error('❌ Error adding comment:', err);
//     res.status(500).json({ error: err.message || 'Unknown error occurred' });
//   }
// });


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