import React, { useEffect, useState } from "react";
import "../styles/List.scss";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server } from "../server";
import { setPropertyLists } from "../redux/user";
import Loader from "../components/Loader";

const PropertyList = () => {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user?.user);
  const properties = user?.propertyList;

  const dispatch = useDispatch();

  const getPropertyList = async () => {
    try {
      const response = await axios.get(`${server}/user/${user._id}/properties`);
      const data = await response.data;
      dispatch(setPropertyLists(data));
      setLoading(false);
    } catch (err) {
      console.log("Fetch all properties failed", err.message);
    }
  };

  useEffect(() => {
    getPropertyList();
  }, []);

  return (
    <>
      <Navbar />

      <h1 className="title-list">Your Property List</h1>
      <div className="list">
        {loading && <Loader />}

        {!loading && properties?.length === 0 && (
          <p className="title-list">No Listings Found</p>
        )}
        {!loading &&
          properties?.length > 0 &&
          properties?.map(
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

export default PropertyList;
