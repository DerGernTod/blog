'use-strict';
const metalsmith = require('metalsmith');
const markdown = require('metalsmith-markdown');
const layouts = require('metalsmith-layouts');
const permalinks = require('metalsmith-permalinks');
const browserSync = require('metalsmith-browser-sync');
const cleanCss = require('metalsmith-clean-css');
const concat = require('metalsmith-concat');
const sass = require('metalsmith-sass');
const handlebars = require('handlebars');
const collections = require('metalsmith-collections');
const watch = require('metalsmith-watch');
const excerpts = require('metalsmith-excerpts');
const ignore = require('metalsmith-ignore');
const fontBuilder = require('./buildSrc/fontBuilder');
const initHandlebars = require('./buildSrc/handlebarsInit');
const imagePreview = require('./buildSrc/imagePreview');

metalsmith(__dirname)
  .source('./src')
  .clean(false)
  .metadata({
    title: "Metalsmith Test",
    description: "Hello world!",
    generator: "Metalsmith",
    url: "http://www.metalsmith.io",
    host: "http://node.radiatedpixel.com:5555/"
  })
  .use(collections({
    posts: {
      pattern: '**/posts/*.md',
      sortBy: 'date',
      reverse: true
    },
    pages: {
      pattern: '**/pages/*.md'
    }
  }))
  .use(markdown())
  .use(imagePreview())
  .use(excerpts())
  .use(permalinks({
    pattern: ':title',
    date: 'YYYY',
    linksets: [{
        match: { collection: 'posts' },
        pattern: 'posts/:date/:title',
        date: 'YYYY/MM/DD'
      },
      {
        match: {collection: 'pages' },
        pattern: 'pages/:title'
      }
    ]
  }))
  .use(initHandlebars())
  .use(layouts({
    'engine' : 'handlebars',
    'directory' : './src/layouts'
  }))
  .use(sass())
  .use(fontBuilder('styles'))
  .use(concat({
    files: 'styles/*.css',
    output: 'styles/app.css',
    forceOutput: true
  }))
  .use(cleanCss({
    files: 'styles/app.css'
  }))
 .use(ignore([
   'assets/fonts/**',
   'layouts/**',
   'styles/*.scss'
 ]))
 .use(browserSync({
   port: 55555,
   files: "./build/**/*.*"
 }))
 .use(watch({
   paths: {
     '${source}/**/*.md': '**/*',
     '${source}/layouts/**/*': '**/*',
     '${source}/styles/*.scss': '**/*' 
   }
 }))
 .destination('./build')
  .build(function errorCallback(err){
      if(err) throw err;
  });
