import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  Dimensions,
  Text,
} from "react-native";
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { map, size, filter } from "lodash";

const widthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm(props) {
  const { toastRef, setIsLoading, navigation } = props;
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantAddress, setRestaurantAddress] = useState("");
  const [restaurantDescription, setRestaurantDescription] = useState("");
  const [imageSelected, setImageSelected] = useState([]);

  const addRestaurant = () => {
    console.log("OK");
    console.log(restaurantName);
    console.log(restaurantAddress);
    console.log(restaurantDescription);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <ImageRestaurant imagenRestaurant={imageSelected[0]}></ImageRestaurant>
      <FormAdd
        setRestaurantName={setRestaurantName}
        setRestaurantAddress={setRestaurantAddress}
        setRestaurantDescription={setRestaurantDescription}
      ></FormAdd>

      <UploadImage
        toastRef={toastRef}
        setImageSelected={setImageSelected}
        imageSelected={imageSelected}
      ></UploadImage>

      <Button
        title="Crear Restaurante"
        onPress={addRestaurant}
        buttonStyle={styles.btnAddRestaurant}
      ></Button>
    </ScrollView>
  );
}
function ImageRestaurant(props) {
  const { imagenRestaurant } = props;

  return (
    <View style={styles.viewPhoto}>
      <Image
        source={
          imagenRestaurant
            ? { uri: imagenRestaurant }
            : require("../../../assets/img/no-image.png")
        }
        style={{ width: widthScreen, height: 200 }}
      ></Image>
    </View>
  );
}

function FormAdd(props) {
  const {
    setRestaurantName,
    setRestaurantAddress,
    setRestaurantDescription,
  } = props;
  return (
    <View style={styles.viewForm}>
      <Input
        placeholder="Nombre del restaurante"
        containerStyle={styles.input}
        onChange={(e) => setRestaurantName(e.nativeEvent.text)}
      ></Input>

      <Input
        placeholder="Dirección"
        containerStyle={styles.input}
        onChange={(e) => setRestaurantAddress(e.nativeEvent.text)}
      ></Input>

      <Input
        placeholder="Descripción del restaurante"
        multiline={true}
        inputContainerStyle={styles.textArea}
        onChange={(e) => setRestaurantDescription(e.nativeEvent.text)}
      ></Input>
    </View>
  );
}

function UploadImage(props) {
  const { toastRef, setImageSelected, imageSelected } = props;

  const imageSelect = async () => {
    const resultPermissions = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    if (resultPermissions === "denied") {
      toastRef.current.show(
        "Es necesario aceptar los permisos de galeria",
        3000
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (result.cancelled) {
        toastRef.current.show(
          "Has cerrado la galeria sin seleccionar ninguina imagen",
          2000
        );
      } else {
        setImageSelected(result.uri);
        setImageSelected([...imageSelected, result.uri]);
      }
    }
  };

  const removeImage = (image) => {
    Alert.alert(
      "Eliminar imagen",
      "Estás seguro de que quieres eliminar la imagen?",
      [
        { text: "cancel", style: "cancel" },
        {
          text: "Eliminar",
          onPress: () => {
            setImageSelected(
              filter(imageSelected, (imageUrl) => imageUrl !== image)
            );
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.viewImage}>
      {size(imageSelected) < 5 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIcon}
          onPress={imageSelect}
        ></Icon>
      )}

      {map(imageSelected, (imageRestaurant, index) => (
        <Avatar
          key={index}
          style={styles.miniatureStyle}
          source={{ uri: imageRestaurant }}
          onPress={() => removeImage(imageRestaurant)}
        ></Avatar>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    height: "100%",
  },
  viewForm: {
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    width: "100%",
    padding: 0,
    margin: 0,
  },
  btnAddRestaurant: {
    backgroundColor: "#00a680",
    margin: 20,
  },
  viewImage: {
    flexDirection: "row",
    marginLeft: 20,
    marginTop: 30,
    marginRight: 20,
  },
  containerIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: "#e3e3e3",
  },
  miniatureStyle: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  viewPhoto: {
    alignItems: "center",
    height: 200,
    marginBottom: 20,
  },
});
