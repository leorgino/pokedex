import axios from "axios";
import { createContext, useEffect, useState, useCallback } from "react";
import {
  AllPokemonsResult,
  PokemonsByTypeResult,
  PokeType,
} from "../interfaces/types";

interface ContextProps {
  types: PokeType[];
  filterSelected: PokeType;
  nameToSearch: string;
  pokemonsFiltered: string[] | null;
  changeTypeSelected: (type: PokeType) => void;
  changeNameToSearch: (type: string) => void;
}

export const PokemonContext = createContext<ContextProps>({} as ContextProps);

const PokemonProvider = ({ children }: any) => {
  // const allPokemonsUrl = "https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0";
  const baseUrl = "https://pokeapi.co/api/v2/pokemon";

  const defaultState: PokeType = {
    name: "All",
    url: `${baseUrl}?limit=10000&offset=0`,
  };

  const [allPokemons, setAllPokemons] = useState(null);
  const [pokemonsFiltered, setPokemonsFiltered] = useState(null);

  const [types, setTypes] = useState([defaultState]);
  const [nameToSearch, setNameToSearch] = useState('');
  const [filterSelected, setFilterSelected] = useState(defaultState);

  const changeNameToSearch = (value: string) => {
    setNameToSearch(value)
  }

  const changeTypeSelected = async (type: PokeType) => {
    setFilterSelected(type);

    const { data } = await axios.get(type?.url!);
    const pokemons = data?.pokemon?.map(
      ({ pokemon }: PokemonsByTypeResult) => pokemon?.url
    );

    type.name !== "All"
      ? setPokemonsFiltered(pokemons)
      : setPokemonsFiltered(allPokemons);
  };

  const getPokemonsType = useCallback(async () => {
    const { data } = await axios.get("https://pokeapi.co/api/v2/type");
    setTypes(prevTypes => [...prevTypes, ...data.results]);
  }, []);

  const getAllPokemons = useCallback(async () => {
    const url = `${baseUrl}?limit=10000&offset=0`;

    try {
      const { data } = await axios.get(url);
      const pokemons = data?.results
        ?.filter((pokemon: AllPokemonsResult) => 
          nameToSearch ? pokemon.name.toLowerCase().includes(nameToSearch.toLowerCase()) : true
        )
        .map((pokemon: AllPokemonsResult) => pokemon?.url);
      setAllPokemons(pokemons);
      setPokemonsFiltered(pokemons);
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
      setAllPokemons(null);
      setPokemonsFiltered(null);
    }
  }, [nameToSearch]);

  useEffect(() => {
    getPokemonsType();
    getAllPokemons();
  }, [nameToSearch, getAllPokemons, getPokemonsType]);

  return (
    <PokemonContext.Provider
      value={{
        types,
        filterSelected,
        pokemonsFiltered,
        nameToSearch,
        changeTypeSelected,
        changeNameToSearch,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};

export default PokemonProvider;