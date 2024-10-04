import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

export const uploadImage = async (uri, userId) => {
  try {
    console.log("Iniciando upload da imagem:", uri);
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `profilePictures/${userId}/${Date.now()}`);
    console.log("Referência do Storage criada:", storageRef.fullPath);
    await uploadBytes(storageRef, blob);
    console.log("Upload concluído");
    const downloadURL = await getDownloadURL(storageRef);
    console.log("URL de download obtida:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    throw error;
  }
};

import * as ImagePicker from "expo-image-picker";

export const pickImage = async () => {
  const permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (permissionResult.granted === false) {
    alert("Permissão para acessar a biblioteca de mídia é necessária!");
    return null;
  }

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  console.log("Resultado da seleção de imagem:", result);

  if (!result.canceled && result.assets && result.assets.length > 0) {
    const uri = result.assets[0].uri;
    console.log("Imagem selecionada com sucesso:", uri);
    return uri;
  } else {
    console.log("Seleção de imagem cancelada ou sem ativos");
  }
  return null;
};
