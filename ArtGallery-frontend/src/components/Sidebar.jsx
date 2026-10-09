import {
  LayoutDashboard,
  Palette,
  Users,
  ShoppingBag,
  BarChart3,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        ARTI<span>VAULT</span>
      </div>

      <div className="sidebar-section">
        <p>MAIN</p>

        <NavLink to="/" className="side-link">
          <LayoutDashboard size={19} />
          Dashboard
        </NavLink>

        <NavLink to="/gallery" className="side-link">
          <Palette size={19} />
          Gallery
        </NavLink>

        <NavLink to="/artists" className="side-link">
          <Users size={19} />
          Artists
        </NavLink>

        <NavLink to="/customers" className="side-link">
          <Users size={19} />
          Customers
        </NavLink>

        <NavLink to="/sales" className="side-link">
          <ShoppingBag size={19} />
          Sales
        </NavLink>

        <NavLink to="/analytics" className="side-link">
          <BarChart3 size={19} />
          Analytics
        </NavLink>
      </div>

      <div className="sidebar-bottom">
        <NavLink to="/settings" className="side-link">
          <Settings size={19} />
          Settings
        </NavLink>
      </div>

    </aside>
  );
}

export default Sidebar;