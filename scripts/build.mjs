import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const projects = JSON.parse(await fs.readFile(path.join(root, 'projects.json'), 'utf8'));
if (!Array.isArray(projects) || !projects.length) throw new Error('A nonempty project list is required.');
const ids = new Set();
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for (const p of projects) {
  if (!/^[a-z0-9-]+$/.test(p.id) || ids.has(p.id)) throw new Error('Project IDs must be unique lowercase slugs.');
  ids.add(p.id);
  for(const key of ['name','category','kind','description','url','source']) if(typeof p[key] !== 'string' || !p[key].trim()) throw new Error('Missing '+key+' in '+p.id);
  for(const key of ['url','source']) if(new URL(p[key]).protocol !== 'https:') throw new Error('Project links must use HTTPS.');
}
const categories = [...new Set(projects.map(p=>p.category))];
const filters = ['全部',...categories].map((category,i)=>`<button type="button" class="filter${i===0?' active':''}" data-category="${esc(category)}" aria-pressed="${i===0}">${esc(category)} <span>${category==='全部'?projects.length:projects.filter(p=>p.category===category).length}</span></button>`).join('\n              ');
const list = projects.map(p=>`<li class="project" data-project="${esc(p.id)}" data-category="${esc(p.category)}">
              <div class="project-content">
                <div class="project-meta"><p class="project-kind">${esc(p.kind)}</p>${p.isNew?'<span class="new-label">新加入</span>':''}</div>
                <h3 lang="en">${esc(p.name)}</h3>
                <p class="project-description">${esc(p.description)}</p>
              </div>
              <div class="project-links">
                <a class="visit-link" href="${esc(p.url)}" aria-label="打开 ${esc(p.name)}">打开看看 <span aria-hidden="true">↗</span></a>
                <a class="source-link" href="${esc(p.source)}" aria-label="${esc(p.name)} 源码">源码 <span aria-hidden="true">↗</span></a>
              </div>
            </li>`).join('\n            ');
const template = await fs.readFile(path.join(root,'index.template.html'),'utf8');
let html = template;
for(const [token,value] of Object.entries({PROJECTS:list,FILTERS:filters,COUNT:String(projects.length)})) html = html.replaceAll('{{'+token+'}}',value);
if (/\{\{[A-Z]+\}\}/.test(html)) throw new Error('Unresolved template token.');
if (process.argv.includes('--check')) {
  if(html !== await fs.readFile(path.join(root,'index.html'),'utf8')) throw new Error('index.html is stale; run node scripts/build.mjs.');
  console.log('Catalog is current: '+projects.length+' projects.');
} else {
  await fs.writeFile(path.join(root,'index.html'),html);
  console.log('Built catalog: '+projects.length+' projects.');
}
