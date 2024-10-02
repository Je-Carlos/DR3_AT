import { View } from "react-native";
import { Text, Button } from "react-native-paper";
import tw from "twrnc";

const Configuracao = ({ navigation }) => {
  return (
    <View style={tw`flex-1 justify-center items-center p-5`}>
      <Text style={tw`text-3xl font-bold mb-5 text-orange-500`}>
        Configurações
      </Text>
      <Button mode="contained" onPress={() => navigation.goBack()}>
        Voltar
      </Button>
    </View>
  );
};

export default Configuracao;
