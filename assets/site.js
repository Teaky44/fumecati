/* Fu&Me Çatı & İzolasyon – ortak betik */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const PHONE='905070633885';
const wa=t=>window.open('https://wa.me/'+PHONE+'?text='+encodeURIComponent(t),'_blank','noopener');
const tl=n=>Number(n).toLocaleString('tr-TR');
$$('.yr').forEach(e=>e.textContent=new Date().getFullYear());

/* menu */
const burger=$('#burger'), mm=$('#mobileMenu');
if(burger){
  burger.addEventListener('click',()=>{const o=mm.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
  $$('#mobileMenu a').forEach(a=>a.addEventListener('click',()=>{mm.classList.remove('open');burger.setAttribute('aria-expanded',false)}));
}

/* reveal */
if('IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
  $$('.rv').forEach(el=>io.observe(el));
}else $$('.rv').forEach(el=>el.classList.add('in'));

/* hazır WhatsApp mesajlı butonlar */
$$('[data-wa]').forEach(b=>b.addEventListener('click',()=>wa(b.dataset.wa)));

/* symptom picker (içerik HTML'de, JS sadece gösterir/gizler) */
if($('#chips')){
  const chips=$$('#chips .chip'), dps=$$('#diag .dpanel');
  const pick=k=>{chips.forEach((c,i)=>c.setAttribute('aria-pressed',i===k));dps.forEach((p,i)=>p.hidden=i!==k)};
  chips.forEach((c,i)=>c.addEventListener('click',()=>pick(i)));
}

/* cross section */
if($('#layerList')){
  const lbs=$$('#layerList .layer-btn'), lps=$$('#layerInfo .lpanel');
  const setLayer=k=>{
    $$('.layer').forEach((g,i)=>g.classList.toggle('active',i===k));
    lbs.forEach((b,i)=>b.setAttribute('aria-pressed',i===k));
    lps.forEach((p,i)=>p.hidden=i!==k);
  };
  lbs.forEach((b,i)=>b.addEventListener('click',()=>setLayer(i)));
  $$('.layer').forEach((g,i)=>g.addEventListener('click',()=>setLayer(i)));
}

/* calculator */
/* TL/m² [alt, üst] — malzeme + işçilik, 2026 piyasa araştırması (Temmuz 2026 itibarıyla).
   Kaynaklar: Novus Tadilat (aktarma 900–1.500, aktarma+taş yünü 1.400–2.200, komple yenileme 2.500–4.500; Ankara),
   Tekme (çelik çatı 4.800–7.200), Dek-Mar (sürme izolasyon 380–850), Kainta (şilte yalıtım 300–500).
   Polyurea ve sandviç panel kalemleri için net TL verisi yok; yukarıdakilerden tahmin edildi.
   Fiyatlar İstanbul'da değişebilir, düzenli güncelleyin. */
const PRICE={
  izolasyon:{standard:[500,900],  premium:[1000,1600], luxury:[2200,3500]},
  tamir:    {standard:[900,1500], premium:[1400,2200], luxury:[2500,4500]},
  yeni:     {standard:[2500,4500],premium:[3500,5500], luxury:[4800,7200]}
};
const KAR_LO=1.45*0.65; /* alt (başlangıç) fiyat: önceki değerden %35 düşük */
const KAR_HI=1.45*0.75; /* üst fiyat: önceki değerden %25 düşük */
const SAVE={standard:1,premium:1.35,luxury:1.75};
if($('#cArea')){
  const cSvc=$('#cSvc'),cMat=$('#cMat'),cArea=$('#cArea');
  const calc=()=>{
    const a=+cArea.value; $('#cOut').textContent=a+' m²';
    cArea.style.setProperty('--p',((a-40)/960*100)+'%');
    const [pl,ph]=PRICE[cSvc.value][cMat.value]; const lo=pl*KAR_LO, hi=ph*KAR_HI;
    $('#cCost').textContent=`₺${tl(Math.round(a*lo/1000)*1000)} – ₺${tl(Math.round(a*hi/1000)*1000)}`;
    $('#cSave').textContent=cSvc.value==='tamir'?'Keşifte belirlenir':`~ ₺${tl(Math.round(a*120*SAVE[cMat.value]/500)*500)} / yıl`;
  };
  [cSvc,cMat,cArea].forEach(e=>e.addEventListener('input',calc));calc();
  $('#cSend').addEventListener('click',()=>{
    wa(`Merhaba, web sitenizdeki hesaplayıcıyı kullandım.\nHizmet: ${cSvc.options[cSvc.selectedIndex].text}\nMalzeme: ${cMat.options[cMat.selectedIndex].text}\nAlan: ${cArea.value} m²\nTahmini işçilik bedeli: ${$('#cCost').textContent} (malzeme ve ekstra giderler hariç)\nKeşif ve net teklif alabilir miyim?`);
  });
}

/* hizmet kartı linkleri iletişim formundaki hizmeti seçer */
$$('[data-svc]').forEach(a=>a.addEventListener('click',()=>{const s=$('#fSvc');if(s)s.selectedIndex=(+a.dataset.svc)-1}));

/* formlar -> WhatsApp: her alanın data-l etiketi mesajda başlık olur */
$$('form[data-wa-form]').forEach(f=>f.addEventListener('submit',e=>{
  e.preventDefault();
  const lines=[f.dataset.waForm];
  f.querySelectorAll('[data-l]').forEach(el=>{const v=el.value.trim();if(v)lines.push(`${el.dataset.l}: ${v}${el.dataset.u||''}`)});
  lines.push('Sayfa: '+location.pathname);
  wa(lines.join('\n'));
  const ok=f.querySelector('.success');
  f.reset();
  if(ok){ok.classList.add('show');setTimeout(()=>ok.classList.remove('show'),7000)}
}));
