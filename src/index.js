import path from 'path';
import fs from 'fs';
import through from 'through2';
import glob from 'glob';
import slash from 'slash';


const reg = /^\s*@import\s+["']([^"']+\*[^"']*(\.scss|\.sass)?)["'];?$/gm;


export default function gulpSassGlob(config = {}) {
    return through.obj(transformFactory(config));
}


function transformFactory({ includePaths = [] }) {
    return function transform(file, env, callback) {
        const includePathsByFile = [...includePaths];
        const isSass = path.extname(file.path) === '.sass';
        const base = path.normalize(path.join(path.dirname(file.path), '/'));
        
        let contents = file.contents.toString('utf-8');
        let contentsCount = contents.split('\n').length;
        
        let result;
        
        includePathsByFile.push(base);
        
        for (var i = 0; i < contentsCount; i++) {
            result = reg.exec(contents);
            
            if (result == null) {
                continue;
            }
            
            const importRule = result[0];
            const globPattern = result[1];
            
            const imports = dedupeArray(flattenArray(...includePathsByFile.map((includePath) => {
                const normalizedIncludePath = path.normalize(path.join(includePath, '/'));
                
                return glob.sync(path.join(normalizedIncludePath, globPattern), {
                    cwd: normalizedIncludePath,
                }).map((fullFilePath) => {
                    if (fullFilePath !== file.path && isSassOrScss(fullFilePath)) {
                        const relativeFilePath = path.relative(normalizedIncludePath, fullFilePath);
                        return `@import "${ slash(relativeFilePath) }"${ isSass ? '' : ';' }`;
                    }
                    
                    return null;
                });
            })));
            
            contents = contents.replace(importRule, imports.join('\n'));
            file.contents = new Buffer(contents);
        }
        
        callback(null, file);
    };
}

function isSassOrScss(filename) {
    return (!fs.statSync(filename).isDirectory() && path.extname(filename).match(/\.sass|\.scss/i));
}

function flattenArray(...arrays) {
    return [].concat(...arrays);
}

function dedupeArray(arr) {
    return [...new Set(arr)];
}
