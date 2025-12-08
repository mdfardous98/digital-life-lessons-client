import React from "react";

import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Header/Navbar";
import Footer from "../components/layout/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow container mx-auto px-6 pt-20 pb-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
