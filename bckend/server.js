const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://sohitsolanki0001:YIGpEBGcqoCjoKAn@cluster0.7sczhaj.mongodb.net/JobSchedular', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  totalEarnings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Job Schema
const jobSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true
  },
  deadline: {
    type: Number,
    required: true,
    min: 1
  },
  profit: {
    type: Number,
    required: true,
    min: 1
  },
  done: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique jobId per user
jobSchema.index({ jobId: 1, userId: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);
const Job = mongoose.model('Job', jobSchema);

// JWT Secret (In production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Auth middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Auth Routes
app.post('/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        totalEarnings: user.totalEarnings
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        totalEarnings: user.totalEarnings
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Protected Routes
app.get('/auth/me', authenticateToken, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      totalEarnings: req.user.totalEarnings
    }
  });
});

// Job Routes (Protected)
app.post('/add-job', authenticateToken, async (req, res) => {
  try {
    const { id, deadline, profit } = req.body;

    if (!id || !deadline || !profit) {
      return res.status(400).json({ error: 'Invalid job data' });
    }

    if (deadline <= 0 || profit <= 0) {
      return res.status(400).json({ error: 'Deadline and profit must be positive numbers' });
    }

    // Check if job ID already exists for this user
    const existingJob = await Job.findOne({ jobId: id, userId: req.user._id });
    if (existingJob) {
      return res.status(400).json({ error: 'Job ID already exists' });
    }

    const job = new Job({
      jobId: id,
      deadline: parseInt(deadline),
      profit: parseInt(profit),
      userId: req.user._id
    });

    await job.save();

    // Get all jobs for this user
    const jobs = await Job.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const jobsFormatted = jobs.map(job => ({
      id: job.jobId,
      deadline: job.deadline,
      profit: job.profit,
      done: job.done
    }));

    res.json({ message: 'Job added', jobs: jobsFormatted });
  } catch (error) {
    console.error('Add job error:', error);
    res.status(500).json({ error: 'Server error while adding job' });
  }
});

app.get('/get-jobs', authenticateToken, async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const jobsFormatted = jobs.map(job => ({
      id: job.jobId,
      deadline: job.deadline,
      profit: job.profit,
      done: job.done
    }));
    res.json(jobsFormatted);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Server error while fetching jobs' });
  }
});

app.delete('/delete-job/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedJob = await Job.findOneAndDelete({ 
      jobId: id, 
      userId: req.user._id 
    });

    if (!deletedJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Get remaining jobs
    const jobs = await Job.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const jobsFormatted = jobs.map(job => ({
      id: job.jobId,
      deadline: job.deadline,
      profit: job.profit,
      done: job.done
    }));

    res.json({ message: 'Job deleted successfully', jobs: jobsFormatted });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Server error while deleting job' });
  }
});

app.post('/schedule', authenticateToken, async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user._id, done: false });
    
    if (jobs.length === 0) {
      return res.json({ scheduled: [], totalProfit: 0 });
    }

    const availableJobs = jobs.map(job => ({
      id: job.jobId,
      deadline: job.deadline,
      profit: job.profit
    }));

    const maxDeadline = Math.max(...availableJobs.map(j => j.deadline));
    const result = Array(maxDeadline).fill(null);
    const sortedJobs = [...availableJobs].sort((a, b) => b.profit - a.profit);

    let scheduled = [];
    let profit = 0;

    for (let job of sortedJobs) {
      for (let j = job.deadline - 1; j >= 0; j--) {
        if (!result[j]) {
          result[j] = job;
          scheduled.push(job.id);
          profit += job.profit;
          break;
        }
      }
    }

    res.json({ scheduled, totalProfit: profit });
  } catch (error) {
    console.error('Schedule error:', error);
    res.status(500).json({ error: 'Server error while scheduling jobs' });
  }
});

app.post('/toggle-done', authenticateToken, async (req, res) => {
  try {
    const { id } = req.body;
    
    const job = await Job.findOne({ jobId: id, userId: req.user._id });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    job.done = !job.done;
    await job.save();

    const jobs = await Job.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const jobsFormatted = jobs.map(job => ({
      id: job.jobId,
      deadline: job.deadline,
      profit: job.profit,
      done: job.done
    }));

    res.json(jobsFormatted);
  } catch (error) {
    console.error('Toggle job error:', error);
    res.status(500).json({ error: 'Server error while updating job' });
  }
});

app.post('/update-earnings', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    req.user.totalEarnings += amount;
    await req.user.save();

    res.json({ 
      message: 'Earnings updated',
      totalEarnings: req.user.totalEarnings 
    });
  } catch (error) {
    console.error('Update earnings error:', error);
    res.status(500).json({ error: 'Server error while updating earnings' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Make sure MongoDB is running on mongodb://localhost:27017');
});