import { useState } from "react";
import { View, Alert } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { auth } from "../../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import tw from "twrnc";
import EsqueciSenha from "../EsqueciSenha/EsqueciSenha";
import * as SecureStore from "expo-secure-store";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, senha)
      .then(async (userCredential) => {
        await SecureStore.setItemAsync(
          "userSession",
          JSON.stringify(userCredential.user)
        );
        navigation.navigate("Home");
      })
      .catch((error) => {
        Alert.alert("Erro", error.message);
      });
  };

  return (
    <View style={tw`flex-1 justify-center items-center p-5`}>
      <Text style={tw`text-3xl font-bold mb-5 text-orange-500`}>
        Dev.Receitas
      </Text>
      <Text style={tw`text-2xl font-bold mb-5`}>Login</Text>
      <TextInput
        style={tw`border p-2 mb-4 w-full`}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
      />
      <TextInput
        style={tw`border p-2 mb-4 w-full`}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        mode="outlined"
      />
      <Button mode="contained" onPress={handleLogin}>
        Entrar
      </Button>
      <Button mode="contained" onPress={() => navigation.navigate("Cadastro")}>
        Cadastrar
      </Button>
      <Button mode="contained" onPress={() => setModalVisible(true)}>
        Esqueci minha senha
      </Button>
      <EsqueciSenha
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
};

export default Login;
