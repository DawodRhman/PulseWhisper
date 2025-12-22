"use client";
import React, { useState, useEffect } from "react";
import AdminHeader from "../shared/AdminHeader";
import AdminDataTable from "../shared/AdminDataTable";
import Modal from "../shared/Modal";
import FormField, { Input, TextArea, SubmitButton } from "../shared/Form";
import MediaPicker from "../media/MediaPicker";

export default function EducationPanel() {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    mediaId: "",
    videoUrl: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await fetch("/api/papa/education");
      const json = await res.json();
      if (json.data) setResources(json.data);
    } catch (error) {
      console.error("Failed to fetch education resources:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      summary: "",
      content: "",
      mediaId: "",
      videoUrl: "",
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      summary: item.summary || "",
      content: item.content ? JSON.stringify(item.content, null, 2) : "",
      mediaId: item.mediaId || "",
      videoUrl: item.videoUrl || "",
      seoTitle: item.seo?.title || "",
      seoDescription: item.seo?.description || "",
      seoKeywords: item.seo?.keywords || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    try {
      const res = await fetch("/api/papa/education", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        fetchResources();
      }
    } catch (error) {
      console.error("Failed to delete resource:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let parsedContent = null;
      if (formData.content) {
        try {
          parsedContent = JSON.parse(formData.content);
        } catch (e) {
          alert("Invalid JSON content");
          setIsSubmitting(false);
          return;
        }
      }

      const payload = {
        title: formData.title,
        summary: formData.summary,
        content: parsedContent,
        mediaId: formData.mediaId || null,
        videoUrl: formData.videoUrl || null,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        seoKeywords: formData.seoKeywords,
      };

      if (editingItem) {
        payload.id = editingItem.id;
      }

      const res = await fetch("/api/papa/education", {
        method: editingItem ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchResources();
      }
    } catch (error) {
      console.error("Failed to save resource:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "summary", label: "Summary" },
  ];

  return (
    <div>
      <AdminHeader
        title="Education & Awareness"
        description="Manage educational resources and campaigns."
        onAdd={handleAdd}
      />

      <AdminDataTable
        columns={columns}
        data={resources}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Resource" : "Add New Resource"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Title">
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Water Conservation Tips"
              required
            />
          </FormField>

          <FormField label="Summary">
            <TextArea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Brief description..."
            />
          </FormField>

          <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
            <h4 className="mb-2 text-sm font-semibold text-slate-800">Media</h4>
            <div className="space-y-4">
              <MediaPicker
                label="Cover Image"
                value={formData.mediaId}
                onChange={(id) => setFormData(prev => ({ ...prev, mediaId: id }))}
                category="education"
                accept="image/*"
              />

              <FormField label="Video URL (YouTube/Vimeo)">
                <Input
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/..."
                />
              </FormField>
            </div>
          </div>

          <FormField label="Content (JSON)">
            <TextArea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder='{"sections": []}'
              className="font-mono text-xs"
            />
          </FormField>

          <div className="mt-6 border-t border-slate-100 pt-4">
            <h4 className="mb-4 text-sm font-bold text-slate-900">SEO Metadata</h4>
            <FormField label="SEO Title">
              <Input
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                placeholder="Meta title..."
              />
            </FormField>
            <FormField label="SEO Description">
              <TextArea
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                placeholder="Meta description..."
              />
            </FormField>
            <FormField label="Keywords">
              <Input
                value={formData.seoKeywords}
                onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                placeholder="Comma-separated keywords..."
              />
            </FormField>
          </div>

          <div className="mt-6">
            <SubmitButton isSubmitting={isSubmitting}>
              {editingItem ? "Update Resource" : "Create Resource"}
            </SubmitButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
