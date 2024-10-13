// src/index.ts
import express from "express";
import { v4 as uuidv4 } from "uuid"; // Para gerar IDs únicos

const app = express();
const port = 3000;

app.use(express.json());

// Simulação de um banco de dados em memória
let todos: { id: string, title: string, completed: boolean }[] = [];

// Rotas

// 1. Obter todos os to-dos
app.get("/todos", (req, res) => {
    res.json(todos);
});

// 2. Criar um novo to-do
app.post("/todos", (req, res) => {
    const { title } = req.body;
    const newTodo = { id: uuidv4(), title, completed: false };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// 3. Atualizar um to-do
app.put("/todos/:id", (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;

    const todoIndex = todos.findIndex(todo => todo.id === id);

    if (todoIndex > -1) {
        todos[todoIndex] = { ...todos[todoIndex], title, completed };
        res.json(todos[todoIndex]);
    } else {
        res.status(404).json({ message: "To-Do not found" });
    }
});

// 4. Deletar um to-do
app.delete("/todos/:id", (req, res) => {
    const { id } = req.params;
    todos = todos.filter(todo => todo.id !== id);
    res.status(204).send();
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
