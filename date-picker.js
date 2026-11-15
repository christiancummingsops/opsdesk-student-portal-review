/* Standalone local port of DateRangePicker.tsx + windows.ts. Demo Vancouver day is fixed. */
(() => {
  const TODAY='2026-10-24', presets=['Today','Yesterday','Last 7 days','Last 30 days','This month','Last month','Last 3 months'];
  const mounts=new Map();
  const parse=s=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(s||''))return null;const d=new Date(s+'T00:00:00Z');return !Number.isNaN(+d)&&d.toISOString().slice(0,10)===s?d:null;};
  const iso=d=>d.toISOString().slice(0,10);
  const add=(s,n)=>{const d=parse(s);d.setUTCDate(d.getUTCDate()+n);return iso(d);};
  const month=(s,n)=>{const d=parse(s.slice(0,7)+'-01');d.setUTCMonth(d.getUTCMonth()+n);return iso(d);};
  const fmt=s=>parse(s).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
  const label=(a,b)=>a===b?fmt(a):`${fmt(a)} – ${fmt(b)}`;
  const range=p=>{switch(p){case'Today':return[TODAY,TODAY];case'Yesterday':return[add(TODAY,-1),add(TODAY,-1)];case'Last 7 days':return[add(TODAY,-6),TODAY];case'Last 30 days':return[add(TODAY,-29),TODAY];case'This month':return['2026-10-01',TODAY];case'Last month':return[month(TODAY,-1),add('2026-10-01',-1)];default:return[month(TODAY,-2),TODAY];}};
  const icon='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>';
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function mount(el,options={}){
    for(const [node,destroy] of mounts)if(node===el||!node.isConnected)destroy();
    const single=options.mode==='single', controller=new AbortController();
    let committedA=single?(parse(options.value)?options.value:TODAY):(parse(options.from)?options.from:'2026-10-01');
    let committedB=single?committedA:(parse(options.to)?options.to:TODAY);
    let start=committedA,end=committedB,view=month(start,0),open=false,picking=false,preset='',error='',outside=null;
    const destroy=()=>{controller.abort();outside?.abort();mounts.delete(el);};mounts.set(el,destroy);
    el.classList.add('coaching-dates');
    const close=()=>{open=false;outside?.abort();outside=null;render();};
    function toggle(){if(open)return close();start=committedA;end=committedB;picking=false;error='';open=true;render();outside=new AbortController();const signal=outside.signal;document.addEventListener('pointerdown',e=>{if(!el.isConnected)return destroy();if(!el.contains(e.target))close();},{signal});document.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();close();el.querySelector('[data-dp="toggle"]').focus();}},{signal});}
    function render(){
      const first=parse(view),offset=first.getUTCDay();
      const cells=Array.from({length:42},(_,i)=>{const day=add(view,i-offset),d=parse(day),out=day.slice(0,7)!==view.slice(0,7),edge=day===start||day===end,inside=end&&day>=start&&day<=end;return `<button type="button" data-day="${day}" aria-label="${fmt(day)}" aria-pressed="${edge?'true':'false'}" class="${out?'out ':''}${edge?'edge':inside?'in-range':''}">${d.getUTCDate()}</button>`;}).join('');
      el.innerHTML=`<div class="dp-wrap${single?' single':''}">${single?`<div class="dp-single-control"><input type="date" name="${esc(options.name||'date')}" aria-label="${esc(options.ariaLabel||'Session date')}" value="${committedA}" required><button type="button" class="range-btn big" data-dp="toggle" aria-label="Open session date calendar" aria-expanded="${open}" aria-haspopup="dialog">${icon}</button></div>`:`<button type="button" class="range-btn big" data-dp="toggle" aria-label="Reporting date range" aria-expanded="${open}" aria-haspopup="dialog">${icon}<span>${label(committedA,committedB)}</span><svg class="dp-caret" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>`}<div class="dp-pop${open?' open':''}" role="dialog" aria-label="${single?'Session date calendar':'Reporting date range calendar'}">${single?'':`<div class="dp-rail">${presets.map(p=>`<button type="button" data-preset="${p}" class="${preset===p?'on':''}">${p}</button>`).join('')}</div>`}<div class="dp-main"><div class="dp-head"><button type="button" class="dp-nav" data-dp="prev" aria-label="Previous month">‹</button><span>${first.toLocaleDateString('en-US',{month:'long',year:'numeric',timeZone:'UTC'})}</span><button type="button" class="dp-nav" data-dp="next" aria-label="Next month">›</button></div><div class="dp-dow">${['S','M','T','W','T','F','S'].map(d=>`<span>${d}</span>`).join('')}</div><div class="dp-grid">${cells}</div>${error?`<p class="dp-error" role="alert">${error}</p>`:''}<div class="dp-foot"><span class="dp-sel">${single?fmt(start):end?label(start,end):fmt(start)+' – pick end'}</span><button type="button" class="dp-btn2" data-dp="cancel">Cancel</button><button type="button" class="dp-btn2 primary" data-dp="apply">Apply</button></div></div></div></div>`;
    }
    el.addEventListener('click',event=>{const b=event.target.closest('button');if(!b||!el.contains(b))return;const action=b.dataset.dp;
      if(action==='toggle')return toggle();if(action==='cancel')return close();
      if(action==='prev'||action==='next'){view=month(view,action==='prev'?-1:1);return render();}
      if(b.dataset.preset){preset=b.dataset.preset;[start,end]=range(preset);view=month(start,0);picking=false;error='';return render();}
      if(b.dataset.day){const day=b.dataset.day;preset='';error='';if(single){start=end=day;}else if(!picking){start=day;end=null;picking=true;}else{[start,end]=day<start?[day,start]:[start,day];picking=false;}return render();}
      if(action==='apply'){const last=end||start;if(!single&&(+parse(last)-+parse(start))/86400000+1>366){error='Range too long — maximum is 12 months';return render();}committedA=start;committedB=last;if(!single&&committedA<=TODAY&&TODAY<committedB)committedB=TODAY;close();options.onApply?.(single?committedA:{from:committedA,to:committedB});}
    },{signal:controller.signal});
    el.addEventListener('change',event=>{if(single&&event.target.matches('input[type=date]')&&parse(event.target.value)){committedA=committedB=start=end=event.target.value;view=month(start,0);options.onApply?.(committedA);}},{signal:controller.signal});
    render();return{destroy,close};
  }
  window.CoachingDatePicker={mount};
})();
