import React, { useEffect, useState } from "react";
import { categories } from "../Data";
import "../styles/Listings.scss";
import ListingCard from "./ListingCard";
import Loader from "./Loader";
import { useSelector } from "react-redux";

const Listings = ({ loading }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const listings = useSelector((state) => state?.listings?.listings);
  const [filteredListings, setFilteredListings] = useState([]);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredListings(listings);
    } else {
      const filtered = listings.filter(
        (listing) => listing.category === selectedCategory
      );
      setFilteredListings(filtered);
    }
  }, [selectedCategory, listings]);

  return (
    <>
      <div className="category-list">
        {categories?.map((category, index) => (
          <div
            className={`category ${
              category.label === selectedCategory ? "selected" : ""
            }`}
            key={index}
            onClick={() => setSelectedCategory(category.label)}
          >
            <div className="category_icon">{category.icon}</div>
            <p>{category.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="listings">
          {filteredListings?.length === 0 ? (
            <p className="title-list">No Listings Found</p>
          ) : (
            filteredListings?.map(
              (
                {
                  _id,
                  creator,
                  listingPhotoPaths,
                  city,
                  localGovt,
                  state,
                  category,
                  type,
                  price,
                  booking = false,
                },
                index
              ) => (
                <ListingCard
                  key={index}
                  listingId={_id}
                  creator={creator}
                  listingPhotoPaths={listingPhotoPaths}
                  city={city}
                  localGovt={localGovt}
                  state={state}
                  category={category}
                  type={type}
                  price={price}
                  booking={booking}
                />
              )
            )
          )}
        </div>
      )}
    </>
  );
};

export default Listings;
