import { realtimeDb, ref, onValue } from "../../../../firebase";

export const getRestaurants = () => {
  return new Promise((resolve, reject) => {
    const restaurantsRef = ref(realtimeDb, 'restaurants');
    onValue(restaurantsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const restaurants = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        resolve(restaurants);
      } else {
        reject("No data available");
      }
    }, (error) => {
      reject(error);
    });
  });
};