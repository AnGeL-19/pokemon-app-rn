import {useMemo, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';


import {useQuery} from '@tanstack/react-query';




import { FullScreenLoader } from '../components/ui/FullScreemLoader';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import { globalTheme } from '../../config/theme/global-thme,';
import { PokemonCard } from '../components/pokemons/PokemonCard';
import { PokeballBg } from '../components/ui/PokeballBg';
import { useDebounced } from '../hooks/useDebounced';
import { getPokemonNamesWithId } from '../../actions/pokemons/get-pokemon-names-with-id';
import { getPokemonsByIds } from '../../actions/pokemons/get-pokemons-by-ids';


export const SearchScreen = () => {
  const {top} = useSafeAreaInsets();
  const [term, setTerm] = useState('');

  const debouncedValue = useDebounced(term);

  const {isLoading, data: pokemonNameList = []} = useQuery({
    queryKey: ['pokemons', 'all'],
    queryFn: () => getPokemonNamesWithId(),
  });

  // Todo: aplicar debounce
  const pokemonNameIdList = useMemo(() => {
    // Es un número
    if (!isNaN(Number(debouncedValue))) {
      const pokemon = pokemonNameList.find(
        pokemon => pokemon.id === Number(debouncedValue),
      );
      return pokemon ? [pokemon] : [];
    }

    if (debouncedValue.length === 0) return [];
    if (debouncedValue.length < 3) return [];

    return pokemonNameList.filter(pokemon =>
      pokemon.name.includes(debouncedValue.toLocaleLowerCase()),
    );
  }, [debouncedValue]);

  const {isLoading: isLoadingPokemons, data: pokemons = []} = useQuery({
    queryKey: ['pokemons', 'by', pokemonNameIdList],
    queryFn: () =>
      getPokemonsByIds(pokemonNameIdList.map(pokemon => pokemon.id)),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <View style={[globalTheme.globalMargin, {paddingTop: top + 10, flex: 1}]}>
      <TextInput
        placeholder="Buscar Pokémon"
        mode="flat"
        autoFocus
        autoCorrect={false}
        onChangeText={setTerm}
        value={term}
      />

      {isLoadingPokemons && <ActivityIndicator style={{paddingTop: 20}} />}


      {/* <Text>{ JSON.stringify(pokemonNameIdList, null, 2) }</Text> */}

      <FlatList
        data={pokemons}
        keyExtractor={(pokemon, index) => `${pokemon.id}-${index}`}
        numColumns={2}
        style={{paddingTop: top + 20}}
        renderItem={({item}) => <PokemonCard pokemon={item} />}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={ <View style={{ height: 150 }} />}
      />

      <PokeballBg style={ style.pokeballBg }  />
    </View>
  );
};


const style = StyleSheet.create({
  pokeballBg: {
    position: 'absolute',
    bottom: -50,
    left: -100,
    opacity: 0.5,
    width: 300,
    height: 300,
    zIndex: -1
  }
})