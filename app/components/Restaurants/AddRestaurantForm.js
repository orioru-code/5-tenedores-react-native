import React, { useState, useEffect } from "react";
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
import Modal from "../Modal";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import uuid from "random-uuid-v4";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

const widthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm(props) {
  const { toastRef, setIsLoading, navigation } = props;
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantAddress, setRestaurantAddress] = useState("");
  const [restaurantDescription, setRestaurantDescription] = useState("");
  const [imageSelected, setImageSelected] = useState([]);
  const [isVisibleMap, setIsVisibleMap] = useState(false);
  const [locationRestaurant, setLocationRestaurant] = useState(null);

  const addRestaurant = () => {
    if (!restaurantName || !restaurantAddress || !restaurantDescription) {
      toastRef.current.show("Todos los campos del formulario son obigatorios");
    } else if (size(imageSelected) === 0) {
      toastRef.current.show("El restaurante debe tener almenos una foto");
    } else if (!locationRestaurant) {
      toastRef.current.show("Tienes que localizar el restaurante en el mapa");
    } else {
      setIsLoading(true);
      uploadImageStorage().then((response) => {
        console.log(response);
        setIsLoading(false);
        db.collection("restaurants")
          .add({
            name: restaurantName,
            address: restaurantAddress,
            description: restaurantDescription,
            location: locationRestaurant,
            images: response,
            rating: 0,
            ratingTotal: 0,
            quantityVotinbg: 0,
            createAt: new Date(),
            createBy: firebase.auth().currentUser.uid,
          })
          .then(() => {
            setIsLoading(false);
            navigation.navigate("restaurants");
          })
          .catch(() => {
            setIsLoading(false);
            toastRef.current.show(
              "Error al subir el restaurante, intentalo más tarde"
            );
          });
      });
    }
  };

  const uploadImageStorage = async () => {
    const imageBlob = [];

    await Promise.all(
      map(imageSelected, async (image) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const ref = firebase.storage().ref("restaurants").child(uuid());
        await ref.put(blob).then(async (result) => {
          await firebase
            .storage()
            .ref(`restaurants/${result.metadata.name}`)
            .getDownloadURL()
            .then((photoUrl) => {
              imageBlob.push(photoUrl);
            });
        });
      })
    );

    return imageBlob;
  };

  return (
    <ScrollView style={styles.scrollView}>
      <ImageRestaurant imagenRestaurant={imageSelected[0]}></ImageRestaurant>
      <FormAdd
        setRestaurantName={setRestaurantName}
        setRestaurantAddress={setRestaurantAddress}
        setRestaurantDescription={setRestaurantDescription}
        setIsVisibleMap={setIsVisibleMap}
        locationRestaurant={locationRestaurant}
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
      <Map
        isVisibleMap={isVisibleMap}
        setIsVisibleMap={setIsVisibleMap}
        setLocationRestaurant={setLocationRestaurant}
        toastRef={toastRef}
      ></Map>
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
    setIsVisibleMap,
    locationRestaurant,
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
        rightIcon={{
          type: "material-community",
          name: "google-maps",
          color: locationRestaurant ? "#00a680" : "#c2c2c2",
          onPress: () => setIsVisibleMap(true),
        }}
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

function Map(props) {
  const {
    isVisibleMap,
    setIsVisibleMap,
    setLocationRestaurant,
    toastRef,
  } = props;
  const [location, setLocation] = useState(null);
  useEffect(() => {
    (async () => {
      const resultPermissions = await Permissions.askAsync(
        Permissions.LOCATION
      );
      const statusPermissions = resultPermissions.permissions.location.status;
      if (statusPermissions !== "granted") {
        toastRef.current.show(
          "Tienes que aceptar los permisos de localización",
          3000
        );
      } else {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        });
      }
    })();
  }, []);

  const confirmLocation = () => {
    setLocationRestaurant(location);
    toastRef.current.show("Localización guardada correctamente");
    setIsVisibleMap(false);
  };

  return (
    <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
      <View>
        {location && (
          <MapView
            style={styles.mapStyle}
            initialRegion={location}
            showsUserLocation={true}
            onRegionChange={(region) => setLocation(region)}
          >
            <MapView.Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
            ></MapView.Marker>
          </MapView>
        )}
        <View style={styles.viewMapBtn}>
          <Button
            title="Guardar Ubicación"
            containerStyle={styles.viewMapContainerSave}
            buttonStyle={styles.viewMapBtnSave}
            onPress={confirmLocation}
          ></Button>
          <Button
            title="Cancelar Ubicación"
            containerStyle={styles.viewMapBtnContainerCancel}
            buttonStyle={styles.viewMapBtnCancel}
            onPress={() => setIsVisibleMap(false)}
          ></Button>
        </View>
      </View>
    </Modal>
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
  mapStyle: {
    width: "100%",
    height: 550,
  },
  viewMapBtn: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  viewMapBtnContainerCancel: {
    paddingLeft: 5,
  },
  viewMapBtnCancel: {
    backgroundColor: "#a60d0d",
  },
  viewMapContainerSave: {
    paddingRight: 5,
  },
  viewMapBtnSave: {
    backgroundColor: "#00a680",
  },
});
