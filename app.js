const metalsmith = require('metalsmith');
const markdown = require('metalsmith-markdown');
const layouts = require('metalsmith-layouts');
const permalinks = require('metalsmith-permalinks');
const browserSync = require('metalsmith-browser-sync');
const cleanCss = require('metalsmith-clean-css');
const concat = require('metalsmith-concat');
const sass = require('metalsmith-sass');
const handlebars = require('handlebars');
const moment = require('moment');
const fs = require('fs');
const collections = require('metalsmith-collections');

handlebars.registerHelper("prettifyDate", function(timestamp){
  return moment(timestamp.getTime()).format('YYYY-MM-DD');
});
handlebars.registerPartial('header', fs.readFileSync(__dirname + '/layouts/partials/header.hbt').toString());
handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/layouts/partials/footer.hbt').toString());

metalsmith(__dirname)
  .source('./src')
  .clean(false)
  .metadata({
    title: "Metalsmith Test",
    description: "Hello world!",
    generator: "Metalsmith",
    url: "http://www.metalsmith.io"
  })
  .use(markdown())
  .use(collections({
    posts: {
      pattern: 'content/posts/*.md',
      sortBy: 'date',
      reverse: true
    },
    pages: {
      pattern: 'content/pages/*.md'
    }
  }))
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
 .destination('./build')
  .build(function errorCallback(err){
      if(err) throw err;
  });
