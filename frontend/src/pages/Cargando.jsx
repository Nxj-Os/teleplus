export default function Cargando() {
  return (
    <main
      className="d-flex align-items-center justify-content-center min-vh-100 text-center"
      style={{
        background:
          "radial-gradient(circle at top, rgba(220, 53, 69, 0.14), transparent 42%), linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
      }}
    >
      <div
        className="p-4 p-md-5 rounded-4 shadow bg-white border"
        style={{ maxWidth: "420px" }}
      >
        <div
          className="spinner-border text-danger mb-4"
          role="status"
          aria-label="Cargando"
          style={{ width: "4rem", height: "4rem" }}
        >
          <span className="visually-hidden">Cargando...</span>
        </div>

        <h1 className="h3 fw-bold mb-2 text-dark">Cargando...</h1>

        <p className="mb-0 text-muted">
          Estamos preparando tu experiencia. En unos segundos estará listo.
        </p>
      </div>
    </main>
  );
}
