import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Setup upload directory
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use("/uploads", express.static(uploadDir));

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, cb) => {
    const filename = `resume-${Date.now()}.pdf`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio";
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "password123", 10);
      await Admin.create({
        username: process.env.ADMIN_USERNAME || "admin",
        password: hashedPassword
      });
      console.log("Admin user seeded");
    }

    const settingsCount = await SiteSetting.countDocuments();
    if (settingsCount === 0) {
      await SiteSetting.create({
        heroName: "Vivek Hirani",
        heroTitle: "Software & Android Developer",
        heroDescription: "Welcome to my creative portfolio! I build modern web and mobile experiences with passion and precision.",
        aboutText: "I am a passionate developer from Rajkot, India, who loves coding, building projects, and learning new technologies. I enjoy collaborating, mentoring, and exploring new opportunities. Available for freelance and developer roles.",
        email: "vivekhirani3636@gmail.com",
        location: "Rajkot, Gujarat, India",
        languages: ["Gujarati", "Hindi", "English"],
        photoUrl: "https://picsum.photos/seed/vivek/400/400",
        resumeUrl: "/resume.pdf",
        github: "https://github.com/VivekHirani36",
        linkedin: "https://www.linkedin.com/in/vivekhirani36",
        contactEmail: "vivekhirani3636@gmail.com",
      });
      console.log("Site settings seeded");
    }
  })
  .catch(err => console.error("MongoDB connection error:", err));

// Schemas
const SkillSchema = new mongoose.Schema({
  name: String,
  category: String,
  icon: String,
});

const ExperienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  period: String,
  description: [String],
});

const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  tech: [String],
  github: String,
  demo: String,
  image: String,
});

const EducationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  period: String,
  description: [String],
});

const SiteSettingSchema = new mongoose.Schema({
  heroName: String,
  heroTitle: String,
  heroDescription: String,
  aboutText: String,
  email: String,
  location: String,
  languages: [String],
  photoUrl: String,
  resumeUrl: String,
  github: String,
  linkedin: String,
  contactEmail: String,
});

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Skill = mongoose.model("Skill", SkillSchema);
const Experience = mongoose.model("Experience", ExperienceSchema);
const Project = mongoose.model("Project", ProjectSchema);
const Education = mongoose.model("Education", EducationSchema);
const SiteSetting = mongoose.model("SiteSetting", SiteSettingSchema);
const Admin = mongoose.model("Admin", AdminSchema);

// Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || "secret", (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth Routes
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(400).json({ message: "Invalid credentials" });

  const validPassword = await bcrypt.compare(password, admin.password);
  if (!validPassword) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });
  res.json({ token });
});

app.post("/api/upload-resume", authenticateToken, upload.single("resume"), (req: any, res: any) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ url: `/uploads/${req.file.filename}` });
});

// Skills
app.get("/api/skills", async (req, res) => {
  const skills = await Skill.find();
  res.json(skills);
});

app.post("/api/skills", authenticateToken, async (req, res) => {
  const skill = new Skill(req.body);
  await skill.save();
  res.json(skill);
});

app.put("/api/skills/:id", authenticateToken, async (req, res) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(skill);
});

app.delete("/api/skills/:id", authenticateToken, async (req, res) => {
  await Skill.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// Experience
app.get("/api/experience", async (req, res) => {
  const exp = await Experience.find();
  res.json(exp);
});

app.post("/api/experience", authenticateToken, async (req, res) => {
  const exp = new Experience(req.body);
  await exp.save();
  res.json(exp);
});

app.put("/api/experience/:id", authenticateToken, async (req, res) => {
  const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(exp);
});

app.delete("/api/experience/:id", authenticateToken, async (req, res) => {
  await Experience.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// Projects
app.get("/api/projects", async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

app.post("/api/projects", authenticateToken, async (req, res) => {
  const project = new Project(req.body);
  await project.save();
  res.json(project);
});

app.put("/api/projects/:id", authenticateToken, async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(project);
});

app.delete("/api/projects/:id", authenticateToken, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// Education
app.get("/api/education", async (req, res) => {
  const edu = await Education.find();
  res.json(edu);
});

app.post("/api/education", authenticateToken, async (req, res) => {
  const edu = new Education(req.body);
  await edu.save();
  res.json(edu);
});

app.put("/api/education/:id", authenticateToken, async (req, res) => {
  const edu = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(edu);
});

app.delete("/api/education/:id", authenticateToken, async (req, res) => {
  await Education.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// Site Settings
app.get("/api/site-settings", async (req, res) => {
  const settings = await SiteSetting.findOne();
  res.json(settings || {});
});

app.put("/api/site-settings/:id", authenticateToken, async (req, res) => {
  const updated = await SiteSetting.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Serve static files from dist
const distPath = path.join(__dirname, "../dist");
app.use(express.static(distPath));

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

export default app;
