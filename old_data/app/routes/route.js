
var routes = require('express').Router();


routes.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  console.log('Call made by-- Prashant Verma');
  next()
});



routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

routes.get('/test', (req, res) => {
  res.status(200).json({ message: 'Test!' });
});



module.exports = routes;
