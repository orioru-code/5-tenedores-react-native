import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-elements";
import Toast from "react-native-easy-toast";
import * as firebase from "firebase";
import Loading from "../../components/Loading";
import InfoUser from "../../components/Account/InfoUser";
import AccountOptions from "../../components/Account/AccountOptions";

export default function UserLogged() {
  const [loading, setloading] = useState(false);
  const [loadingText, setloadingText] = useState("");
  const toastRef = useRef();
  const [reloadUserInfo, setreloadUserInfo] = useState(false);
  const [userInfo, setuserInfo] = useState(null);

  useEffect(() => {
    (async () => {
      const user = await firebase.auth().currentUser;
      setuserInfo(user);
    })();
    setreloadUserInfo(false);
  }, [reloadUserInfo]);
  return (
    <View style={styles.viewUserInfo}>
      {userInfo && (
        <InfoUser
          userInfo={userInfo}
          toastRef={toastRef}
          setloading={setloading}
          setloadingText={setloadingText}
        />
      )}

      <AccountOptions
        userInfo={userInfo}
        toastRef={toastRef}
        setreloadUserInfo={setreloadUserInfo}
      ></AccountOptions>
      <Button
        title="Cerrar Sesión"
        buttonStyle={styles.btnCloseSession}
        titleStyle={styles.btnCloseSessionText}
        onPress={() => firebase.auth().signOut()}
      ></Button>
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading text={loadingText} isVisible={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  viewUserInfo: {
    minHeight: "100%",
    backgroundColor: "#f2f2f2",
  },
  btnCloseSession: {
    marginTop: 30,
    borderRadius: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e3e3e3",
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3",
    paddingBottom: 10,
    paddingTop: 10,
  },
  btnCloseSessionText: {
    color: "#00a680",
  },
});
