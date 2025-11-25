"use client";
import React, { useState, useEffect } from "react";
import AdminHeader from "../shared/AdminHeader";
import AdminDataTable from "../shared/AdminDataTable";
import Modal from "../shared/Modal";
import FormField, { Input, TextArea, SubmitButton } from "../shared/Form";

export default function LocationsPanel() {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    label: "",
    address: "",
    phone: "",
    email: "",
    hours: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await fetch("/api/papa/locations");
      const json = await res.json();
      if (json.data) setLocations(json.data);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      label: "",
      address: "",
      phone: "",
      email: "",
      hours: "",
      latitude: "",
      longitude: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      label: item.label,
      address: item.address,
      phone: item.phone || "",
      email: item.email || "",
      hours: item.hours || "",
      latitude: item.latitude || "",
      longitude: item.longitude || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this location?")) return;

    try {
      const res = await fetch("/api/papa/locations", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        fetchLocations();
      }
    } catch (error) {
      console.error("Failed to delete location:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
      };

      if (editingItem) {
        payload.id = editingItem.id;
      }

      const res = await fetch("/api/papa/locations", {
        method: editingItem ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchLocations();
      }
    } catch (error) {
      console.error("Failed to save location:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: "label", label: "Label" },
    { key: "address", label: "Address" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
  ];

  return (
    <div>
      <AdminHeader
        title="Office Locations"
        description="Manage contact addresses and map coordinates."
        onAdd={handleAdd}
      />

      <AdminDataTable
        columns={columns}
        data={locations}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Location" : "Add New Location"}
      >
        <form onSubmit={handleSubmit}>
          <FormField label="Label">
            <Input
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="e.g. Head Office"
              required
            />
          </FormField>

          <FormField label="Address">
            <TextArea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full address..."
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Phone">
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+92..."
              />
            </FormField>
            <FormField label="Email">
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="info@kwsc..."
              />
            </FormField>
          </div>

          <FormField label="Hours">
            <Input
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              placeholder="e.g. Mon-Fri 9am-5pm"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Latitude">
              <Input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="24.8607"
              />
            </FormField>
            <FormField label="Longitude">
              <Input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="67.0011"
              />
            </FormField>
          </div>

          <div className="mt-6">
            <SubmitButton isSubmitting={isSubmitting}>
              {editingItem ? "Update Location" : "Create Location"}
            </SubmitButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
