(() => {
  const controls = document.querySelector('.collection-tools');
  const input = document.querySelector('#project-search');
  const buttons = [...document.querySelectorAll('[data-category].filter')];
  const projects = [...document.querySelectorAll('[data-project]')];
  const status = document.querySelector('#collection-status');
  const empty = document.querySelector('#empty-state');
  if (!controls || !input || !status || !empty) return;
  let selected = '全部';
  const searchable = projects.map(el=>({el,text:el.textContent.toLocaleLowerCase(),category:el.dataset.category}));
  const update = () => {
    const query = input.value.trim().toLocaleLowerCase();
    let count = 0;
    for (const p of searchable) {
      const visible = (selected === '全部' || selected === p.category) && (!query || p.text.includes(query));
      p.el.hidden = !visible;
      count += Number(visible);
    }
    for (const button of buttons) {
      const active = button.dataset.category === selected;
      button.classList.toggle('active',active);
      button.setAttribute('aria-pressed',String(active));
    }
    status.textContent = selected === '全部' && !query ? `目前收录 ${projects.length} 个项目，持续更新。` : `找到 ${count} 个项目`;
    empty.hidden = count !== 0;
  };
  for(const button of buttons) button.addEventListener('click',()=>{selected=button.dataset.category;update();});
  input.addEventListener('input',update);
  document.querySelector('#clear-filters').addEventListener('click',()=>{selected='全部';input.value='';update();input.focus();});
  controls.hidden = false;
  update();
})();
