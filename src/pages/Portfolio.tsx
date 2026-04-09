import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Github, 
  Linkedin, 
  Mail, 
  Download, 
  Moon, 
  Sun, 
  Code, 
  Globe, 
  Smartphone, 
  Wrench, 
  Briefcase, 
  GraduationCap, 
  ExternalLink,
  ChevronDown,
  ArrowUp,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

interface Skill {
  _id: string;
  name: string;
  category: string;
  icon: string;
}

interface Experience {
  _id: string;
  title: string;
  company: string;
  period: string;
  description: string[];
}

interface Project {
  _id: string;
  title: string;
  description: string;
  tech: string[];
  github: string;
  demo: string;
  image: string;
}

interface Education {
  _id: string;
  degree: string;
  institution: string;
  period: string;
  description: string[];
}

interface SiteSettings {
  heroName: string;
  heroTitle: string;
  heroDescription: string;
  aboutText: string;
  email: string;
  location: string;
  languages: string[];
  photoUrl: string;
  resumeUrl: string;
  github: string;
  linkedin: string;
  contactEmail: string;
}

export default function Portfolio() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, skillsRes, expRes, projRes, eduRes] = await Promise.all([
          axios.get("/api/site-settings"),
          axios.get("/api/skills"),
          axios.get("/api/experience"),
          axios.get("/api/projects"),
          axios.get("/api/education"),
        ]);
        setSettings(settingsRes.data);
        setSkills(skillsRes.data);
        setExperience(expRes.data);
        setProjects(projRes.data);
        setEducation(eduRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();

    // Dark mode check
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className={`min-h-screen ${isDark ? "dark" : ""}`}>
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800">
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">Vivek</div>
          
          {/* Desktop Nav */}
          <ul className="hidden md:flex gap-8 font-medium">
            {["home", "about", "skills", "experience", "projects", "education", "contact"].map((item) => (
              <li key={item}>
                <button 
                  onClick={() => scrollToSection(item)}
                  className="capitalize hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white dark:bg-slate-900 border-b dark:border-slate-800 p-4"
          >
            <ul className="flex flex-col gap-4">
              {["home", "about", "skills", "experience", "projects", "education", "contact"].map((item) => (
                <li key={item}>
                  <button 
                    onClick={() => scrollToSection(item)}
                    className="capitalize w-full text-left py-2 hover:bg-slate-100 dark:hover:bg-slate-800 px-2 rounded"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="hero-creative-bg min-h-[80vh] flex items-center justify-center text-white px-4 relative overflow-hidden">
        <div className="max-w-4xl text-center z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-4"
          >
            Hi, I'm <span className="text-blue-300">{settings?.heroName || "Vivek Hirani"}</span>
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl font-medium mb-6 opacity-90"
          >
            {settings?.heroTitle || "Software & Android Developer"}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg mb-8 max-w-2xl mx-auto opacity-80"
          >
            {settings?.heroDescription || "Welcome to my creative portfolio! I build modern web and mobile experiences with passion and precision."}
          </motion.p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              asChild
              className={isDark ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white text-blue-600 hover:bg-blue-50"}
            >
              <a href={settings?.resumeUrl || "/resume.pdf"} target="_blank" rel="noreferrer" download>
                <Download className="mr-2 w-5 h-5" /> Download CV
              </a>
            </Button>
            <div className="flex gap-4 items-center">
              <a href={settings?.github || "https://github.com/VivekHirani36"} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform"><Github className="w-8 h-8" /></a>
              <a href={settings?.linkedin || "https://www.linkedin.com/in/vivekhirani36"} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform"><Linkedin className="w-8 h-8" /></a>
              <a href={`mailto:${settings?.contactEmail || "vivekhirani3636@gmail.com"}`} className="hover:scale-110 transition-transform"><Mail className="w-8 h-8" /></a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 animate-bounce">
          <ChevronDown className="w-8 h-8 opacity-50" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-blue-400 shadow-xl flex-shrink-0">
              <img 
                src={settings?.photoUrl || "https://picsum.photos/seed/vivek/400/400"} 
                alt={settings?.heroName || "Vivek Hirani"} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <Briefcase className="text-blue-500" /> About Me
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                {settings?.aboutText || "I am a passionate developer from Rajkot, India, who loves coding, building projects, and learning new technologies. I enjoy collaborating, mentoring, and exploring new opportunities. Available for freelance and developer roles."}
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Mail className="text-blue-500 w-5 h-5" /> <strong>Email:</strong> {settings?.email || "vivekhirani3636@gmail.com"}
                </li>
                <li className="flex items-center gap-3">
                  <Globe className="text-blue-500 w-5 h-5" /> <strong>Location:</strong> {settings?.location || "Rajkot, Gujarat, India"}
                </li>
                <li className="flex items-center gap-3">
                  <Wrench className="text-blue-500 w-5 h-5" /> <strong>Languages:</strong> {settings?.languages?.join(", ") || "Gujarati, Hindi, English"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-2">
            <Code className="text-blue-500" /> Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {["Programming", "Web", "Android", "Tools"].map((category) => (
              <div key={category} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border dark:border-slate-800">
                <h3 className="text-xl font-bold mb-6 text-blue-600 dark:text-blue-400 border-b pb-2 flex items-center gap-2">
                  {category === "Programming" && <Code className="w-5 h-5" />}
                  {category === "Web" && <Globe className="w-5 h-5" />}
                  {category === "Android" && <Smartphone className="w-5 h-5" />}
                  {category === "Tools" && <Wrench className="w-5 h-5" />}
                  {category}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {skills.filter(s => s.category === category).map(skill => (
                    <div key={skill._id} className="skill-chip">
                      {skill.name}
                    </div>
                  ))}
                  {skills.filter(s => s.category === category).length === 0 && (
                    <p className="text-sm text-slate-400 italic">No skills added yet.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Experience</h2>
          <div className="timeline">
            {experience.map((exp) => (
              <div key={exp._id} className="timeline-item">
                <div className="timeline-icon"><Briefcase className="w-4 h-4" /></div>
                <div className="timeline-content">
                  <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">{exp.title} – {exp.company}</h3>
                  <span className="text-sm text-blue-400 block mb-4">{exp.period}</span>
                  <ul className="list-disc ml-4 space-y-2 text-slate-600 dark:text-slate-400">
                    {exp.description.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            {experience.length === 0 && (
              <p className="text-center text-slate-400 italic">No experience added yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project._id} className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-md group hover:-translate-y-2 transition-all duration-300 border dark:border-slate-800">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={project.image || `https://picsum.photos/seed/${project.title}/600/400`} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((t, i) => (
                      <span key={i} className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.github} target="_blank"><Github className="w-4 h-4 mr-2" /> GitHub</a>
                    </Button>
                    <Button size="sm" asChild>
                      <a href={project.demo} target="_blank"><ExternalLink className="w-4 h-4 mr-2" /> Demo</a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <p className="col-span-full text-center text-slate-400 italic">No projects added yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-2">
            <GraduationCap className="text-blue-500" /> Education
          </h2>
          <div className="timeline">
            {education.map((edu) => (
              <div key={edu._id} className="timeline-item">
                <div className="timeline-icon"><GraduationCap className="w-4 h-4" /></div>
                <div className="timeline-content">
                  <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">{edu.degree}</h3>
                  <p className="font-medium mb-1">{edu.institution}</p>
                  <span className="text-sm text-blue-400 block mb-4">{edu.period}</span>
                  <ul className="list-disc ml-4 space-y-2 text-slate-600 dark:text-slate-400">
                    {edu.description.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            {education.length === 0 && (
              <p className="text-center text-slate-400 italic">No education details added yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
          <p className="text-slate-400 mb-12 max-w-xl mx-auto">
            I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>
          <div className="flex justify-center gap-8 mb-12">
            <a href="https://github.com/VivekHirani36" target="_blank" className="hover:text-blue-400 transition-colors"><Github className="w-10 h-10" /></a>
            <a href="https://www.linkedin.com/in/vivekhirani36" target="_blank" className="hover:text-blue-400 transition-colors"><Linkedin className="w-10 h-10" /></a>
            <a href="mailto:vivekhirani3636@gmail.com" className="hover:text-blue-400 transition-colors"><Mail className="w-10 h-10" /></a>
          </div>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
            <a href="mailto:vivekhirani3636@gmail.com">Say Hello</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-slate-950 text-slate-500 text-center border-t border-slate-900">
        <p>&copy; {new Date().getFullYear()} Vivek Hirani. All rights reserved.</p>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mt-4 inline-flex items-center gap-2 hover:text-white transition-colors"
        >
          Back to Top <ArrowUp className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
}
