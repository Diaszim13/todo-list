// src/index.ts
// import express from "express";
const express = require("express");
// const express = require("express");
// import { v4 as uuidv4 } from "uuid"; // Para gerar IDs únicos
const { v4: uuidv4 } = require("uuid");
// import pool from "./db/db.mts"
const pool = require("./db/db.mts");
// import { ResultSetHeader } from 'mysql2';
// import type { ResultSetHeader } from "mysql2";
const { ResultSetHeader } = require("mysql2");
const cors = require("cors")
const app = express();
const port = 3000;
const corsOptions = {
    origin: 'http://localhost:4200', // Substitua pelo domínio permitido
    optionsSuccessStatus: 200
};
app.use(express.json());
app.use(cors(corsOptions));

// Rotas
// 1. Obter todos os to-dos
app.get("/todos", async (req, res) => {
    try {
        const [rows] = await pool.query("select * from todos");
        res.json(rows)
    } catch (err) {
        res.status(500).json({ error: err})
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
        const [result] = await pool.query("update todos set TITLE = ?, complete = ? WHERE id = ?", [
            title, completed, id
        ]);
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
    console.log(id);
    
    try {
        const [result] = await pool.query("DELETE FROM todos WHERE id = ?", [id]);

        if (result.affectedRows > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "To-Do não encontrado" });
        }
    } catch (err) {
        res.status(500).json({ error: "Erro ao deletar to-do" });
    }
});

app.put("/todos/:id/complete", async (req, res) => {
    const { id } = req.params;
    console.log(id);
    
    try {
        const [result] = await pool.query("UPDATE todos SET completed = 1 WHERE id = ?", [id]);

        if (result.affectedRows > 0) {
            res.json({ message: "To-Do completado" });
        } else {
            res.status(404).json({ message: "To-Do não encontrado" });
        }
    } catch (err) {
        res.status(500).json({ error: "Erro ao completar to-do" });
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
