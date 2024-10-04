import React, { useState } from "react";
import { View, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { auth } from "../../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import EsqueciSenha from "../EsqueciSenha/EsqueciSenha";
import * as SecureStore from "expo-secure-store";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        senha
      );
      const user = userCredential.user;
      await SecureStore.setItemAsync("userSession", JSON.stringify(user));
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Erro", "Falha na autenticação. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        style={styles.input}
        secureTextEntry
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          Entrar
        </Button>
      )}
      <Button
        onPress={() => navigation.navigate("Cadastro")}
        style={styles.link}
      >
        Não tem uma conta? Cadastre-se
      </Button>
      <Button onPress={() => setModalVisible(true)} style={styles.link}>
        Esqueci minha senha
      </Button>
      <EsqueciSenha
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 16,
  },
  link: {
    marginBottom: 8,
  },
});

export default Login;
