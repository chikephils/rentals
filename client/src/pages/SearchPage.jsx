import React, { useEffect, useState } from "react";
import "../styles/List.scss";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import ListingCard from "../components/ListingCard";
import axios from "axios";
import { server } from "../server";
import Loader from "../components/Loader";

const SearchPage = () => {
  const [loading, setLoading] = useState(true);
  const { search } = useParams();
  const [searchList, setSearchList] = useState({});

  const getSearchListings = async () => {
    try {
      const response = await axios.get(`${server}/listing/search/${search}`);
      const data = await response.data;
      setSearchList(data);
      setLoading(false);
    } catch (err) {
      console.log("Search Listing Failed", err.message);
    }
  };

  useEffect(() => {
    getSearchListings();
  }, [search]);

  return (
    <>
      <Navbar />
      <h1 className="title-list">{search}</h1>

      <div className="list">
        {loading && <Loader />}

        {!loading && searchList?.length === 0 && (
          <p className="title-list">No Listings Found</p>
        )}

        {!loading &&
          searchList?.length > 0 &&
          searchList?.map(
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
