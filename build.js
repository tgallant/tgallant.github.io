'use strict'

const metalsmith = require('metalsmith')

const sass = require('metalsmith-sass')
const assets = require('metalsmith-assets')
const layouts = require('metalsmith-layouts')

const bourbon = require('bourbon')
const neat = require('bourbon-neat')

const siteMeta = {
  name: 'timgalant.us',
  desc: 'Tim Gallant\'s Personal Blog',
  author: 'Tim Gallant'
}

const tmplConfig = {
  engine: 'handlebars',
  directory: 'src/templates',
  partials: 'src/partials',
  default: 'default.html'
}

const assetsConfig = {
  source: 'src/assets'
}

const sassConfig = {
  outputDir: 'css',
  outputStyle: 'compressed',
  includePaths: bourbon.includePaths.concat(neat.includePaths)
}

metalsmith(__dirname)
  .source('src/html')
  .destination('build/')
  .metadata(siteMeta)
  .use(layouts(tmplConfig))
  .use(assets(assetsConfig))
  .use(sass(sassConfig))
  .build(err => {
    if (err) throw err
  })
