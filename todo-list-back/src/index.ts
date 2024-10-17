// src/index.ts
import express from "express";
import { v4 as uuidv4 } from "uuid"; // Para gerar IDs únicos
import pool from "./db/db.ts"
import type { ResultSetHeader } from "mysql2";
const app = express();
const port = 3000;

app.use(express.json());


// Rotas

// 1. Obter todos os to-dos
app.get("/todos", async (req, res) => {
    try {
        const [rows] = await pool.query("select * from todos");
        res.json(rows)
    } catch (err) {
        res.status(500).json({ error: "Erro" })
    }
});

// 2. Criar um novo to-do
app.post("/todos", async (req, res) => {
    const { title } = req.body;
    const newTodo = { id: uuidv4(), title, completed: false };

    try {
        await pool.query("insert into todos values (?,?,?)", [
            newTodo.id,
            newTodo.title,
            newTodo.completed
        ])
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(500).json({ err: "erro ao cadastrar" })
    }
});

// 3. Atualizar um to-do
app.put("/todos/:id", async (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;

    try {
        const [result] = await pool.query < ResultSetHeader>("update todos set TITLE = ?, complete = ? WHERE id = ?", [
            title, completed, [id]
        ])
        if (result.affectedRows > 0) {
            res.json({ result });
        } else {
            res.status(400).json({ err: "nao encontrad" });
        }
    } catch ($e) {
        res.status(400).json({ err: "nao encontrad" });
    }
});

// 4. Deletar um to-do
app.delete("/todos/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query<ResultSetHeader>("DELETE FROM todos WHERE id = ?", [id]);

        if (result.affectedRows > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "To-Do não encontrado" });
        }
    } catch (err) {
        res.status(500).json({ error: "Erro ao deletar to-do" });
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
