import { useEffect, useState } from "react";

import {
  Palette,
  Users,
  UserRound,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

import {
  getArtworks,
  getArtists,
  getCustomers,
  getSales,
} from "../services/api";

function Home() {

  const [artworks, setArtworks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sales, setSales] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadDashboard() {

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

        console.error("Dashboard error:", error);

      } finally {

        setLoading(false);

      }
    }

    loadDashboard();

  }, []);

  const totalSales = sales.reduce(
    (total, sale) => total + sale.salePrice,
    0
  );

  const commission = totalSales * 0.10;

  if (loading) {
    return (
      <div className="dashboard">
        <h1>Loading dashboard...</h1>
      </div>
    );
  }

  return (

    <div className="dashboard">

      <div className="dashboard-header">

        <div>

          <h1>
            Good evening 👋
          </h1>

          <p>
            Here's what's happening in your gallery today.
          </p>

        </div>

        <div className="dashboard-date">
          ARTIVAULT
        </div>

      </div>


      {/* STAT CARDS */}

      <div className="dashboard-stats">

        <div className="stat-card">

          <Palette size={22} />

          <p>Total Artworks</p>

          <h2>
            {artworks.length}
          </h2>

          <span>
            In your collection
          </span>

        </div>


        <div className="stat-card">

          <Users size={22} />

          <p>Total Artists</p>

          <h2>
            {artists.length}
          </h2>

          <span>
            Registered artists
          </span>

        </div>


        <div className="stat-card">

          <UserRound size={22} />

          <p>Total Customers</p>

          <h2>
            {customers.length}
          </h2>

          <span>
            Registered collectors
          </span>

        </div>


        <div className="stat-card">

          <ShoppingBag size={22} />

          <p>Total Sales</p>

          <h2>
            ₹{totalSales.toLocaleString("en-IN")}
          </h2>

          <span>
            {sales.length} transactions
          </span>

        </div>

      </div>


      {/* SECOND ROW */}

      <div className="dashboard-bottom">

        <div className="recent-sales">

          <div className="section-heading">

            <div>
              <h2>Recent Sales</h2>
              <p>Latest artwork transactions</p>
            </div>

            <ShoppingBag size={20} />

          </div>


          {sales.length === 0 ? (

            <p className="empty-state">
              No sales recorded yet.
            </p>

          ) : (

            <div className="sales-list">

              {sales.slice(-5).reverse().map((sale) => (

                <div
                  className="sale-row"
                  key={sale.saleId}
                >

                  <div>

                    <h3>
                      {sale.artwork}
                    </h3>

                    <p>
                      {sale.artist} • {sale.customer}
                    </p>

                  </div>

                  <strong>
                    ₹{sale.salePrice.toLocaleString("en-IN")}
                  </strong>

                </div>

              ))}

            </div>

          )}

        </div>


        <div className="commission-card">

          <TrendingUp size={24} />

          <p>Gallery Commission</p>

          <h2>
            ₹{commission.toLocaleString("en-IN")}
          </h2>

          <span>
            Calculated at 10%
          </span>

        </div>

      </div>

    </div>

  );
}

export default Home;