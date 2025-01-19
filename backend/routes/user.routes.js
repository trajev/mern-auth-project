const express = require("express")
const {getAllUsers, registerUser, loginUser, getProfile, logoutUser } = require("../controllers/user.controllers");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router()

router.route("/").get(getAllUsers)
router.post( "/register" , registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyToken, getProfile );
router.post("/logout", logoutUser )

module.exports = router