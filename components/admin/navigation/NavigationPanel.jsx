"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, ExternalLink, Plus, RefreshCcw } from "lucide-react";

const BUCKET_TOP = "__top__";
const BUCKET_HIDDEN = "__hidden__";
const BASE_LINKS = [
  { id: "static-whatwedo", slug: "whatwedo", title: "What We Do", showInNavbar: true, navGroup: "", locked: true },
  { id: "static-ourservices", slug: "ourservices", title: "Our Services", showInNavbar: true, navGroup: "whatwedo", locked: true },
  { id: "static-portfolio", slug: "portfolio", title: "Our Projects", showInNavbar: true, navGroup: "whatwedo", locked: true },
  { id: "static-workwithus", slug: "workwithus", title: "Work With Us", showInNavbar: true, navGroup: "whatwedo", locked: true },
  { id: "static-news", slug: "news", title: "News & Updates", showInNavbar: true, navGroup: "whatwedo", locked: true },
  { id: "static-rti", slug: "right-to-information", title: "Right to Information", showInNavbar: true, navGroup: "whatwedo", locked: true },
  { id: "static-aboutus", slug: "aboutus", title: "About Us", showInNavbar: true, navGroup: "", locked: true },
  { id: "static-watertodaysection", slug: "watertodaysection", title: "Water Today", showInNavbar: true, navGroup: "aboutus", locked: true },
  { id: "static-achievements", slug: "achievements", title: "Achievements", showInNavbar: true, navGroup: "aboutus", locked: true },
  { id: "static-ourleadership", slug: "ourleadership", title: "Our Leadership", showInNavbar: true, navGroup: "aboutus", locked: true },
  { id: "static-careers", slug: "careers", title: "Careers", showInNavbar: true, navGroup: "aboutus", locked: true },
  { id: "static-faqs", slug: "faqs", title: "FAQs", showInNavbar: true, navGroup: "aboutus", locked: true },
  { id: "static-tenders", slug: "tenders", title: "Tenders", showInNavbar: true, navGroup: "", locked: true },
  { id: "static-education", slug: "education", title: "Education", showInNavbar: true, navGroup: "", locked: true },
  { id: "static-contact", slug: "contact", title: "Contact", showInNavbar: true, navGroup: "", locked: true },
];

