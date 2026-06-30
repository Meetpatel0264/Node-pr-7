const fs = require("fs");
const Blog = require("../../models/Blog");

const removeImage = (imageName) => {
    if (!imageName) {
        return;
    }

    const imagePath = `uploads/blogs/${imageName}`;
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
};

const viewBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.render("blog/viewBlog", { blogs });
    } catch (error) {
        res.redirect("/miscError");
    }
};

const singleBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.redirect("/view-blog");
        }

        res.render("blog/singleBlog", { blog });
    } catch (error) {
        res.redirect("/view-blog");
    }
};

const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog) {
            removeImage(blog.image);
            await Blog.findByIdAndDelete(req.params.id);
        }
        res.redirect("/view-blog");
    } catch (error) {
        res.redirect("/view-blog");
    }
};

module.exports = {
    viewBlogs,
    singleBlog,
    deleteBlog
};
