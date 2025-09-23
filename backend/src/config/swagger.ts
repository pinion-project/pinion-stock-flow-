import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Pinion Stock Flow API',
      version: '1.0.0',
      description: 'API documentation for Pinion Stock Flow backend',
    },
    servers: [
      { url: '/api', description: 'Base API path' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['src/routes/**/*.ts', 'src/controllers/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
