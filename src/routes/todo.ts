import express from 'express';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { todosRouter } from '../../routes/todos';
import { Router } from "express";
// ... import lain yang mungkin Anda miliki (seperti dari lib/db)

export const todosRouter = Router();

// DATA CONTOH UNTUK AGUSTUS 2025
const mockTodos = [
  {
    id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    title: "Plan team retreat for Q4",
    completed: false,
    date: "2025-08-04T10:00:00.000Z",
    priority: "HIGH",
  },
  {
    id: "b2c3d4e5-f6a7-8901-2345-67890abcdef0",
    title: "Submit monthly expense report",
    completed: true,
    date: "2025-08-10T14:30:00.000Z",
    priority: "MEDIUM",
  },
  {
    id: "c3d4e5f6-a7b8-9012-3456-7890abcdef01",
    title: "Prepare presentation for stakeholder meeting",
    completed: false,
    date: "2025-08-18T09:00:00.000Z",
    priority: "HIGH",
  },
  {
    id: "d4e5f6a7-b8c9-0123-4567-890abcdef012",
    title: "Renew software licenses",
    completed: false,
    date: "2025-08-22T11:00:00.000Z",
    priority: "LOW",
  },
  {
    id: "e5f6a7b8-c9d0-1234-5678-90abcdef0123",
    title: "Book flights for conference in September",
    completed: true,
    date: "2025-08-28T16:45:00.000Z",
    priority: "MEDIUM",
  },
;


// Modifikasi rute GET /todos/scroll
todosRouter.get("/scroll", async (req, res) => {
  try {
    // Di sini seharusnya ada logika Anda untuk mengambil data dari database (DynamoDB)
    // const realTodos = await getTodosFromDB(req.query);

    // INI HANYA UNTUK DEMO: Kita akan berpura-pura database kosong
    // dan langsung mengembalikan data contoh.
    // Ganti logika `if (true)` ini dengan `if (realTodos.length === 0)`
    // untuk menggunakannya hanya saat database Anda benar-benar kosong.
    if (true) {
      console.log("Mengembalikan data contoh (mock data)...");
      return res.json({
        todos: mockTodos,
        nextCursor: null, // Kita set null agar tidak ada infinite scroll
        hasNextPage: false,
      });
    }

    // Jika database tidak kosong, jalankan logika normal Anda
    // res.json(realTodos);

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// ... rute lain (POST, PUT, DELETE) biarkan seperti semula ...




type SwaggerRequest = {
  headers: Record<string, string>;
  method?: string;
  url?: string;
};

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
  },
  apis: ['./src/routes/todos/*.ts'],
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
