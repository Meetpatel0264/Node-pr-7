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

const addBlogPage = (req, res) => {
    res.render("blog/addBlog", { error: null, success: null });
};

const addBlog = async (req, res) => {
    try {
        const { title, desc, authername } = req.body;

        if (!title || !desc || !authername || !req.file) {
            return res.render("blog/addBlog", { error: "Image, title, description and author name are required", success: null });
        }

        await Blog.create({
            image: req.file.filename,
            title: title.trim(),
            desc: desc.trim(),
            authername: authername.trim()
        });

        res.redirect("/view-blog");
    } catch (error) {
        if (req.file) {
            removeImage(req.file.filename);
        }
        res.render("blog/addBlog", { error: "Blog not added. Please upload valid image.", success: null });
    }
};

const editBlogPage = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.redirect("/view-blog");
        }

        res.render("blog/editBlog", { blog, error: null });
    } catch (error) {
        res.redirect("/view-blog");
    }
};

const updateBlog = async (req, res) => {
    try {
        const { title, desc, authername } = req.body;
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.redirect("/view-blog");
        }

        if (!title || !desc || !authername) {
            return res.render("blog/editBlog", { blog, error: "Title, description and author name are required" });
        }

        if (req.file) {
            removeImage(blog.image);
            blog.image = req.file.filename;
        }

        blog.title = title.trim();
        blog.desc = desc.trim();
        blog.authername = authername.trim();
        await blog.save();

        res.redirect(`/blog/${blog._id}`);
    } catch (error) {
        if (req.file) {
            removeImage(req.file.filename);
        }
        res.redirect("/view-blog");
    }
};

module.exports = {
    addBlogPage,
    addBlog,
    editBlogPage,
    updateBlog
};
