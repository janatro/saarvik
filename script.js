/* SAARVIK Museum – Gamification, Interaktion und dezente Animationen ohne Backend */
const STORE='saarvik-pass-v3';
const levels=[['Bauer',0],['Händler',160],['Krieger',360],['Jarl',640],['König',1000]];
let pass=JSON.parse(localStorage.getItem(STORE)||'null')||{id:'SVK-'+Math.random().toString(36).slice(2,8).toUpperCase(),points:0,badges:[],activities:[],rankName:'Gast'};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const title=()=>levels.slice().reverse().find(l=>pass.points>=l[1])[0];
const next=()=>levels.find(l=>pass.points<l[1]);
function formatActivityName(name){
  const labels={
    haendler:'Händlerpfad abgeschlossen',
    entdeckter:'Entdeckerpfad abgeschlossen',
    entdecker:'Entdeckerpfad abgeschlossen',
    krieger:'Kriegerpfad abgeschlossen'
  };
  if(labels[name])return labels[name];
  if(typeof name==='string'&&name.startsWith('Wähle deinen Weg: ')){
    const role=name.split(': ')[1];
    const roleLabels={haendler:'Händlerpfad abgeschlossen',entdecker:'Entdeckerpfad abgeschlossen',krieger:'Kriegerpfad abgeschlossen'};
    return roleLabels[role]||('Pfad '+role.charAt(0).toUpperCase()+role.slice(1)+' abgeschlossen');
  }
  return typeof name==='string'?name.charAt(0).toUpperCase()+name.slice(1):name;
}
function save(){localStorage.setItem(STORE,JSON.stringify(pass));renderPass()}
function addActivity(name,pts,badge){pass.points+=pts;if(!pass.activities.includes(name))pass.activities.push(name);if(badge&&!pass.badges.includes(badge))pass.badges.push(badge);save();$$('.pass-points,.pass-title').forEach(e=>e.animate([{transform:'scale(1)'},{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:520}))}
function renderPass(){const n=next(),pct=Math.min(100,pass.points/1000*100);$$('.pass-id').forEach(e=>e.textContent=pass.id);$$('.pass-points').forEach(e=>e.textContent=pass.points);$$('.pass-title').forEach(e=>e.textContent=title());$$('.pass-next').forEach(e=>e.textContent=n?`${n[0]} bei ${n[1]} Punkten`:'höchster Titel erreicht');$$('.pass-progress').forEach(e=>requestAnimationFrame(()=>e.style.width=pct+'%'));const b=$('#badgeList');if(b)b.innerHTML=pass.badges.length?pass.badges.map(x=>`<span class="badge">${x}</span>`).join(''):'<p>Noch keine Abzeichen gesammelt.</p>';const a=$('#activityList');if(a)a.innerHTML=pass.activities.length?pass.activities.map(x=>`<li>${formatActivityName(x)}</li>`).join(''):'<li>Noch keine Aktivität abgeschlossen.</li>';renderRank()}
function renderRank(){const el=$('#rankList');if(!el)return;let ranks=JSON.parse(localStorage.getItem('saarvik-rank-v3')||'[]');ranks=ranks.filter(r=>r.name!==pass.rankName);ranks.push({name:pass.rankName||'Gast',points:pass.points});ranks.sort((a,b)=>b.points-a.points);localStorage.setItem('saarvik-rank-v3',JSON.stringify(ranks.slice(0,8)));el.innerHTML=ranks.slice(0,6).map((r,i)=>{
if(i===0)return `<li><span class="rank-medal" aria-hidden="true">🥇</span><span>${r.name} · ${r.points} Punkte</span></li>`;
if(i===1)return `<li><span class="rank-medal" aria-hidden="true">🥈</span><span>${r.name} · ${r.points} Punkte</span></li>`;
if(i===2)return `<li><span class="rank-medal" aria-hidden="true">🥉</span><span>${r.name} · ${r.points} Punkte</span></li>`;
return `<li><span class="rank-pos">${i+1}.</span><span>${r.name} · ${r.points} Punkte</span></li>`;
}).join('')}
document.addEventListener('DOMContentLoaded',()=>{renderPass();$('.menu-btn')?.addEventListener('click',()=>$('.navlinks').classList.toggle('open'));$$('.large-tile,.image-card,.world,.story-band,.immersive,.pass-ornate,.timeline article,.card-form,.info-panel,.story-card').forEach(e=>e.classList.add('reveal'));const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting)x.target.classList.add('visible')}),{threshold:.12});$$('.reveal').forEach(e=>io.observe(e));$$('.tab-btn').forEach(b=>b.onclick=(ev)=>{$$('.myth-options button,.quiz-options button').forEach(b=>b.classList.remove('selected'));ev.currentTarget.classList.add('selected');$$('.tab-btn,.game-panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#'+b.dataset.tab).classList.add('active')});initName();initRunes();initMyths();initGod();initStory()});
function initName(){const f=$('#nameForm');if(!f)return;f.onsubmit=e=>{e.preventDefault();const first=$('#firstName').value.trim()||'Gast',m=+$('#birthMonth').value,trait=$('#trait').value,role=$('#role').value;pass.rankName=first;
const nordicNames={
  Händler:['Leif','Eirik','Astrid','Sigrid','Kari','Inga','Torben','Liv'],
  Entdecker:['Leif','Ragnar','Freya','Astrid','Sven','Kjell','Ingrid','Njal'],
  Krieger:['Björn','Ragnar','Astrid','Sigrid','Harald','Tyr','Hilda','Einar'],
  Handwerker:['Einar','Kjell','Inga','Liv','Torben','Sigrid','Arne','Kari']
};
const bynames={
  mutig:['Eisenherz','Sturmrufer','Schildwacht','Falkenmut'],
  klug:['Runenwächterin','Runenwächter','Klarblick','Weisblick'],
  loyal:['Treuhand','Eichenherz','Hafenwacht','Schildfreund'],
  abenteuerlustig:['Nordwind','Sternenseglerin','Sternensegler','Meerpfad'],
  ehrgeizig:['Goldsucher','Goldsucherin','Hochfahrt','Bernsteinblick']
};
const namePool=nordicNames[role]||nordicNames.Entdecker;
const byPool=bynames[trait]||bynames.mutig;
const base=namePool[(first.length+m+role.length)%namePool.length];
let by=byPool[(first.charCodeAt(0)+m+trait.length)%byPool.length];
if((base==='Astrid'||base==='Sigrid'||base==='Inga'||base==='Liv'||base==='Freya'||base==='Hilda'||base==='Ingrid')&&by==='Runenwächter')by='Runenwächterin';
if(!(base==='Astrid'||base==='Sigrid'||base==='Inga'||base==='Liv'||base==='Freya'||base==='Hilda'||base==='Ingrid')&&by==='Runenwächterin')by='Runenwächter';
if(!(base==='Astrid'||base==='Sigrid'||base==='Inga'||base==='Liv'||base==='Freya'||base==='Hilda'||base==='Ingrid')&&by==='Sternenseglerin')by='Sternensegler';
if((base==='Astrid'||base==='Sigrid'||base==='Inga'||base==='Liv'||base==='Freya'||base==='Hilda'||base==='Ingrid')&&by==='Sternensegler')by='Sternenseglerin';
if(!(base==='Astrid'||base==='Sigrid'||base==='Inga'||base==='Liv'||base==='Freya'||base==='Hilda'||base==='Ingrid')&&by==='Goldsucherin')by='Goldsucher';
const name=`${base} ${by}`;
$('#nameResult').innerHTML=`<div class="certificate museum-certificate"><div class="cert-header"><img src="assets/saarvik-logo.png" alt="SAARVIK Museum Logo"><span>SAARVIK Zertifikat</span></div><div class="cert-rule"></div><p class="cert-kicker">Persönliche Auszeichnung im Wikinger-Abenteuer</p><h2>${name}</h2><div class="cert-meta"><span><strong>Rolle</strong>${role}</span><span><strong>Eigenschaft</strong>${trait.charAt(0).toUpperCase()+trait.slice(1)}</span></div><p class="cert-text">Dieses Zertifikat bestätigt die erfolgreiche Teilnahme am Wikinger-Abenteuer im SAARVIK Museum Saarbrücken.</p><div class="cert-footer"><span>Ausgestellt vom SAARVIK Museum Saarbrücken</span><span class="cert-seal">SV</span></div></div>`;addActivity('Wikinger-Namensgenerator',55,'Namenssiegel')}}
const runeMap={a:'ᚨ',b:'ᛒ',c:'ᚲ',d:'ᛞ',e:'ᛖ',f:'ᚠ',g:'ᚷ',h:'ᚺ',i:'ᛁ',j:'ᛃ',k:'ᚲ',l:'ᛚ',m:'ᛗ',n:'ᚾ',o:'ᛟ',p:'ᛈ',q:'ᚲ',r:'ᚱ',s:'ᛊ',t:'ᛏ',u:'ᚢ',v:'ᚹ',w:'ᚹ',x:'ᛉ',y:'ᛇ',z:'ᛉ',ä:'ᚨ',ö:'ᛟ',ü:'ᚢ',' ':'  '};
function initRunes(){const i=$('#runeInput'),o=$('#runeOutput');if(!i)return;const upd=()=>o.textContent=[...i.value.toLowerCase()].map(c=>runeMap[c]||c).join('')||'ᚱᚢᚾᛖᚾ';i.oninput=upd;$('#copyRunes').onclick=(ev)=>{$$('.myth-options button,.quiz-options button').forEach(b=>b.classList.remove('selected'));ev.currentTarget.classList.add('selected');navigator.clipboard?.writeText(o.textContent);addActivity('Runenübersetzer',35,'Runenmeister')}}
const myths=[['Wikinger trugen im Kampf typischerweise Hörnerhelme.',false,'Für Hörnerhelme im wikingerzeitlichen Kampf gibt es keine belastbaren Belege; das Bild wurde stark durch spätere Darstellungen geprägt.'],['Die Wikingerzeit wird meist grob vom späten 8. bis ins 11. Jahrhundert eingeordnet.',true,'Diese zeitliche Einordnung wird häufig genutzt, auch wenn regionale Entwicklungen unterschiedlich verliefen.'],['Wikinger waren ausschließlich Plünderer.',false,'Raubzüge sind ein Teil der Geschichte, aber Handel, Landwirtschaft, Handwerk, Reisen und Siedlungen waren ebenso wichtig.'],['Langschiffe konnten für Reisen auf See und in flacheren Gewässern geeignet sein.',true,'Ihre Bauweise machte sie beweglich und für verschiedene Gewässer nutzbar.'],['Runen waren Schriftzeichen.',true,'Runen dienten in unterschiedlichen germanischen Kontexten als Schriftzeichen und Inschriften.'],['Alle Menschen in Skandinavien waren Wikinger.',false,'Viele Menschen waren Bauern, Händler oder Handwerker; „Wikinger“ bezeichnet eher eine Rolle oder Tätigkeit.'],['Nordische Mythen sind keine direkten Tatsachenberichte.',true,'Sie sind wichtige Quellen für Vorstellungen und Erzähltraditionen, müssen aber historisch eingeordnet werden.'],['Handelskontakte reichten weit über Skandinavien hinaus.',true,'Funde und Quellen zeigen weiträumige Kontakte und Austauschbeziehungen.'],['Frauen konnten wichtige soziale und wirtschaftliche Rollen haben.',true,'Archäologische Funde und Quellen weisen auf vielfältige Rollen hin, die je nach Ort und Zeit variierten.'],['Wikinger nutzten nur Schwerter.',false,'Auch Äxte, Speere, Bögen, Messer und Werkzeuge spielten eine Rolle.'],['Schiffe waren zugleich Transportmittel, Statussymbol und technisches Meisterstück.',true,'Schiffe verbanden Mobilität, Handel, Krieg, Austausch und soziale Bedeutung.'],['Alle Wikinger waren blond und gleich gekleidet.',false,'Solche Vereinfachungen sind Klischees; Kleidung, Herkunft und Aussehen waren vielfältig.'],['Archäologie liefert fertige Antworten ohne Interpretation.',false,'Funde müssen dokumentiert, verglichen und vorsichtig interpretiert werden.'],['Handwerk war für die Wikingerzeit zentral.',true,'Schmiede, Holzarbeiten, Textilien und Spezialwissen prägten Alltag und Austausch.'],['Das Saarland war ein gesicherter Standort einer großen Wikingerstadt.',false,'Für eine solche Aussage bräuchte es Belege. Das Museum nutzt Saarbrücken als heutigen Vermittlungsort für europäische Geschichte.']];let mythI=0,mythScore=0,mythLocked=false;
function initMyths(){if($('#mythBox'))showMyth()}
function showMyth(){mythLocked=false;const box=$('#mythBox'),fb=$('#mythFeedback');if(mythI>=myths.length){box.innerHTML=`<h2>Ergebnis: ${mythScore}/${myths.length}</h2><p>Du hast 15 historische Aussagen geprüft.</p><button class="btn btn-primary" onclick="mythI=0;mythScore=0;showMyth()">Neu starten</button>`;fb.innerHTML='';addActivity('Wikinger vs. Realität',mythScore*7,'Mythenprüfer');return}let q=myths[mythI];box.innerHTML=`<p class="eyebrow">Aussage ${mythI+1} von ${myths.length}</p><h2>${q[0]}</h2><div class="progress"><span style="width:${mythI/myths.length*100}%"></span></div><div class="quiz-options"><button class="option" onclick="answerMyth(true)">Wahr</button><button class="option" onclick="answerMyth(false)">Falsch</button></div>`;fb.innerHTML=''}
function answerMyth(v){if(mythLocked)return;mythLocked=true;const q=myths[mythI];if(v===q[1])mythScore++;$('#mythFeedback').innerHTML=`<div class="result myth-result"><div class="result-copy"><strong>${v===q[1]?'Richtig.':'Nicht ganz.'}</strong> ${q[2]}</div><button class="btn btn-primary" onclick="mythI++;showMyth()">Weiter</button></div>`}
const godQs=[['Was ist dir in einer Gruppe am wichtigsten?',{'Weitblick':'Odin','Schutz':'Thor','Verbindung':'Freyja','Freiheit':'Loki','Gerechtigkeit':'Tyr'}],['Welche Aufgabe reizt dich?',{'Rätsel lösen':'Odin','Schwieriges tragen':'Thor','Menschen gewinnen':'Freyja','Regeln hinterfragen':'Loki','Streit schlichten':'Tyr'}],['Dein Museumsobjekt?',{'Runenstein':'Odin','Hammer-Amulett':'Thor','Schmuckfund':'Freyja','Maskenfragment':'Loki','Schwertgriff':'Tyr'}],['Wie reagierst du auf Gefahr?',{'Beobachten':'Odin','Eingreifen':'Thor','Beruhigen':'Freyja','Ablenken':'Loki','Standhalten':'Tyr'}],['Welche Stärke beschreibt dich?',{'wissbegierig':'Odin','mutig':'Thor','charismatisch':'Freyja','einfallsreich':'Loki','fair':'Tyr'}],['Welche Landschaft wählst du?',{'Nebelwald':'Odin','Gewitterküste':'Thor','Blühendes Tal':'Freyja','Verwinkelte Gasse':'Loki','Thingplatz':'Tyr'}],['Was ärgert dich?',{'Dummheit':'Odin','Feigheit':'Thor','Kälte':'Freyja','Langeweile':'Loki','Wortbruch':'Tyr'}],['Dein Reisetyp?',{'Forscher':'Odin','Beschützer':'Thor','Diplomat':'Freyja','Improvisierer':'Loki','Wächter':'Tyr'}],['Was sammelst du?',{'Wissen':'Odin','Trophäen':'Thor','Beziehungen':'Freyja','Ideen':'Loki','Prinzipien':'Tyr'}],['Wie triffst du Entscheidungen?',{'Strategisch':'Odin','Direkt':'Thor','Einfühlsam':'Freyja','Unkonventionell':'Loki','Nach Regeln':'Tyr'}]];const godDesc={
  Odin:{key:'odin',image:'assets/wikinger-gott-odin.png',title:'Wissenssucher',description:'Strategisch, neugierig und bereit, für Erkenntnis Umwege zu gehen.'},
  Thor:{key:'thor',image:'assets/wikinger-gott-thor.png',title:'Beschützer',description:'Direkt, mutig und zuverlässig, wenn andere Hilfe brauchen.'},
  Freyja:{key:'freyja',image:'assets/wikinger-goettin-freyja.png',title:'Vermittlerin',description:'Charismatisch, selbstbestimmt und offen für Schönheit, Stärke und Verbindung.'},
  Loki:{key:'loki',image:'assets/wikinger-gott-loki.png',title:'Wandler',description:'Kreativ, scharfzüngig und stark, wenn alte Lösungen nicht reichen.'},
  Tyr:{key:'tyr',image:'assets/wikinger-gott-tyr.png',title:'Rechtswahrer',description:'Geradlinig, fair und bereit, Verantwortung zu übernehmen.'}
};
const godImages={
  Freyja:{src:'assets/wikinger-goettin-freyja.png',alt:'Freya – Ergebnis des Wikinger-Abenteuers'},
  Freya:{src:'assets/wikinger-goettin-freyja.png',alt:'Freya – Ergebnis des Wikinger-Abenteuers'},
  Loki:{src:'assets/wikinger-gott-loki.png',alt:'Loki – Ergebnis des Wikinger-Abenteuers'},
  Odin:{src:'assets/wikinger-gott-odin.png',alt:'Odin – Ergebnis des Wikinger-Abenteuers'},
  Thor:{src:'assets/wikinger-gott-thor.png',alt:'Thor – Ergebnis des Wikinger-Abenteuers'},
  Tyr:{src:'assets/wikinger-gott-tyr.png',alt:'Tyr – Ergebnis des Wikinger-Abenteuers'}
};
function initGod(){const form=$('#godForm');if(!form)return;form.innerHTML=godQs.map((q,i)=>`<div class="question-card"><h3>${i+1}. ${q[0]}</h3><div class="choice-grid">${Object.entries(q[1]).map(([k,v])=>`<button type="button" class="choice-card" data-q="${i}" data-val="${v}">${k}</button>`).join('')}</div></div>`).join('')+'<button class="btn btn-primary">Ergebnis anzeigen</button>';const answers={};form.onclick=e=>{const b=e.target.closest('.choice-card');if(!b)return;answers[b.dataset.q]=b.dataset.val;$$(`.choice-card[data-q="${b.dataset.q}"]`).forEach(x=>x.classList.remove('selected'));b.classList.add('selected')};form.onsubmit=e=>{e.preventDefault();const scores={Odin:0,Thor:0,Freyja:0,Loki:0,Tyr:0};Object.values(answers).forEach(v=>scores[v]++);if(Object.keys(answers).length<10){$('#godResult').innerHTML='<div class="result">Bitte beantworte alle 10 Fragen.</div>';return}const g=Object.entries(scores).sort((a,b)=>b[1]-a[1])[0][0],d=godDesc[g];$('#godResult').innerHTML=`<div class="god-result-card refined-god-result"><div class="god-image-wrap god-portrait-frame"><img src="${godImages[g].src}" alt="${godImages[g].alt}" title="${godImages[g].alt}" loading="lazy" decoding="async"></div><div class="god-result-copy"><p class="eyebrow">Dein Ergebnis</p><h2>${g}</h2><h3>${d.title}</h3><p>${d.description}</p><p class="god-score">Eigenschaften: ${Object.entries(scores).map(x=>x.join(' ')).join(' · ')}</p></div></div>`;addActivity('Nordische Gottheit Finder',65,'Götterzeichen')}}
const stories={haendler:[['Du erreichst einen Markt am Fluss. Was ist dein erster Schritt?',[['Gewichte prüfen',15],['Laut werben',8],['Sofort tauschen',4]]],['Ein Kunde zweifelt an deiner Ware.',[['Herkunft erklären',16],['Preis senken',8],['Streit suchen',1]]],['Ein Sturm bedroht die Rückreise.',[['Lager sichern',16],['Risiko nehmen',4],['Ware zurücklassen',7]]],['Ein fremder Händler bietet seltenen Bernstein.',[['Qualität prüfen',15],['Blind kaufen',3],['Partnerschaft vorschlagen',14]]],['Deine Gruppe braucht Vorräte.',[['Teil der Ware tauschen',13],['Rationen planen',12],['Ignorieren',0]]],['Am Ziel warten viele Käufer.',[['Fair handeln',15],['Übertreiben',2],['Langfristige Kontakte pflegen',16]]]],entdecker:[['Nebel liegt über dem Wasser.',[['Küste lesen',15],['Weitersegeln',6],['Zurückkehren',7]]],['Du findest unbekannte Zeichen.',[['Dokumentieren',16],['Übersehen',1],['Rätselhaft erzählen',8]]],['Ein Seitenfluss lockt.',[['Kundschafter senden',14],['Alle hinein',5],['Markierung setzen',12]]],['Vorräte werden knapp.',[['Jagd und Handel kombinieren',14],['Schneller fahren',6],['Rationen teilen',15]]],['Ein Dorf erscheint am Ufer.',[['Geschenke senden',15],['Verstecken',7],['Einschüchtern',2]]],['Die Heimreise beginnt.',[['Route notieren',16],['Nur erinnern',5],['Karte tauschen',12]]]],krieger:[['Die Gruppe bittet um Schutz.',[['Wachen einteilen',16],['Allein patrouillieren',7],['Drohen',3]]],['Ein Streit eskaliert.',[['Schlichten',15],['Zuschlagen',2],['Zeugen hören',14]]],['Ein Schild bricht.',[['Reparieren lassen',13],['Ignorieren',1],['Ersatz bauen',12]]],['Der Weg wird eng.',[['Formation ändern',15],['Rennen',4],['Späher senden',14]]],['Jemand bricht sein Wort.',[['Thing einberufen',16],['Rache nehmen',2],['Ausgleich suchen',13]]],['Die Gruppe kehrt heim.',[['Erfahrung teilen',15],['Ruhm fordern',7],['Wache organisieren',13]]]]};let storyRole='',storyI=0,storyPts=0;
function initStory(){const box=$('#storyBox');if(box){box.hidden=true;box.innerHTML=''}if(!$('#roleSelect'))return;$$('.role-card').forEach(b=>b.onclick=(ev)=>{$$('.role-card').forEach(x=>x.classList.remove('selected'));ev.currentTarget.classList.add('selected');storyRole=b.dataset.role;storyI=0;storyPts=0;if(box)box.hidden=false;showStory()})}
function showStory(){const box=$('#storyBox'),sc=stories[storyRole];if(storyI>=sc.length){let end=storyPts>82?'glänzend gemeistert':storyPts>55?'mit Erfahrung bestanden':'knapp überstanden';box.innerHTML=`<h2>Dein Weg ist ${end}.</h2><p>${storyPts} Story-Punkte. Du kannst eine andere Rolle wählen und neue Entscheidungen ausprobieren.</p><button class="btn btn-primary" onclick="addActivity(formatActivityName(storyRole),Math.round(storyPts/2),'Wegzeichen')">Punkte in Wikingerpass übernehmen</button>`;return}let s=sc[storyI];box.innerHTML=`<p class="eyebrow">${storyRole} · Entscheidung ${storyI+1} von ${sc.length}</p><h2>${s[0]}</h2><div class="story-options">${s[1].map(o=>`<button class="option" onclick="storyPts+=${o[1]};storyI++;showStory()">${o[0]}</button>`).join('')}</div>`}