export default function NavigationPanel() {
  const [pages, setPages] = useState([]);
  const [baseline, setBaseline] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(null);
  const [query, setQuery] = useState("");
  const [newGroup, setNewGroup] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const mergedPages = useMemo(() => {
    const dbMap = new Map(pages.map((p) => [p.slug, p]));
    const extras = BASE_LINKS.filter((link) => !dbMap.has(link.slug));
    return [...pages, ...extras];
  }, [pages]);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/papa/pages");
      const json = await res.json();
      if (json.data) {
        const sorted = json.data
          .slice()
          .sort((a, b) => (a.navGroup || "").localeCompare(b.navGroup || "") || a.title.localeCompare(b.title));
        setPages(sorted);
        setBaseline(
          Object.fromEntries(
            sorted.map((p) => [
              p.id,
              { showInNavbar: !!p.showInNavbar, navLabel: p.navLabel || "", navGroup: p.navGroup || "" },
            ])
          )
        );
      }
    } catch (error) {
      console.error("Failed to fetch pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const navGroups = useMemo(() => {
    const groups = new Set(
      mergedPages
        .filter((p) => p.showInNavbar && p.navGroup)
        .map((p) => p.navGroup)
        .filter(Boolean)
    );
    return Array.from(groups).sort((a, b) => a.localeCompare(b));
  }, [mergedPages]);

  const filteredPages = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mergedPages;
    return mergedPages.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.navGroup || "").toLowerCase().includes(q)
    );
  }, [mergedPages, query]);

  const pagesForBucket = (bucket) => {
    if (bucket === BUCKET_HIDDEN) return filteredPages.filter((p) => !p.showInNavbar);
    if (bucket === BUCKET_TOP) return filteredPages.filter((p) => p.showInNavbar && !p.navGroup);
    return filteredPages.filter((p) => p.showInNavbar && p.navGroup === bucket);
  };

  const markDirty = (page) => {
    const base = baseline[page.id];
    if (!base) return false;
    return (
      base.showInNavbar !== !!page.showInNavbar ||
      (base.navLabel || "") !== (page.navLabel || "") ||
      (base.navGroup || "") !== (page.navGroup || "")
    );
  };

  const handleDrop = (bucket) => {
    if (!dragging) return;
    const dragged = filteredPages.find((p) => p.id === dragging);
    if (dragged?.locked) return;
    setPages((prev) =>
      prev.map((p) =>
        p.id === dragging
          ? {
              ...p,
              showInNavbar: bucket !== BUCKET_HIDDEN,
              navGroup: bucket === BUCKET_TOP || bucket === BUCKET_HIDDEN ? "" : bucket,
            }
          : p
      )
    );
    setDragging(null);
  };

  const addGroup = () => {
    const value = newGroup.trim();
    if (!value) return;
    if (!navGroups.includes(value)) {
      setPages((prev) => prev.slice()); // force rerender
    }
    setNewGroup("");
  };

  const saveChanges = async () => {
    const dirty = pages.filter((p) => markDirty(p));
    if (!dirty.length) return;
    setSaving(true);
    try {
      for (const page of dirty) {
        if (page.locked) continue;
        await fetch("/api/papa/pages", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: page.id,
            showInNavbar: !!page.showInNavbar,
            navLabel: page.navLabel || undefined,
            navGroup: page.navGroup || undefined,
          }),
        });
      }
      await fetchPages();
    } catch (error) {
      console.error("Failed to save navigation", error);
    } finally {
      setSaving(false);
    }
  };

  const selectedPage = mergedPages.find((p) => p.id === selectedId);

  const updateSelected = (field, value) => {
    if (!selectedId) return;
    setPages((prev) =>
      prev.map((p) => (p.id === selectedId ? { ...p, [field]: value } : p))
    );
  };

  const buckets = [
    { key: BUCKET_TOP, title: "Top-level", hint: "Shows directly in navbar" },
    ...navGroups.map((g) => ({ key: g, title: g, hint: "Dropdown group" })),
    { key: BUCKET_HIDDEN, title: "Hidden", hint: "Keeps page out of navbar" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Navigation Builder</h2>
          <p className="text-muted-foreground">Drag pages into navbar buckets. Top-level = main menu, groups = dropdowns, hidden = removed.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-64"
          />
          <Button variant="ghost" size="icon" onClick={fetchPages} title="Reload pages">
            <RefreshCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">Navbar buckets</CardTitle>
            <p className="text-sm text-muted-foreground">Create a dropdown group, then drag pages into it.</p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add navbar group (e.g., aboutus)"
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              className="w-56"
            />
            <Button type="button" size="sm" onClick={addGroup} className="flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Group
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {buckets.map((bucket) => {
              const list = pagesForBucket(bucket.key);
              return (
                <div
                  key={bucket.key}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(bucket.key)}
                  className={`rounded-xl border border-dashed p-3 transition ${
                    dragging ? "border-blue-400 bg-blue-50/50" : "border-slate-200 bg-slate-50/60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm">{bucket.title}</p>
                      <p className="text-xs text-muted-foreground">{bucket.hint}</p>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{list.length} pages</span>
                  </div>
                  <div className="space-y-2 min-h-[80px]">
                    {list.length === 0 && (
                      <p className="text-xs text-muted-foreground italic">Drop pages here</p>
                    )}
                    {list.map((page) => (
                      <button
                        key={page.id}
                        draggable={!page.locked}
                        onDragStart={() => !page.locked && setDragging(page.id)}
                        onDragEnd={() => setDragging(null)}
                        onClick={() => setSelectedId(page.id)}
                        className={`w-full text-left rounded-lg border px-3 py-2 bg-white shadow-sm transition hover:-translate-y-0.5 ${
                          selectedId === page.id ? "border-blue-400 ring-1 ring-blue-200" : "border-slate-200"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{page.navLabel || page.title}</span>
                            {page.locked && (
                              <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 rounded-full px-2 py-0.5">
                                core
                              </span>
                            )}
                            <Link
                              href={`/${page.slug}`}
                              target="_blank"
                              onClick={(e) => e.stopPropagation()}
                              className="text-slate-400 hover:text-blue-600"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </div>
                          {markDirty(page) && (
                            <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 rounded-full px-2 py-0.5">
                              Unsaved
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">/{page.slug}</p>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Page details</CardTitle>
          <p className="text-sm text-muted-foreground">Select a page chip to adjust its nav label.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedPage ? (
            <>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <Label>Page</Label>
                  <p className="text-sm font-semibold">{selectedPage.title}</p>
                  <p className="text-xs text-muted-foreground">/{selectedPage.slug}</p>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="navLabel">Navbar label</Label>
                  <Input
                    id="navLabel"
                    placeholder={selectedPage.title}
                    value={selectedPage.navLabel || ""}
                    onChange={(e) => updateSelected("navLabel", e.target.value)}
                    disabled={selectedPage.locked}
                  />
                  <p className="text-xs text-muted-foreground">Leave empty to use the page title.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => updateSelected("navLabel", "")}
                  disabled={selectedPage.locked}
                >
                  Use page title
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Select a page to edit its label.</p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveChanges} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Save navigation
        </Button>
      </div>
    </div>
  );
}
