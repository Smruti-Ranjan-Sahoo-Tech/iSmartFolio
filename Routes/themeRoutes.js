const express = require('express')
const ThemeService = require('../Controller/themeController')
const Router = express.Router()
Router.post('/add', ThemeService.addTheme)
Router.get('/show', ThemeService.getTheme)
module.exports = Router