import React, { useState } from "react";
import "../styles/Fitler.scss";

const Filter = ({ onSubmit }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      category: selectedCategory,
      type: selectedType,
      bedrooms: bedrooms || "All",
      bathrooms: bathrooms || "All",
    });
  };
  return (
    <form className="filter-form" onSubmit={handleSubmit}>
      <h2>Filter Listings</h2>
      <div className="filter-group">
        <label htmlFor="category">Category: </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Bungalow">Bungalows</option>
          <option value="Penthouse">Penthouse</option>
          <option value="Terrace">Terrace</option>
          <option value="Block of Flats">Block of Flats</option>
          <option value="Semi-Detached">Semi-Detached</option>
          <option value="Fully-Detached">Fully-Detached</option>
          <option value="Mansion">Mansion</option>
          <option value="Beach-house">Beach-house</option>
        </select>
      </div>
      <div className="filter-group">
        <label htmlFor="type">Types: </label>
        <select
          id="type"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="All">All</option>
          <option value="For Sale">For Sale</option>
          <option value="Renting">Renting</option>
          <option value="Serviced Apartment">Serviced Apartments</option>
        </select>
      </div>
      <div className="filter-group">
        <label htmlFor="bedrooms">Bedrooms:</label>
        <input
          type="number"
          id="bedrooms"
          min="0"
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
        />
      </div>
      <div className="filter-group">
        <label htmlFor="bathrooms">Bathrooms:</label>
        <input
          type="number"
          id="bathrooms"
          min="0"
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
        />
      </div>
      <button type="submit">Apply Filters</button>
    </form>
  );
};

export default Filter;
