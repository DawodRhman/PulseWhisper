"use client";
import React, { useState, useEffect } from "react";
import AdminHeader from "../shared/AdminHeader";
import AdminDataTable from "../shared/AdminDataTable";
import Modal from "../shared/Modal";
import FormField, { Input, TextArea, SubmitButton } from "../shared/Form";

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
    setFormData({ title: "", summary: "", content: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      summary: item.summary || "",
      content: item.content ? JSON.stringify(item.content, null, 2) : "",
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
        <form onSubmit={handleSubmit}>
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

          <FormField label="Content (JSON)">
            <TextArea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder='{"sections": []}'
              className="font-mono text-xs"
            />
          </FormField>

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
