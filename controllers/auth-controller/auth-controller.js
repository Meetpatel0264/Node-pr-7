const User = require("../../models/User");
const bcrypt = require("bcrypt");
const passport = require("../../middleware/passport");

const renderLogin = (req, res) => {
    res.render("auth/login", {
        error: null,
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

const loginUser = async (req, res, next) => {
    try {
        let { email, password } = req.body;

        email = email ? email.toLowerCase().trim() : "";
        password = password ? password.trim() : "";

        if (!email || !password) {
            return res.render("auth/login", {
                error: "Email and password are required",
                success: null
            });
        }

        // const user = await User.findOne({ email });
        // if (!user) {
        //     return res.render("auth/login", {
        //         error: "Invalid email or password",
        //         success: null
        //     });
        // }
        // const isMatch = await bcrypt.compare(password, user.password);
        // if (!isMatch) {
        //     return res.render("auth/login", {
        //         error: "Invalid email or password",
        //         success: null
        //     });
        // }
        // res.cookie("userId", user._id.toString());
        // return res.redirect("/dashboard");

        passport.authenticate("local", (err, user, info) => {
            if (err) {
                console.error(err);
                return res.render("auth/login", {
                    error: "Login failed. Please try again.",
                    success: null
                });
            }

            if (!user) {
                return res.render("auth/login", {
                    error: info && info.message ? info.message : "Invalid email or password",
                    success: null
                });
            }

            req.logIn(user, (loginErr) => {
                if (loginErr) {
                    console.error(loginErr);
                    return res.render("auth/login", {
                        error: "Login failed. Please try again.",
                        success: null
                    });
                }

                res.cookie("userId", user._id.toString());
                return res.redirect("/dashboard");
            });
        })(req, res, next);

    } catch (error) {
        console.error(error);

        return res.render("auth/login", {
            error: "Login failed. Please try again.",
            success: null
        });
    }
};

const logoutUser = (req, res, next) => {
    res.clearCookie("userId");

    if (req.logout) {
        return req.logout((err) => {
            if (err) {
                return next(err);
            }
            req.session.destroy(() => {
                return res.redirect("/login");
            });
        });
    }

    return res.redirect("/login");
};

module.exports = {
    renderLogin,
    renderRegister,
    registerUser,
    loginUser,
    logoutUser
};
