import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import tw from "twrnc";

const DetalhesReceita = ({ route }) => {
  const { idMeal } = route.params;
  const [receita, setReceita] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceita = async () => {
      try {
        const response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
        );
        setReceita(response.data.meals[0]);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchReceita();
  }, [idMeal]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={tw`p-5`}>
      <Text style={tw`text-2xl font-bold mb-5`}>{receita.strMeal}</Text>
      <Image
        source={{ uri: receita.strMealThumb }}
        style={tw`w-full h-60 mb-5`}
      />
      <Text style={tw`text-lg font-bold mb-2`}>Instruções:</Text>
      <Text style={tw`text-base`}>{receita.strInstructions}</Text>
    </ScrollView>
  );
};

export default DetalhesReceita;
