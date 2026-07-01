const User = require("../../models/User");
const bcrypt = require("bcrypt");
const passport = require("../../middleware/passport");

const renderLogin = (req, res) => {
    res.render("auth/login", {
        error: req.query.error ? "Invalid email or password" : null,
        success: null
    });
};

const renderRegister = (req, res) => {
    res.render("auth/register", {
        error: null,
        success: null
    });
};

const registerUser = async (req, res) => {
    try {
        let { username, email, password } = req.body;

        username = username ? username.trim() : "";
        email = email ? email.toLowerCase().trim() : "";
        password = password ? password.trim() : "";

        if (!username || !email || !password) {
            return res.render("auth/register", {
                error: "All fields are required",
                success: null
            });
        }

        const exists = await User.findOne({ email });

        if (exists) {
            return res.render("auth/register", {
                error: "Email already registered",
                success: null
            });
        }

        const hashPass = await bcrypt.hash(password, 12);

        await User.create({
            username,
            email,
            password: hashPass
        });

        return res.render("auth/login", {
            error: null,
            success: "Account created successfully. Please login."
        });

    } catch (error) {
        console.error(error);

        return res.render("auth/register", {
            error: "Registration failed. Please try again.",
            success: null
        });
    }
};

const loginUser = (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/login?error=1",
        failureFlash: false
    })(req, res, next);
};

const logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.session.destroy((sessionErr) => {
            if (sessionErr) {
                return next(sessionErr);
            }

            res.clearCookie("sessionId");
            return res.redirect("/login");
        });
    });
};

module.exports = {
    renderLogin,
    renderRegister,
    registerUser,
    loginUser,
    logoutUser
};
