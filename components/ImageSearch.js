import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image } from 'react-native';

function ImageSearch() {
  const [img, setImg] = useState("extended family");
  const [res, setRes] = useState([]);

  const fetchRequest = async () => {
    const data = await fetch(
      `https://api.unsplash.com/search/photos?page=1&query=${img}&client_id=SwkCnhCkXTf9Ok5kviKHUg9UEeEyCCP3_yCJ9MXjZb0`
    );
    const dataJ = await data.json();
    const result = dataJ.results;
    console.log(result);
    setRes(result);
  };
  useEffect(() => {
    fetchRequest();
  }, []);

  return (
    <View>
      {res.map((result, index) => (
        <Image
          key={index}
          source={{ uri: result.urls.small }}
          style={{ width: 200, height: 200 }}
        />
      ))}
    </View>
  );
}

export default ImageSearch;
