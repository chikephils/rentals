import React from "react";
import Navbar from "../components/Navbar";
import Slide from "../components/Slide";
import Categories from "../components/Categories";
import Listings from "../components/Listings";
import Footer from "../components/Footer";

const HomePage = ({ loading }) => {
  return (
    <>
      <Navbar />
      <Slide />
      <Categories />
      <Listings loading={loading} />
      <Footer />
    </>
  );
};

export default HomePage;
