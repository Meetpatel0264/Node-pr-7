const express = require("express");
const authController = require("../controllers/auth-controller/auth-controller");
const dashboardController = require("../controllers/dashboard-controller/dashboard-controller");
const blogController = require("../controllers/blog-controller/blog-controller");
const viewController = require("../controllers/view-controller/view-controller");
const upload = require("../middleware/multer");
const { isLoggedIn, checkUserLogin, checkUserLogout } = require("../middleware/user-check/userCheck");

const router = express.Router();


router.get("/", (req, res) => {
    if (isLoggedIn(req)) {
        return res.redirect("/dashboard");
    }

    res.redirect("/login");
});

router.get("/login", checkUserLogout, authController.renderLogin);

router.post("/login", checkUserLogout, authController.loginUser);

router.get("/register", checkUserLogout, authController.renderRegister);

router.post("/register", checkUserLogout, authController.registerUser);

router.get("/logout", authController.logoutUser);

router.get("/dashboard", checkUserLogin, dashboardController.dashboard);

router.get("/analytics", (req, res) => res.redirect("/dashboard"));

router.get("/add-blog", checkUserLogin, blogController.addBlogPage);

router.post("/add-blog", checkUserLogin, upload.single("image"), blogController.addBlog);

router.get("/view-blog", checkUserLogin, viewController.viewBlogs);

router.get("/blog/:id", checkUserLogin, viewController.singleBlog);

router.get("/edit-blog/:id", checkUserLogin, blogController.editBlogPage);

router.post("/update-blog/:id", checkUserLogin, upload.single("image"), blogController.updateBlog);

router.get("/delete-blog/:id", checkUserLogin, viewController.deleteBlog);

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