// Automatische Ausstellungsslideshow auf der Ausstellungsseite
function initExhibitionSlider(){
  const slider=document.querySelector('[data-exhibition-slider]');
  if(!slider)return;
  const slides=[...slider.querySelectorAll('.exhibition-slide')];
  const dots=[...slider.querySelectorAll('.slider-dots button')];
  const title=slider.querySelector('[data-slider-title]');
  const text=slider.querySelector('[data-slider-text]');
  let index=0;
  let timer=null;
  const show=(next)=>{
    index=(next+slides.length)%slides.length;
    slides.forEach((s,i)=>s.classList.toggle('is-active',i===index));
    dots.forEach((d,i)=>d.classList.toggle('is-active',i===index));
    if(title)title.textContent=slides[index].dataset.title||'';
    if(text)text.textContent=slides[index].dataset.text||'';
  };
  const start=()=>{stop();timer=window.setInterval(()=>show(index+1),4000)};
  const stop=()=>{if(timer){window.clearInterval(timer);timer=null}};
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>{show(i);start()}));
  slider.addEventListener('mouseenter',stop);
  slider.addEventListener('mouseleave',start);
  slider.addEventListener('focusin',stop);
  slider.addEventListener('focusout',start);
  show(0);start();
}

document.addEventListener('DOMContentLoaded',initExhibitionSlider);


