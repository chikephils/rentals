import React, { useEffect, useState } from "react";
import { categories } from "../Data";
import "../styles/Listings.scss";
import ListingCard from "./ListingCard";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server } from "../server";
import { setListings } from "../redux/state";

const Listings = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const listings = useSelector((state) => state.listings);

  const getFeedListings = async () => {
    try {
      const response = await axios.get(
        selectedCategory !== "All"
          ? `${server}/listing?category=${selectedCategory}`
          : `${server}/listing`,
        { headers: { "Content-Type": "application/json" } }
      );
      const data = await response.data;
      dispatch(setListings({ listings: data }));
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFeedListings();
  }, [selectedCategory]);

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
          {listings?.map(
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
          )}
        </div>
      )}
    </>
  );
};

export default Listings;
