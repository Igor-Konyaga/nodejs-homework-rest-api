const express = require("express");
const {
  register,
  login,
  logout,
  current,
} = require("../../controllers/authController");
const { protect } = require("../../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.use(protect);

router.post("/logout", logout);
router.post("/current", current);

module.exports = router;
