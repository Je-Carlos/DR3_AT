import { useState, useEffect } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import axios from "axios";
import tw from "twrnc";

export default function Home({ navigation }) {
  const [receitas, setReceitas] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceitas = async () => {
      try {
        const response = await axios.get(
          "https://www.themealdb.com/api/json/v1/1/search.php?s="
        );
        setReceitas(response.data.meals);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchReceitas();
  }, []);

  const filtrarReceitas = (text) => {
    setBusca(text);
    if (text) {
      const receitasFiltradas = receitas.filter((receita) =>
        receita.strMeal.toLowerCase().includes(text.toLowerCase())
      );
      setReceitas(receitasFiltradas);
    } else {
      setLoading(true);
      axios
        .get("https://www.themealdb.com/api/json/v1/1/search.php?s=")
        .then((response) => {
          setReceitas(response.data.meals);
          setLoading(false);
        });
    }
  };

  return (
    <View style={tw`flex-1 justify-center items-center p-5`}>
      <Text style={tw`text-2xl font-bold mb-5`}>Receitas Deliciosas</Text>
      <TextInput
        style={tw`border p-2 mb-4 w-full`}
        placeholder="Buscar Receita"
        value={busca}
        onChangeText={(text) => filtrarReceitas(text)}
        mode="outlined"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={receitas}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("DetalheReceita", { idMeal: item.idMeal })
              }
            >
              <Text style={tw`bg-gray-200 p-3 my-2 rounded w-full text-center`}>
                {item.strMeal}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
      <Button mode="contained" onPress={() => navigation.navigate("Perfil")}>
        Perfil
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("Configuracao")}
      >
        Configurações
      </Button>
    </View>
  );
}
