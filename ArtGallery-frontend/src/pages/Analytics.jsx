import { useEffect, useState } from "react";
import {
  Palette,
  CheckCircle,
  ShoppingBag,
  IndianRupee,
  TrendingUp,
} from "lucide-react";

import {
  getArtworks,
  getArtists,
  getCustomers,
  getSales,
} from "../services/api";

function Analytics() {
  const [artworks, setArtworks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const [
          artworkData,
          artistData,
          customerData,
          salesData,
        ] = await Promise.all([
          getArtworks(),
          getArtists(),
          getCustomers(),
          getSales(),
        ]);

        setArtworks(artworkData);
        setArtists(artistData);
        setCustomers(customerData);
        setSales(salesData);
      } catch (error) {
        console.error("Analytics error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="analytics-page">
        <h1>Loading analytics...</h1>
      </div>
    );
  }

  const availableArtworks = artworks.filter(
    (artwork) => artwork.available === true
  );

  const soldArtworks = artworks.filter(
    (artwork) => artwork.available === false
  );

  const totalRevenue = sales.reduce(
    (total, sale) => total + Number(sale.salePrice || 0),
    0
  );

  const averageArtworkPrice =
    artworks.length > 0
      ? artworks.reduce(
          (total, artwork) => total + Number(artwork.price || 0),
          0
        ) / artworks.length
      : 0;

  const mostExpensiveArtwork =
    artworks.length > 0
      ? artworks.reduce((highest, artwork) =>
          Number(artwork.price) > Number(highest.price)
            ? artwork
            : highest
        )
      : null;

  const commission = totalRevenue * 0.1;

  return (
    <div className="analytics-page">

      {/* HEADER */}

      <div className="gallery-header">
        <div>
          <p className="gallery-eyebrow">INSIGHTS</p>

          <h1>Analytics</h1>

          <p className="gallery-description">
            Overview of your gallery's performance and collection.
          </p>
        </div>
      </div>

      {/* MAIN STATS */}

      <div className="analytics-grid">

        <div className="analytics-card">
          <div className="analytics-icon">
            <Palette size={21} />
          </div>

          <p>Total Artworks</p>

          <h2>{artworks.length}</h2>

          <span>
            {availableArtworks.length} currently available
          </span>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon">
            <CheckCircle size={21} />
          </div>

          <p>Available Artworks</p>

          <h2>{availableArtworks.length}</h2>

          <span>
            Ready for sale
          </span>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon">
            <ShoppingBag size={21} />
          </div>

          <p>Sold Artworks</p>

          <h2>{soldArtworks.length}</h2>

          <span>
            Completed transactions
          </span>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon">
            <IndianRupee size={21} />
          </div>

          <p>Total Revenue</p>

          <h2>
            ₹{totalRevenue.toLocaleString("en-IN")}
          </h2>

          <span>
            From {sales.length} sales
          </span>
        </div>

      </div>

      {/* SECOND SECTION */}

      <div className="analytics-bottom">

        {/* COLLECTION OVERVIEW */}

        <div className="analytics-panel">

          <div className="section-heading">
            <div>
              <h2>Collection Overview</h2>
              <p>Current gallery inventory</p>
            </div>

            <Palette size={20} />
          </div>

          <div className="analytics-details">

            <div className="analytics-detail-row">
              <span>Total Artists</span>
              <strong>{artists.length}</strong>
            </div>

            <div className="analytics-detail-row">
              <span>Total Customers</span>
              <strong>{customers.length}</strong>
            </div>

            <div className="analytics-detail-row">
              <span>Available Artworks</span>
              <strong>{availableArtworks.length}</strong>
            </div>

            <div className="analytics-detail-row">
              <span>Sold Artworks</span>
              <strong>{soldArtworks.length}</strong>
            </div>

          </div>

        </div>

        {/* FINANCIAL OVERVIEW */}

        <div className="analytics-panel">

          <div className="section-heading">
            <div>
              <h2>Financial Overview</h2>
              <p>Gallery sales performance</p>
            </div>

            <TrendingUp size={20} />
          </div>

          <div className="analytics-details">

            <div className="analytics-detail-row">
              <span>Total Revenue</span>

              <strong>
                ₹{totalRevenue.toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="analytics-detail-row">
              <span>Gallery Commission</span>

              <strong>
                ₹{commission.toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="analytics-detail-row">
              <span>Average Artwork Price</span>

              <strong>
                ₹{Math.round(averageArtworkPrice).toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="analytics-detail-row">
              <span>Total Transactions</span>

              <strong>{sales.length}</strong>
            </div>

          </div>

        </div>

      </div>

      {/* MOST EXPENSIVE ARTWORK */}

      {mostExpensiveArtwork && (
        <div className="featured-analytics">

          <div>
            <p className="gallery-eyebrow">
              COLLECTION HIGHLIGHT
            </p>

            <h2>
              {mostExpensiveArtwork.title}
            </h2>

            <p>
              Highest priced artwork in your gallery
            </p>
          </div>

          <strong>
            ₹
            {Number(
              mostExpensiveArtwork.price
            ).toLocaleString("en-IN")}
          </strong>

        </div>
      )}

    </div>
  );
}

export default Analytics;