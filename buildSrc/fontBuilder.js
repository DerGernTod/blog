'use-strict';
const fontmin = require('fontmin');
/**
 * scans the metalsmith source directory for all files ending with .ttf and transforms 
 * them to base64 encoded css files
 * @param curDest {string} destination directory
 */
module.exports = function createMetalsmithCallback(curDest){
    return function metalsmithCallback(files, metalsmith, done){
        var runs = [];
        var count = 0;
        for(var curFile in files){
            if(curFile.endsWith('.ttf')){
                let file = curFile;
                let path = metalsmith._source + "/" + curFile; 
                let dest = metalsmith._destination + "/" + curDest;
                runs.push(function fontRun(doneCallback){
                    var fm = new fontmin().dest(dest).src(path).use(fontmin.css({
                        fontPath: file,
                        base64: true
                    }));
                    fm.run(function runFontMin(err, fontMinFiles){
                        if(err){
                            throw err;
                        }
                        count++;
                        let ind = file.lastIndexOf("\\");
                        let newPath = curDest + file.substr(ind, file.length - ind - 4) + '.css';
                        doneCallback({
                            contents: fontMinFiles[1].contents,
                            path: newPath
                        });
                    });
                });
            }
        }
        var iterator = runs[Symbol.iterator]();
        var callNum = iterator.next();
        callNum.value(function iterCallback(resultFile){
            files[resultFile.path] = {
                contents: resultFile.contents
            }
            callNum = iterator.next();
            if(callNum.done){
                done();
            }else{
                callNum.value(iterCallback);
            }
        })
    }
};