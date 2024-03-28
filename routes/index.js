var express = require('express');
var router = express.Router();
const db = require("../db");
const multer = require('multer');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') 
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) 
    }
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    const resultado = await db.mostrar();
    res.render('index', { title: 'PS INCLUDE', resultado });
});

router.post("/save", upload.single('imagem'), async (req, res) => {
        
    const post = {
        tema: req.body.tema,
        texto: req.body.texto,
        imagem: req.file ? req.file.path : '' 
    };

    await db.inserir(post);
    res.redirect('/');
        
});

router.post("/delete", async (req, res) => {

    const id = req.body.postId;
    await db.remover(id);
    res.redirect('/');

});

router.post("/edit", upload.single('imagem'), async (req, res) => {

    const id = req.body.postId;
    const novopost = {
        tema: req.body.tema,
        texto: req.body.texto,
        imagem: req.file ? req.file.path : '' 
    };

    await db.editar(id, novopost);
    res.redirect('/')

});

module.exports = router;
