const express = require('express')

const router= require('express').Router()
const server = express();
const next = require('next')


const dev = process.env.NODE_ENV !== 'production'

const app = next({ dev })

app.prepare().then(() => {


    router.get('/admin', (req,res) => {
        const page='/admin/admin'
        app.render(req,res,page);
    })





})



module.exports = router;