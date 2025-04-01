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
  },
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger Docs available at /api-docs');
};

export default setupSwagger;
