const express = require("express");
const {
  register,
  login,
  logout,
  current,
  updateSubscriptionUser,
  updateUserAvatar,
} = require("../../controllers/authController");
const { protect, uploadAvatar } = require("../../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.use(protect);

router.post("/logout", logout);
router.post("/current", current);

router.patch("/subscription", updateSubscriptionUser);
router.patch("/avatars", uploadAvatar.single("avatar"), updateUserAvatar);

module.exports = router;
