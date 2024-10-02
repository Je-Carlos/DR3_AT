import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
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

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
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
