import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LoginPage from "./modules/auth/LoginPage";
import SignupPage from "./modules/auth/SignupPage";
import StrengthCheckerPage from "./modules/strength-checker/StrengthCheckerPage";
import DuplicateDetectorPage from "./modules/duplicate-detector/DuplicateDetectorPage";
import ExpiryTrackerPage from "./modules/expiry-tracker/ExpiryTrackerPage";
import BreachCheckPage from "./modules/breach-check/BreachCheckPage";
import VaultPage from "./modules/vault/VaultPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "strength",   element: <StrengthCheckerPage /> },
      { path: "duplicates", element: <DuplicateDetectorPage /> },
      { path: "expiry",     element: <ExpiryTrackerPage /> },
      { path: "breach",     element: <BreachCheckPage /> },
      { path: "vault",      element: <VaultPage /> },
    ],
  },
  { path: "/login",  element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
]);

export default router;
