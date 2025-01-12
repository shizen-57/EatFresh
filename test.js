import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { firebase } from './firebaseConfig'; // Import Firebase config

const App = () => {
  const [restaurants, setRestaurants] = useState(null);

  // Function to fetch data from Firebase
  const fetchData = () => {
    const reference = firebase.database().ref('restaurants'); // Reference to 'restaurants' node in Firebase
    reference.once('value', snapshot => {
      const data = snapshot.val(); // Get the data from Firebase
      console.log(data); // Log the fetched data
      setRestaurants(data); // Set the fetched data in the state
    });
  };

  useEffect(() => {
    fetchData(); // Call fetchData when the component mounts
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Fetch Data from Firebase" onPress={fetchData} />
      <Text>Restaurants Data:</Text>
      <Text>{JSON.stringify(restaurants, null, 2)}</Text>
    </View>
  );
};

export default App;
