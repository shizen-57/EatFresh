import { db } from "../../../../firebase";
import { collection, getDocs } from "firebase/firestore";

export const getRestaurants = async () => {
  const querySnapshot = await getDocs(collection(db, "restaurants"));
  const restaurants = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    restaurants.push({
      id: doc.id,
      name: data.name,
      address: data.location.address,
      latitude: data.location.latitude,
      longitude: data.location.longitude,
      rating: data.rating,
    });
  });
  return restaurants;
};