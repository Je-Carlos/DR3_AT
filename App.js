import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./src/components/Home/Home";
import Login from "./src/components/Login/Login";
import Cadastro from "./src/components/Cadastro/Cadastro";
import DetalhesReceita from "./src/components/DetalheReceita/DetalheReceita";
import Perfil from "./src/components/Perfil/Perfil";
import AtualizarPerfil from "./src/components/AtualizarPerfil/AtualizarPerfil";
import Configuracao from "./src/components/Configuracao/Configuracao";
import theme from "./src/theme";
import { PaperProvider } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import * as Network from "expo-network";

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState("Login");
  const [isConnected, setIsConnected] = useState(true);
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const userSession = await SecureStore.getItemAsync("userSession");
        if (userSession) {
          const user = JSON.parse(userSession);
          if (user) {
            setInitialRoute("Login");
          }
        }
      } catch (error) {
        console.error("Failed to load user session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    const checkNetworkConnection = async () => {
      try {
        const networkState = await Network.getNetworkStateAsync();
        console.log("Estado da rede:", networkState);
        setIsConnected(networkState.isConnected);
      } catch (error) {
        console.error("Erro ao verificar conexão de rede:", error);
      }
    };
    checkUserSession();
    checkNetworkConnection();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  if (!isConnected) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 18, color: "red" }}>
          Sem conexão com a internet
        </Text>
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cadastro" component={Cadastro} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="DetalheReceita" component={DetalhesReceita} />
          <Stack.Screen name="Perfil" component={Perfil} />
          <Stack.Screen name="AtualizarPerfil" component={AtualizarPerfil} />
          <Stack.Screen name="Configuracao" component={Configuracao} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
