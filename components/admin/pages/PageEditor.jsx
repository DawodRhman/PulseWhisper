"use client";
import React, { useState, useEffect } from "react";
import { Save, X, Plus, ArrowUp, ArrowDown, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assuming these exist or I'll use standard HTML
import { Label } from "@/components/ui/label"; // Assuming these exist
import { Textarea } from "@/components/ui/textarea"; // Assuming these exist
import { Switch } from "@/components/ui/switch"; // Assuming these exist
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MediaPicker from "@/components/admin/media/MediaPicker";

const SECTION_TYPES = [
  { value: "HERO", label: "Hero Section" },
  { value: "TEXT_BLOCK", label: "Text Block" },
  { value: "CARD_GRID", label: "Card Grid" },
  { value: "FAQ", label: "FAQ Section" },
  { value: "LEADERSHIP", label: "Leadership Team" },
  { value: "SERVICES", label: "Services Section" },
  { value: "PROJECTS", label: "Projects Section" },
  { value: "MEDIA_GALLERY", label: "Media Gallery" },
  { value: "SUBSCRIBE", label: "Subscribe Section" },
  { value: "ACHIEVEMENTS", label: "Achievements" },
  { value: "WORKWITHUS", label: "WorkWithUs" },
  { value: "DYNAMIC_CONTENT", label: "Dynamic Code & Data" },
];

const KNOWN_APIS = [
  { value: "/api/news", label: "News Updates" },
  { value: "/api/services", label: "Services" },
  { value: "/api/projects", label: "Projects" },
  { value: "/api/leadership", label: "Leadership" },
  { value: "/api/tenders", label: "Tenders" },
  { value: "/api/careers", label: "Careers" },
  { value: "/api/watertoday", label: "Water Today" },
];

export default function PageEditor({ page, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    isPublished: false,
    showInNavbar: false,
    navLabel: "",
    navGroup: "",
    seo: { title: "", description: "" },
    sections: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (page) {
      setFormData({
        id: page.id,
        title: page.title,
        slug: page.slug,
        isPublished: page.isPublished,
        showInNavbar: page.showInNavbar || false,
        navLabel: page.navLabel || "",
        navGroup: page.navGroup || "",
        seo: page.seo || { title: "", description: "" },
        sections: page.sections || [],
      });
    }
  }, [page]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("seo.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({ ...prev, seo: { ...prev.seo, [field]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSection = (type) => {
    const newSection = {
      type,
      order: formData.sections.length,
      content: getDefaultContent(type),
    };
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const handleRemoveSection = (index) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  const handleMoveSection = (index, direction) => {
    const newSections = [...formData.sections];
    if (direction === "up" && index > 0) {
      [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
    } else if (direction === "down" && index < newSections.length - 1) {
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    }
    // Update order property
    newSections.forEach((s, i) => s.order = i);
    setFormData(prev => ({ ...prev, sections: newSections }));
  };

  const handleSectionContentChange = (index, field, value) => {
    const newSections = [...formData.sections];
    newSections[index] = {
      ...newSections[index],
      content: {
        ...newSections[index].content,
        [field]: value,
      },
    };
    setFormData(prev => ({ ...prev, sections: newSections }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = page ? "PATCH" : "POST";
      const res = await fetch("/api/papa/pages", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Failed to save page");
        return;
      }
      
      onSave();
    } catch (error) {
      console.error("Error saving page:", error);
      alert("An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-center sticky top-0 bg-background z-10 py-4 border-b">
        <h2 className="text-2xl font-bold">{page ? "Edit Page" : "Create Page"}</h2>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Page"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Page Title</Label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input 
                id="slug" 
                name="slug" 
                value={formData.slug} 
                onChange={handleChange} 
                placeholder="e.g., about-us" 
              />
              <p className="text-xs text-muted-foreground mt-1">Leave blank to auto-generate from title.</p>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="isPublished" 
                name="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                className="h-4 w-4"
              />
              <Label htmlFor="isPublished">Published</Label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="showInNavbar" 
                name="showInNavbar"
                checked={formData.showInNavbar}
                onChange={(e) => setFormData(prev => ({ ...prev, showInNavbar: e.target.checked }))}
                className="h-4 w-4"
              />
              <Label htmlFor="showInNavbar">Show in Navbar</Label>
            </div>
            {formData.showInNavbar && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="navLabel">Navbar Label</Label>
                  <Input 
                    id="navLabel" 
                    name="navLabel" 
                    value={formData.navLabel} 
                    onChange={handleChange} 
                    placeholder="Defaults to page title" 
                  />
                </div>
                <div>
                  <Label htmlFor="navGroup">Navbar Group</Label>
                  <Input 
                    id="navGroup" 
                    name="navGroup" 
                    value={formData.navGroup} 
                    onChange={handleChange} 
                    placeholder="e.g., whatwedo, aboutus, or a new group name"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    To nest under an existing menu, use its slug (whatwedo, aboutus, tenders, education, contact, etc.).
                    Enter a new label to create a new menu group with this page inside.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="seo.title">Meta Title</Label>
              <Input 
                id="seo.title" 
                name="seo.title" 
                value={formData.seo.title} 
                onChange={handleChange} 
              />
            </div>
            <div>
              <Label htmlFor="seo.description">Meta Description</Label>
              <Textarea 
                id="seo.description" 
                name="seo.description" 
                value={formData.seo.description} 
                onChange={handleChange} 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Content Sections</h3>
          <div className="flex gap-2">
            {SECTION_TYPES.map(type => (
              <Button 
                key={type.value} 
                type="button" 
                size="sm" 
                variant="secondary"
                onClick={() => handleAddSection(type.value)}
              >
                <Plus className="w-3 h-3 mr-1" /> {type.label}
              </Button>
            ))}
          </div>
        </div>

        {formData.sections.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
            No sections added. Click a button above to add content.
          </div>
        )}

        {formData.sections.map((section, index) => {
          const sectionAnchorId = `section-${index + 1}-${(section.type || "section").toLowerCase()}`;
          return (
            <Card key={index} id={sectionAnchorId} className="relative group">
              <div className="absolute right-4 top-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button type="button" size="icon" variant="ghost" onClick={() => handleMoveSection(index, "up")} disabled={index === 0}>
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button type="button" size="icon" variant="ghost" onClick={() => handleMoveSection(index, "down")} disabled={index === formData.sections.length - 1}>
                  <ArrowDown className="w-4 h-4" />
                </Button>
                <Button type="button" size="icon" variant="destructive" onClick={() => handleRemoveSection(index)}>
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
              
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">
                  {SECTION_TYPES.find(t => t.value === section.type)?.label || section.type}{" "}
                  <span className="text-xs lowercase text-muted-foreground">#{sectionAnchorId}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SectionForm 
                  type={section.type} 
                  content={section.content} 
                  idPrefix={sectionAnchorId}
                  onChange={(field, value) => handleSectionContentChange(index, field, value)} 
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </form>
  );
}

function getDefaultContent(type) {
  switch (type) {
    case "HERO":
      return {
        title: "Hero Title",
        subtitle: "Hero Subtitle",
        backgroundImage: "",
        backgroundMediaId: "",
        backgroundMeta: null,
      };
    case "TEXT_BLOCK":
      return {
        heading: "Section Heading",
        body: "<p>Enter your text here...</p>",
      };
    case "CARD_GRID":
      return { heading: "Grid Heading", description: "Description", cards: [] };
    case "FAQ":
    case "LEADERSHIP":
    case "SERVICES":
    case "PROJECTS":
    case "MEDIA_GALLERY":
    case "SUBSCRIBE":
      return {}; // These components manage their own data or don't need config yet
    case "WORKWITHUS":
      return {}; // These components manage their own data or don't need config yet
    default:
      return {};
  }
}

function SectionForm({ type, content, onChange, idPrefix }) {
  const fieldId = (suffix) => (idPrefix ? `${idPrefix}-${suffix}` : suffix);

  switch (type) {
    case "HERO":
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor={fieldId("title")}>Title</Label>
            <Input
              id={fieldId("title")}
              value={content.title || ""}
              onChange={(e) => onChange("title", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor={fieldId("subtitle")}>Subtitle</Label>
            <Input
              id={fieldId("subtitle")}
              value={content.subtitle || ""}
              onChange={(e) => onChange("subtitle", e.target.value)}
            />
          </div>
          <div className="col-span-2 space-y-2">
            <MediaPicker
              label="Hero Background (image, GIF, or MP4)"
              value={content.backgroundMediaId || ""}
              category="page-hero"
              accept="image/*,video/mp4"
              onChange={(assetId, asset) => {
                onChange("backgroundMediaId", assetId || "");
                onChange("backgroundMeta", asset || null);
                onChange("backgroundImage", asset?.url || "");
              }}
            />
            <p className="text-xs text-muted-foreground">
              Upload or pick an image/GIF/MP4 to use behind the hero content.
            </p>
          </div>
          <div className="col-span-2">
            <Label htmlFor={fieldId("backgroundImage")}>
              Background Media URL
            </Label>
            <Input
              id={fieldId("backgroundImage")}
              value={content.backgroundImage || ""}
              onChange={(e) => onChange("backgroundImage", e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Optional override if you prefer to paste a direct URL.
            </p>
          </div>
        </div>
      );
    case "TEXT_BLOCK":
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor={fieldId("heading")}>Heading</Label>
            <Input
              id={fieldId("heading")}
              value={content.heading || ""}
              onChange={(e) => onChange("heading", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor={fieldId("body")}>Body (HTML supported)</Label>
            <Textarea
              id={fieldId("body")}
              value={content.body || ""}
              onChange={(e) => onChange("body", e.target.value)}
              className="min-h-[150px] font-mono text-sm"
            />
          </div>
        </div>
      );
    case "CARD_GRID":
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor={fieldId("heading")}>Heading</Label>
            <Input
              id={fieldId("heading")}
              value={content.heading || ""}
              onChange={(e) => onChange("heading", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor={fieldId("description")}>Description</Label>
            <Input
              id={fieldId("description")}
              value={content.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
            />
          </div>
          <div className="p-4 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground mb-2">
              Cards (JSON format for now)
            </p>
            <Textarea
              id={fieldId("cards")}
              value={JSON.stringify(content.cards || [], null, 2)}
              onChange={(e) => {
                try {
                  onChange("cards", JSON.parse(e.target.value));
                } catch (err) {
                  // Allow typing invalid JSON temporarily
                }
              }}
              className="font-mono text-xs min-h-[200px]"
            />
          </div>
        </div>
      );
    case "FAQ":
    case "LEADERSHIP":
    case "SERVICES":
    case "PROJECTS":
    case "MEDIA_GALLERY":
    case "SUBSCRIBE":
    case "ACHIEVEMENTS":
      return (
        <div className="p-4 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
          <p className="text-sm">
            This section is <strong>dynamic</strong>. It will automatically
            display the latest {type.toLowerCase().replace("_", " ")} from the
            database.
            <br />
            No configuration is needed here.
          </p>
        </div>
      );
    case "WORKWITHUS":
      return (
        <div className="p-4 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
          <p className="text-sm">
            This section is <strong>dynamic</strong>. It will automatically
            display the latest {type.toLowerCase().replace("_", " ")} from the
            database.
            <br />
            No configuration is needed here.
          </p>
        </div>
      );
    case "DYNAMIC_CONTENT":
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor={fieldId("apiEndpoint")}>Data Source (API)</Label>
            <div className="flex gap-2">
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={content.apiEndpoint || ""}
                onChange={(e) => onChange("apiEndpoint", e.target.value)}
              >
                <option value="">Select an API...</option>
                {KNOWN_APIS.map((api) => (
                  <option key={api.value} value={api.value}>
                    {api.label} ({api.value})
                  </option>
                ))}
                <option value="custom">Custom URL...</option>
              </select>
            </div>
            {(!KNOWN_APIS.find(a => a.value === content.apiEndpoint) && content.apiEndpoint) && (
               <Input
                 className="mt-2"
                 placeholder="Enter custom API URL (e.g., /api/my-custom-route)"
                 value={content.apiEndpoint || ""}
                 onChange={(e) => onChange("apiEndpoint", e.target.value)}
               />
            )}
          </div>

          <div>
            <Label htmlFor={fieldId("template")}>Item Template (HTML)</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Use <code>{"{{fieldName}}"}</code> to insert data. Example: <code>{"<h3>{{title}}</h3>"}</code>.
              This HTML will be repeated for every item in the API response.
            </p>
            <Textarea
              id={fieldId("template")}
              value={content.template || ""}
              onChange={(e) => onChange("template", e.target.value)}
              className="font-mono text-sm min-h-[150px]"
              placeholder='<div class="card">
  <h3>{{title}}</h3>
  <p>{{summary}}</p>
</div>'
            />
          </div>

          <div>
            <Label htmlFor={fieldId("containerClass")}>Container CSS Classes</Label>
            <Input
              id={fieldId("containerClass")}
              value={content.containerClass || ""}
              onChange={(e) => onChange("containerClass", e.target.value)}
              placeholder="grid grid-cols-1 md:grid-cols-3 gap-6"
            />
          </div>
          
          <div>
            <Label htmlFor={fieldId("itemClass")}>Item Wrapper CSS Classes</Label>
            <Input
              id={fieldId("itemClass")}
              value={content.itemClass || ""}
              onChange={(e) => onChange("itemClass", e.target.value)}
              placeholder="bg-white p-4 rounded shadow"
            />
          </div>
        </div>
      );
    default:
      return (
        <p className="text-sm text-muted-foreground">
          No configuration available for this section type.
        </p>
      );
  }
}
