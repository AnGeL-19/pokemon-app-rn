import { pokeApi } from "../../config/api/pokeApi";
import { Pokemon } from "../../domain/pokemon";
import { PokeAPIPokemon } from "../../infrestucture/interfaces/pokeapi.interface";
import { PokemonMapper } from "../../infrestucture/mappers/pokemon.mapper";




export const getPokemonById = async(id: number): Promise<Pokemon> => {

  try {

    console.log(`petición http ${ id }`);
    
    const { data } = await pokeApi.get<PokeAPIPokemon>(`/pokemon/${id}`);

    const pokemon = await PokemonMapper.pokeApiPokemonToEntity(data);

    return pokemon;



  } catch (error) {
    throw new Error(`Error getting pokemon by id: ${id}`);
  }

}