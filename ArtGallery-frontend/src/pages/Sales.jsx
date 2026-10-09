import { useEffect, useState } from "react";
import { Plus, Search, X, DollarSign } from "lucide-react";
import {
  getSales,
  getArtworks,
  getCustomers,
  recordSale,
  getCommission,
} from "../services/api";

function Sales() {
  const [sales, setSales] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [commission, setCommission] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    artworkId: "",
    customerId: "",
    salePrice: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const [salesData, artworksData, customersData] =
        await Promise.all([
          getSales(),
          getArtworks(),
          getCustomers(),
        ]);

      setSales(salesData);
      setArtworks(artworksData);
      setCustomers(customersData);

      let totalCommission = 0;

for (const sale of salesData) {
  const result = await getCommission(Number(sale.salePrice));
  totalCommission += Number(result);
}

setCommission(totalCommission);
    } catch (error) {
      console.error("Failed to load sales data:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Automatically set artwork price
    if (name === "artworkId") {
      const selectedArtwork = artworks.find(
        (artwork) => artwork.artworkId === Number(value)
      );

      if (selectedArtwork) {
        setFormData({
          ...formData,
          artworkId: value,
          salePrice: selectedArtwork.price,
        });
      }
    }
  }

  function handleAddClick() {
    setFormData({
      artworkId: "",
      customerId: "",
      salePrice: "",
    });

    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);

    setFormData({
      artworkId: "",
      customerId: "",
      salePrice: "",
    });
  }

  async function handleSubmitSale(e) {
    e.preventDefault();

    if (!formData.artworkId || !formData.customerId || !formData.salePrice) {
      alert("Please fill all fields");
      return;
    }

    try {
      setSaving(true);

      await recordSale(
        Number(formData.artworkId),
        Number(formData.customerId),
        Number(formData.salePrice)
      );

      alert("Sale recorded successfully!");

      closeModal();

      // Reload sales + artworks
      await loadData();
    } catch (error) {
      console.error("Failed to record sale:", error);
      alert(error.message || "Failed to record sale");
    } finally {
      setSaving(false);
    }
  }

  const availableArtworks = artworks.filter(
    (artwork) => artwork.available === true
  );

  const filteredSales = sales.filter((sale) => {
    const searchText = search.toLowerCase();

    return (
      sale.artwork?.toLowerCase().includes(searchText) ||
      sale.artist?.toLowerCase().includes(searchText) ||
      sale.customer?.toLowerCase().includes(searchText)
    );
  });

  const totalSales = sales.reduce(
    (total, sale) => total + Number(sale.salePrice || 0),
    0
  );

  async function calculateTotalCommission() {
  try {
    let total = 0;

    for (const sale of sales) {
      const result = await getCommission(Number(sale.salePrice));
      total += Number(result);
    }

    setCommission(total);
  } catch (error) {
    console.error("Failed to calculate commission:", error);
  }
}

  return (
    <div className="sales-page">

      {/* HEADER */}

      <div className="gallery-header">
        <div>
          <p className="gallery-eyebrow">TRANSACTIONS</p>

          <h1>Sales</h1>

          <p className="gallery-description">
            Manage artwork sales and customer transactions.
          </p>
        </div>

        <button
          className="add-artwork-btn"
          onClick={handleAddClick}
        >
          <Plus size={18} />
          Record Sale
        </button>
      </div>

      {/* SUMMARY CARDS */}

      <div className="sales-summary">

        <div className="sales-summary-card">
          <div className="sales-summary-icon">
            <DollarSign size={20} />
          </div>

          <div>
            <p>Total Sales</p>

            <h2>
              ₹{totalSales.toLocaleString("en-IN")}
            </h2>
          </div>
        </div>

        <div className="sales-summary-card">
          <div className="sales-summary-icon">
            <DollarSign size={20} />
          </div>

          <div>
            <p>Transactions</p>

            <h2>{sales.length}</h2>
          </div>
        </div>

        <div className="sales-summary-card">
          <div className="sales-summary-icon">
            <DollarSign size={20} />
          </div>

          <div>
            <p>Gallery Commission</p>

            <h2>
              ₹{commission.toLocaleString("en-IN")}
            </h2>
          </div>
        </div>

      </div>

      {/* SEARCH */}

      <div className="filter-bar">

        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search artwork, artist or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

      </div>

      <div className="gallery-results">
        <p>
          Showing <strong>{filteredSales.length}</strong> sales
        </p>
      </div>

      {/* SALES TABLE */}

      {loading ? (
        <div className="gallery-loading">
          Loading sales...
        </div>
      ) : filteredSales.length === 0 ? (
        <div className="gallery-empty">
          <h2>No sales found</h2>

          <p>
            Record your first artwork sale to see it here.
          </p>
        </div>
      ) : (
        <div className="sales-table-container">

          <table className="sales-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Artwork</th>
                <th>Artist</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Sale Price</th>
                <th>Commission</th>
              </tr>
            </thead>

            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.saleId}>

                  <td>
                    #{String(sale.saleId).padStart(2, "0")}
                  </td>

                  <td className="sales-artwork-name">
                    {sale.artwork}
                  </td>

                  <td>
                    {sale.artist}
                  </td>

                  <td>
                    {sale.customer}
                  </td>

                  <td>
                    {sale.saleDate}
                  </td>

                  <td className="sales-price">
                    ₹{Number(sale.salePrice).toLocaleString("en-IN")}
                  </td>

                  <td className="sales-commission">
                    ₹{(Number(sale.salePrice) * 0.1).toLocaleString("en-IN")}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}

      {/* RECORD SALE MODAL */}

      {showModal && (
        <div className="modal-overlay">

          <div className="artwork-modal">

            <div className="modal-header">

              <div>
                <p className="gallery-eyebrow">
                  TRANSACTION
                </p>

                <h2>Record Sale</h2>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeModal}
              >
                <X size={20} />
              </button>

            </div>

            <form onSubmit={handleSubmitSale}>

              {/* ARTWORK */}

              <div className="form-group">

                <label>Artwork</label>

                <select
                  name="artworkId"
                  value={formData.artworkId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">
                    Select artwork
                  </option>

                  {availableArtworks.map((artwork) => (
                    <option
                      key={artwork.artworkId}
                      value={artwork.artworkId}
                    >
                      {artwork.title} — ₹
                      {Number(artwork.price).toLocaleString("en-IN")}
                    </option>
                  ))}
                </select>

              </div>

              {/* CUSTOMER */}

              <div className="form-group">

                <label>Customer</label>

                <select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">
                    Select customer
                  </option>

                  {customers.map((customer) => (
                    <option
                      key={customer.customerId}
                      value={customer.customerId}
                    >
                      {customer.name}
                    </option>
                  ))}
                </select>

              </div>

              {/* SALE PRICE */}

              <div className="form-group">

                <label>Sale Price</label>

                <input
                  type="number"
                  name="salePrice"
                  placeholder="Enter sale price"
                  value={formData.salePrice}
                  onChange={handleInputChange}
                  min="1"
                  required
                />

              </div>

              {/* ACTIONS */}

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
                  disabled={saving}
                >
                  <DollarSign size={17} />

                  {saving
                    ? "Recording..."
                    : "Record Sale"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Sales;