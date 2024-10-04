import React, { useState, useEffect } from "react";
import { View, Text, Image, Alert } from "react-native";
import { Button } from "react-native-paper";
import { auth } from "../../firebase/firebase";
import tw from "twrnc";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
// TODO: adicionar a conexão com o Firebase
const Perfil = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
      }
    };

    fetchUser();

    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (
        cameraStatus.status !== "granted" ||
        galleryStatus.status !== "granted"
      ) {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de permissão para acessar a câmera e a galeria."
        );
      }
    })();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    await SecureStore.deleteItemAsync("userSession");
    navigation.navigate("Login");
  };

  const manipulateImage = async (uri) => {
    if (typeof uri !== "string") {
      throw new TypeError("The uri argument must be a string");
    }
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 300, height: 300 } }],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );
    return manipulatedImage.uri;
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const resizedUri = await manipulateImage(result.assets[0].uri);
      setImage(resizedUri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const resizedUri = await manipulateImage(result.assets[0].uri);
      setImage(resizedUri);
    }
  };

  return (
    <View style={tw`flex-1 justify-center items-center p-5`}>
      <Text style={tw`text-3xl font-bold mb-5 text-orange-500`}>
        Perfil do Usuário
      </Text>
      {image && (
        <Image
          source={{ uri: image }}
          style={tw`w-40 h-40 rounded-full mb-5`}
        />
      )}
      {user ? (
        <>
          <Text style={tw`text-xl mb-2`}>
            Nome: {user.displayName || "N/A"}
          </Text>
          <Text style={tw`text-xl mb-2`}>Email: {user.email}</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("AtualizarPerfil")}
          >
            Atualizar Perfil
          </Button>
          <Button mode="contained" onPress={handleLogout}>
            Sair
          </Button>
        </>
      ) : (
        <Text style={tw`text-xl mb-2`}>Carregando...</Text>
      )}
      <Button mode="contained" onPress={takePhoto} style={tw`mt-5`}>
        Tirar Foto
      </Button>
      <Button mode="contained" onPress={pickImage} style={tw`mt-2`}>
        Selecionar da Galeria
      </Button>
    </View>
  );
};

export default Perfil;
