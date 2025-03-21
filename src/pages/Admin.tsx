
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import AdminPanel from "@/components/AdminPanel";

const Admin = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-muted/20">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="page-container">
          <AdminPanel />
        </div>
      </div>
    </main>
  );
};

export default Admin;
