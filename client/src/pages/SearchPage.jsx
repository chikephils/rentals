import React, { useEffect, useState } from "react";
import "../styles/List.scss";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ListingCard from "../components/ListingCard";
import axios from "axios";
import { server } from "../server";
import { setListings } from "../redux/state";
import Loader from "../components/Loader";

const SearchPage = () => {
  const [loading, setLoading] = useState(true);
  const { search } = useParams();
  const listings = useSelector((state) => state.listings);
  const dispatch = useDispatch();

  const getSearchListings = async () => {
    try {
      const response = await axios.get(`${server}/listing/search/${search}`);
      const data = await response.data;
      dispatch(setListings({ listings: data }));
      setLoading(false);
    } catch (err) {
      console.log("Search Listing Failed", err.message);
    }
  };

  useEffect(() => {
    getSearchListings();
  }, [search]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">{search}</h1>
      <div className="list">
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
    </>
  );
};

export default SearchPage;
