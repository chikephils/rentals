import React, { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server } from "../server";
import { setTripLists } from "../redux/state";
import ListingCard from "../components/ListingCard";


const TripList = () => {
  const [loading, setLoading] = useState(true);
  const tripList = useSelector((state) => state.user.tripList);
  const userId = useSelector((state) => state.user._id);
  const dispatch = useDispatch();

  const getTripList = async () => {
    try {
      const response = await axios.get(`${server}/user/${userId}/trips`);

      const data = response.data;
      console.log(data);
      dispatch(setTripLists(data));
      setLoading(false);
    } catch (err) {
      console.log("Fetch tripList failed", err.message);
    }
  };

  useEffect(() => {
    getTripList();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />

      <h1 className="title-list">Your Trip List</h1>
      <div className="list">
        {tripList?.map(
          (
            {
              listingId,
              hostId,
              startDate,
              endDate,
              totalPrice,
              booking = true,
            },
            index
          ) => (
            <ListingCard
              key={index}
              creator={hostId._id}
              listingId={listingId._id}
              startDate={startDate}
              endDate={endDate}
              totalPrice={totalPrice}
              listingPhotoPaths={listingId.listingPhotoPaths}
              city={listingId.city}
              localGovt={listingId.localGovt}
              state={listingId.state}
              category={listingId.category}
              booking={booking}
            />
          )
        )}
      </div>
      <br />
      <br />
     
    </>
  );
};

export default TripList;
