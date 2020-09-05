import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import Loading from "../Loading";
import { validateEmail } from "../../utils/validations";
import { size, isEmpty } from "lodash"; //longitud del email
import * as firebase from "firebase";
import { useNavigation } from "@react-navigation/native";

export default function RegisterForm(props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepitePassword, setShowRepitePassword] = useState(false);
  const [formData, setformData] = useState(defaultFormValue());
  const [loading, setLoading] = useState(false);

  //recibe por props de register, el toast reference
  const { toastRef } = props;
  const navigation = useNavigation();

  const onSubmit = () => {
    if (
      isEmpty(formData.email) ||
      isEmpty(formData.password) ||
      isEmpty(formData.repitePassword)
    ) {
      toastRef.current.show("Todos los campos son obligatorios");
    } else if (!validateEmail(formData.email)) {
      toastRef.current.show("El email no es correcto");
    } else if (formData.password !== formData.repitePassword) {
      toastRef.current.show("Las contraseñas tienen que ser iguales");
    } else if (size(formData.password) < 6) {
      toastRef.current.show(
        "La contraseña tiene que tener almenos 6 carácteres"
      );
    } else {
      setLoading(true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(formData.email, formData.password)
        .then((res) => {
          setLoading(false); //pantalla de carga
          navigation.navigate("account");
        })
        .catch((err) => {
          setLoading(false); //pantalla de carga
          toastRef.current.show("El email ya está en uso, pruebe con otro");
        });
    }
  };

  const onChange = (e, type) => {
    // cada vez que cambia algo del formulario cambia el objeto donde guardamos la info
    // console.log(e.nativeEvent.text);
    // setformData({[type]: e.nativeEvent.text})
    setformData({ ...formData, [type]: e.nativeEvent.text });
  };

  return (
    <View style={styles.formContainer}>
      <Input
        placeholder="Correo Electrónico"
        containerStyle={styles.inputForm}
        onChange={(e) => {
          onChange(e, "email");
        }}
        rightIcon={
          <Icon
            type="material-community"
            name="at"
            iconStyle={styles.iconRight}
          />
        }
      />
      <Input
        placeholder="Contraseña"
        containerStyle={styles.inputForm}
        onChange={(e) => {
          onChange(e, "password");
        }}
        password={true}
        secureTextEntry={showPassword ? false : true}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={styles.iconRight}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      <Input
        placeholder="Repetir contraseña"
        containerStyle={styles.inputForm}
        onChange={(e) => {
          onChange(e, "repitePassword");
        }}
        password={true}
        secureTextEntry={showRepitePassword ? false : true}
        rightIcon={
          <Icon
            type="material-community"
            name={showRepitePassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={styles.iconRight}
            onPress={() => setShowRepitePassword(!showRepitePassword)}
          />
        }
      />
      <Button
        title="Unirse"
        containerStyle={styles.btnContainerRegister}
        buttonStyle={styles.btnRegister}
        onPress={onSubmit}
      ></Button>
      <Loading isVisible={loading} text="Creando cuenta" />
    </View>
  );
}

function defaultFormValue() {
  return {
    email: "",
    password: "",
    repitePassword: "",
  };
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  btnContainerRegister: {
    marginTop: 20,
  },
  btnRegister: {
    backgroundColor: "#00a680",
  },
  iconRight: {
    color: "#c1c1c1",
  },
});
