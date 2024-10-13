//[SECTION] Dependencies and Modules
const express = require("express");
const userController = require("../controllers/user");
const auth = require("../auth");
//[SECTION] Routing Component
const router = express.Router();

const { verify, verifyAdmin, isLoggedIn } = auth;

router.get('/', verify, verifyAdmin, userController.getAllUsers);
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/details", verify, userController.getProfile);
router.get('/:userId', userController.getUserById);
router.put('/edit', verify, userController.editProfile);



module.exports = router;