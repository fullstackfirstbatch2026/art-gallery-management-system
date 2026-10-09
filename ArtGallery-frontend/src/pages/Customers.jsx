import { useEffect, useState } from "react";

import {
  Plus,
  X,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";

import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from "../services/api";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // =========================
  // LOAD CUSTOMERS
  // =========================

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      setLoading(true);

      const data = await getCustomers();

      setCustomers(data);
    } catch (error) {
      console.error("Failed to load customers:", error);
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // FORM INPUT
  // =========================

  function handleInputChange(e) {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  // =========================
  // ADD CUSTOMER
  // =========================

  function handleAddClick() {
    setEditingCustomer(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
    });

    setShowModal(true);
  }

  // =========================
  // EDIT CUSTOMER
  // =========================

  function handleEditClick(customer) {
    setEditingCustomer(customer);

    setFormData({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
    });

    setShowModal(true);
  }

  // =========================
  // CLOSE MODAL
  // =========================

  function closeModal() {
    setShowModal(false);
    setEditingCustomer(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
    });
  }

  // =========================
  // ADD / UPDATE CUSTOMER
  // =========================

  async function handleSubmitCustomer(e) {
    e.preventDefault();

    try {
      const customerData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };

      if (editingCustomer) {
        await updateCustomer(
          editingCustomer.customerId,
          customerData
        );
      } else {
        await addCustomer(customerData);
      }

      closeModal();

      await loadCustomers();

    } catch (error) {
      console.error("Failed to save customer:", error);

      alert(
        editingCustomer
          ? "Failed to update customer"
          : "Failed to add customer"
      );
    }
  }

  // =========================
  // DELETE CUSTOMER
  // =========================

  async function handleDeleteCustomer(id) {
    console.log("Deleting customer ID:", id);

    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) {
      return;
    }

    try {
      // Store which customer is being deleted
      setDeleteLoading(id);

      // Delete from backend
      await deleteCustomer(id);

      console.log("Customer deleted successfully:", id);

      // Remove customer immediately from frontend
      setCustomers((previousCustomers) =>
        previousCustomers.filter(
          (customer) => customer.customerId !== id
        )
      );

    } catch (error) {
      console.error("Failed to delete customer:", error);

      alert(
        "Failed to delete customer. Check the browser console."
      );
    } finally {
      setDeleteLoading(null);
    }
  }

  // =========================
  // SEARCH
  // =========================

  const filteredCustomers = customers.filter((customer) => {
    const searchText = search.toLowerCase();

    return (
      customer.name?.toLowerCase().includes(searchText) ||
      customer.email?.toLowerCase().includes(searchText) ||
      customer.phone?.toLowerCase().includes(searchText)
    );
  });

  // =========================
  // UI
  // =========================

  return (
    <div className="customers-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="gallery-header">

        <div>
          <p className="gallery-eyebrow">
            COLLECTORS
          </p>

          <h1>Customers</h1>

          <p className="gallery-description">
            Manage your gallery's collectors and customers.
          </p>
        </div>

        <button
          className="add-artwork-btn"
          onClick={handleAddClick}
        >
          <Plus size={18} />
          Add Customer
        </button>

      </div>

      {/* =========================
          SEARCH
      ========================= */}

      <div className="filter-bar">

        <div className="search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </div>

      {/* =========================
          RESULT COUNT
      ========================= */}

      <div className="gallery-results">

        <p>
          Showing{" "}
          <strong>{filteredCustomers.length}</strong>{" "}
          customers
        </p>

      </div>

      {/* =========================
          CUSTOMER LIST
      ========================= */}

      {loading ? (

        <div className="gallery-loading">
          Loading customers...
        </div>

      ) : filteredCustomers.length === 0 ? (

        <div className="gallery-empty">

          <h2>No customers found</h2>

          <p>
            Try changing your search or add a new customer.
          </p>

        </div>

      ) : (

        <div className="customers-grid">

          {filteredCustomers.map((customer) => (

            <div
              className="customer-card"
              key={customer.customerId}
            >

              {/* AVATAR */}

              <div className="customer-avatar">
                {customer.name?.charAt(0).toUpperCase()}
              </div>

              {/* CUSTOMER INFORMATION */}

              <div className="customer-info">

                <div className="customer-id">
                  #
                  {String(customer.customerId).padStart(
                    2,
                    "0"
                  )}
                </div>

                <h2>{customer.name}</h2>

                <div className="customer-contact">

                  <span>
                    {customer.email}
                  </span>

                  <span>
                    {customer.phone}
                  </span>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="customer-actions">

                <button
                  className="edit-artwork-btn"
                  onClick={() =>
                    handleEditClick(customer)
                  }
                  disabled={deleteLoading !== null}
                >
                  <Pencil size={15} />
                  Edit
                </button>

                <button
                  className="delete-artwork-btn"
                  onClick={() =>
                    handleDeleteCustomer(
                      customer.customerId
                    )
                  }
                  disabled={
                    deleteLoading === customer.customerId
                  }
                >

                  <Trash2 size={15} />

                  {deleteLoading === customer.customerId
                    ? "Deleting..."
                    : "Delete"}

                </button>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      {showModal && (

        <div className="modal-overlay">

          <div className="artwork-modal">

            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>

                <p className="gallery-eyebrow">
                  COLLECTORS
                </p>

                <h2>
                  {editingCustomer
                    ? "Edit Customer"
                    : "Add Customer"}
                </h2>

              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeModal}
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}

            <form onSubmit={handleSubmitCustomer}>

              {/* NAME */}

              <div className="form-group">

                <label>
                  Customer Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter customer name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />

              </div>

              {/* EMAIL */}

              <div className="form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />

              </div>

              {/* PHONE */}

              <div className="form-group">

                <label>
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />

              </div>

              {/* MODAL BUTTONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                >

                  {editingCustomer ? (
                    <>
                      <Pencil size={17} />
                      Update Customer
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Add Customer
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Customers;