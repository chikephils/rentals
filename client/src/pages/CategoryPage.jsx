import React, { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server } from "../server";
import { setListings } from "../redux/state";

const CategoryPage = () => {
  const [loading, setLoading] = useState(true);
  const { category } = useParams();
  const dispatch = useDispatch();

  const listings = useSelector((state) => state.listings);

  const getFeedListings = async () => {
    try {
      const response = await axios.get(
        `${server}/listing?category=${category}`
      );
      const data = await response.data;
      console.log(data);
      dispatch(setListings({ listings: data }));
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFeedListings();
  }, [category]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">{category} listings</h1>
      <div className="list">
        {listings.map(
          ({
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
          }) => (
            <ListingCard
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
    </>
  );
};

export default CategoryPage;
