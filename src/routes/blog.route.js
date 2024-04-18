// Router Configuration
import { Router } from "express";
import multer from "multer";
import path from "path";
import { blogs } from "../models/blogs.model.js";
import { comments } from "../models/comments.model.js";
const router = Router();

// Multer Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

// Route for rendering the form
router.get('/add-new', (req, res) => {
    res.render('addBlog.ejs', {
        user: req.user
    });
});

// Route for handling form submission
router.post('/create', upload.single('coverImageURL'), async (req, res) => {
    const imageURL = req.file?.filename ? `/uploads/${req.file?.filename}`:'/uploads/Default.png';
    try {
        const { title, body } = req.body;
        const blog = await blogs.create({
            title: title,
            body: body,
            coverImageURL: imageURL,
            createdBy: req.user._id,
            authorName: req.user.fullName
        })

        return res.redirect(`/blog/${blog._id}`);   //return res.redirect('/blog/${req.user._id}');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating blog');
    }
});

router.get('/:id', async(req, res) => {
    const blog = await blogs.findById(req.params.id).populate('createdBy');
    if(!blog) return res.json("Invalid Blog")

    const comment = await comments.find({blogId: blog._id}).populate('createdBy');

    return res.render('Blog.ejs', {
        user: req.user,
        blog: blog,
        comment
    })
});


router.post('/add-comment/:blogid', async (req, res) => {
    try {
        // Find the blog by ID
        const blog = await blogs.findById(req.params.blogid);
        if (!blog) {
            return res.json("Invalid Blog");
        }

        // Create a new comment
        await comments.create({
            content: req.body.content,
            blogId: req.params.blogid,
            createdBy: req.user._id // Assuming req.user contains the user's ID
        });

        // Redirect back to the blog page
        return res.redirect(`/blog/${req.params.blogid}`);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error adding comment');
    }
});

router.get('/delete/:blogID', async(req, res) => {
    try {
        const deleteInstance = await blogs.findByIdAndDelete(req.params.blogID);
        if (!deleteInstance) {
            return res.json('Blog not found or Already deleted');
        }
        return res.redirect(`/user/${req.user._id}`);
    } catch (error) {
        console.error('Error deleting blog:', error);
        return res.status(500).json('Internal server error');
    }
});


export default router;
