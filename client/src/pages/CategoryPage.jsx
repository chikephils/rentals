import React, { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const CategoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [filteredList, setFilteredList] = useState();
  const { category } = useParams();

  const listings = useSelector((state) => state.listings?.listings);

  useEffect(() => {
    const filteredListings = listings.filter(
      (listing) => listing.category === category
    );
    setFilteredList(filteredListings);
    setLoading(false);
  }, []);

  return (
    <>
      <Navbar />

      <h1 className="title-list">{category} listings</h1>
      <div className="list">
        {loading && <Loader />}

        {!loading && listings?.length === 0 && (
          <p className="title-list">No Listings Found</p>
        )}

        {!loading &&
          filteredList?.length > 0 &&
          filteredList?.map(
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

export default CategoryPage;
