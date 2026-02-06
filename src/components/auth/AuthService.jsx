// Authentication utilities using localStorage

export const AuthService = {
  // Get all users
  getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  },

  // Save users
  saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  },

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  // Set current user (login)
  setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  // Clear current user (logout)
  logout() {
    localStorage.removeItem('currentUser');
  },

  // Register new user
  register(name, email, password) {
    const users = this.getUsers();
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
      throw new Error('Email already registered');
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production, this should be hashed!
      requests: [],
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser);
    
    return newUser;
  },

  // Login user
  login(email, password) {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.email === email && u.password === password);
    
    if (userIndex === -1) {
      throw new Error('Invalid email or password');
    }

    // Update last login timestamp
    users[userIndex].lastLogin = new Date().toISOString();
    this.saveUsers(users);

    this.setCurrentUser(users[userIndex]);
    return users[userIndex];
  },

  // Check if user is authenticated
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  // Add request to user
  addRequestToUser(requestData) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) throw new Error('User not found');

    if (!users[userIndex].requests) {
      users[userIndex].requests = [];
    }

    users[userIndex].requests.push({
      ...requestData,
      id: requestData.id || Date.now().toString(),
      submittedAt: new Date().toISOString()
    });

    this.saveUsers(users);
    // Update session with fresh data
    this.setCurrentUser(users[userIndex]);
  },

  // Get user's latest request
  getUserLatestRequest() {
    const currentUser = this.getCurrentUser();
    if (!currentUser || !currentUser.requests || currentUser.requests.length === 0) {
      return null;
    }
    return currentUser.requests[currentUser.requests.length - 1];
  }
};