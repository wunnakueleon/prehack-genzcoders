import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div>
      <nav>Navbar</nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
