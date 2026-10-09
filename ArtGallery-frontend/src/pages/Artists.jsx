import { useEffect, useState } from "react";

import {
  Plus,
  X,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";

import {
  getArtists,
  addArtist,
  updateArtist,
  deleteArtist,
} from "../services/api";

function Artists() {
  const [artists, setArtists] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingArtist, setEditingArtist] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
  });

  useEffect(() => {
    loadArtists();
  }, []);

  async function loadArtists() {
    try {
      setLoading(true);

      const data = await getArtists();

      setArtists(data);
    } catch (error) {
      console.error("Failed to load artists:", error);
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
  }

  function handleAddClick() {
    setEditingArtist(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      country: "",
    });

    setShowModal(true);
  }

  function handleEditClick(artist) {
    setEditingArtist(artist);

    setFormData({
      name: artist.name,
      email: artist.email,
      phone: artist.phone,
      country: artist.country,
    });

    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingArtist(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      country: "",
    });
  }

  async function handleSubmitArtist(e) {
    e.preventDefault();

    try {
      const artistData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
      };

      if (editingArtist) {
        await updateArtist(
          editingArtist.artistId,
          artistData
        );
      } else {
        await addArtist(artistData);
      }

      closeModal();

      await loadArtists();
    } catch (error) {
      console.error("Failed to save artist:", error);

      alert(
        editingArtist
          ? "Failed to update artist"
          : "Failed to add artist"
      );
    }
  }

  async function handleDeleteArtist(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this artist?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(true);

      await deleteArtist(id);

      await loadArtists();
    } catch (error) {
      console.error("Failed to delete artist:", error);

      alert("Failed to delete artist");
    } finally {
      setDeleteLoading(false);
    }
  }

  const filteredArtists = artists.filter((artist) => {
    const searchText = search.toLowerCase();

    return (
      artist.name?.toLowerCase().includes(searchText) ||
      artist.email?.toLowerCase().includes(searchText) ||
      artist.country?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="artists-page">

      {/* HEADER */}

      <div className="gallery-header">
        <div>
          <p className="gallery-eyebrow">
            ARTISTS
          </p>

          <h1>Artists</h1>

          <p className="gallery-description">
            Manage the talented artists in your gallery.
          </p>
        </div>

        <button
          className="add-artwork-btn"
          onClick={handleAddClick}
        >
          <Plus size={18} />
          Add Artist
        </button>
      </div>


      {/* SEARCH */}

      <div className="filter-bar">

        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search artists..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

      </div>


      {/* RESULT COUNT */}

      <div className="gallery-results">
        <p>
          Showing{" "}
          <strong>
            {filteredArtists.length}
          </strong>{" "}
          artists
        </p>
      </div>


      {/* ARTISTS */}

      {loading ? (
        <div className="gallery-loading">
          Loading artists...
        </div>
      ) : filteredArtists.length === 0 ? (
        <div className="gallery-empty">
          <h2>No artists found</h2>

          <p>
            Try changing your search.
          </p>
        </div>
      ) : (
        <div className="artists-grid">

          {filteredArtists.map((artist) => (

            <div
              className="artist-card"
              key={artist.artistId}
            >

              <div className="artist-avatar">
                {artist.name?.charAt(0)}
              </div>

              <div className="artist-info">

                <div className="artist-id">
                  #{String(
                    artist.artistId
                  ).padStart(2, "0")}
                </div>

                <h2>
                  {artist.name}
                </h2>

                <p>
                  {artist.country}
                </p>

                <div className="artist-contact">

                  <span>
                    {artist.email}
                  </span>

                  <span>
                    {artist.phone}
                  </span>

                </div>

              </div>


              <div className="artist-actions">

                <button
                  className="edit-artwork-btn"
                  onClick={() =>
                    handleEditClick(artist)
                  }
                >
                  <Pencil size={15} />
                  Edit
                </button>

                <button
                  className="delete-artwork-btn"
                  onClick={() =>
                    handleDeleteArtist(
                      artist.artistId
                    )
                  }
                  disabled={deleteLoading}
                >
                  <Trash2 size={15} />
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>
      )}


      {/* MODAL */}

      {showModal && (

        <div className="modal-overlay">

          <div className="artwork-modal">

            <div className="modal-header">

              <div>

                <p className="gallery-eyebrow">
                  ARTISTS
                </p>

                <h2>
                  {editingArtist
                    ? "Edit Artist"
                    : "Add Artist"}
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


            <form
              onSubmit={handleSubmitArtist}
            >

              <div className="form-group">

                <label>
                  Artist Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter artist name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />

              </div>


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


              <div className="form-row">

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


                <div className="form-group">

                  <label>
                    Country
                  </label>

                  <input
                    type="text"
                    name="country"
                    placeholder="Enter country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />

                </div>

              </div>


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

                  {editingArtist ? (
                    <>
                      <Pencil size={17} />
                      Update Artist
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Add Artist
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

export default Artists; 