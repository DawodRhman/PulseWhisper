"use client";
import React, { useState, useEffect } from "react";
import AdminHeader from "../shared/AdminHeader";
import AdminDataTable from "../shared/AdminDataTable";
import Modal from "../shared/Modal";
import FormField, { Input, TextArea, SubmitButton } from "../shared/Form";
import MediaPicker from "@/components/admin/media/MediaPicker";

export default function WaterTodayPanel() {
  const [updates, setUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    status: "",
    publishedAt: "",
    mediaId: "",
    mediaUrl: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const res = await fetch("/api/papa/watertoday");
      const json = await res.json();
      if (json.data) setUpdates(json.data);
    } catch (error) {
      console.error("Failed to fetch updates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      summary: "",
      status: "PUBLISHED",
      publishedAt: new Date().toISOString().slice(0, 16),
      publishedAt: new Date().toISOString().slice(0, 16),
      mediaId: "",
      mediaUrl: "",
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
      status: item.status || "PUBLISHED",
      publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString().slice(0, 16) : "",
      mediaId: item.mediaId || "",
      mediaUrl: item.media?.url || "",
      seoTitle: item.seo?.title || "",
      seoDescription: item.seo?.description || "",
      seoKeywords: item.seo?.keywords || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this update?")) return;

    try {
      const res = await fetch("/api/papa/watertoday", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        fetchUpdates();
      }
    } catch (error) {
      console.error("Failed to delete update:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : null,
        mediaId: formData.mediaId || null,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        seoKeywords: formData.seoKeywords,
      };

      if (editingItem) {
        payload.id = editingItem.id;
      }

      const res = await fetch("/api/papa/watertoday", {
        method: editingItem ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchUpdates();
      }
    } catch (error) {
      console.error("Failed to save update:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "status", label: "Status" },
    {
      key: "publishedAt",
      label: "Date",
      render: (val) => val ? new Date(val).toLocaleDateString() : "-"
    },
  ];

  return (
    <div>
      <AdminHeader
        title="Water Today"
        description="Manage daily water supply updates."
        onAdd={handleAdd}
      />

      <AdminDataTable
        columns={columns}
        data={updates}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Update" : "Add New Update"}
      >
        <form onSubmit={handleSubmit}>
          <FormField label="Title">
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Supply Update for District Central"
              required
            />
          </FormField>

          <FormField label="Summary">
            <TextArea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Brief details..."
            />
          </FormField>

          <div className="mb-4">
            <MediaPicker
              label="Update Image"
              category="water-today"
              value={formData.mediaId}
              initialUrl={formData.mediaUrl}
              onChange={(id, asset) => setFormData(prev => ({
                ...prev,
                mediaId: id,
                mediaUrl: asset ? "" : prev.mediaUrl // Clear manual URL if picker used
              }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Status">
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </FormField>
            <FormField label="Published At">
              <Input
                type="datetime-local"
                value={formData.publishedAt}
                onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
              />
            </FormField>
          </div>

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
              {editingItem ? "Update Update" : "Create Update"}
            </SubmitButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
