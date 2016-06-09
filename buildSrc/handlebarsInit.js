'use-strict';
const handlebars = require('handlebars');
const fs = require('fs');
const moment = require('moment');

function initHandlebars(files, metalsmith, done){
    handlebars.registerHelper("prettifyDate", function(timestamp){
        return moment(timestamp.getTime()).format('YYYY-MM-DD');
    });
    
    handlebars.registerPartial('header', fs.readFileSync(metalsmith.source() + '/layouts/partials/header.hbt').toString());
    handlebars.registerPartial('footer', fs.readFileSync(metalsmith.source() + '/layouts/partials/footer.hbt').toString());
    handlebars.registerPartial('listPost', fs.readFileSync(metalsmith.source() + '/layouts/partials/listPost.hbt').toString());
    done();
}

module.exports = function(){ return initHandlebars; }