"use client";
import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function NavigationPanel() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/papa/pages");
      const json = await res.json();
      if (json.data) {
        // Sort by title or maybe by some order?
        setPages(json.data.sort((a, b) => a.title.localeCompare(b.title)));
      }
    } catch (error) {
      console.error("Failed to fetch pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleNavbar = async (pageId, currentValue) => {
    // Optimistic update
    setPages(prev => prev.map(p => p.id === pageId ? { ...p, showInNavbar: !currentValue } : p));

    try {
      await fetch("/api/papa/pages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: pageId, showInNavbar: !currentValue }),
      });
    } catch (error) {
      console.error("Failed to update page:", error);
      // Revert on error
      setPages(prev => prev.map(p => p.id === pageId ? { ...p, showInNavbar: currentValue } : p));
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin w-8 h-8" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Navigation Manager</h2>
        <p className="text-muted-foreground">Control which pages appear in the main navigation bar.</p>
      </div>
      
      <div className="grid gap-4">
        {pages.map(page => (
          <Card key={page.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  {page.title}
                  <Link href={`/${page.slug}`} target="_blank" className="text-muted-foreground hover:text-blue-600">
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </h3>
                <p className="text-sm text-muted-foreground">/{page.slug}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${page.showInNavbar ? "text-green-600" : "text-gray-500"}`}>
                  {page.showInNavbar ? "Visible in Menu" : "Hidden"}
                </span>
                <Switch 
                  checked={page.showInNavbar || false} 
                  onCheckedChange={() => toggleNavbar(page.id, page.showInNavbar)} 
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
