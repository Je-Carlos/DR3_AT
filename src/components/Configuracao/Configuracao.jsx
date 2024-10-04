import React from "react";
import { View, Text } from "react-native";
import { Button, Provider as PaperProvider } from "react-native-paper";
import tw from "twrnc";

const Configuracao = ({ navigation, isDarkTheme, toggleTheme }) => {
  return (
    <PaperProvider>
      <View style={tw`flex-1 justify-center items-center p-5`}>
        <Text
          style={tw`text-3xl font-bold mb-5 ${
            isDarkTheme ? "text-white" : "text-orange-500"
          }`}
        >
          Configurações
        </Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Voltar
        </Button>

        <Button
          mode="contained"
          onPress={() => navigation.navigate("AtualizarPerfil")}
          style={tw`mt-5`}
        >
          Atualizar Perfil
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("GerenciarNotificacoes")}
          style={tw`mt-5`}
        >
          Gerenciar Notificações
        </Button>
      </View>
    </PaperProvider>
  );
};

export default Configuracao;
