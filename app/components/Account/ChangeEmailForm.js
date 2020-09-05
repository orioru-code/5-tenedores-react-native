import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button } from "react-native-elements";
import { validateEmail } from "../../utils/validations";
import { reauthenticate } from "../../utils/api";
import * as firebase from "firebase";

export default function ChangeEmailForm(props) {
  const { email, setshowModal, toastRef, setreloadUserInfo } = props;
  const [formData, setformData] = useState(defaultValue());
  const [showPassword, setshowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setisLoading] = useState(false);

  const onChange = (e, type) => {
    setformData({ ...formData, [type]: e.nativeEvent.text });
  };

  const onSubmit = () => {
    setErrors({});
    if (!formData.email || email === formData.email) {
      setErrors({
        email: "El email no ha cambiado",
      });
    } else if (!validateEmail(formData.email)) {
      setErrors({
        email: "Email incorrecto",
      });
    } else if (!formData.password) {
      setErrors({
        password: "La contraseña no puede estar vacia",
      });
    } else {
      setisLoading(true);
      reauthenticate(formData.password)
        .then(() => {
          firebase
            .auth()
            .currentUser.updateEmail(formData.email)
            .then(() => {
              setisLoading(false);
              setreloadUserInfo(true);
              toastRef.current.show("Email actualizado correctamente");
              setshowModal(false);
            })
            .catch(() => {
              setErrors({ error: "Error al actualizar el email" });
              setisLoading(false);
            });
        })
        .catch(() => {
          setisLoading(true);
          setErrors({
            password: "La contraseña no es correcta",
          });
        });
    }
  };
  return (
    <View style={styles.view}>
      <Input
        placeholder="Correo electrónico"
        containerStyle={styles.input}
        defaultValue={email || ""}
        rightIcon={{
          type: "material-community",
          name: "at",
          color: "#c2c2c2",
        }}
        onChange={(e) => onChange(e, "email")}
        errorMessage={errors.email}
      ></Input>
      <Input
        placeholder="Contraseña"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={showPassword ? false : true}
        rightIcon={{
          type: "material-community",
          name: showPassword ? "eye-off-outline" : "eye-outline",
          color: "#c2c2c2",
          onPress: () => setshowPassword(!showPassword),
        }}
        onChange={(e) => onChange(e, "password")}
        errorMessage={errors.password}
      ></Input>
      <Button
        title="Cambiar Email"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={onSubmit}
        laoding={isLoading}
      ></Button>
    </View>
  );
}

function defaultValue() {
  return {
    email: "",
    password: "",
  };
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
  btn: {
    backgroundColor: "#00a680",
  },
});
