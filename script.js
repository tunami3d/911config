const ASSET = 'assets/';
const dateStamp = document.getElementById('dateStamp');
if (dateStamp) dateStamp.textContent = new Date().toLocaleDateString(undefined,{year:'numeric', month:'short', day:'2-digit'});
const leathers = [
  {id:'leather', label:'Cognac Leather', file:'seat_baseleather.png', swatch:'leather-cognac', tone:'warm cognac leather'},
  {id:'black', label:'Black Leather', file:'seat_baseblack.png', swatch:'leather-black', tone:'black leather'},
  {id:'grey', label:'Slate Grey', file:'seat_basegrey.png', swatch:'leather-grey', tone:'slate grey leather'},
  {id:'cream', label:'Cream', file:'seat_basecream.png', swatch:'leather-cream', tone:'cream leather'},
  {id:'red', label:'Burgundy Red', file:'seat_basered.png', swatch:'leather-red', tone:'burgundy red leather'},
];
const inserts = [
  {id:'none', label:'None / Full Leather', file:null, preview:'none-sample', story:'a full leather construction'},
  {id:'pepita', label:'Pepita', file:'insert_pepita.png', preview:null, story:'classic pepita inserts'},
  {id:'pink', label:'Pink Tartan', file:'insert_pinktartan.png', preview:null, story:'pink tartan inserts'},
  {id:'jazz', label:'Cool Jazz', file:'insert_cooljazz.png', preview:null, story:'a cool jazz woven insert'},
];
const hardware = [
  {id:'alum', label:'Satin Aluminum', file:'hardware_alum.png', swatch:'hw-alum', story:'satin aluminum hardware'},
  {id:'gold', label:'Champagne Gold', file:'hardware_gold.png', swatch:'hw-gold', story:'champagne gold hardware'},
  {id:'carbon', label:'Carbon Fiber', file:'hardware_carbon.png', swatch:'hw-carbon', story:'carbon fiber hardware'},
  {id:'pink', label:'Pink Anodized', file:'hardware_pink.png', swatch:'hw-pink', story:'pink anodized hardware'},
];
let state = JSON.parse(localStorage.getItem('commissionStudioBuild') || 'null') || {leather:'leather', insert:'pepita', hardware:'alum'};
function makeOption(item, group){
  const btn=document.createElement('button'); btn.className='option'; btn.dataset.id=item.id;
  const sw=document.createElement('span'); sw.className='swatch '+(group==='hardware'?'round ':'')+(item.swatch||item.preview||'');
  if(group==='insert' && item.file){ sw.style.backgroundImage=`url(${ASSET+item.file})`; }
  if(group==='insert' && item.id==='none'){ sw.textContent='—'; sw.style.display='grid'; sw.style.placeItems='center'; }
  btn.append(sw, document.createTextNode(item.label));
  btn.onclick=()=>{ state[group]=item.id; update(); };
  return btn;
}
function renderOptions(){
  leatherOptions.append(...leathers.map(x=>makeOption(x,'leather')));
  insertOptions.append(...inserts.map(x=>makeOption(x,'insert')));
  hardwareOptions.append(...hardware.map(x=>makeOption(x,'hardware')));
}
function byId(arr,id){return arr.find(x=>x.id===id)||arr[0]}
function setActive(container,id){[...container.children].forEach(b=>b.classList.toggle('active',b.dataset.id===id))}
function update(){
  const L=byId(leathers,state.leather), I=byId(inserts,state.insert), H=byId(hardware,state.hardware);
  seatBase.src=ASSET+L.file;
  insertLayer.style.display=I.file?'block':'none'; if(I.file) insertLayer.src=ASSET+I.file;
  hardwareLayer.src=ASSET+H.file;
  sumLeather.textContent=L.label; sumInsert.textContent=I.label; sumHardware.textContent=H.label;
  labelLeather.textContent=L.label; labelInsert.textContent=I.label; labelHardware.textContent=H.label;
  sampleLeather.className='sample leather-sample '+L.swatch;
  sampleInsert.className='sample '+(I.preview||''); sampleInsert.textContent=''; sampleInsert.style.backgroundImage= I.file ? `url(${ASSET+I.file})` : '';
  if(!I.file){sampleInsert.textContent='Full leather';}
  sampleHardware.className='sample circle '+H.swatch;
  story.textContent=`Commission 001 pairs ${L.tone} with ${I.story} and ${H.story}. A restrained interior study with period influence, clear material hierarchy, and a grand touring character.`;
  setActive(leatherOptions,state.leather); setActive(insertOptions,state.insert); setActive(hardwareOptions,state.hardware);
  localStorage.setItem('commissionStudioBuild', JSON.stringify(state));
}
saveBtn.onclick=()=>{ localStorage.setItem('commissionStudioBuild', JSON.stringify(state)); saveBtn.textContent='Saved'; setTimeout(()=>saveBtn.textContent='Save Build',1200); };
renderOptions(); update();
