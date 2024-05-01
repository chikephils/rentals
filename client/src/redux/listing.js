import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../server";

const initialState = {
  listings: [],
  loading: true,
  error: null,
};

export const getAllListings = createAsyncThunk(
  "listings/getAllListings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${server}/listing/get-listings`);
      console.log(response.data);
      return response.data.listings;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const createListing = createAsyncThunk(
  "listings/createListing",
  async (
    {
      creator,
      category,
      type,
      streetAddress,
      city,
      localGovt,
      state,
      bedroomCount,
      bathroomCount,
      amenities,
      title,
      description,
      price,
      listingPhoto,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${server}/listing/create`, {
        creator,
        category,
        type,
        streetAddress,
        city,
        localGovt,
        state,
        bedroomCount,
        bathroomCount,
        amenities,
        title,
        description,
        price,
        listingPhoto,
      });
      return response.data.listing;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const listingSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder

      .addCase(getAllListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllListings.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload;
      })
      .addCase(getAllListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.loading = false;
        state.listings.push(action.payload);
      })
      .addCase(createListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default listingSlice.reducer;
export const selectAllListings = (state) => state.listings.listings;
export const selectListingLoading = (state) => state.listings.loading;
