const Blog = require("../../models/Blog");

const dashboard = async (req, res) => {
    try {
        const totalBlogs = await Blog.countDocuments();
        const latestBlogs = await Blog.find();
        res.render("dashboard/analytics", { totalBlogs, latestBlogs });
    } catch (error) {
        res.redirect("/miscError");
    }
};

module.exports = {
    dashboard
};
