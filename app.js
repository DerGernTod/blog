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

const initHandlebars = require('./buildSrc/handlebarsInit');

initHandlebars(__dirname);

metalsmith(__dirname)
  .source('./src')
  .clean(false)
  .metadata({
    title: "Metalsmith Test",
    description: "Hello world!",
    generator: "Metalsmith",
    url: "http://www.metalsmith.io"
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
  .use(permalinks({
    pattern: ':title',
    date: 'YYYY',
    linksets: [{
        match: { collection: 'posts' },
        pattern: 'posts/:date/:title',
        date: 'YYYY-MM-DD'
      },
      {
        match: {collection: 'pages' },
        pattern: 'pages/:title'
      }
    ]
  }))
  .use(layouts('handlebars'))
  .use(sass())
  .use(concat({
    files: 'styles/**/*.css',
    output: 'styles/app.css'
  }))
  .use(cleanCss({
    files: 'styles/app.css'
  }))
 .use(browserSync())
 .use(excerpts())
 .use(watch({
   paths: {
     '${source}/**/*.md': true,
     'layouts/**/*': '**/*',
     '${source}/styles/*.scss': '**/*' 
   }
 }))
 .destination('./build')
  .build(function errorCallback(err){
      if(err) throw err;
  });
