import swaggerAutogen from 'swagger-autogen';
const outputFile = './swagger.json';
const endpointFiles = ['./app.mjs'];
const template = {
  host: 'localhost:9000'
};

swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointFiles, template);
