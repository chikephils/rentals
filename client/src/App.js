import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ListingPage from "./pages/ListingPage";
import CreateListing from "./pages/CreateListing";
import ListingDetails from "./pages/ListingDetails";
import TripList from "./pages/TripList";
import WishList from "./pages/WishList";
import PropertyList from "./pages/PropertyList";
import ReservationList from "./pages/ReservationList";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setListings } from "./redux/state";
import axios from "axios";
import { server } from "./server";

function App() {
  const [loading, setLoading] = useState(true)
  const isAuth = Boolean(useSelector((state) => state.token));
  const dispatch = useDispatch();

  const getFeedListings = async () => {
    try {
      const response = await axios.get(`${server}/listing/get-listings`);
      const data = await response.data;
      dispatch(setListings(data));
      setLoading(false)
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFeedListings();
  }, []);
  
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage loading={loading} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/all-listing" element={<ListingPage loading={loading} />} />
          <Route
            path="/create-listing"
            element={isAuth ? <CreateListing /> : <Navigate to="/login" />}
          />
          <Route path="/listing/:listingId" element={<ListingDetails />} />
          <Route
            path="/listing/category/:category"
            element={<CategoryPage />}
          />
          <Route path="/listing/search/:search" element={<SearchPage />} />
          <Route
            path="/:userId/trips"
            element={isAuth ? <TripList /> : <Navigate to="/login" />}
          />
          <Route
            path="/:userId/wishList"
            element={isAuth ? <WishList /> : <Navigate to="/login" />}
          />
          <Route
            path="/:userId/properties"
            element={isAuth ? <PropertyList /> : <Navigate to="/login" />}
          />
          <Route
            path="/:userId/reservations"
            element={isAuth ? <ReservationList /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
