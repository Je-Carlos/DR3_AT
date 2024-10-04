import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import Home from "./src/components/Home/Home";
import Login from "./src/components/Login/Login";
import Cadastro from "./src/components/Cadastro/Cadastro";
import DetalhesReceita from "./src/components/DetalheReceita/DetalheReceita";
import Perfil from "./src/components/Perfil/Perfil";
import AtualizarPerfil from "./src/components/AtualizarPerfil/AtualizarPerfil";
import Configuracao from "./src/components/Configuracao/Configuracao";
import GerenciarNotificacoes from "./src/components/GerenciarNotificacoes/GerenciarNotificacoes";
import {
  Provider as PaperProvider,
  adaptNavigationTheme,
} from "react-native-paper";
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import * as Network from "expo-network";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";

const { LightTheme: CombinedDefaultTheme, DarkTheme: CombinedDarkTheme } =
  adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
    materialLight: PaperDefaultTheme,
    materialDark: PaperDarkTheme,
  });

const Stack = createStackNavigator();

const Main = () => {
  const { isDarkTheme } = useTheme();
  const theme = isDarkTheme ? CombinedDarkTheme : CombinedDefaultTheme;
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
        console.error("Erro ao verificar a sessão do usuário:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const checkConnection = async () => {
      const state = await NetInfo.fetch();
      setIsConnected(state.isConnected);
    };

    checkUserSession();
    checkConnection();

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
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
      <NavigationContainer theme={theme}>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cadastro" component={Cadastro} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="DetalhesReceita" component={DetalhesReceita} />
          <Stack.Screen name="Perfil" component={Perfil} />
          <Stack.Screen name="AtualizarPerfil" component={AtualizarPerfil} />
          <Stack.Screen name="Configuracao" component={Configuracao} />
          <Stack.Screen
            name="GerenciarNotificacoes"
            component={GerenciarNotificacoes}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <Main />
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
