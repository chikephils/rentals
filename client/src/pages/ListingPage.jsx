import React, { useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import "../styles/List.scss";
import { IoFilterCircle } from "react-icons/io5";
import Filter from "../components/Filter";

const ListingPage = () => {
  const [open, setisOpen] = useState(false);
  const listings = useSelector((state) => state?.listings?.listings);
  const [filteredListings, setFilteredListings] = useState(listings);

  const handleFilterSubmit = (filterParams) => {
    const { category, type, bedrooms, bathrooms } = filterParams;

    const filteredList = listings.filter((listing) => {
      let shouldInclude = true;
      if (category && category !== "All") {
        shouldInclude = shouldInclude && listing.category === category;
      }
      if (type && type !== "All") {
        shouldInclude = shouldInclude && listing.type === type;
      }
      if (bedrooms && bedrooms !== "All") {
        shouldInclude =
          shouldInclude && listing.bedroomCount === parseInt(bedrooms);
      }
      if (bathrooms && bathrooms !== "All") {
        shouldInclude =
          shouldInclude && listing.bathroomCount === parseInt(bathrooms);
      }
      return shouldInclude;
    });

    setFilteredListings(filteredList);
    setisOpen(false);
  };

  return (
    <>
      <Navbar />

      <h1 className="title-list">All Listings</h1>
      <div className="icon">
        {" "}
        <IoFilterCircle onClick={() => setisOpen(!open)} />
        {open && (
          <div>
            <Filter onSubmit={handleFilterSubmit} />
          </div>
        )}
      </div>

      <div className="list">
        {filteredListings.length === 0 ? (
          <p className="title-list">No Listings Found</p>
        ) : (
          filteredListings.map(
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
                key={_id}
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
    </>
  );
};

export default ListingPage;
