import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";

export default function ChangeDisplayNameForm(props) {
  const { displayName, setshowModal, toastRef, setreloadUserInfo } = props;
  const [newDisplayName, setnewDisplayName] = useState(null);
  const [isLoading, setisLoading] = useState(false);

  const [error, setError] = useState(null);
  const onSubmit = () => {
    setError(null);
    if (!newDisplayName) {
      setError("El nombre no puede estar vacio");
    } else if (displayName === newDisplayName) {
      setError("El nombre no puede ser igual al actual");
    } else {
      setisLoading(true);
      const update = {
        displayName: newDisplayName,
      };
      firebase
        .auth()
        .currentUser.updateProfile(update)
        .then(() => {
          setisLoading(false);
          setreloadUserInfo(true);
          setshowModal(false);
        })
        .catch(() => {
          setError("Error al actualizar el nombre");
          setisLoading(false);
        });
    }
  };

  return (
    <View style={styles.view}>
      <Input
        placeholder="Nombre y apellidos"
        containerStyle={styles.input}
        rightIcon={{
          type: "material-community",
          name: "account-circle-outline",
          color: "#c2c2c2",
        }}
        defaultValue={displayName || ""}
        onChange={(e) => {
          setnewDisplayName(e.nativeEvent.text);
        }}
        errorMessage={error}
      ></Input>
      <Button
        title="Cambiar nombre"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btnStyle}
        onPress={onSubmit}
        loading={isLoading}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  btnContainer: {
    marginTop: 20,
    width: "95%",
  },
  btnStyle: {
    backgroundColor: "#00a680",
  },
});
