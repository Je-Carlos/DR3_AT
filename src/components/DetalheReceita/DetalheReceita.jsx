import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import tw from "twrnc";

const DetalhesReceita = ({ route }) => {
  const { receita } = route.params;

  return (
    <ScrollView style={tw`flex-1 p-4 bg-gray-100`}>
      <Image source={{ uri: receita.strMealThumb }} style={tw`w-full h-60`} />
      <Text style={tw`text-3xl font-bold my-4 text-center text-orange-500`}>
        {receita.strMeal}
      </Text>
      <Text style={tw`text-lg font-bold mb-2`}>
        Categoria: {receita.strCategory}
      </Text>
      <Text style={tw`text-lg font-bold mb-2`}>Área: {receita.strArea}</Text>
      <Text style={tw`text-lg font-bold mb-2`}>Instruções:</Text>
      <Text style={tw`text-base mb-4`}>{receita.strInstructions}</Text>
    </ScrollView>
  );
};

export default DetalhesReceita;
