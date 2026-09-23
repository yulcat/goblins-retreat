import {mkdir,cp,writeFile} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const f of ['index.html','style.css','src'])await cp(f,`dist/${f}`,{recursive:true});
await writeFile('dist/.nojekyll','');
console.log('Built dependency-free static site in dist/');
