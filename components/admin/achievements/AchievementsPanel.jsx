"use client";
import React, { useState, useEffect } from "react";
import AdminHeader from "../shared/AdminHeader";
import AdminDataTable from "../shared/AdminDataTable";
import Modal from "../shared/Modal";
import FormField, { Input, TextArea, SubmitButton } from "../shared/Form";

export default function AchievementsPanel() {
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    metric: "",
    iconKey: "",
    order: "0",
  });

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const res = await fetch("/api/papa/achievements");
      const json = await res.json();
      if (json.data) setAchievements(json.data);
    } catch (error) {
      console.error("Failed to fetch achievements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ title: "", summary: "", metric: "", iconKey: "", order: "0" });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      summary: item.summary || "",
      metric: item.metric || "",
      iconKey: item.iconKey || "",
      order: item.order.toString(),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;

    try {
      const res = await fetch("/api/papa/achievements", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        fetchAchievements();
      }
    } catch (error) {
      console.error("Failed to delete achievement:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        order: parseInt(formData.order),
      };

      if (editingItem) {
        payload.id = editingItem.id;
      }

      const res = await fetch("/api/papa/achievements", {
        method: editingItem ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchAchievements();
      }
    } catch (error) {
      console.error("Failed to save achievement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "metric", label: "Metric" },
    { key: "order", label: "Order" },
  ];

  return (
    <div>
      <AdminHeader
        title="Achievements"
        description="Manage awards, milestones, and key achievements."
        onAdd={handleAdd}
      />

      <AdminDataTable
        columns={columns}
        data={achievements}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Achievement" : "Add New Achievement"}
      >
        <form onSubmit={handleSubmit}>
          <FormField label="Title">
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Best Water Utility"
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

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Metric">
              <Input
                value={formData.metric}
                onChange={(e) => setFormData({ ...formData, metric: e.target.value })}
                placeholder="e.g. 2024 Award"
              />
            </FormField>
            <FormField label="Icon Key">
              <Input
                value={formData.iconKey}
                onChange={(e) => setFormData({ ...formData, iconKey: e.target.value })}
                placeholder="e.g. trophy"
              />
            </FormField>
          </div>

          <FormField label="Order">
            <Input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: e.target.value })}
              placeholder="0"
            />
          </FormField>

          <div className="mt-6">
            <SubmitButton isSubmitting={isSubmitting}>
              {editingItem ? "Update Achievement" : "Create Achievement"}
            </SubmitButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
