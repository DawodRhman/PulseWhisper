"use client";
import React, { useState, useEffect } from "react";
import AdminHeader from "../shared/AdminHeader";
import AdminDataTable from "../shared/AdminDataTable";
import Modal from "../shared/Modal";
import FormField, { Input, TextArea, SubmitButton } from "../shared/Form";

export default function FaqPanel() {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    order: "0",
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await fetch("/api/papa/faq");
      const json = await res.json();
      if (json.data) setFaqs(json.data);
    } catch (error) {
      console.error("Failed to fetch FAQs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ question: "", answer: "", order: "0" });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      question: item.question,
      answer: item.answer,
      order: item.order.toString(),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      const res = await fetch("/api/papa/faq", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        fetchFaqs();
      }
    } catch (error) {
      console.error("Failed to delete FAQ:", error);
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

      const res = await fetch("/api/papa/faq", {
        method: editingItem ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchFaqs();
      }
    } catch (error) {
      console.error("Failed to save FAQ:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: "question", label: "Question" },
    { key: "order", label: "Order" },
  ];

  return (
    <div>
      <AdminHeader
        title="Frequently Asked Questions"
        description="Manage the FAQ section content."
        onAdd={handleAdd}
      />

      <AdminDataTable
        columns={columns}
        data={faqs}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit FAQ" : "Add New FAQ"}
      >
        <form onSubmit={handleSubmit}>
          <FormField label="Question">
            <Input
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="e.g. How do I pay my bill?"
              required
            />
          </FormField>

          <FormField label="Answer">
            <TextArea
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              placeholder="Detailed answer..."
              required
              className="min-h-[150px]"
            />
          </FormField>

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
              {editingItem ? "Update FAQ" : "Create FAQ"}
            </SubmitButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
