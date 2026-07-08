import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Popularsets from "./components/Popularsets";
import Philosophy from "./components/Philosophy";
import Subscribe from "./components/Subscribe";
import Footer from "./components/Footer";

import Minifigures from "./pages/Minifigures";
import Sets from "./pages/Sets";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SearchCatalog from "./pages/SearchCatalog";
import SearchResults from "./pages/SearchResults";
import SetDetails from "./pages/SetDetails";
import MinifigureDetails from "./pages/MinifigureDetails";
import RequestSource from "./pages/RequestSource";
import Cart from "./pages/Cart";
import ShopSetDetails from "./pages/ShopSetDetails";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

function HomePage() {
  return (
    <>
      <Hero />
      <Popularsets />
      <Philosophy />
      <Subscribe />
      <Footer />
    </>
  );
}

function App() {
  return (
    <>
      <Navbar />

      <div className="pt-24">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/sets" element={<Sets />} />
          <Route path="/sets/:id" element={<ShopSetDetails />} />
          <Route path="/minifigures" element={<Minifigures />} />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/catalog/search" element={<SearchCatalog />} />
          <Route path="/catalog/results" element={<SearchResults />} />
          <Route path="/catalog/set/:setNum" element={<SetDetails />} />
          <Route path="/catalog/minifig/:figNum" element={<MinifigureDetails />} />
          <Route path="/catalog/request" element={<RequestSource />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;