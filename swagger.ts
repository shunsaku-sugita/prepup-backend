import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PrepUp API",
      version: "1.0.0",
      description: "API documentation for PrepUp",
    },
    servers: [
      {
        url: "https://api.prepup.ca/api/",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpecs = swaggerJSDoc(swaggerOptions);
