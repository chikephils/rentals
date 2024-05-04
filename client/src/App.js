import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
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
import { useEffect } from "react";
import ScrollToTop from "./ScrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllListings } from "./redux/listing";

function App() {
  const dispatch = useDispatch();
  const isAuth = Boolean(useSelector((state) => state.user?.token));

  useEffect(() => {
    dispatch(getAllListings());
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/all-listing" element={<ListingPage />} />
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
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme="light"
        />
      </div>
    </>
  );
}

export default App;
