"use client";
import React, { useState, useEffect } from "react";
import AdminHeader from "../shared/AdminHeader";
import AdminDataTable from "../shared/AdminDataTable";
import Modal from "../shared/Modal";
import FormField, { Input, SubmitButton } from "../shared/Form";

export default function StatsPanel() {
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    label: "",
    value: "",
    suffix: "",
    order: "0",
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/papa/stats");
      const json = await res.json();
      if (json.data) setStats(json.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ label: "", value: "", suffix: "", order: "0" });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      label: item.label,
      value: item.value.toString(),
      suffix: item.suffix || "",
      order: item.order.toString(),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this stat?")) return;
    
    try {
      const res = await fetch("/api/papa/stats", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      
      if (res.ok) {
        fetchStats();
      }
    } catch (error) {
      console.error("Failed to delete stat:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        value: parseInt(formData.value),
        order: parseInt(formData.order),
      };

      if (editingItem) {
        payload.id = editingItem.id;
      }

      const res = await fetch("/api/papa/stats", {
        method: editingItem ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchStats();
      }
    } catch (error) {
      console.error("Failed to save stat:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: "label", label: "Label" },
    { key: "value", label: "Value" },
    { key: "suffix", label: "Suffix" },
    { key: "order", label: "Order" },
  ];

  return (
    <div>
      <AdminHeader
        title="Stats & Counters"
        description="Manage the animated counters on the homepage."
        onAdd={handleAdd}
      />

      <AdminDataTable
        columns={columns}
        data={stats}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Stat" : "Add New Stat"}
      >
        <form onSubmit={handleSubmit}>
          <FormField label="Label">
            <Input
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="e.g. Projects Completed"
              required
            />
          </FormField>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Value">
              <Input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="e.g. 150"
                required
              />
            </FormField>
            
            <FormField label="Suffix">
              <Input
                value={formData.suffix}
                onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                placeholder="e.g. +"
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
              {editingItem ? "Update Stat" : "Create Stat"}
            </SubmitButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
