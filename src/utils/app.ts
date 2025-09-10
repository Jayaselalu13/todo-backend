import express from 'express';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import routes from '../routes';
import { VercelRequest, VercelResponse } from '@vercel/node';

type SwaggerRequest = {
  headers: Record<string, string>;
  method?: string;
  url?: string;
};

const { todosRouter } = routes;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Web Programming Hack - Todo API',
      version: '1.0.0',
      description: 'API documentation for managing todos',
    },
    tags: [
      {
        name: 'Todos',
        description: 'Operations related to todo items',
      },
    ],
    components: {
      schemas: {
        Todo: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'The unique ID of the todo' },
            title: { type: 'string', description: 'The title of the todo' },
            completed: {
              type: 'boolean',
              description: 'Whether the todo is completed',
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'The date associated with the todo',
            },
            priority: {
              type: 'string',
              enum: ['LOW', 'MEDIUM', 'HIGH'],
              description: 'The priority of the todo',
            },
          },
          required: ['id', 'title', 'completed', 'date', 'priority'],
        },
        NewTodo: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'The title of the todo' },
            completed: {
              type: 'boolean',
              default: false,
              description: 'Whether the todo is completed',
            },
            date: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Optional due date',
            },
            priority: {
              type: 'string',
              enum: ['LOW', 'MEDIUM', 'HIGH'],
              default: 'MEDIUM',
              description: 'Priority level of the todo',
            },
          },
          required: ['title'],
        },
      },
    },
    paths: {
      '/todos': {
        post: {
          tags: ['Todos'],
          summary: 'Create a new todo',
          description: 'Add a new todo item to the list',
          responses: {
            201: {
              description: 'Todo created successfully',
            },
          },
        },
        get: {
          tags: ['Todos'],
          summary: 'Retrieve todos',
          description:
            'Retrieve todos with optional filtering, pagination, and sorting',
          responses: {
            200: {
              description: 'List of todos',
            },
          },
        },
        delete: {
          tags: ['Todos'],
          summary: 'Delete a todo',
          description: 'Delete a todo by ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID of the todo to delete',
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            204: {
              description: 'Todo deleted successfully',
            },
            404: {
              description: 'Todo not found',
            },
          },
        },
        put: {
          tags: ['Todos'],
          summary: 'Update a todo',
          description: 'Update a todo by ID',
          responses: {
            200: {
              description: 'Todo updated successfully',
            },
          },
        },
      },
      '/todos/scroll': {
        get: {
          tags: ['Todos'],
          summary: 'Retrieve todos with infinite scrolling',
          description:
            'Retrieve todos with optional filtering, sorting, and infinite scrolling',
          responses: {
            200: {
              description: 'List of todos with infinite scrolling',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export const app = express();

app.use(cors());
app.use(express.json());

app.use(
  '/swagger-ui.css',
  express.static(path.join(__dirname, 'css/swagger-ui.css'))
);

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    customCssUrl: '/swagger-ui.css',
    customSiteTitle: 'Todo API Documentation',
    swaggerOptions: {
      requestInterceptor: (req: SwaggerRequest) => {
        console.log('Intercepting request:', req);
        req.headers['api-key'] = '0ICVyrNhPL56Oss58qv-_y42PhSQvYcPm6Vz26j4bNw';
        return req;
      },
    },
  })
);

app.use('/todos', todosRouter);

app.listen(8081, () => {
  console.log('Server running on port 8081');
  console.log('Swagger docs available at http://localhost:8081/api-docs');
});

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ message: 'Serverless function is working!' });
}
