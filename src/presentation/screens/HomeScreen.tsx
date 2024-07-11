import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {FAB, Text, useTheme} from 'react-native-paper';


import {useInfiniteQuery, useQueryClient} from '@tanstack/react-query';

import {FlatList} from 'react-native-gesture-handler';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { getPokemons } from '../../actions/pokemons';
import { globalTheme } from '../../config/theme/global-thme,';
import { PokemonCard } from '../components/pokemons/PokemonCard';
import { PokeballBg } from '../components/ui/PokeballBg';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../navigator/StackNavigator';

interface Props extends StackScreenProps<RootStackParams,'HomeScreen'>{};

export const HomeScreen = ({ navigation }: Props) => {

  const {top} = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const theme = useTheme();
  //* Esta es la forma tradicional de una petición http
  // const {isLoading, data: pokemons = [] } = useQuery({
  //   queryKey: ['pokemons'],
  //   queryFn: () => getPokemons(0),
  //   staleTime: 1000 * 60 * 60, // 60 minutes
  // });

  const {isLoading, data, fetchNextPage} = useInfiniteQuery({
    queryKey: ['pokemons', 'infinite'],
    initialPageParam: 0,
    staleTime: 1000 * 60 * 60, // 60 minutes
    queryFn: async params => {
      const pokemons = await getPokemons(params.pageParam);
      pokemons.forEach(pokemon => {
        queryClient.setQueryData(['pokemon', pokemon.id], pokemon);
      });

      return pokemons;
    },
    getNextPageParam: (lastPage, pages) => pages.length,
  });

  return (
    <View style={globalTheme.globalMargin}>
      <PokeballBg style={styles.imgPosition} />

      <FlatList
        data={data?.pages.flat() ?? []}
        keyExtractor={(pokemon, index) => `${pokemon.id}-${index}`}
        numColumns={2}
        style={{paddingTop: top + 20}}
        ListHeaderComponent={() => <Text variant="displayMedium">Pokédex</Text>}
        renderItem={({item}) => <PokemonCard pokemon={item} />}
        onEndReachedThreshold={0.6}
        onEndReached={() => fetchNextPage()}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => 
          <View style={{
            paddingBottom: 40,
            flex: 1,
            justifyContent: 'center',
          }}>
            <ActivityIndicator size={30} />
          </View>
        }
      />

      <FAB 
        label="Buscar"
        style={[ globalTheme.fab, { backgroundColor: theme.colors.primary } ]}
        mode="elevated"
        color={ theme.dark ? 'black': 'white' }
        onPress={() => navigation.push('SearchScreen') }
      />

    </View>
  );
};

const styles = StyleSheet.create({
  imgPosition: {
    position: 'absolute',
    top: -100,
    right: -100,
  },
});