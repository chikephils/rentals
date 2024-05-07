import React, { useEffect, useState } from "react";
import "../styles/ListingDetails.scss";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../server";
import { facilities } from "../Data";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import numbersWithCommas from "../utils";

const ListingDetails = () => {
  const [loading, setLoading] = useState(true);
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const customerId = useSelector((state) => state?.user?.user?._id);
  const customer = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();
  const editedPrice = numbersWithCommas(listing?.price);

  const getListingDetails = async () => {
    try {
      const response = await axios.get(`${server}/listing/${listingId}`);

      const data = await response.data;
      setListing(data);
      setLoading(false);
    } catch (error) {
      console.log("Fetch Listing Details Failed", error.message);
    }
  };

  useEffect(() => {
    getListingDetails();
  }, []);

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  console.log(listing);

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const start = new Date(dateRange[0].startDate);
  const end = new Date(dateRange[0].endDate);
  const dayCount = Math.round(end - start) / (1000 * 60 * 60 * 24);
  const editedTotalPrice = listing?.price * dayCount;
  const bookingTotal = numbersWithCommas(editedTotalPrice);

  const handleSubmit = async () => {
    if (!customer) {
      toast.info("Please Login to continue");
    }
    try {
      const bookingForm = {
        customerId,
        listingId,
        hostId: listing.creator._id,
        startDate: dateRange[0].startDate.toDateString(),
        endDate: dateRange[0].endDate.toDateString(),
        totalPrice: listing.price * dayCount,
      };

      const response = await axios.post(
        `${server}/booking/create`,
        bookingForm
      );
      if (response.status >= 200 && response.status < 300) {
        navigate(`/${customerId}/trips`);
      }
    } catch (err) {
      console.log("Submit Booking failed.", err.message);
    }
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <Loader />
      ) : (
        <div className="listing-details">
          <div className="title">
            <h1>{listing.title}</h1>
          </div>

          <div className="photos">
            {listing.listingPhotoPaths?.map((item, index) => (
              <img src={`${item.url}`} alt="pics" key={index} />
            ))}
          </div>
          <h2>
            {listing.type} in {listing.localGovt}, {listing.state}
          </h2>
          <p>
            {listing.bedroomCount} bedrooms - {listing.bathroomCount}{" "}
            bathroom(s)
          </p>
          <hr />
          <div className="profile">
            <img
              src={`${listing.creator?.profileImagePath?.url}`}
              alt="profileImg"
            />
            <h3>
              Hosted by {listing.creator?.firstName} {listing.creator?.lastName}
            </h3>
          </div>
          <hr />
          <h3>Description</h3>
          <p>{listing.description}</p>

          <div className="booking">
            <div>
              <h2>What this place offers?</h2>
              <div className="amenities">
                {listing.amenities.map((amenity, index) => (
                  <div className="facility" key={index}>
                    <div className="facility_icon">
                      {
                        facilities.find((facility) => facility.name === amenity)
                          ?.icon
                      }
                    </div>
                    <p>{amenity}</p>
                  </div>
                ))}
              </div>
            </div>

            <>
              {listing.type === "Serviced Apartment" &&
                listing?.creator._id !== customerId &&
                customer && (
                  <div>
                    <h2>How long are you Renting?</h2>
                    <div className="date-range-calendar">
                      <DateRange
                        ranges={dateRange}
                        onChange={handleSelect}
                        className="picker"
                        direction="horizontal"
                      />
                      {dayCount > 1 && (
                        <h3>
                          ₦{editedPrice} x {dayCount} nights
                        </h3>
                      )}
                      {dayCount === 1 && (
                        <h3>
                          ₦{editedPrice} x {dayCount} night
                        </h3>
                      )}
                      <h3>Total price: ₦{bookingTotal}</h3>
                      <p>Start Date: {dateRange[0].startDate.toDateString()}</p>
                      <p>End Date: {dateRange[0].endDate.toDateString()}</p>
                      <button
                        className="button"
                        type="submit"
                        onClick={handleSubmit}
                      >
                        BOOKING
                      </button>
                    </div>
                  </div>
                )}

              {listing.type === "Renting" && (
                <div>
                  <h3>Total price: ₦{editedPrice} per Annum</h3>
                </div>
              )}
              {listing.type === "For Sale" && (
                <div>
                  <h3>Total price: ₦{editedPrice} Outright</h3>
                </div>
              )}
            </>
          </div>
        </div>
      )}
      <br />
      <br />
      <Footer />
    </>
  );
};

export default ListingDetails;
