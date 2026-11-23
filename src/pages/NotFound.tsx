import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  useEffect(() => { console.error("404 Error:", location.pathname); }, [location.pathname]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">404</p>
        <h1 className="mb-4 text-4xl font-bold">Page not found</h1>
        <p className="mb-4 text-xl text-muted-foreground">This address is not a page on Athena Web Studio.</p>
        <a href="/" className="text-primary underline hover:text-primary/90">Return to Home</a>
      </div>
    </div>
  );
};

export default NotFound;
