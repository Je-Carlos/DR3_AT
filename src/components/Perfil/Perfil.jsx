import { View } from "react-native";
import { Text, Button } from "react-native-paper";
import { auth } from "../../firebase/firebase";
import tw from "twrnc";

const Perfil = ({ navigation }) => {
  const user = auth.currentUser;

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigation.navigate("Login");
    });
  };

  return (
    <View style={tw`flex-1 justify-center items-center p-5`}>
      <Text style={tw`text-3xl font-bold mb-5 text-orange-500`}>
        Perfil do Usuário
      </Text>
      {user ? (
        <>
          <Text style={tw`text-xl mb-2`}>
            Nome: {user.displayName || "N/A"}
          </Text>
          <Text style={tw`text-xl mb-2`}>Email: {user.email}</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("AtualizarPerfil")}
          >
            Atualizar Perfil
          </Button>
          <Button mode="contained" onPress={handleLogout}>
            Sair
          </Button>
        </>
      ) : (
        <Text style={tw`text-xl`}>Nenhum usuário logado</Text>
      )}
    </View>
  );
};

export default Perfil;
