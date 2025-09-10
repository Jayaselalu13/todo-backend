import express from 'express';
import { handleZodErrorResponse } from 'utils/error';
import { z } from 'zod';
import { TodoSchema } from 'types/todos';
import { deleteTodo, getTodo } from 'mockup/todos';

export const deleteTodoRouter = express.Router();

const deleteTodoParamsSchema = z.object({
  todoId: TodoSchema.shape.id,
});

deleteTodoRouter.delete('/:todoId', (req, res) => {
  const validationResult = deleteTodoParamsSchema.safeParse(req.params);

  if (!validationResult.success) {
    return handleZodErrorResponse(res, validationResult.error);
  }

  const { todoId } = validationResult.data;

  const todoExists = getTodo(todoId);
  if (!todoExists) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  deleteTodo(todoId);

  return res.status(204).send();
});
