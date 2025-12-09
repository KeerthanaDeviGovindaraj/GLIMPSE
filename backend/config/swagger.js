// config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sports Management API',
      version: '1.0.0',
      description: 'Complete API documentation for Sports Management System',
      contact: {
        name: 'Gayatri',
        email: 'gayatri@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Sport: {
          type: 'object',
          required: ['name', 'category'],
          properties: {
            id: {
              type: 'string',
              description: 'Sport ID'
            },
            name: {
              type: 'string',
              description: 'Sport name'
            },
            category: {
              type: 'string',
              enum: ['Team Sport', 'Individual Sport', 'Water Sport', 'Combat Sport', 'Other'],
              description: 'Sport category'
            },
            description: {
              type: 'string',
              description: 'Sport description'
            },
            rulesLink: {
              type: 'string',
              description: 'Link to rules'
            },
            popularity: {
              type: 'string',
              enum: ['High', 'Medium', 'Low'],
              description: 'Popularity level'
            },
            isActive: {
              type: 'boolean',
              description: 'Active status'
            },
            createdBy: {
              type: 'string',
              description: 'Creator name'
            }
          }
        },
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            id: {
              type: 'string',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email'
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              description: 'User role'
            },
            isActive: {
              type: 'boolean',
              description: 'Account status'
            }
          }
        },
        Upload: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Upload ID'
            },
            filename: {
              type: 'string',
              description: 'Stored filename'
            },
            originalName: {
              type: 'string',
              description: 'Original filename'
            },
            mimetype: {
              type: 'string',
              description: 'File MIME type'
            },
            size: {
              type: 'number',
              description: 'File size in bytes'
            },
            uploadedBy: {
              type: 'string',
              description: 'Uploader name'
            },
            status: {
              type: 'string',
              enum: ['pending', 'processed', 'failed'],
              description: 'Processing status'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Sports Management API'
  }));

  // JSON endpoint
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('📚 Swagger docs available at http://localhost:5000/api-docs');
};

module.exports = setupSwagger;