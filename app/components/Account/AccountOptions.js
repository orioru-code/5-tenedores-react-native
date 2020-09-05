import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ListItem } from "react-native-elements";
import { map } from "lodash";
import Modal from "../Modal";
import ChangeDisplayNameForm from "./ChangeDisplayNameForm";
import ChangeEmailForm from "../Account/ChangeEmailForm";
import ChanPasswordForm from "./ChangePasswordForm";
import ChangePasswordForm from "./ChangePasswordForm";

export default function AccountOptions(props) {
  const { userInfo, toastRef, setreloadUserInfo } = props;
  const [showModal, setshowModal] = useState(false);
  const [renderComponent, setrenderComponent] = useState(null);

  const selectComponent = (key) => {
    switch (key) {
      case "displayName":
        setrenderComponent(
          <ChangeDisplayNameForm
            displayName={userInfo.displayName}
            setshowModal={setshowModal}
            toastRef={toastRef}
            setreloadUserInfo={setreloadUserInfo}
          />
        );
        setshowModal(true);
        break;

      case "email":
        setrenderComponent(
          <ChangeEmailForm
            email={userInfo.email}
            setshowModal={setshowModal}
            toastRef={toastRef}
            setreloadUserInfo={setreloadUserInfo}
          />
        );

        setshowModal(true);
        break;

      case "password":
        setrenderComponent(
          <ChangePasswordForm
            setshowModal={setshowModal}
            toastRef={toastRef}
          ></ChangePasswordForm>
        );
        setshowModal(true);
        break;
      default:
        setrenderComponent(null);
        break;
    }
  };

  const menuOptions = generateOptions(selectComponent);

  return (
    <View>
      {map(menuOptions, (menu, index) => (
        <ListItem
          key={index}
          title={menu.title}
          leftIcon={{
            type: menu.iconType,
            name: menu.iconNameLeft,
            color: menu.iconColorLeft,
          }}
          rightIcon={{
            type: menu.iconType,
            name: menu.iconNameRight,
            color: menu.iconColorRight,
          }}
          containerStyle={styles.menuItem}
          onPress={menu.onPress}
        ></ListItem>
      ))}

      {renderComponent && (
        <Modal isVisible={showModal} setIsVisible={setshowModal}>
          {renderComponent}
        </Modal>
      )}
    </View>
  );
}

const generateOptions = (selectedComponent) => {
  return [
    {
      title: "Cambiar Nombre y Apellidos",
      iconType: "material-community",
      iconNameLeft: "account-circle",
      iconColorLeft: "#ccc",
      iconNameRight: "chevron-right",
      iconColorRight: "#00a680",
      onPress: () => selectedComponent("displayName"),
    },
    {
      title: "Cambiar Email",
      iconType: "material-community",
      iconNameLeft: "at",
      iconColorLeft: "#ccc",
      iconNameRight: "chevron-right",
      iconColorRight: "#00a680",
      onPress: () => selectedComponent("email"),
    },
    {
      title: "Cambiar Contraseña",
      iconType: "material-community",
      iconNameLeft: "lock-reset",
      iconColorLeft: "#ccc",
      iconNameRight: "chevron-right",
      iconColorRight: "#00a680",
      onPress: () => selectedComponent("password"),
    },
  ];
};

const styles = StyleSheet.create({
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3",
  },
});