// Demo-Kontaktformular: keine E-Mail, kein Backend, keine Speicherung
(() => {
  const form = document.getElementById("contactDemoForm");
  const modal = document.getElementById("contactDemoModal");
  if (!form || !modal) return;

  const fields = [
    {
      el: document.getElementById("contactName"),
      message: "Bitte geben Sie Ihren Namen ein."
    },
    {
      el: document.getElementById("contactEmail"),
      message: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    },
    {
      el: document.getElementById("contactMessage"),
      message: "Bitte geben Sie eine Nachricht ein."
    }
  ];

  const setError = (field, message = "") => {
    if (!field.el) return;
    const error = form.querySelector(`[data-error-for="${field.el.id}"]`);
    field.el.classList.toggle("is-invalid", Boolean(message));
    field.el.setAttribute("aria-invalid", message ? "true" : "false");
    if (error) error.textContent = message;
  };

  const validateField = (field) => {
    const value = field.el?.value.trim() || "";
    const valid = value && (!field.validate || field.validate(value));
    setError(field, valid ? "" : field.message);
    return Boolean(valid);
  };

  const openModal = () => {
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    const closeButton = modal.querySelector("[data-close-demo-modal]");
    closeButton?.focus();
  };

  const closeModal = () => {
    modal.hidden = true;
    document.body.style.overflow = "";
    form.reset();
    fields.forEach((field) => setError(field, ""));
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const isValid = fields.map(validateField).every(Boolean);
    if (!isValid) {
      const firstInvalid = fields.find((field) => field.el?.classList.contains("is-invalid"));
      firstInvalid?.el?.focus();
      return;
    }
    openModal();
  });

  fields.forEach((field) => {
    field.el?.addEventListener("input", () => {
      if (field.el.classList.contains("is-invalid")) validateField(field);
    });
  });

  modal.querySelectorAll("[data-close-demo-modal]").forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });
})();



