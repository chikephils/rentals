import React from "react";
import "../styles/List.scss";
import { useSelector } from "react-redux";
import ListingCard from "../components/ListingCard";
import Navbar from "../components/Navbar";

const WishList = () => {
  const wishlist = useSelector((state) => state.user?.user?.wishList);

  return (
    <>
      <Navbar />
      <h1 className="title-list">Your Wish List</h1>
      <div className="list">
        {wishlist?.length === 0 ? (
          <p className="title-list">No Listings Found</p>
        ) : (
          wishlist?.map(
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
    </>
  );
};

export default WishList;
