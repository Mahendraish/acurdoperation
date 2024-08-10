const express = require("express");
const router = express.Router();
const User = require('../modules/users'); // Ensure the path is correct
const multer = require('multer');

// Configure Multer storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({
    storage: storage,
}).single('image');

// POST route to add a new user
router.post('/add', upload, async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename,
        });

        await user.save();
        req.session.message = {
            type: "success",
            message: "User Added Successfully to Portal"
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

// GET route to render the home page
router.get('/', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.render("index", { title: "Home page", users: users });
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

// GET route to render the add user page
router.get('/add', (req, res) => {
    res.render("add_users", { title: "Add New Users" });
});

module.exports = router;
