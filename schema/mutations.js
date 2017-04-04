import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';

import { Pokemon } from '../generated/type_definitions'
import { Pokemon as PokemonClass } from './models/pokemon'

module.exports.Mutation = {
  name: 'Mutation',
  description: 'Functions to set stuff',
  fields () {
    return {       
    }      
  }
}