import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Superstores from "./Superstores";
import Employees from "./Employees";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Superstores />
  </StrictMode>,
);
