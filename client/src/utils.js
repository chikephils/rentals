const numbersWithCommas = (value) => {
  // Convert value to a string
  const stringValue = String(value);

  // Check if the value is already formatted with commas
  if (stringValue.includes(",")) {
    return stringValue; // Return the value as is
  }
  // Format the value with commas
  return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default numbersWithCommas;
