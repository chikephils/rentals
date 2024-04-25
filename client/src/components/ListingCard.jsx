import React, { useState } from "react";
import "../styles/ListingCard.scss";
import { backend_url, server } from "../server";
import {
  ArrowForwardIos,
  ArrowBackIosNew,
  Favorite,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setWishLists } from "../redux/state";

const ListingCard = ({
  listingId,
  creator,
  listingPhotoPaths,
  city,
  localGovt,
  state,
  category,
  type,
  price,
  startDate,
  endDate,
  totalPrice,
  booking,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const wishList = user?.wishList || [];
  const isLiked = wishList?.find((item) => item?._id === listingId);
  const dispatch = useDispatch();

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + listingPhotoPaths.length) % listingPhotoPaths.length
    );
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % listingPhotoPaths.length);
  };

  const patchWishList = async () => {
    if (user?._id !== creator._id) {
      const response = await axios.patch(
        `${server}/user/${user?._id}/${listingId}`
      );
      const data = await response.data;
      dispatch(setWishLists(data.wishList));
    } else {
      return;
    }
  };

  return (
    <div
      className="listing-card"
      onClick={() => navigate(`/listing/${listingId}`)}
    >
      <div className="slider-container">
        <div
          className="slider"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {listingPhotoPaths?.map((photo, index) => (
            <div key={index} className="slide">
              <img src={`${backend_url}/${photo}`} alt={`pics ${index + 1}`} />
              <div
                className="prev-button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevSlide(e);
                }}
              >
                <ArrowBackIosNew sx={{ fontSize: "15px" }} />
              </div>
              <div
                className="next-button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextSlide(e);
                }}
              >
                <ArrowForwardIos sx={{ fontSize: "15px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <h3>
        {city},{localGovt}, {state}
      </h3>
      <p>{category}</p>

      {!booking && type === "Serviced Apartment" ? (
        <>
          <p>{type}</p>
          <p>
            {" "}
            <span>₦</span> {price} per night
          </p>
        </>
      ) : (
        <>
          {type === "Serviced Apartment" && (
            <>
              <p>
                {startDate} - {endDate}
              </p>
              <p>
                <span>₦</span> {totalPrice} total
              </p>
            </>
          )}
        </>
      )}

      {type === "Renting" && (
        <>
          <p>{type}</p>
          <p>
            {" "}
            <span>₦</span> {price} per annum
          </p>
        </>
      )}
      {type === "For Sale" && (
        <>
          <p>{type}</p>
          <p>
            {" "}
            <span>₦</span> {price} Outright
          </p>
        </>
      )}

      <button
        className="favorite"
        onClick={(e) => {
          e.stopPropagation();
          patchWishList();
        }}
        disabled={!user}
      >
        {isLiked ? (
          <Favorite sx={{ color: "red" }} />
        ) : (
          <Favorite sx={{ color: "white" }} />
        )}
      </button>
    </div>
  );
};

export default ListingCard;
