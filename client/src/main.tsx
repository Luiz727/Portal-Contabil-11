import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles.css"; // Novo arquivo de estilos responsivos com variáveis NIXCON
import { ThemeProvider } from "next-themes";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="light">
    <App />
  </ThemeProvider>
);
