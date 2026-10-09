import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Artists from "./pages/Artists";
import Sales from "./pages/Sales";
import Customers from "./pages/Customers";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <BrowserRouter>

      <div className="app-layout">

        <Sidebar />

        <main className="main-content">

          <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/gallery" element={<Gallery />} />

            <Route path="/artists" element={<Artists />} />

            <Route path="/customers" element={<Customers />} />

            <Route path="/sales" element={<Sales />} />

            <Route path="/analytics" element={<Analytics />} />

          </Routes>

        </main>

      </div>

    </BrowserRouter>
  );
}

export default App;