"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Globe, Search, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageEditor from "./PageEditor";

export default function PagesPanel() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // "list" | "editor"
  const [selectedPage, setSelectedPage] = useState(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/papa/pages");
      const json = await res.json();
      if (json.data) {
        setPages(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedPage(null);
    setView("editor");
  };

  const handleCreateHome = () => {
    setSelectedPage({
      title: "Home Page",
      slug: "home",
      isPublished: true,
      sections: [
        {
          type: "HERO",
          order: 0,
          content: {
            title: "Committed to Deliver",
            subtitle: "Ensuring clean, safe water supply and efficient sewerage services for Karachi.",
            ctaLabel: "Learn About KW&SC",
            ctaHref: "/aboutus",
            backgroundImage: "/karachicharminar.gif"
          }
        }
      ]
    });
    setView("editor");
  };

  const handleEdit = (page) => {
    setSelectedPage(page);
    setView("editor");
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this page?")) return;
    try {
      const res = await fetch("/api/papa/pages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchPages();
      }
    } catch (error) {
      console.error("Failed to delete page:", error);
    }
  };

  const handleSave = () => {
    setView("list");
    fetchPages();
  };

  const handleCancel = () => {
    setView("list");
    setSelectedPage(null);
  };

  if (view === "editor") {
    return (
      <PageEditor 
        page={selectedPage} 
        onSave={handleSave} 
        onCancel={handleCancel} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pages</h2>
          <p className="text-muted-foreground">
            Manage dynamic pages and their content sections.
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Create Page
        </Button>
      </div>

      {!loading && !pages.some(p => p.slug === "home") && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-900">Home Page Missing</h3>
            <p className="text-sm text-blue-700">The home page is currently using default hardcoded data. Create it to start editing.</p>
          </div>
          <Button onClick={handleCreateHome} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            Initialize Home Page
          </Button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p>Loading pages...</p>
        ) : pages.length === 0 ? (
          <div className="col-span-full text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
            No pages found. Create one to get started.
          </div>
        ) : (
          pages.map((page) => (
            <Card key={page.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {page.title}
                </CardTitle>
                {page.isPublished ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Published
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Draft
                  </span>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> /{page.slug}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(page)}>
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDelete(page.id)}
                    disabled={page.slug === "about-us"} // Protect critical pages if needed
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
