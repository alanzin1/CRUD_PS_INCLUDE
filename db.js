const { MongoClient, ObjectId } = require("mongodb");
const multer = require('multer');
const fs = require('fs');
const mongoose = require('mongoose');

const URI = "mongodb+srv://admin:PCwxwyGSMYUEnw1t@blogdata.ngzc0nv.mongodb.net/?retryWrites=true&w=majority&appName=BlogData";

let db = null;

async function conexao() {
    if (!db) {
        try {
            const client = await MongoClient.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
            db = client.db();
        } catch (error) {
            console.error("Erro ao conectar ao banco de dados:", error);
            throw error;
        }
    }
    return db;
}

async function inserir(post) {
    const db = await conexao();
    return db.collection("posts").insertOne(post);
}

async function mostrar() {
    const db = await conexao();
    return db.collection("posts").find().toArray();
}

async function remover(id) {
    const db = await conexao();
    return db.collection("posts").deleteOne({ _id: new ObjectId(id) });
}

async function editar(id, novo) {
    const db = await conexao();
    const postExistente = await db.collection("posts").findOne({ _id: new ObjectId(id) });
    if (novo.imagem && novo.imagem !== postExistente.imagem) {
        novo.imagem = novo.imagem;
    } else {
        novo.imagem = postExistente.imagem;
    }
    await db.collection("posts").updateOne({ _id: new ObjectId(id) }, { $set: novo });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

async function salvarImagem(req, res, next) {
    try {
        const db = await conexao();
        await db.collection("posts").insertOne({ imagem: req.file.path });
        res.redirect('/');
    } catch (error) {
        console.error("Erro ao salvar imagem:", error);
        res.status(500).send("Erro ao salvar imagem");
    }
}

module.exports = {
    inserir,
    mostrar,
    remover,
    editar,
    salvarImagem
};
