import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

type HeaderProps = {
  toggleSidebar: () => void;
  fiscalModule?: boolean;
};

export default function Header({ toggleSidebar, fiscalModule = false }: HeaderProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const avatarUrl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Would implement search functionality here
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className="bg-white shadow-sm z-index-1">
      <div className="px-3 px-sm-4 px-lg-5 py-3 d-flex align-items-center justify-content-between">
        {fiscalModule ? (
          <div className="d-flex align-items-center">
            <Link href="/">
              <button
                type="button"
                className="btn btn-link d-flex align-items-center text-primary me-2 p-1"
              >
                <span className="material-icons">arrow_back</span>
              </button>
            </Link>
            <span className="d-flex align-items-center">
              <span className="fs-5 fw-medium">Módulo Fiscal</span>
              <span className="ms-2 badge bg-primary rounded-pill">v1.0</span>
            </span>
          </div>
        ) : (
          <>
            <div className="d-flex align-items-center d-md-none">
              <button
                type="button"
                className="btn btn-outline-primary d-flex align-items-center gap-2"
                onClick={toggleSidebar}
              >
                <span className="material-icons">menu</span>
                <span>Menu</span>
              </button>
              <div className="ms-3">
                <h1 className="fs-5 fw-medium mb-0">ContaSmart</h1>
              </div>
            </div>

            <div className="d-none d-md-flex align-items-center">
              <div className="position-relative">
                <form onSubmit={handleSearch}>
                  <div className="position-relative">
                    <span className="position-absolute top-50 start-0 translate-middle-y ms-3">
                      <span className="material-icons text-muted small">search</span>
                    </span>
                    <input
                      type="text"
                      placeholder="Buscar..."
                      className="form-control ps-5 pe-3"
                      style={{ width: '260px' }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>
              </div>
            </div>
          </>
        )}

        <div className="d-flex align-items-center gap-3">
          <button 
            type="button"
            className="btn btn-link position-relative p-1 text-body"
          >
            <span className="material-icons">notifications</span>
            <span className="position-absolute top-0 end-0 badge rounded-pill bg-danger">3</span>
          </button>

          <button 
            type="button"
            className="btn btn-link position-relative p-1 text-body"
            onClick={() => window.location.href = "/whatsapp"}
          >
            <span className="material-icons">chat</span>
            <span className="position-absolute top-0 end-0 badge rounded-pill bg-primary">5</span>
          </button>

          <div className="border-start border-light d-none d-md-block h-75 mx-2"></div>

          <div className="d-flex align-items-center d-md-none">
            <img 
              className="rounded-circle object-fit-cover"
              style={{ width: '32px', height: '32px' }}
              src={avatarUrl} 
              alt="Foto de perfil do usuário" 
            />
          </div>
        </div>
      </div>
    </header>
  );
}
