import {Footer} from "../../components/Footer"
import { useParams } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../../components/Header'
import { Main, Container, Card, Left, Right, PokemonTypes, Stat } from "./styled";
import ball from "../../assets/big-ball-card.png";
import { ChakraProvider, Progress } from '@chakra-ui/react'
import { Spinner } from '@chakra-ui/react'
import {getTypes} from '../../utils/returnPokemonType'
import {getColors} from '../../utils/returnCardColor'
import { GlobalContext } from '../../context/GlobalContext';
import {goToErrorPage} from '../../router/coordinator'
import noImage from '../../assets/sem-imagem.png'



export const DetailsPage = () => {
  const { name } = useParams();
  const navigate = useNavigate()


  const context = useContext(GlobalContext)
  const {getInfoPokemon} = context

  const [pokemon, setPokemon] = useState({})

  const requestPokemon = async () => {
    try {
      const responsePokemon = await getInfoPokemon(name)

      if(responsePokemon === undefined){
        goToErrorPage(navigate)
      }else{
        setPokemon(responsePokemon)
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    requestPokemon()
  }, [])

  return (
    <>
      <Header isAllPokemons={true} isDetailPage={true} />
      <Main>
        <Container>
          <h1>Detalhes</h1>
          <div>
            <span>
              {pokemon.sprites === undefined? 
                <ChakraProvider>
                  <Spinner 
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='gray.700'
                    overflow='hidden'
                    size='xl'
                  />
                </ChakraProvider> : 
                pokemon.sprites?.other["official-artwork"].front_default === null? 
                <img src={noImage}/> :
                // <img src={pokemon.sprites?.other.dream_world.front_default}/>}
                <img src={pokemon.sprites?.other["official-artwork"].front_default}/>}
              </span>
            <Card color={pokemon.types != undefined && getColors(pokemon.types[0].type.name)}>
              <img src={ball} />
              <Left>
                <div className='images'>
                  <div>
                    <img src={pokemon.sprites?.front_default} />
                  </div>
                  <div>
                    <img src={pokemon.sprites?.back_default} />
                  </div>

                </div>
                <div className='base'>
                  <h3>Base Stats</h3>
                  <div>
                    <ChakraProvider>
                      <Stat>
                        <div>
                          {pokemon.stats?.map((stat) => {
                            return (<p key={stat.stat.name} >{stat.stat.name === "special-attack"? "Sp. Atk" : stat.stat.name === "special-defense"? "Sp. Def" : stat.stat.name}</p>)
                          })}
                        </div>
                        <div>
                        {pokemon.stats?.map((stat) => {
                            return (<p key={stat.stat.name} >{stat.base_stat}</p>)
                          })}
                          
                        </div>
                        <div>
                        {pokemon.stats?.map((stat) => {
                            return (<Progress key={stat.stat.name} value={stat.base_stat} width="120px" />)
                          })}
                        </div>
                      </Stat>
                    </ChakraProvider>
                  </div>
                </div>
              </Left>
              <Right>
                <div className='pokemonData'>
                  <h2>#{pokemon.id}</h2>
                  <h1>{pokemon.name}</h1>
                  <div>
                    {pokemon.types?.map((type) => {
                      // console.log(type.type.name)
                      return <img key={type.type.name} src={getTypes(type.type.name)} />
                    })}
                  </div>
                </div>
                <div className='moves'>
                  <h3>Moves:</h3>
                  {[1,2,3,4].map((item)=>{
                    return <span >
                      {pokemon.moves === undefined || pokemon.moves === null || pokemon.moves.length === 0? 
                      <ChakraProvider>
                        <Spinner 
                          thickness='4px'
                          speed='0.65s'
                          emptyColor='gray.200'
                          color='gray.700'
                          overflow='hidden'
                          size='sm'
                        />
                      </ChakraProvider> :
                      pokemon.moves != undefined && pokemon.moves[item].move.name}
                    </span>
                  })}
                </div>
              </Right>
            </Card>
          </div>
        </Container>
      </Main>
      <Footer/>
    </>
  )
}