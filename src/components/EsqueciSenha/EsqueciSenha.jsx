import { useState } from "react";
import { View, Text, TextInput, Button, Alert, Modal } from "react-native";
import { auth } from "../../firebase/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import tw from "twrnc";

const EsqueciSenha = ({ modalVisible, setModalVisible }) => {
  const [email, setEmail] = useState("");

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert("Sucesso", "Email de redefinição de senha enviado!");
        setModaalVisible(false);
      })
      .catch((error) => {
        Alert.alert("Erro", error.message);
      });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View
        style={tw`flex-1 justify-center items-center bg-gray-800 bg-opacity-50`}
      >
        <View style={tw`bg-white rounded-lg p-6 w-11/12`}>
          <Text style={tw`text-2xl font-bold mb-5`}>Redefinir Senha</Text>
          <TextInput
            style={tw`border p-2 mb-4 w-full`}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Button title="Enviar Email" onPress={handleResetPassword} />
          <Button title="Cancelar" onPress={() => setModalVisible(false)} />
        </View>
      </View>
    </Modal>
  );
};

export default EsqueciSenha;
