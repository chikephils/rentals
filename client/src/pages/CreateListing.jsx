import React, { useState } from "react";
import "../styles/CreateListing.scss";
import Navbar from "../components/Navbar";
import { categories, types, facilities } from "../Data";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import variables from "../styles/variables.scss";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IoIosImages } from "react-icons/io";
import { BiTrash } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server } from "../server";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { Nigeria } from "../Data";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { getAllListings } from "../redux/listing";

const CreateListing = () => {
  const [photos, setPhotos] = useState([]);
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [bedroomCount, setBedroomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [amenities, setAmenities] = useState([]);
  const creatorId = useSelector((state) => state.user?.user._id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const dispatch = useDispatch();

  const [formLocation, setFormLocation] = useState({
    streetAddress: "",
    state: "",
    localGovt: "",
    city: "",
  });

  const [formDescription, setFormDescription] = useState({
    title: "",
    description: "",
    price: 0,
  });

  const [selectedLocals, setSelectedLocals] = useState([]);

  const handleFormDescription = (e) => {
    const { name, value } = e.target;
    setFormDescription({
      ...formDescription,
      [name]: value,
    });
  };

  const handleChangeLocation = (e) => {
    const { name, value } = e.target;
    setFormLocation({ ...formLocation, [name]: value });

    if (name === "state") {
      const filteredLocals =
        Nigeria.find((state) => state.state.name === value)?.state.locals || [];
      setSelectedLocals(filteredLocals);
    }
  };

  const handleSelectAmenities = (facility) => {
    if (amenities.includes(facility)) {
      setAmenities((prevAmenities) =>
        prevAmenities.filter((option) => option !== facility)
      );
    } else {
      setAmenities((prev) => [...prev, facility]);
    }
  };

  const handleUploadPhotos = (e) => {
    const newPhotos = e.target.files;
    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
  };

  const handleDragPhoto = (result) => {
    if (!result.destination) return;
    const items = Array.from(photos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setPhotos(items);
  };

  const handleRemovePhoto = (indexToRemove) => {
    setPhotos((prevPhotos) =>
      prevPhotos.filter((_, index) => index !== indexToRemove)
    );
  };

  const handlePost = async (e) => {
    e.preventDefault();
    setShowLoader(true);
    setLoading(true);

    const newPhotos = [];

    // Convert images to base64 strings
    for (const photo of photos) {
      const reader = new FileReader();
      reader.readAsDataURL(photo);
      await new Promise((resolve) => {
        reader.onload = () => {
          newPhotos.push(reader.result);
          resolve();
        };
      });
    }

    try {
      const response = await axios.post(
        `${server}/listing/create`,
        {
          creator: creatorId,
          category,
          type,
          streetAddress: formLocation.streetAddress,
          city: formLocation.city,
          localGovt: formLocation.localGovt,
          state: formLocation.state,
          bedroomCount,
          bathroomCount,
          amenities,
          title: formDescription.title,
          description: formDescription.description,
          price: formDescription.price,
          listingPhotos: newPhotos, // Include base64 strings directly in the payload
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);
      if (response.status >= 200 && response.status < 300) {
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error(response.data.message);
        console.log("Failed to publish");
      }
    } catch (err) {
      toast.error(err.response.data.message);
      console.log("Publish Listing failed", err.message);
    } finally {
      setLoading(false);
      setShowLoader(false);
      dispatch(getAllListings());
    }
  };

  return (
    <>
      <Navbar />
      <div className={`create-listing`}>
        <>
          {showLoader && (
            <div className="createLoader">
              <Loader />
            </div>
          )}
        </>
        <h1>Publish your Property</h1>
        <form onSubmit={handlePost}>
          <div className="create-listing_step1">
            <h2>Step 1: Tell us about the Place</h2>
            <br />
            <h3>
              Which of these categories best describes your place for rent
            </h3>
            <div className="category-list">
              {categories?.map((item, index) => (
                <div
                  className={`category ${
                    category === item.label ? "selected" : ""
                  } `}
                  key={index}
                  onClick={() => setCategory(item.label)}
                >
                  <div className="category_icon">{item.icon}</div>
                  <p>{item.label}</p>
                </div>
              ))}
            </div>

            <h3>What type of place do you have?</h3>
            <div className="type-list">
              {types?.map((item, index) => (
                <div
                  className={`type ${type === item.name ? "selected" : ""}`}
                  key={index}
                  onClick={() => setType(item.name)}
                >
                  <div className="type_text">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                  </div>
                  <div className="type_icon">{item.icon}</div>
                </div>
              ))}
            </div>

            <h3>Where's the place located?</h3>
            <div className="full">
              <div className="location">
                <p>Street Address</p>
                <input
                  type="text"
                  placeholder="street Address"
                  name="streetAddress"
                  value={formLocation.streetAddress}
                  onChange={handleChangeLocation}
                  required
                />
              </div>
            </div>
            <div className="half">
              <div className="location">
                <p>State</p>
                <select
                  value={formLocation.state}
                  name="state"
                  onChange={handleChangeLocation}
                  required
                >
                  <option value="Select State">State</option>
                  {Nigeria &&
                    Nigeria.map((state) => (
                      <option value={state.state.name} key={state.state.id}>
                        {state.state.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="location">
                {formLocation.state !== "Select State" && (
                  <>
                    <p>Local Government Area (L.G.A)</p>
                    <select
                      value={formLocation.localGovt}
                      onChange={handleChangeLocation}
                      name="localGovt"
                    >
                      <option value="Select Local">L.G.A</option>
                      {selectedLocals.map((local) => (
                        <option value={local.name} key={local.id}>
                          {local.name}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>
            </div>
            <div className="half">
              <div className="location">
                <p>City/Town/Village</p>
                <input
                  text="text"
                  placeholder="City"
                  name="city"
                  value={formLocation.city}
                  onChange={handleChangeLocation}
                  required
                />
              </div>
            </div>

            <h3>Share some basics about the rentals</h3>
            <div className="basics">
              <div className="basic">
                <p>Bedrooms</p>
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() => {
                      bedroomCount > 1 && setBedroomCount(bedroomCount - 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                  <p>{bedroomCount}</p>
                  <AddCircleOutline
                    onClick={() => {
                      setBedroomCount(bedroomCount + 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                </div>
              </div>

              <div className="basic">
                <p>Bathrooms</p>
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() => {
                      bathroomCount > 1 && setBathroomCount(bathroomCount - 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                  <p>{bathroomCount}</p>
                  <AddCircleOutline
                    onClick={() => {
                      setBathroomCount(bathroomCount + 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="create-listing_step2">
            <h2>Step 2: Make your place stand out</h2>
            <hr />

            <h3>Tell tenants what your place has to offer</h3>
            <div className="amenities">
              {facilities?.map((item, index) => (
                <div
                  className={`facility ${
                    amenities.includes(item.name) ? "selected" : ""
                  }`}
                  key={index}
                  onClick={() => handleSelectAmenities(item.name)}
                >
                  <div className="facility_icon">{item.icon}</div>
                  <p>{item.name}</p>
                </div>
              ))}
            </div>

            <h3>Add Some photos of the place</h3>
            <DragDropContext onDragEnd={handleDragPhoto}>
              <Droppable droppableId="photos" direction="horizontal">
                {(provided) => (
                  <div
                    className="photos"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {photos.length < 1 && (
                      <>
                        <input
                          id="image"
                          type="file"
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={handleUploadPhotos}
                          multiple
                        />
                        <label htmlFor="image" className="alone">
                          <div className="icon">
                            <IoIosImages />
                          </div>
                          <p>Upload from your device</p>
                        </label>
                      </>
                    )}
                    {photos.length > 1 && (
                      <>
                        {photos.map((photo, index) => {
                          return (
                            <Draggable
                              key={index}
                              draggableId={index.toString()}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  className="photo"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <img
                                    src={URL.createObjectURL(photo)}
                                    alt="pics"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePhoto(index)}
                                  >
                                    <BiTrash />
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        <input
                          id="image"
                          type="file"
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={handleUploadPhotos}
                          multiple
                        />
                        <label htmlFor="image" className="together">
                          <div className="icon">
                            <IoIosImages />
                          </div>
                          <p>Upload from your device</p>
                        </label>
                      </>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <h3>What makes your place attractive</h3>
            <div className="description">
              <p>Title</p>
              <input
                type="text"
                placeholder="What type of property is this"
                name="title"
                onChange={handleFormDescription}
                value={formDescription.title}
                required
              />
              <p>Description</p>
              <textarea
                type="text"
                placeholder="Write some detailed description about this property"
                name="description"
                onChange={handleFormDescription}
                value={formDescription.description}
                required
              />

              <p>Price</p>
              <span>₦</span>
              <input
                type="number"
                placeholder="0"
                name="price"
                className="price"
                onChange={handleFormDescription}
                required
              />
            </div>
          </div>
          <button className="submit_btn" type="submit" disabled={loading}>
            {loading ? "CREATING..." : "CREATE YOUR LISTING"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CreateListing;
