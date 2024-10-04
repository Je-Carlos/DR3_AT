import React, { useState } from "react";
import { View } from "react-native";
import { Text, Button, Provider as PaperProvider } from "react-native-paper";
import { lightTheme, darkTheme } from "../../theme";
import tw from "twrnc";

const Configuracao = ({ navigation }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <PaperProvider theme={isDarkTheme ? darkTheme : lightTheme}>
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
        <Button mode="contained" onPress={toggleTheme} style={tw`mt-5`}>
          Alternar para {isDarkTheme ? "Modo Claro" : "Modo Escuro"}
        </Button>
      </View>
    </PaperProvider>
  );
};

export default Configuracao;
