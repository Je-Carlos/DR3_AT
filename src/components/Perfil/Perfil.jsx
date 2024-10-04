import React, { useState, useEffect } from "react";
import { View, Text, Image, Alert } from "react-native";
import { Button } from "react-native-paper";
import { auth } from "../../firebase/firebase";
import { uploadImage, pickImage } from "../../utils/uploadImage";
import tw from "twrnc";
import * as SecureStore from "expo-secure-store";

const Perfil = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setProfileImage(currentUser.photoURL);
    }
  }, []);

  const handlePickImage = async () => {
    const uri = await pickImage();
    console.log("Imagem selecionada URI:", uri);
    if (uri) {
      try {
        const downloadURL = await uploadImage(uri, user.uid);
        console.log("Imagem carregada URL:", downloadURL);
        setProfileImage(downloadURL);
        await user.updateProfile({ photoURL: downloadURL });
        console.log("Perfil atualizado com URL da imagem:", downloadURL);
        Alert.alert("Sucesso", "Foto de perfil atualizada!");
      } catch (error) {
        Alert.alert("Erro", "Falha ao fazer upload da imagem.");
        console.error("Erro ao fazer upload da imagem:", error);
      }
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    await SecureStore.deleteItemAsync("userSession");
    navigation.navigate("Login");
  };

  return (
    <View style={tw`flex-1 justify-center items-center p-5`}>
      <Text style={tw`text-3xl font-bold mb-5 text-orange-500`}>
        Perfil do Usuário
      </Text>
      {user ? (
        <>
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={tw`w-24 h-24 rounded-full mb-4`}
            />
          ) : (
            <Text style={tw`text-xl mb-4`}>Nenhuma foto de perfil</Text>
          )}
          <Button mode="contained" onPress={handlePickImage}>
            Alterar Foto de Perfil
          </Button>
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
        <>
          <Text style={tw`text-xl mb-4`}>Nenhum usuário logado</Text>
          <Button mode="contained" onPress={() => navigation.navigate("Login")}>
            Fazer Login
          </Button>
        </>
      )}
    </View>
  );
};

export default Perfil;
