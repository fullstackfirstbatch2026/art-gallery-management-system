import { useEffect, useState } from "react";

import {
  Search,
  Plus,
  SlidersHorizontal,
  X,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  getArtworks,
  getArtists,
  addArtwork,
  updateArtwork,
  deleteArtwork,
} from "../services/api";

function Gallery() {
  // =================================
  // ARTWORK DATA
  // =================================

  const [artworks, setArtworks] = useState([]);
  const [artists, setArtists] = useState([]);

  // =================================
  // FILTER STATES
  // =================================

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");

  // =================================
  // LOADING
  // =================================

  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // =================================
  // MODAL
  // =================================

  const [showModal, setShowModal] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState(null);

  // =================================
  // IMAGE
  // =================================

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // =================================
  // FORM DATA
  // =================================

  const [formData, setFormData] = useState({
    title: "",
    artistId: "",
    category: "",
    price: "",
    available: true,
  });

  // =================================
  // LOAD DATA
  // =================================

  useEffect(() => {
    loadArtworks();
    loadArtists();
  }, []);

  async function loadArtists() {
    try {
      const data = await getArtists();
      setArtists(data);
    } catch (error) {
      console.error("Failed to load artists:", error);
    }
  }

  async function loadArtworks() {
    try {
      setLoading(true);

      const data = await getArtworks();

      setArtworks(data);
    } catch (error) {
      console.error("Failed to load artworks:", error);
    } finally {
      setLoading(false);
    }
  }

  // =================================
  // FORM INPUT
  // =================================

  function handleInputChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  // =================================
  // IMAGE CHANGE
  // =================================

  function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setSelectedImage(file);

    setImagePreview(URL.createObjectURL(file));
  }

  // =================================
  // OPEN ADD MODAL
  // =================================

  function handleAddClick() {
    setEditingArtwork(null);

    setFormData({
      title: "",
      artistId: "",
      category: "",
      price: "",
      available: true,
    });

    setSelectedImage(null);
    setImagePreview("");

    setShowModal(true);
  }

  // =================================
  // OPEN EDIT MODAL
  // =================================

  function handleEditClick(artwork) {
    setEditingArtwork(artwork);

    setFormData({
      title: artwork.title,
      artistId: artwork.artistId,
      category: artwork.category,
      price: artwork.price,
      available: artwork.available,
    });

    setSelectedImage(null);

    if (artwork.imageUrl) {
      setImagePreview(
        `http://localhost:8081${artwork.imageUrl}`
      );
    } else {
      setImagePreview("");
    }

    setShowModal(true);
  }

  // =================================
  // CLOSE MODAL
  // =================================

  function closeModal() {
    setShowModal(false);

    setEditingArtwork(null);

    setSelectedImage(null);
    setImagePreview("");

    setFormData({
      title: "",
      artistId: "",
      category: "",
      price: "",
      available: true,
    });
  }

  // =================================
  // UPLOAD IMAGE
  // =================================

  async function uploadArtworkImage(artworkId, imageFile) {
    const imageFormData = new FormData();

    imageFormData.append("image", imageFile);

    console.log("Uploading image...");
    console.log("Artwork ID:", artworkId);
    console.log("Image:", imageFile.name);

    const response = await fetch(
      `http://localhost:8081/artworks/${artworkId}/image`,
      {
        method: "POST",
        body: imageFormData,
      }
    );

    console.log("Image upload status:", response.status);

    const responseText = await response.text();

    console.log("Image upload response:", responseText);

    if (!response.ok) {
      throw new Error(
        `Image upload failed (${response.status}): ${responseText}`
      );
    }

    return responseText;
  }

  // =================================
  // ADD / UPDATE ARTWORK
  // =================================

  async function handleSubmitArtwork(e) {
    e.preventDefault();

    try {
      const artworkData = {
        title: formData.title,
        artistId: Number(formData.artistId),
        category: formData.category,
        price: Number(formData.price),
        available: formData.available,
      };

      let artworkId;

      // =================================
      // UPDATE
      // =================================

      if (editingArtwork) {
        const updatedArtwork = await updateArtwork(
          editingArtwork.artworkId,
          artworkData
        );

        artworkId = updatedArtwork.artworkId;
      }

      // =================================
      // ADD
      // =================================

      else {
        const newArtwork = await addArtwork(
          artworkData
        );

        artworkId = newArtwork.artworkId;
      }

      // =================================
      // UPLOAD IMAGE
      // =================================

      if (selectedImage) {
        await uploadArtworkImage(
          artworkId,
          selectedImage
        );
      }

      // =================================
      // CLOSE + RELOAD
      // =================================

      closeModal();

      await loadArtworks();

    } catch (error) {
      console.error(
        "SAVE ARTWORK ERROR:",
        error
      );

      alert(
        `Failed: ${error.message}`
      );
    }
  }

  // =================================
  // DELETE ARTWORK
  // =================================

  async function handleDeleteArtwork(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this artwork?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(true);

      await deleteArtwork(id);

      await loadArtworks();

    } catch (error) {
      console.error(
        "Failed to delete artwork:",
        error
      );

      alert("Failed to delete artwork");

    } finally {
      setDeleteLoading(false);
    }
  }

  // =================================
  // CATEGORIES
  // =================================

  const categories = [
    "All",
    ...new Set(
      artworks
        .map((artwork) => artwork.category)
        .filter(Boolean)
    ),
  ];

  // =================================
  // FILTER ARTWORKS
  // =================================

  const filteredArtworks = artworks.filter(
    (artwork) => {
      const matchesSearch =
        artwork.title
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        artwork.category === category;

      const matchesStatus =
        status === "All" ||
        (status === "Available" &&
          artwork.available) ||
        (status === "Sold" &&
          !artwork.available);

      const matchesPrice =
        maxPrice === "" ||
        artwork.price <= Number(maxPrice);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesPrice
      );
    }
  );

  // =================================
  // RETURN
  // =================================

  return (
    <div className="gallery-page">

      {/* HEADER */}

      <div className="gallery-header">
        <div>
          <p className="gallery-eyebrow">
            COLLECTION
          </p>

          <h1>Gallery</h1>

          <p className="gallery-description">
            Discover exceptional works from
            our curated collection.
          </p>
        </div>

        <button
          className="add-artwork-btn"
          onClick={handleAddClick}
        >
          <Plus size={18} />
          Add Artwork
        </button>
      </div>

      {/* FILTER BAR */}

      <div className="filter-bar">

        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search artworks..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="filter-item">
          <SlidersHorizontal size={16} />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            {categories.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </div>

        <select
          className="filter-select"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option value="All">
            All Status
          </option>

          <option value="Available">
            Available
          </option>

          <option value="Sold">
            Sold
          </option>
        </select>

        <input
          className="price-input"
          type="number"
          placeholder="Max price ₹"
          value={maxPrice}
          onChange={(e) =>
            setMaxPrice(e.target.value)
          }
        />

      </div>

      {/* RESULTS */}

      <div className="gallery-results">
        <p>
          Showing{" "}
          <strong>
            {filteredArtworks.length}
          </strong>{" "}
          artworks
        </p>
      </div>

      {/* ARTWORK GRID */}

      {loading ? (
        <div className="gallery-loading">
          Loading artworks...
        </div>
      ) : filteredArtworks.length === 0 ? (
        <div className="gallery-empty">
          <h2>No artworks found</h2>

          <p>
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="artwork-grid">

          {filteredArtworks.map(
            (artwork) => (
              <div
                className="artwork-card"
                key={artwork.artworkId}
              >

                {/* ARTWORK IMAGE */}

                <div className="artwork-image">

                  <div className="artwork-number">
                    #
                    {String(
                      artwork.artworkId
                    ).padStart(2, "0")}
                  </div>

                  <div className="artwork-category">
                    {artwork.category}
                  </div>

                  {artwork.imageUrl ? (
                    <img
                      src={`http://localhost:8081${artwork.imageUrl}`}
                      alt={artwork.title}
                      className="artwork-real-image"
                    />
                  ) : (
                    <div className="artwork-art">
                      {artwork.title?.charAt(0)}
                    </div>
                  )}

                  <span
                    className={
                      artwork.available
                        ? "availability available"
                        : "availability sold"
                    }
                  >
                    {artwork.available
                      ? "AVAILABLE"
                      : "SOLD"}
                  </span>

                </div>

                {/* ARTWORK INFO */}

                <div className="artwork-info">

                  <div>
                    <h2>
                      {artwork.title}
                    </h2>

                    <p>
                      Artist #{artwork.artistId}
                    </p>
                  </div>

                  <strong>
                    ₹
                    {Number(
                      artwork.price
                    ).toLocaleString("en-IN")}
                  </strong>

                </div>

                {/* EDIT / DELETE */}

                <div className="artwork-actions">

                  <button
                    className="edit-artwork-btn"
                    onClick={() =>
                      handleEditClick(
                        artwork
                      )
                    }
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    className="delete-artwork-btn"
                    onClick={() =>
                      handleDeleteArtwork(
                        artwork.artworkId
                      )
                    }
                    disabled={deleteLoading}
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>

                </div>

              </div>
            )
          )}

        </div>
      )}

      {/* ADD / EDIT MODAL */}

      {showModal && (
        <div className="modal-overlay">

          <div className="artwork-modal">

            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>
                <p className="gallery-eyebrow">
                  COLLECTION
                </p>

                <h2>
                  {editingArtwork
                    ? "Edit Artwork"
                    : "Add Artwork"}
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

            <form
              onSubmit={handleSubmitArtwork}
            >

              {/* TITLE */}

              <div className="form-group">

                <label>
                  Artwork Title
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="Enter artwork title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />

              </div>

              {/* ARTIST + CATEGORY */}

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Artist ID
                  </label>

                  <input
                    type="number"
                    name="artistId"
                    placeholder="e.g. 1"
                    value={formData.artistId}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    placeholder="e.g. Painting"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  />

                </div>

              </div>

              {/* PRICE */}

              <div className="form-group">

                <label>
                  Price (₹)
                </label>

                <input
                  type="number"
                  name="price"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  required
                />

              </div>

              {/* AVAILABILITY */}

              <div className="form-group">

                <label>
                  Availability
                </label>

                <select
                  name="available"
                  value={
                    formData.available
                      ? "true"
                      : "false"
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      available:
                        e.target.value ===
                        "true",
                    })
                  }
                >
                  <option value="true">
                    Available
                  </option>

                  <option value="false">
                    Sold
                  </option>
                </select>

              </div>

              {/* IMAGE */}

              <div className="form-group">

                <label>
                  Artwork Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

              </div>

              {/* IMAGE PREVIEW */}

              {imagePreview && (
                <div className="image-preview">

                  <img
                    src={imagePreview}
                    alt="Artwork preview"
                  />

                </div>
              )}

              {/* MODAL ACTIONS */}

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
                  {editingArtwork ? (
                    <>
                      <Pencil size={17} />
                      Update Artwork
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Add Artwork
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

export default Gallery;