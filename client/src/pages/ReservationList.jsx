import React, { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server } from "../server";
import { setReservationList } from "../redux/user";
import ListingCard from "../components/ListingCard";


const ReservationList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user?.user?._id);
  const reservationList = useSelector(
    (state) => state.user.user?.reservationList
  );

  const dispatch = useDispatch();

  const getReservationList = async () => {
    try {
      const response = await axios.get(`${server}/user/${userId}/reservations`);

      const data = response.data;
      dispatch(setReservationList(data));
      setLoading(false);
    } catch (err) {
      console.log("Fetch reservation List failed", err.message);
    }
  };

  useEffect(() => {
    getReservationList();
  }, []);

  return (
    <>
      <Navbar />

      <h1 className="title-list">Your Reservations</h1>
      <div className="list">
        {loading && <Loader />}

        {!loading && reservationList?.length === 0 && (
          <p className="title-list">No Listings Found</p>
        )}
        {!loading &&
          reservationList?.length > 0 &&
          reservationList?.map(
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
    </>
  );
};

export default ReservationList;
