const handlebars = require('handlebars');
const fs = require('fs');
const moment = require('moment');

function initHandlebars(dir){
    handlebars.registerHelper("prettifyDate", function(timestamp){
        return moment(timestamp.getTime()).format('YYYY-MM-DD');
    });
    
    handlebars.registerPartial('header', fs.readFileSync(dir + '/layouts/partials/header.hbt').toString());
    handlebars.registerPartial('footer', fs.readFileSync(dir + '/layouts/partials/footer.hbt').toString());
}

module.exports = initHandlebars;