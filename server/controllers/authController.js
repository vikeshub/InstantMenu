const db = require("../models");
const User = db.User;
const Role = db.Role;
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 
const authConfig = require("../config/auth.config");

// Helper to generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role_id.name },
    authConfig.JWT_ACCESS_SECRET,
    { expiresIn: authConfig.ACCESS_TOKEN_EXPIRATION }
  );
  const refreshToken = jwt.sign(
    { userId: user._id },
    authConfig.JWT_REFRESH_SECRET,
    { expiresIn: authConfig.REFRESH_TOKEN_EXPIRATION }
  );
  return { accessToken, refreshToken };
};

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Default role for new registrations is 'customer'
    const customerRole = await Role.findOne({ name: "customer" });
    if (!customerRole) {
      return res
        .status(500)
        .json({ message: "Default customer role not found." });
    }

    const user = new User({
      name,
      email,
      password,
      phone,
      role_id: customerRole._id
    });

    await user.save(); 
    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("role_id"); // Populate role to get role name
    if (!user) {
      return res.status(404).json({ message: "User not found." }); 
    }

    const isMatch = await bcrypt.compare(password, user.password); 
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." }); 
    }

    const { accessToken, refreshToken } = generateTokens(user); 

    // Set refresh token in HTTP-only cookie 
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure in production
      sameSite: "Strict", // Or 'None' if cross-site, but requires secure: true
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, matches REFRESH_TOKEN_EXPIRATION
    });

    res.json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role_id.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};

// Refresh Token
exports.refreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res
      .status(401)
      .json({ message: "Unauthorized: No refresh token found." });

  const refreshToken = cookies.jwt;

  try {
    const decoded = jwt.verify(refreshToken, authConfig.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId).populate("role_id");

    if (!user)
      return res.status(403).json({ message: "Forbidden: User not found." });

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role_id.name },
      authConfig.JWT_ACCESS_SECRET,
      { expiresIn: authConfig.ACCESS_TOKEN_EXPIRATION }
    );

    res.json({ accessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    res
      .status(403)
      .json({ message: "Forbidden: Invalid or expired refresh token." }); 
  }
};

// Logout User
exports.logoutUser = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content to send

  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.json({ message: "Logout successful." });
};

// Get User Profile 
exports.getUserProfile = async (req, res) => {
  try {
    // req.user is set by authenticateJWT middleware
    const user = await User.findById(req.user.userId)
      .select("-password")
      .populate("role_id");
    if (!user) {
      return res.status(404).json({ message: "User profile not found." });
    }
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role_id.name,
      },
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ message: "Server error fetching profile." });
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.updated_at = Date.now();
    await user.save();
    res.json({
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    res.status(500).json({ message: "Server error updating profile." });
  }
};
// Update Password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password incorrect.' });
    }

    user.password = newPassword; // Pre-save hook will hash this
    await user.save();
    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Server error updating password.' });
  }
};


// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find(); 
    res.status(200).json({ roles });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: 'Server error fetching roles.' });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('role_id');
    res.json({ users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error fetching users.' });
  }
};

// Delete user by id (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error deleting user.' });
  }
};

// Register user by role (admin can register restaurant_owner, restaurant_owner can register staff)
exports.registerByRole = async (req, res) => {
  try {
    const { name, email, password, phone, roleName } = req.body;
    const requestUser = req.user;

    // Find the requester's role (from JWT or DB)
    const requestUserDoc = await User.findById(requestUser.userId).populate('role_id');
    const requestUserRole = requestUserDoc.role_id;
    const targetRole = await Role.findOne({ name: roleName });

    if (!targetRole) {
      return res.status(400).json({ message: "Target role not found." });
    }

    // Logic: Admin can register restaurant_owner | restaurant_owner can register staff
    if (
      (requestUserRole.name === 'admin' && roleName === 'restaurant_owner') ||
      (requestUserRole.name === 'restaurant_owner' && roleName === 'staff')
    ) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use." });
      }

      let createdBy = null;
      if (requestUserRole.name === 'admin' && roleName === 'restaurant_owner') {
        createdBy = requestUserDoc._id;
      } else if (requestUserRole.name === 'restaurant_owner' && roleName === 'staff') {
        createdBy = requestUserDoc._id;
      }

      const newUser = new User({
        name,
        email,
        password,
        phone,
        role_id: targetRole._id,
        created_by: createdBy
      });

      await newUser.save();

      const userObj = newUser.toObject();
      delete userObj.password;

      res.status(201).json({ message: `User with role '${roleName}' registered successfully.`, user: userObj });
    } else {
      return res.status(403).json({ message: `You are not allowed to create users with role '${roleName}'.` });
    }

  } catch (error) {
    console.error("registerByRole error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
};
