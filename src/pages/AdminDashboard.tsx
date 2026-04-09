import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosConfig";
import { 
  Plus, 
  Trash2, 
  Edit, 
  LogOut, 
  LayoutDashboard, 
  Code, 
  Briefcase, 
  FolderKanban, 
  GraduationCap,
  Wrench
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, s, ex, p, ed] = await Promise.all([
        axiosInstance.get("/api/site-settings"),
        axiosInstance.get("/api/skills"),
        axiosInstance.get("/api/experience"),
        axiosInstance.get("/api/projects"),
        axiosInstance.get("/api/education"),
      ]);
      setSiteSettings(settingsRes.data);
      setSkills(s.data);
      setExperience(ex.data);
      setProjects(p.data);
      setEducation(ed.data);
    } catch (error) {
      toast.error("Failed to fetch data");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const deleteItem = async (type: string, id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await axiosInstance.delete(`/api/${type}/${id}`);
      toast.success("Deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-blue-600" />
            <h1 className="text-xl font-bold">Admin Portal</h1>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate("/")}>View Site</Button>
            <Button variant="destructive" onClick={handleLogout}><LogOut className="mr-2 w-4 h-4" /> Logout</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full md:w-auto">
            <TabsTrigger value="settings"><LayoutDashboard className="mr-2 w-4 h-4" /> Site Settings</TabsTrigger>
            <TabsTrigger value="skills"><Code className="mr-2 w-4 h-4" /> Skills</TabsTrigger>
            <TabsTrigger value="experience"><Briefcase className="mr-2 w-4 h-4" /> Experience</TabsTrigger>
            <TabsTrigger value="projects"><FolderKanban className="mr-2 w-4 h-4" /> Projects</TabsTrigger>
            <TabsTrigger value="education"><GraduationCap className="mr-2 w-4 h-4" /> Education</TabsTrigger>
          </TabsList>

          <TabsContent value="skills">
            <SectionManager 
              title="Skills" 
              items={skills} 
              type="skills" 
              onUpdate={fetchData} 
              config={config}
              deleteItem={deleteItem}
              fields={[
                { name: "name", label: "Skill Name", type: "text" },
                { name: "category", label: "Category", type: "select", options: ["Programming", "Web", "Android", "Tools"] },
              ]}
            />
          </TabsContent>

          <TabsContent value="experience">
            <SectionManager 
              title="Experience" 
              items={experience} 
              type="experience" 
              onUpdate={fetchData} 
              config={config}
              deleteItem={deleteItem}
              fields={[
                { name: "title", label: "Job Title", type: "text" },
                { name: "company", label: "Company", type: "text" },
                { name: "period", label: "Period (e.g. 2022 - 2023)", type: "text" },
                { name: "description", label: "Description (one per line)", type: "textarea" },
              ]}
            />
          </TabsContent>

          <TabsContent value="projects">
            <SectionManager 
              title="Projects" 
              items={projects} 
              type="projects" 
              onUpdate={fetchData} 
              config={config}
              deleteItem={deleteItem}
              fields={[
                { name: "title", label: "Project Title", type: "text" },
                { name: "description", label: "Description", type: "textarea" },
                { name: "tech", label: "Tech Stack (comma separated)", type: "text" },
                { name: "github", label: "GitHub Link", type: "text" },
                { name: "demo", label: "Demo Link", type: "text" },
                { name: "image", label: "Image URL", type: "text" },
              ]}
            />
          </TabsContent>

          <TabsContent value="settings">
            <SiteSettingsForm settings={siteSettings} onUpdate={fetchData} config={config} />
          </TabsContent>

          <TabsContent value="education">
            <SectionManager 
              title="Education" 
              items={education} 
              type="education" 
              onUpdate={fetchData} 
              config={config}
              deleteItem={deleteItem}
              fields={[
                { name: "degree", label: "Degree", type: "text" },
                { name: "institution", label: "Institution", type: "text" },
                { name: "period", label: "Period", type: "text" },
                { name: "description", label: "Description (one per line)", type: "textarea" },
              ]}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function SectionManager({ title, items, type, onUpdate, config, fields, deleteItem }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const handleOpen = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      const initialData = { ...item };
      if (type === "experience" || type === "education") {
        initialData.description = item.description.join("\n");
      }
      if (type === "projects") {
        initialData.tech = item.tech.join(", ");
      }
      setFormData(initialData);
    } else {
      setEditingItem(null);
      setFormData({});
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...formData };
    
    if (type === "experience" || type === "education") {
      data.description = formData.description?.split("\n").filter((l: string) => l.trim() !== "") || [];
    }
    if (type === "projects") {
      data.tech = formData.tech?.split(",").map((s: string) => s.trim()).filter((s: string) => s !== "") || [];
    }

    try {
      if (editingItem) {
        await axiosInstance.put(`/api/${type}/${editingItem._id}`, data);
        toast.success("Updated successfully");
      } else {
        await axiosInstance.post(`/api/${type}`, data);
        toast.success("Added successfully");
      }
      setIsOpen(false);
      onUpdate();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Button onClick={() => handleOpen()}><Plus className="mr-2 w-4 h-4" /> Add New</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name/Title</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item: any) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium">{item.name || item.title || item.degree}</TableCell>
                <TableCell>{item.category || item.company || item.institution || item.description?.substring(0, 50)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleOpen(item)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteItem(type, item._id)}><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-slate-400 py-8">No items found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit" : "Add"} {title}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              {fields.map((field: any) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  {field.type === "textarea" ? (
                    <Textarea 
                      id={field.name} 
                      value={formData[field.name] || ""} 
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    />
                  ) : field.type === "select" ? (
                    <select 
                      id={field.name}
                      className="w-full p-2 border rounded-md dark:bg-slate-900"
                      value={formData[field.name] || ""}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      {field.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <Input 
                      id={field.name} 
                      type={field.type} 
                      value={formData[field.name] || ""} 
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    />
                  )}
                </div>
              ))}
              <DialogFooter>
                <Button type="submit">{editingItem ? "Update" : "Create"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function SiteSettingsForm({ settings, onUpdate, config }: any) {
  const [formData, setFormData] = useState<any>({
    heroName: settings?.heroName || "",
    heroTitle: settings?.heroTitle || "",
    heroDescription: settings?.heroDescription || "",
    aboutText: settings?.aboutText || "",
    email: settings?.email || "",
    location: settings?.location || "",
    languages: settings?.languages?.join(", ") || "",
    photoUrl: settings?.photoUrl || "",
    resumeUrl: settings?.resumeUrl || "",
    github: settings?.github || "",
    linkedin: settings?.linkedin || "",
    contactEmail: settings?.contactEmail || "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  React.useEffect(() => {
    setFormData({
      heroName: settings?.heroName || "",
      heroTitle: settings?.heroTitle || "",
      heroDescription: settings?.heroDescription || "",
      aboutText: settings?.aboutText || "",
      email: settings?.email || "",
      location: settings?.location || "",
      languages: settings?.languages?.join(", ") || "",
      photoUrl: settings?.photoUrl || "",
      resumeUrl: settings?.resumeUrl || "",
      github: settings?.github || "",
      linkedin: settings?.linkedin || "",
      contactEmail: settings?.contactEmail || "",
    });
  }, [settings]);

  const handleUploadResume = async () => {
    if (!resumeFile) return;
    setUploading(true);
    setUploadMessage("");

    try {
      const fileData = new FormData();
      fileData.append("resume", resumeFile);
      const res = await axiosInstance.post("/api/upload-resume", fileData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFormData({ ...formData, resumeUrl: res.data.url });
      setUploadMessage("Resume uploaded successfully.");
      setResumeFile(null);
    } catch (error) {
      setUploadMessage("Upload failed. Please choose a PDF file.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings?._id) return;

    const payload = {
      ...formData,
      languages: formData.languages?.split(",").map((lang: string) => lang.trim()).filter((lang: string) => lang),
    };

    try {
      await axiosInstance.put(`/api/site-settings/${settings._id}`, payload);
      toast.success("Site settings updated");
      onUpdate();
    } catch (error) {
      toast.error("Save failed");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="heroName">Hero Name</Label>
              <Input id="heroName" value={formData.heroName} onChange={(e) => setFormData({ ...formData, heroName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroTitle">Hero Title</Label>
              <Input id="heroTitle" value={formData.heroTitle} onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroDescription">Hero Description</Label>
            <Textarea id="heroDescription" value={formData.heroDescription} onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aboutText">About Text</Label>
            <Textarea id="aboutText" value={formData.aboutText} onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })} />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="languages">Languages</Label>
              <Input id="languages" value={formData.languages} onChange={(e) => setFormData({ ...formData, languages: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photoUrl">Photo URL</Label>
              <Input id="photoUrl" value={formData.photoUrl} onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="resumeUrl">Resume URL</Label>
              <Input id="resumeUrl" value={formData.resumeUrl} onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resumeFile">Upload Resume (PDF)</Label>
              <Input
                id="resumeFile"
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setResumeFile(file);
                  setUploadMessage("");
                }}
              />
              {resumeFile && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">{resumeFile.name}</span>
                  <Button type="button" size="sm" className="text-sm" onClick={handleUploadResume} disabled={uploading}>
                    {uploading ? "Uploading..." : "Upload PDF"}
                  </Button>
                </div>
              )}
              {uploadMessage && <p className="text-sm text-slate-500">{uploadMessage}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input id="linkedin" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input id="contactEmail" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save Settings</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
