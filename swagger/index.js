'use strict';

const rp = require('request-promise');
const {GraphQLSchema, GraphQLObjectType} = require('graphql');
const {getAllEndPoints, loadSchema} = require('./swagger');
const {createGQLObject, mapParametersToFields} = require('./type_map');

const queryFields = (swaggerPath) => {
  return loadSchema(swaggerPath).then(swaggerSchema => {
    const endpoints = getAllEndPoints(swaggerSchema);
    return getQueriesFields(endpoints, false);
  });
};

const mutationFields = (swaggerPath) => {
  return loadSchema(swaggerPath).then(swaggerSchema => {
    const endpoints = getAllEndPoints(swaggerSchema);
    return getQueriesFields(endpoints, true);
  });
};

function resolver(endpoint) {
  return (_, args, opts) => {
    const req = endpoint.request(args, {
      baseUrl: opts.GQLProxyBaseUrl
    });
    return rp(req).then(res => {
      return JSON.parse(res);
    }).catch(e => {
      throw e;
    });
  };
}

function getQueriesFields(endpoints, isMutation) {
  return Object.keys(endpoints).filter((typeName) => {
    return !!endpoints[typeName].mutation === !!isMutation;
  }).reduce((result, typeName) => {
    const endpoint = endpoints[typeName];
    const type = createGQLObject(endpoint.response, typeName, endpoint.location);
    result[typeName] = {
      type,
      description: endpoint.description,
      args: mapParametersToFields(endpoint.parameters, endpoint.location, typeName),
      resolve: resolver(endpoint)
    };
    return result;
  }, {});
}

module.exports = {
  queryFields,
  mutationFields
};