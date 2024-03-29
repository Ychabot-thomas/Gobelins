const path = require('path')
const { Router } = require('express')
const multer = require('multer')
const { Experiment } = require('../models/index.js') //
const router = Router()
const upload = multer({ dest: path.join(__dirname, '..', 'public', 'uploads') })

router.get('/', (req, res, next) => {
  return Experiment.findAll()
    .then(experiments => res.render('list', { experiments }))
    .catch(err => {
      console.log(
        'There was an error querying experiments',
        JSON.stringify(err),
      )
      return res.send(err)
    })
})

router.get('/api/', (req, res, next) => {
  return Experiment.findAll({
    order: [['createdAt', 'DESC']],
  })
    .then(experiments => res.send(experiments))
    .catch(err => {
      console.log(
        'There was an error querying experiments',
        JSON.stringify(err),
      )
      return res.send(err)
    })
})

router.get('/api/:id(\\d+)', (req, res, next) => {
  return Experiment.findByPk(parseInt(req.params.id, 10))
    .then(experiment => res.send(experiment))
    .catch(err => {
      console.log(
        'There was an error querying experiments',
        JSON.stringify(err),
      )
      return res.send(err)
    })
})

// on submitting a new job using form multipart
router.post('/', upload.single('experiment'), (req, res, next) => {
  console.log(req.body, req)
  const username = req.body.username || 'untitled'
  const score = req.body.score || 'untitled'
  const lives = req.body.lives || 'untitled'
  // const file = req.file.filename
  // console.log(req.file.filename)

  return Experiment.create({
    username,
    score,
    lives,
  })
    .then(experiment => res.redirect(301, '/experiment'))
    .catch(err => {
      console.log(
        '***There was an error creating a experiment',
        JSON.stringify(experiment),
      )
      return res.status(400).send(err)
    })
})

router.get('/:id(\\d+)', async (req, res, next) => {
  return Experiment.findByPk(parseInt(req.params.id, 10))
    .then(({ dataValues }) => {
      const { username, /*file,*/ score, lives, createdAt } = dataValues
      return res.render('experiment', {
        username,
        /*file,*/ score,
        lives,
        createdAt,
      })
    })
    .catch(err => {
      console.log(
        'There was an error querying experiments',
        JSON.stringify(err),
      )
      next()
    })
})

router.get('/new', (req, res, next) => {
  return res.render('new', {})
})

module.exports = router
