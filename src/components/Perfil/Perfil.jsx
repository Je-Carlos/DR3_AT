import React, { useState, useEffect } from "react";
import { View, Text, Image, Alert } from "react-native";
import { Button } from "react-native-paper";
import {
  auth,
  storage,
  firestore,
  realtimeDatabase,
} from "../../firebase/firebase"; // Certifique-se de que o Firebase Storage, Firestore e Realtime Database estão configurados
import tw from "twrnc";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { ref as dbRef, set } from "firebase/database";
import { updateProfile } from "firebase/auth"; // Importa a função updateProfile corretamente

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

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profilePictures/${user.uid}.png`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      Alert.alert(
        "Erro",
        `Não foi possível fazer upload da imagem. Por favor, tente novamente. Detalhes: ${error.message}`
      );
      throw error;
    }
  };

  const saveImageUrl = async (url) => {
    try {
      const userDocRef = doc(firestore, "users", user.uid);
      await setDoc(userDocRef, { photoURL: url }, { merge: true });

      const userDbRef = dbRef(realtimeDatabase, `users/${user.uid}`);
      await set(userDbRef, { photoURL: url });
    } catch (error) {
      console.error("Erro ao salvar a URL da imagem:", error);
      Alert.alert(
        "Erro",
        `Não foi possível salvar a URL da imagem. Por favor, tente novamente. Detalhes: ${error.message}`
      );
      throw error;
    }
  };

  const updateProfilePhoto = async (url) => {
    if (user) {
      try {
        await updateProfile(user, { photoURL: url });
      } catch (error) {
        console.error("Erro ao atualizar o perfil do usuário:", error);
        Alert.alert(
          "Erro",
          `Não foi possível atualizar o perfil do usuário. Por favor, tente novamente. Detalhes: ${error.message}`
        );
      }
    } else {
      console.error("Usuário não autenticado.");
      Alert.alert(
        "Erro",
        "Usuário não autenticado. Por favor, faça login novamente."
      );
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const resizedUri = await manipulateImage(result.assets[0].uri);
        const downloadURL = await uploadImage(resizedUri);
        setImage(downloadURL);
        await updateProfilePhoto(downloadURL);
        await saveImageUrl(downloadURL);
      }
    } catch (error) {
      console.error("Erro ao selecionar a imagem:", error);
    }
  };

  const takePhoto = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const resizedUri = await manipulateImage(result.assets[0].uri);
        const downloadURL = await uploadImage(resizedUri);
        setImage(downloadURL);
        await updateProfilePhoto(downloadURL);
        await saveImageUrl(downloadURL);
      }
    } catch (error) {
      console.error("Erro ao tirar a foto:", error);
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