// Ausstellungsseite: interaktive Themenwelten
document.addEventListener('DOMContentLoaded', () => {
  const cards = [...document.querySelectorAll('.world-card[data-world]')];
  const panels = [...document.querySelectorAll('[data-world-panel]')];
  if (!cards.length || !panels.length) return;

  const activateWorld = (id, shouldScroll = true) => {
    cards.forEach(card => {
      const active = card.dataset.world === id;
      card.classList.toggle('active', active);
      card.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    panels.forEach(panel => panel.classList.toggle('active', panel.dataset.worldPanel === id));
    if (shouldScroll) {
      document.querySelector('.world-detail-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  cards.forEach(card => card.addEventListener('click', () => activateWorld(card.dataset.world)));
  activateWorld(cards[0].dataset.world, false);
});


// Ausstellungsseite: aktive Station im Museumsrundgang markieren
document.addEventListener('DOMContentLoaded', () => {
  const stations = [...document.querySelectorAll('.route-station')];
  const sections = stations
    .map(station => document.querySelector(station.getAttribute('href')))
    .filter(Boolean);

  if (!stations.length || !sections.length) return;

  stations.forEach(station => {
    station.addEventListener('click', event => {
      event.preventDefault();
      const target = document.querySelector(station.getAttribute('href'));
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      stations.forEach(s => s.classList.toggle('active', s === station));
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = `#${entry.target.id}`;
      stations.forEach(station => station.classList.toggle('active', station.getAttribute('href') === id));
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0.1 });

  sections.forEach(section => observer.observe(section));
});


// Ausstellungsrundgang: Fortschritt + dezente Reveal-Animation
document.addEventListener('DOMContentLoaded', () => {
  const route = document.querySelector('.museum-route');
  const routeProgress = document.querySelector('.route-progress span');
  const stations = [...document.querySelectorAll('.route-station')];
  const sections = stations
    .map(station => document.querySelector(station.getAttribute('href')))
    .filter(Boolean);

  if (route && routeProgress && stations.length && sections.length) {
    const setActiveRoute = (targetId) => {
      const activeIndex = stations.findIndex(station => station.getAttribute('href') === `#${targetId}`);
      stations.forEach((station, index) => station.classList.toggle('active', index === activeIndex));
      const progress = activeIndex <= 0 ? 0 : (activeIndex / Math.max(stations.length - 1, 1)) * 100;
      route.style.setProperty('--route-progress', `${progress}%`);
      const active = stations[activeIndex];
      if (active) {
        const left = active.offsetLeft - route.clientWidth / 2 + active.clientWidth / 2;
        route.scrollTo({ left, behavior: 'smooth' });
      }
    };

    const observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveRoute(visible.target.id);
    }, { rootMargin: '-32% 0px -58% 0px', threshold: [0.15, 0.35, 0.6] });

    sections.forEach(section => observer.observe(section));

    stations.forEach(station => {
      station.addEventListener('click', () => {
        const id = station.getAttribute('href').replace('#', '');
        setActiveRoute(id);
      });
    });
  }

  const revealTargets = document.querySelectorAll('.tour-intro,.tour-section,.exhibition-final-cta');
  if (revealTargets.length) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach(target => revealObserver.observe(target));
  }
});


// Ausstellungsseite: Museumsplan + ScrollSpy
document.addEventListener('DOMContentLoaded', () => {
  const planStations = [...document.querySelectorAll('.plan-station[data-station]')];
  const sideStations = [...document.querySelectorAll('.side-station')];
  const allLinks = [...planStations, ...sideStations];
  const sections = ['eingang','wege','handel','alltag','handwerk','runen','mythologie']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if (!sections.length) return;

  const setActive = (id) => {
    planStations.forEach(link => link.classList.toggle('active', link.dataset.station === id));
    sideStations.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}` || (id === 'eingang' && false)));
  };

  allLinks.forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActive(target.id);
    });
  });

  const observer = new IntersectionObserver(entries => {
    const active = entries
      .filter(entry => entry.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (active) setActive(active.target.id);
  }, { rootMargin: '-30% 0px -58% 0px', threshold: [0.15, .35, .55] });

  sections.forEach(section => observer.observe(section));
});
