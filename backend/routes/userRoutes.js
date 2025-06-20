import express from "express";
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
} from "../controllers/userController.js";
import {
  authenticate,
  authorizedAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST /api/v1/users → Register user
router.post("/", createUser);

// GET /api/v1/users → Admin-only get all users
router.get("/", authenticate, authorizedAdmin, getAllUsers);

// POST /api/v1/users/auth → Login user
router.post("/auth", loginUser);

// POST /api/v1/users/logout → Logout user
router.post("/logout", logoutCurrentUser);

// GET /api/v1/users/profile - Get User's profile
// router.route("profile").get(authenticate, getCurrentUserProfile);
router.get("/profile", authenticate, getCurrentUserProfile);

// PUT /api/v1/users/profile - Update User's profile
router.put("/profile", authenticate, updateCurrentUserProfile);

export default router;
