import React from "react";
import { categories } from "../Data";
import { Link } from "react-router-dom";
import "../styles/Categories.scss";

const Categories = () => {
  return (
    <div className="categories">
      <h1>Explore Top Categories</h1>
      <p>
        Explore our wide range of home rentals that carter to all types of home
        seekers, Immerse yourself in the local culture, enjoy the comforts of
        home, and create unforgettable memories in your dream home.
      </p>

      <div className="categories_list">
        {categories?.slice(1, 7).map((category, index) => (
          <Link to={`/listing/category/${category.label}`} key={index}>
            <div className="category" key={index}>
              <img src={category.img} alt={category.label} />
              <div className="overlay"></div>
              <div className="category_text">
                <div className="category_text_icon">{category.icon}</div>
                <p>{category.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
