import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles.css"; // Estilos responsivos com variáveis NIXCON
import "./styles/responsive.css"; // Novo sistema de responsividade NIXCON
import "./styles/hide-scrollbar.css"; // Ocultar barras de rolagem
import { ThemeProvider } from "next-themes";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="light">
    <App />
  </ThemeProvider>
);
