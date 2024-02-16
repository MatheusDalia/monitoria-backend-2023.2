import { Router } from "express";
import { prisma } from "../prisma.js";
import multer from "multer";
import path from "path";
import { authMiddleware } from "../middleware/authMiddleware.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

export const userRouter = Router();

userRouter.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
});
// Route for creating a new post with image upload
userRouter.post("/posts", upload.single("image"), async (req, res) => {
  const { description, authorId } = req.body;
  const imagePath = req.file.path;

  const newPost = await prisma.post.create({
    data: {
      description,
      imageUrl: imagePath, // Change image to imageUrl
      authorId, // Associate the post with the correct user
    },
  });

  res.send(newPost);
});

// Route for reading all posts
userRouter.get("/posts", async (req, res) => {
  const posts = await prisma.post.findMany();
  res.send(posts);
});

// Route for reading a single post by ID
userRouter.get("/posts/:id", async (req, res) => {
  const postId = parseInt(req.params.id);
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  res.send(post);
});

userRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  res.send(user);
});

userRouter.post("", async (req, res) => {
  const user = await req.body;

  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      name: user.name,
      password: user.password,
    },
  });

  res.send(newUser);
});
