const express = require('express')
const router = express.Router()

router.get('/' ,(req, res) =>{
    res.render('index', { title: 'My Express App', message: 'Hello'});
 });

router.all('/', (req, res, next) =>{
    res.render('404');
}

 module.exports = router;
