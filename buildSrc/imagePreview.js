'use-strict';
const gm = require('gm');
function calcImagePreviews(files, metalsmith, done){
    var relevantPaths = Object.keys(files).filter(function filterPath(path){
        return path.indexOf('assets\\images') >= 0;
    });
    let doneCount = 0;
    for(let i = 0; i < relevantPaths.length; i++){
        let path = relevantPaths[i];
        let absolutePath = metalsmith.source() + "\\" + path;
        let file = files[path];
        gm(absolutePath).resize(3,3).toBuffer('GIF', function(error, buffer){
            if(!error){
                console.log('data:image/gif;base64,' + buffer.toString('base64'));
                
            }else{
                console.error(error);
            }
            checkDone();
        });
    }
    checkDone();

    function checkDone(){
        doneCount++;
        if(doneCount >= relevantPaths.length){
            done();
        }
    }
}
/**
 * requires installation of GraphicsMagick on the executing computer
 */
module.exports = function(){ return calcImagePreviews; }