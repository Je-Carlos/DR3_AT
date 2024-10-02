import { useState } from "react";
import { View, Alert } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { auth } from "../../firebase/firebase";
import { updateEmail, updatePassword } from "firebase/auth";
import tw from "twrnc";

const AtualizarPerfil = ({ navigation }) => {
  const user = auth.currentUser;
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdateEmail = () => {
    if (newEmail) {
      updateEmail(user, newEmail)
        .then(() => {
          Alert.alert("Sucesso", "Email atualizado com sucesso!");
        })
        .catch((error) => {
          Alert.alert("Erro", error.message);
        });
    } else {
      Alert.alert("Erro", "Por favor, insira um novo email.");
    }
  };

  const handleUpdatePassword = () => {
    if (newPassword) {
      updatePassword(user, newPassword)
        .then(() => {
          Alert.alert("Sucesso", "Senha atualizada com sucesso!");
        })
        .catch((error) => {
          Alert.alert("Erro", error.message);
        });
    } else {
      Alert.alert("Erro", "Por favor, insira uma nova senha.");
    }
  };

  return (
    <View style={tw`flex-1 justify-center items-center p-5`}>
      <Text style={tw`text-3xl font-bold mb-5 text-orange-500`}>
        Atualizar Perfil
      </Text>
      <TextInput
        style={tw`border p-2 mb-4 w-full`}
        placeholder="Novo Email"
        value={newEmail}
        onChangeText={setNewEmail}
        mode="outlined"
      />
      <Button mode="contained" onPress={handleUpdateEmail}>
        Atualizar Email
      </Button>
      <TextInput
        style={tw`border p-2 mb-4 w-full`}
        placeholder="Nova Senha"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        mode="outlined"
      />
      <Button mode="contained" onPress={handleUpdatePassword}>
        Atualizar Senha
      </Button>
      <Button mode="contained" onPress={() => navigation.goBack()}>
        Voltar
      </Button>
    </View>
  );
};

export default AtualizarPerfil;
