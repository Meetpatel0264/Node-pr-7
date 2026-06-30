const express = require("express");
const authController = require("../controllers/auth-controller/auth-controller");
const dashboardController = require("../controllers/dashboard-controller/dashboard-controller");
const blogController = require("../controllers/blog-controller/blog-controller");
const viewController = require("../controllers/view-controller/view-controller");
const upload = require("../middleware/multer");
const passport = require("passport");

const router = express.Router();

const isLoggedIn = (req) => {
    return (req.isAuthenticated && req.isAuthenticated()) || (req.cookies && req.cookies.userId);
};

const checkLogin = (req, res) => {

    if (!isLoggedIn(req)) {
        res.redirect("/login");
        return false;
    }

    return true;
};

const checkGuest = (req, res) => {
    
    if (isLoggedIn(req)) {
        res.redirect("/dashboard");
        return false;
    }

    return true;
};

router.get("/", (req, res) => {
    if (isLoggedIn(req)) {
        return res.redirect("/dashboard");
    }

    res.redirect("/login");
});

router.get("/login", (req, res) => {
    if (!checkGuest(req, res)) {
        return;
    }
    authController.renderLogin(req, res);
});

router.post("/login", (req, res, next) => {
    if (!checkGuest(req, res)) {
        return;
    }
    authController.loginUser(req, res, next);
});

router.get("/register", (req, res) => {
    if (!checkGuest(req, res)) {
        return;
    }
    authController.renderRegister(req, res);
});

router.post("/register", (req, res) => {
    if (!checkGuest(req, res)) {
        return;
    }
    authController.registerUser(req, res);
});

router.get("/logout", authController.logoutUser);

router.get("/dashboard", (req, res) => {
    if (!checkLogin(req, res)) {
        return;
    }
    dashboardController.dashboard(req, res);
});

router.get("/analytics", (req, res) => res.redirect("/dashboard"));

router.get("/add-blog", (req, res) => {
    if (!checkLogin(req, res)) {
        return;
    }
    blogController.addBlogPage(req, res);
});

router.post("/add-blog", upload.single("image"), (req, res) => {
    if (!checkLogin(req, res)) {
        return;
    }
    blogController.addBlog(req, res);
});

router.get("/view-blog", (req, res) => {
    if (!checkLogin(req, res)) {
        return;
    }
    viewController.viewBlogs(req, res);
});

router.get("/blog/:id", (req, res) => {
    if (!checkLogin(req, res)) {
        return;
    }
    viewController.singleBlog(req, res);
});

router.get("/edit-blog/:id", (req, res) => {
    if (!checkLogin(req, res)) {
        return;
    }
    blogController.editBlogPage(req, res);
});

router.post("/update-blog/:id", upload.single("image"), (req, res) => {
    if (!checkLogin(req, res)) {
        return;
    }
    blogController.updateBlog(req, res);
});

router.get("/delete-blog/:id", (req, res) => {
    if (!checkLogin(req, res)) {
        return;
    }
    viewController.deleteBlog(req, res);
});

router.get("/miscError", (req, res) => {
    res.status(404).render("Misc/miscError");
});

router.get("/underMaintenance", (req, res) => {
    res.render("Misc/underMaintenance");
});

router.use((req, res) => {
    res.status(404).render("Misc/miscError");
});

module.exports = router;
