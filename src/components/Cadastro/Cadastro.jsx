import React, { useState } from "react";
import { View, Alert } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { auth } from "../../firebase/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import tw from "twrnc";

const Cadastro = ({ navigation }) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleCadastro = () => {
    createUserWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        // Atualizar o perfil do usuário com o nome
        updateProfile(userCredential.user, {
          displayName: nome,
        }).then(() => {
          navigation.navigate("Home");
        });
      })
      .catch((error) => {
        Alert.alert("Erro", error.message);
      });
  };

  return (
    <View style={tw`flex-1 justify-center items-center p-5`}>
      <Text style={tw`text-2xl font-bold mb-5`}>Cadastro</Text>
      <TextInput
        style={tw`border p-2 mb-4 w-full`}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        mode="outlined"
      />
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
      <Button mode="contained" onPress={handleCadastro}>
        Cadastrar
      </Button>
      <Button mode="contained" onPress={() => navigation.goBack()}>
        Voltar
      </Button>
    </View>
  );
};

export default Cadastro;
