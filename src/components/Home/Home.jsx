import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import axios from "axios";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const Home = () => {
  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchReceitas = async () => {
      try {
        const response = await axios.get(
          "https://www.themealdb.com/api/json/v1/1/search.php?s="
        );
        setReceitas(response.data.meals || []);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchReceitas();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`
      );
      setReceitas(response.data.meals || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const renderReceita = ({ item }) => (
    <TouchableOpacity
      style={tw`w-1/2 p-2`}
      onPress={() => navigation.navigate("DetalhesReceita", { receita: item })}
    >
      <View style={tw`bg-white rounded-lg overflow-hidden shadow-lg`}>
        <Image source={{ uri: item.strMealThumb }} style={tw`w-full h-40`} />
        <Text style={tw`p-2 text-lg font-bold text-center`}>
          {item.strMeal}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 p-4 bg-gray-100`}>
      <View style={tw`flex-row justify-between items-center mb-5`}>
        <Text style={tw`text-3xl font-bold text-orange-500`}>Dev.Receitas</Text>
        <View style={tw`flex-row`}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Perfil")}
            style={tw`mr-4`}
          >
            <Ionicons name="person-circle-outline" size={30} color="orange" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Configuracao")}>
            <Ionicons name="settings-outline" size={30} color="orange" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={tw`flex-row mb-5`}>
        <TextInput
          style={tw`flex-1 p-2 border border-gray-300 rounded-lg`}
          placeholder="Pesquisar receitas..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity
          style={tw`ml-2 p-2 bg-orange-500 rounded-lg`}
          onPress={handleSearch}
        >
          <Text style={tw`text-white`}>Buscar</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#FFA500" />
      ) : (
        <FlatList
          data={receitas}
          renderItem={renderReceita}
          keyExtractor={(item) => item.idMeal}
          numColumns={2}
          columnWrapperStyle={tw`justify-between`}
        />
      )}
    </View>
  );
};

export default Home;
