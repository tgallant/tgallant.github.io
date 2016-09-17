'use strict'

const devBuild = ((process.env.NODE_ENV || '').trim().toLowerCase() !== 'production')

const metalsmith = require('metalsmith')
const markdown = require('metalsmith-markdown')
const publish = require('metalsmith-publish')
const wordcount = require('metalsmith-word-count')
const collections = require('metalsmith-collections')
const permalinks = require('metalsmith-permalinks')
const inplace = require('metalsmith-in-place')
const layouts = require('metalsmith-layouts')
const sitemap = require('metalsmith-sitemap')
const rssfeed = require('metalsmith-feed')
const assets = require('metalsmith-assets')
const htmlmin = devBuild ? null : require('metalsmith-html-minifier')
const browsersync = devBuild ? require('metalsmith-browser-sync') : null

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

const collectionsConfig = {
}

const permaLinksConfig = {}

const ms = metalsmith(__dirname)
  .clean(!devBuild)
  .source('/src/html')
  .destination('build/')
  .metadata(siteMeta)
  .use(publish())
  .use(collections(collectionsConfig))
  .use(permalinks(permaLinksConfig))
  .use(markdown())
  .build(err => {
    if (err) throw err
  })
