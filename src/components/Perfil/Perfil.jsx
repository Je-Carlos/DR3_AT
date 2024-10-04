import React, { useState, useEffect } from "react";
import { View, Alert, StyleSheet } from "react-native";
import {
  Text,
  Button,
  Avatar,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import {
  auth,
  storage,
  firestore,
  realtimeDatabase,
} from "../../firebase/firebase"; // Certifique-se de que o caminho está correto
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref as dbRef, set, get } from "firebase/database";
import { updateProfile } from "firebase/auth";
import { useTheme as useAppTheme } from "../../context/ThemeContext"; // Certifique-se de que o caminho está correto

const Perfil = ({ navigation }) => {
  const { isDarkTheme } = useAppTheme();
  const { colors } = useTheme();
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
        await loadProfileImage(currentUser);
      }
      setLoading(false);
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

  const loadProfileImage = async (currentUser) => {
    try {
      const userDocRef = doc(firestore, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && userDoc.data().photoURL) {
        setImage(userDoc.data().photoURL);
        return;
      }

      const userDbRef = dbRef(realtimeDatabase, `users/${currentUser.uid}`);
      const userDbSnapshot = await get(userDbRef);
      if (userDbSnapshot.exists() && userDbSnapshot.val().photoURL) {
        setImage(userDbSnapshot.val().photoURL);
        return;
      }

      if (currentUser.photoURL) {
        setImage(currentUser.photoURL);
      }
    } catch (error) {
      console.error("Erro ao carregar a imagem do perfil:", error);
    }
  };

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>
        Perfil do Usuário
      </Text>
      <Avatar.Image
        size={100}
        source={image ? { uri: image } : require("../../../assets/avatar.png")}
        style={styles.avatar}
      />
      <Button mode="contained" onPress={pickImage} style={styles.button}>
        Selecionar da Galeria
      </Button>
      <Button mode="contained" onPress={takePhoto} style={styles.button}>
        Tirar Foto
      </Button>
      {user ? (
        <>
          <Text style={[styles.infoText, { color: colors.text }]}>
            Nome: {user.displayName || "N/A"}
          </Text>
          <Text style={[styles.infoText, { color: colors.text }]}>
            Email: {user.email}
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("AtualizarPerfil")}
            style={styles.button}
          >
            Atualizar Perfil
          </Button>
          <Button mode="contained" onPress={handleLogout} style={styles.button}>
            Sair
          </Button>
        </>
      ) : (
        <Text style={[styles.infoText, { color: colors.text }]}>
          Carregando...
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  avatar: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 16,
    width: "80%",
  },
  infoText: {
    fontSize: 18,
    marginBottom: 8,
  },
});

export default Perfil;
