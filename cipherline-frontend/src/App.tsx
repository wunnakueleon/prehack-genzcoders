import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Bell, Lock, User } from "lucide-react";

const NAV_ITEMS = [
  {id: "vault",     label: "Vault",      path: "/vault" },
  { id: "strength",  label: "Strength",   path: "/strength" },
  { id: "breach",    label: "Breach",     path: "/breach" },
  { id: "expiry",    label: "Expiry",     path: "/expiry" },
  { id: "duplicate", label: "Duplicates", path: "/duplicates" },
];

export default function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="app-shell page-enter">
      <nav className="topnav">
        <div className="inline-flex items-center gap-3 font-mono font-semibold tracking-[0.02em] text-[18px]">
          <img src="/cipherline.png" alt="cipherline" width="20" height="20" style={{ objectFit: "contain" }} />
          <span className="hidden min-[720px]:inline">
            cipherline<span style={{ color: "var(--accent)" }}>.</span>
          </span>
        </div>
        <div className="hidden min-[1100px]:flex gap-1 ml-[18px]">
          {NAV_ITEMS.map((n) => (
            <div
              key={n.id}
              className={"nav-link " + (pathname.startsWith(n.path) ? "active" : "")}
              onClick={() => navigate(n.path)}
            >
              {n.label}
            </div>
          ))}
        </div>
        <div className="flex-1"></div>
        <button className="nav-icon-btn max-[720px]:hidden" title="Notifications">
          <Bell />
          <span className="badge" />
        </button>
        <button
          className="nav-icon-btn max-[720px]:hidden"
          title="Lock vault"
          onClick={() => navigate("/login")}
        >
          <Lock />
        </button>
        <button className="nav-icon-btn max-[720px]:hidden" title="Profile">
          <User />
        </button>
      </nav>

      <Outlet />
    </div>
  );
}
