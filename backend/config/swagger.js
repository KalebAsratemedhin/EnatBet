import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

dotenv.config();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express MongoDB API',
      version: '1.0.0',
      description: 'API documentation for Express MongoDB application',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token in format: Bearer <token>'
        }
      }
    },
    // Add global security requirement (optional but recommended)
    security: [{ bearerAuth: [] }]
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

const setupSwagger = (app) => {
  app.use('/api-docs', 
    swaggerUi.serve, 
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        persistAuthorization: true, // Saves token between page refreshes
        docExpansion: 'none',      // Cleaner UI
      }
    })
  );
  console.log('Swagger Docs available at /api-docs');
};

export default setupSwagger;