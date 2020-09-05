import React, { useState, useRef } from "react";
import { View, Text } from "react-native";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
import AddRestaurantForm from "../../components/Restaurants/AddRestaurantForm";

export default function AddRestaurant(props) {
  const { navigation } = props;
  const toastRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <View>
      <AddRestaurantForm
        toastRef={toastRef}
        setIsLoading={setIsLoading}
        navigation={navigation}
      ></AddRestaurantForm>
      <Toast ref={toastRef} position="center" opacitity={0.9}></Toast>
      <Loading isVisible={isLoading} text="Creando restaurante"></Loading>
    </View>
  );
}
