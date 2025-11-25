"use client";
import React, { useState, useEffect } from "react";
import AdminHeader from "../shared/AdminHeader";
import AdminDataTable from "../shared/AdminDataTable";
import Modal from "../shared/Modal";
import FormField, { Input, TextArea, SubmitButton } from "../shared/Form";

export default function RtiPanel() {
  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    docType: "",
    externalUrl: "",
    order: "0",
  });

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await fetch("/api/papa/rti");
      const json = await res.json();
      if (json.data) setDocs(json.data);
    } catch (error) {
      console.error("Failed to fetch RTI documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ title: "", summary: "", docType: "", externalUrl: "", order: "0" });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      summary: item.summary || "",
      docType: item.docType || "",
      externalUrl: item.externalUrl || "",
      order: item.order.toString(),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const res = await fetch("/api/papa/rti", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        fetchDocs();
      }
    } catch (error) {
      console.error("Failed to delete document:", error);
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

      const res = await fetch("/api/papa/rti", {
        method: editingItem ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchDocs();
      }
    } catch (error) {
      console.error("Failed to save document:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "docType", label: "Type" },
    { key: "order", label: "Order" },
  ];

  return (
    <div>
      <AdminHeader
        title="Right to Information"
        description="Manage legal documents and disclosures."
        onAdd={handleAdd}
      />

      <AdminDataTable
        columns={columns}
        data={docs}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Document" : "Add New Document"}
      >
        <form onSubmit={handleSubmit}>
          <FormField label="Title">
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Annual Report 2024"
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
            <FormField label="Document Type">
              <Input
                value={formData.docType}
                onChange={(e) => setFormData({ ...formData, docType: e.target.value })}
                placeholder="e.g. PDF"
              />
            </FormField>
            <FormField label="External URL">
              <Input
                value={formData.externalUrl}
                onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                placeholder="https://..."
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
              {editingItem ? "Update Document" : "Create Document"}
            </SubmitButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
