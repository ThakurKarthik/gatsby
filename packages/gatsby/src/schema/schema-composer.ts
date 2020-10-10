import { GraphQLDirective } from "graphql"
import { SchemaComposer, GraphQLJSON } from "graphql-compose"
import { getNodeInterface } from "./types/node-interface"
import { GraphQLDate } from "./types/date"
const {
  addDirectives,
  GraphQLFieldExtensionDefinition,
} = require(`./extensions`)

const removeCurrentDirectives = <T>(
  schemaComposer: SchemaComposer<T>
): void => {
  const currentDirectives = schemaComposer.getDirectives()
  currentDirectives.forEach(directive => {
    schemaComposer.removeDirective(directive)
  })
}
const addBuiltInDirectives = <T>(schemaComposer: SchemaComposer<T>): void => {
  // Workaround, mainly relevant in testing
  // See https://github.com/graphql-compose/graphql-compose/commit/70995f7f4a07996cfbe92ebf19cae5ee4fa74ea2
  // This is fixed in v7, so can be removed once we upgrade
  const { BUILT_IN_DIRECTIVES } = require(`graphql-compose/lib/SchemaComposer`)
  BUILT_IN_DIRECTIVES.forEach((directive: GraphQLDirective) => {
    schemaComposer.addDirective(directive)
  })
}

const resetAndInitDirectives = (schemaComposer): void => {
  removeCurrentDirectives(schemaComposer)
  addBuiltInDirectives(schemaComposer)
}

export const createSchemaComposer = (
  { fieldExtensions } = { fieldExtensions: GraphQLFieldExtensionDefinition }
): SchemaComposer<unknown> => {
  const schemaComposer = new SchemaComposer()
  resetAndInitDirectives(schemaComposer)
  getNodeInterface({ schemaComposer })
  schemaComposer.addAsComposer(GraphQLDate)
  schemaComposer.addAsComposer(GraphQLJSON)
  addDirectives({ schemaComposer, fieldExtensions })
  return schemaComposer
}
