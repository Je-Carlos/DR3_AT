import React, { useState } from "react";
import { View, Text, Switch } from "react-native";
import { Button, Provider as PaperProvider } from "react-native-paper";
import tw from "twrnc";

const GerenciarNotificacoes = ({ navigation }) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <PaperProvider>
      <View style={tw`flex-1 justify-center items-center p-5`}>
        <Text style={tw`text-3xl font-bold mb-5 text-orange-500`}>
          Gerenciar Notificações
        </Text>
        <View style={tw`flex-row items-center mb-5`}>
          <Text style={tw`text-xl mr-2`}>Notificações</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Voltar
        </Button>
      </View>
    </PaperProvider>
  );
};

export default GerenciarNotificacoes;
