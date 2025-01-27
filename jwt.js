function generateToken(user) {
    return jwt.sign({ user }, 'your_secret_key', { expiresIn: '1h' });
  }
  
  // Middleware to verify JWT token
  function verifyToken(req, res, next) {
    const token = req.session.token;
    if (!token) return res.status(401).send('Access denied. No token provided.');
  
    jwt.verify(token, 'your_secret_key', (err, decoded) => {
        if (err) return res.status(403).send('Invalid token.');
        req.user = decoded.user;
        next();
    });
  }
  
  
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Check username and password (authentication logic)
  
    // Assuming authentication is successful
    const user = { username,password }; // You can add more user information here if needed
    const token = generateToken(user);
    req.session.token = token; // Store token in session
    res.redirect('/dashboard');
  });
  
  
  
  app.get('/dashboard', verifyToken, (req, res) => {
    // Access user information from req.user
    res.render('dashboard', { user: req.user });
  });
  
  