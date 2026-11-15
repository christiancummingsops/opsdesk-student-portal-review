/* Local synthetic coaching review, October 28. No accounts, vendor calls or money movement.
   Extends the approved mockup in place. Existing recorded amounts remain unchanged. */
'use strict';
(() => {
  const original = { overview, sessionDetail, filing, act, earningDetail };
  const params = new URLSearchParams(location.search);
  state.profile = params.get('profile') || '';
  state.profileTab = params.get('profileTab') || 'performance';
  state.portalTab = params.get('portalTab') === 'links' ? 'links' : 'performance';
  state.rosterFilter = 'active';
  state.rosterQuery = '';
  state.sourceFilter = 'all';
  state.payeeFilter = 'all';
  state.payStatus = 'all';
  state.payoutQuery = '';
  state.review = params.get('review') || '';
  state.reviewExample = false;
  state.sessionTypeFilter = 'all';
  state.reviewCoach = coaches.some(c=>c.id===params.get('reviewCoach')) ? params.get('reviewCoach') : 'all';
  state.payoutMonth = /^\d{4}-(0[1-9]|1[0-2])$/.test(params.get('payoutMonth') || '') ? params.get('payoutMonth') : state.from.slice(0,7);
  state.performanceQuery = '';
  const today = '2026-10-24'; // Same fixed synthetic scenario as the approved mockup.
  const products = coverage.map(([name], i) => ({
    id: ['wix','base44','hostinger','constant_contact','higgsfield','doola','xero','nw_agent','revolut','trendtrack'][i],
    name, audience: i < 4 ? 'both' : 'unset'
  }));
  const product = id => products.find(p => p.id === id);
  const coachEligible = p => p && !p.retired && ['coach','both'].includes(p.audience);
  const productId = name => products.find(p => p.name === name)?.id;
  const types = [
    { id: 'onboarding', name: 'Onboarding', requirements: '', version: 1 },
    { id: 'qa', name: 'Live Q&A', requirements: '', version: 1 }
  ];
  const arrangements = coaches.map(c => ({ coach: c.id, unit: c.rate == null ? 'commission' : 'session', amount: c.rate, effective: '2026-09-01' }));
  const assignments = [];
  const links = [];
  const invoices = [];
  const wiseDetails = new Map();
  coaches.forEach(c => { c.archived = false; c.email = ''; });
  sessions.forEach(s => { s.typeId = s.id === 's1' ? 'onboarding' : 'qa'; });
  earnings.forEach(e => {
    e.commissionPct = 15; // Preserved historical fixture terms, not a new default.
    const id = productId(e.product);
    if (id && !assignments.some(a => a.subject === e.coach && a.product === id))
      assignments.push({ subject: e.coach, product: id, rates: [{ effective: '2026-08-01', percent: 15 }], retired: false });
  });
  const stagingPortalLinks = [{"row": 4, "product": "base44", "name": "Base44", "url": "https://base44.pxf.io/c/3417626/3783676/25619?subId1=aidbportal&trafcat=pricing", "status": "live", "first": "2026-10-18 (Offer row created; live to students 2026-10-21)", "last": "2026-11-05 (live crawl)", "category": "affiliate"}, {"row": 5, "product": "base44", "name": "Base44", "url": "https://base44.pxf.io/c/3417626/2049275/25619?trafcat=base", "status": "changed (replaced by ad 3783676 link)", "first": "2026-07-23 (seed)", "last": "2026-09-20 (seed)", "category": "affiliate"}, {"row": 11, "product": "constant_contact", "name": "Constant Contact", "url": "https://join.constantcontact.com/aisilver?sid1=aidbportal", "status": "removed (retired 3 Nov, replacement offer pending)", "first": "2026-10-18", "last": "2026-11-03 (retired)", "category": "affiliate"}, {"row": 12, "product": "constant_contact", "name": "Constant Contact", "url": "https://join.constantcontact.com/ai", "status": "changed (now /aisilver?sid1=aidbportal)", "first": "2026-07-23 (seed)", "last": "2026-09-20 (seed)", "category": "affiliate"}, {"row": 25, "product": "hostinger", "name": "Hostinger", "url": "https://www.hostg.xyz/aff_c?offer_id=1407&aff_id=216352&aff_sub=aidbportal", "status": "live", "first": "2026-10-18", "last": "2026-11-05 (live crawl)", "category": "affiliate"}, {"row": 45, "product": "wix", "name": "Wix", "url": "https://wix.pxf.io/c/3417626/3740959/25616?subId1=aidbportal&trafcat=drop&sharedid={student_name}", "status": "live (Primary offer)", "first": "2026-10-18", "last": "2026-11-05 (live crawl)", "category": "affiliate"}];
  const inventoryResources = [{"row": 6, "product": "base44", "name": "Base44 (app, in-portal)", "url": "https://app.base44.com/superagent", "status": "live", "first": "2026-10-31", "last": "2026-11-05", "category": "tool link"}, {"row": 7, "product": "base44", "name": "Base44 (mobile app)", "url": "https://apps.apple.com/app/id6757432427 and https://play.google.com/store/apps/details?id=com.base44.android", "status": "live (in source)", "first": "2026-10-29", "last": "2026-11-04", "category": "tool link"}, {"row": 8, "product": "base44", "name": "Base44 (nad-boost-now app)", "url": "https://nad-boost-now.base44.app/", "status": "live (in export, not DOM-verified)", "first": "2026-10-16", "last": "2026-10-16", "category": "resource"}, {"row": 9, "product": "base44", "name": "Base44 (pricing)", "url": "https://base44.com/pricing", "status": "live (in source)", "first": "2026-11-01", "last": "2026-11-04", "category": "tool link"}];
  const stagingPortalProducts = new Set(stagingPortalLinks.map(entry => entry.product));
  for (const entry of stagingPortalLinks) {
    if (!product(entry.product)) products.push({id:entry.product,name:entry.name,audience:'unset'});
    const active = entry.status.startsWith('live');
    if (active && !assignments.some(a=>a.subject==='portal'&&a.product===entry.product)) assignments.push({subject:'portal',product:entry.product,rates:[],retired:false});
    const [token=''] = trackingFromUrl(entry.url).values;
    links.push({id:'inventory-'+entry.row,subject:'portal',product:entry.product,url:entry.url,token,active,inventory:entry});
  }
  function inventoryNote(){return `<p class="hint coo-note"><strong>Real supplied link inventory; historical observations, not live feed coverage.</strong> Rows retain their original URLs/status, last observed October–November 2026. Browser-only review edits; no production registration. Conversion records and revenue are not supplied. Other coaching names and money on this review are synthetic examples.</p>`;}
  function resourceInventory(){return section('Other portal inventory · not affiliate assignments',table('<th>Source row</th><th>Resource</th><th>Type / observed status</th>',inventoryResources.map(r=>`<tr><td>${r.row}</td><td><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.name)}</a></td><td>${esc(r.category)} · ${esc(r.status)}<small>${esc(r.last)}</small></td></tr>`).join('')));}
  const portalEligible = p => p && !p.retired && (stagingPortalProducts.has(p.id) || coachEligible(p));
  const subjectName = id => id === 'portal' ? 'Student portal' : coach(id)?.name || 'Unknown';
  const isOwner = () => state.role === 'owner';
  const ownerOnly = fn => (...args) => { if (isOwner()) return fn(...args); };
  const empty = (title, text = '') => `<div class="empty"><strong>${esc(title)}</strong>${text ? `<p>${esc(text)}</p>` : ''}</div>`;
  const table = (head, body, label = '') => `<div class="table-wrap" ${label ? `role="region" aria-label="${esc(label)}"` : ''}><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
  const section = (title, body, actions = '') => `<section class="panel"><div class="panel-head"><h2>${esc(title)}</h2>${actions}</div>${body}</section>`;
  const options = (values, current) => values.map(([value, label]) => `<option value="${esc(value)}" ${current === value ? 'selected' : ''}>${esc(label)}</option>`).join('');
  const typeName = id => types.find(t => t.id === id)?.name || 'Not set';
  const fmtMonth = m => new Date(m + '-15T12:00:00').toLocaleDateString('en-CA', { month: 'long', year: 'numeric' });
  const activeLinks = (subject, id) => links.filter(l => l.subject === subject && l.product === id && l.active);
  const assigned = subject => assignments.filter(a => a.subject === subject && !a.retired);
  const currentPercent = a => a.rates.filter(r => r.effective <= today).sort((a,b) => b.effective.localeCompare(a.effective))[0]?.percent;
  const arrangement = id => arrangements.filter(a => a.coach === id && a.effective <= today).sort((a,b) => b.effective.localeCompare(a.effective))[0];
  const arrangementLabel = id => {
    const a = arrangement(id);
    return !a ? 'Not configured' : a.unit === 'commission' ? 'Commission only' : `${cad(a.amount)} / ${a.unit === 'hour' ? 'hour' : 'session'}`;
  };
  function closeModal() { if ($('#modal').open) $('#modal').close(); }
  function show(title, body, footer = '') { closeModal(); openModal(esc(title), body, footer); }
  function formError(text) { $('#form-error').textContent = text; }
  function afterSave(message) { closeModal(); render(); toast(message); }

  tabs = () => own()
    ? [['overview','My earnings'],['sessions','My sessions'],['affiliates','Monthly performance'],['coverage','Product coverage']]
    : [['overview','Overview'],['sessions','Call reviews'],['affiliates','Monthly performance'],['coaches','Coaches'],['coach-products','Products'],['portal','Student portal'],['types','Session types'],['coverage','Data coverage']];

  let lastReviewSearch = location.search;
  url = function () {
    // The original popstate handler renders first. Restore catalogue state here
    // before that render can write an outdated expansion back into history.
    if (location.search !== lastReviewSearch) {const navigation=new URLSearchParams(location.search);state.review=navigation.get('review')||'';state.reviewCoach=coaches.some(c=>c.id===navigation.get('reviewCoach'))?navigation.get('reviewCoach'):'all';state.reviewExample=false;catalogueState.expanded=navigation.get('product')||'';state.portalTab=navigation.get('portalTab')==='links'?'links':'performance';const month=navigation.get('payoutMonth');if(/^\d{4}-(0[1-9]|1[0-2])$/.test(month||''))state.payoutMonth=month;}
    const p = new URLSearchParams({ role: state.role, tab: state.tab, from: state.from, to: state.to, variant: state.variant });
    if (state.tab === 'coaches' && state.profile) { p.set('profile', state.profile); p.set('profileTab', state.profileTab); }
    if (['products','coach-products'].includes(state.tab) && catalogueState.expanded) p.set('product',catalogueState.expanded);
    if(state.tab==='portal')p.set('portalTab',state.portalTab);
    if(state.tab==='payouts')p.set('payoutMonth',state.payoutMonth);
    if(state.tab==='sessions'&&isOwner()&&state.review)p.set('review',state.review);
    if(state.tab==='sessions'&&!own()&&state.reviewCoach!=='all')p.set('reviewCoach',state.reviewCoach);
    const next = '?' + p;
    if (initialRender) { history.replaceState(null, '', next); initialRender = false; }
    else if (location.search !== next) history.pushState(null, '', next);
    lastReviewSearch = next;
  };

  render = function () {
    const isPayout = state.tab === 'payouts' && isOwner();
    const isProducts = state.tab === 'products' && isOwner();
    const isWorkspace = isPayout || isProducts;
    if (!isWorkspace && !tabs().some(([id]) => id === state.tab)) state.tab = 'overview';
    if (own()) { state.profile = ''; state.sourceFilter = 'coaches'; }
    if (state.profile && !coach(state.profile)) state.profile = '';
    if(state.tab==='coach-products' && catalogueState.expanded && !coachEligible(product(catalogueState.expanded)))catalogueState.expanded='';
    url();
    const titles = { overview: own() ? 'My coaching' : 'Coaching', affiliates: 'Monthly performance', coaches: 'Coaches', portal: 'Student portal', sessions: own() ? 'My sessions' : 'Call reviews', types: 'Session types', coverage: 'Product coverage', payouts: 'Payouts', products: 'Manage products', 'coach-products':'Products for coaches' };
    const profile = state.tab === 'coaches' && state.profile ? coach(state.profile) : null;
    const selectedReview = state.tab==='sessions'&&isOwner()?sessions.find(s=>s.id===state.review):null;
    const blocked = own() && coach('avery').archived;
    const body = blocked ? section('Access ended', empty('This coach is archived', 'Historical records are retained. Contact your administrator.'))
      : selectedReview ? reviewPage(selectedReview)
      : profile ? profilePage(profile)
      : state.tab === 'overview' ? overview()
      : state.tab === 'affiliates' ? affiliatePage()
      : state.tab === 'coaches' ? rosterPage()
      : state.tab === 'portal' ? portalPage()
      : state.tab === 'sessions' ? sessionPage()
      : state.tab === 'types' ? typesPage()
      : state.tab === 'payouts' ? payoutPage() : state.tab === 'products' ? cataloguePage() : state.tab === 'coach-products' ? cataloguePage(true) : coveragePage();
    $('#app').innerHTML = `<div class="shell ${isProducts?'products-workspace':isPayout?'payouts-workspace':selectedReview?'call-review-workspace':''}"><aside class="sidebar"><div class="brand"><img src="assets/adb.png" alt=""><strong>ADB <span>· OpsDesk</span></strong></div><div class="nav-caption">WORKSPACE</div><nav class="nav">
      <button class="${isWorkspace?'':'active'}" data-action="tab:overview"><span>◫</span> ${own()?'My coaching':'Coaching'}</button>
      ${!own()?'<button data-action="workspace:Dashboard">◫ Dashboard ↗</button><button data-action="workspace:Lead-sources">▤ Lead sources ↗</button><button data-action="workspace:Pods">⊞ Pods ↗</button>':''}
      ${isOwner()?`<button data-action="coo:team">♧ Team</button><button class="${isPayout?'active':''}" data-action="tab:payouts">▣ Payouts</button><button class="${isProducts?'active':''}" data-action="coo:catalogue">⊞ Products</button>`:''}
      </nav><div class="sidebar-bottom"><div class="name-cell"><span class="avatar">${own()?'AS':isOwner()?'OW':'MG'}</span><span><strong>${own()?'Avery Stone':isOwner()?'Owner (Admin)':'Manager'}</strong><small>${own()?'Coach':isOwner()?'Admin':'Manager'}</small></span></div></div></aside>
      <div class="main"><header class="topbar"><div>${isPayout?'<h1 class="payout-title">Payouts</h1>':isProducts?'<div class="products-title"><button class="btn ghost small" data-action="coo:catalogue-back" aria-label="Back to coaching" title="Back to coaching">←</button><h1>Manage products</h1></div>':`<span class="mobile-brand">ADB · </span>${own()?'My workspace':'Workspace'} <span class="muted">/</span> ${isPayout?'Payouts':'Coaching'}`}</div><div class="topbar-actions"><label>Role <select id="role" aria-label="Role">${options([['owner','Owner (Admin)'],['manager','Manager'],['coach','Coach']],state.role)}</select></label><div id="report-picker"></div><button class="theme-toggle" data-theme-toggle aria-label="Switch to ${document.documentElement.dataset.theme==='dark'?'light':'dark'} mode">◐</button></div></header>
      <main class="content variant-dashboard"><div class="page-head"><div>${profile?'<button class="btn ghost small" data-action="coo:back" aria-label="Back to coaches" title="Back to coaches">←</button>':isProducts?'<button class="btn ghost small" data-action="coo:catalogue-back" aria-label="Back to coaching" title="Back to coaching">←</button>':''}<h1>${esc(profile?.name||titles[state.tab])}</h1><p class="subtitle">${profile?`${esc(profile.focus)} · ${profile.archived?'Archived':'Active'} · ADB`:state.tab==='payouts'?'ADB · one place to reconcile and pay your team':own()?'Your sessions and private compensation.':state.role==='manager'?'Read-only coaching activity and finances.':''}</p></div><div class="actions">${!blocked&&own()?btn('+ File a session','file','primary'):profile&&isOwner()?btn('Edit coach','coo:edit/'+profile.id)+btn(profile.archived?'Restore coach':'Archive coach','coo:archive/'+profile.id,profile.archived?'':'danger'):state.tab==='coaches'&&isOwner()?btn('+ Add coach','coo:add','primary'):state.tab==='types'&&isOwner()?btn('+ Add session type','coo:type/new','primary'):''}${state.tab==='coach-products'&&isOwner()?btn('Manage all products','coo:catalogue','small'):''}${isOwner()?btn(isPayout?'Back to coaching':'Payouts',isPayout?'tab:overview':'tab:payouts','small'):''}</div></div>
      ${isWorkspace||profile||selectedReview?'':`<nav class="tabs" aria-label="Coaching sections">${tabs().map(([id,label])=>`<button data-action="tab:${id}" class="${state.tab===id?'active':''}" aria-current="${state.tab===id?'page':'false'}">${esc(label)}</button>`).join('')}</nav>`}${body}</main></div></div>
      <nav class="bottom-nav" ${profile||isProducts||selectedReview?'hidden':''}>${(isPayout?[['overview','Coaching'],['payouts','Payouts']]:tabs().slice(0,4)).map(([id,label])=>`<button data-action="tab:${id}" class="${state.tab===id?'active':''}">${esc(label)}</button>`).join('')}</nav>`;
    bind();
    bindReview();
    CoachingDatePicker.mount($('#report-picker'), { mode:'range', from:state.from, to:state.to, onApply:({from,to})=>{state.from=from;state.to=to;render();} });
  };

  overview = () => inventoryNote()+section('Student Portal revenue','<p class="hint">Unavailable — supplied inventory has no dated vendor purchase/amount/status records. No portal total or zero is inferred. Original coaching figures below are synthetic demonstrations.</p>')+reviewOverviewEntry() + original.overview()
    .replaceAll('15% affiliate compensation','Affiliate compensation')
    .replaceAll('15% affiliate cost','Affiliate cost')
    .replaceAll('15% of preserved Products CPA','Preserved coach/product terms')
    + (own()?section('Your invoices',table('<th>Earning month</th><th>Invoice</th><th></th>',monthRows('avery').map(r=>`<tr><td>${fmtMonth(r.month)}</td><td>${invoices.some(i=>i.coach==='avery'&&i.month===r.month)?badge('Provided','good'):badge('Needed','warn')}</td><td>${btn('Provide invoice','coo:invoice/avery/'+r.month,'small')}</td></tr>`).join('')||'<tr><td colspan="3">No earning months in this range.</td></tr>')):'');

  function reviewOverviewEntry() {
    if(own())return '';
    return `<section class="review-entry" aria-label="Call reviews"><div class="review-entry-copy"><span class="review-entry-label">COACH QUALITY</span><h2>Call reviews</h2><p>Review coach recordings, score call quality and check how students are treated.</p><small>${allSessions().length} recordings in selected dates · Choose a recording, then select Review call.</small></div><div class="review-entry-actions">${btn(isOwner()?'Review calls →':'View call records →','coo:open-reviews','primary')}${btn(isOwner()?'Set review requirements':'View review requirements','tab:types','ghost small')}</div></section>`;
  }

  function rosterPage() {
    const filtered = coaches.filter(c => (state.rosterFilter === 'all' || (state.rosterFilter === 'archived') === c.archived)
      && `${c.name} ${c.focus} ${c.email}`.toLowerCase().includes(state.rosterQuery.toLowerCase()));
    return `<div class="grid metrics">${metric('Active coaches',coaches.filter(c=>!c.archived).length,'Current team')}${metric('Archived coaches',coaches.filter(c=>c.archived).length,'History preserved')}${metric('Assigned products',assignments.filter(a=>a.subject!=='portal'&&!a.retired).length,'Coach/product assignments')}${metric('Session records',sessions.length,'Includes archived coaches')}</div>`
      + section('Coach management', `<div class="toolbar"><input id="roster-query" type="search" aria-label="Search coaches" placeholder="Search coaches…" value="${esc(state.rosterQuery)}"><select id="roster-filter" aria-label="Coach status">${options([['active','Active coaches'],['archived','Archived coaches'],['all','All coaches']],state.rosterFilter)}</select></div>`
      + table('<th>Coach</th><th>Status</th><th>Session arrangement</th><th>Products / links</th><th></th>', filtered.map(c=>`<tr><td>${person(c.id)}</td><td>${badge(c.archived?'Archived':'Active',c.archived?'neutral':'good')}</td><td>${esc(arrangementLabel(c.id))}</td><td>${assigned(c.id).length} products<small>${links.filter(l=>l.subject===c.id&&l.active&&l.url).length} links recorded</small></td><td><div class="actions">${btn('View profile','coo:profile/'+c.id,'ghost small',`aria-label="View ${esc(c.name)} profile"`)}${isOwner()?btn(c.archived?'Restore':'Archive','coo:archive/'+c.id,'ghost small',`aria-label="${c.archived?'Restore':'Archive'} ${esc(c.name)}"`):''}</div></td></tr>`).join('') || '<tr><td colspan="5">No coaches match these filters.</td></tr>'));
  }

  function profilePage(c) {
    const pages = [['performance','Performance'],['rates','Rate card'],['links','Products & links'],['sessions','Sessions'],['payment','Payment details']];
    const nav = `<nav class="profile-tabs" aria-label="Coach profile sections">${pages.map(([id,label])=>btn(label,'coo:profile-tab/'+id,`small ${state.profileTab===id?'primary':''}`)).join('')}</nav>`;
    if (state.profileTab === 'rates') return nav + rateCard(c);
    if (state.profileTab === 'links') return nav + assignmentsPage(c.id);
    if (state.profileTab === 'sessions') return nav + section('Session history', sessionRows(sessions.filter(s=>s.coach===c.id&&inPeriod(s.date))));
    if (state.profileTab === 'payment') return nav + paymentDetails(c);
    const f = financial(c.id);
    return nav + `<div class="grid metrics">${metric('Company revenue',cad(f.revenue),'Selected period')}${metric('Session compensation',cad(f.session),'Stamped session amounts')}${metric('Affiliate compensation',cad(f.affiliate),'Preserved commercial terms')}${metric('Payments made',cad(f.paid),'By payment date')}</div>`
      + coachReviewSummary(c.id)
      + reportPanel(c.id)
      + section('Monthly performance', performanceTable(c.id))
      + section('Session history',sessionRows(sessions.filter(s=>s.coach===c.id&&inPeriod(s.date))));
  }

  function rateCard(c) {
    return section('Session arrangement', `<div class="panel-body"><div class="money-line"><span>Current arrangement</span><strong>${esc(arrangementLabel(c.id))}</strong></div>${arrangements.filter(a=>a.coach===c.id).sort((a,b)=>b.effective.localeCompare(a.effective)).map(a=>`<div class="money-line"><span>Effective ${esc(a.effective)}</span><strong>${a.unit==='commission'?'Commission only':`${cad(a.amount)} / ${a.unit==='hour'?'hour':'session'}`}</strong></div>`).join('')}<p class="hint coo-note">Filed amounts stay fixed. Hourly billing needs agreed duration and rounding rules before creating new payable amounts.</p></div>`,isOwner()?btn('Add dated arrangement','coo:arrangement/'+c.id,'small'):'')
      + section('Product commissions', table('<th>Product</th><th>Applied commission</th><th>Effective date</th><th></th>',assigned(c.id).map(a=>{const r=a.rates.filter(r=>r.effective<=today).sort((a,b)=>b.effective.localeCompare(a.effective))[0];return `<tr><td>${esc(product(a.product).name)}</td><td>${r?`${r.percent}% of Products CPA`:'Not configured'}</td><td>${r?.effective||'—'}</td><td>${isOwner()?btn('Manage terms','coo:terms/'+c.id+'/'+a.product,'ghost small'):badge('Read-only')}</td></tr>`;}).join('')||'<tr><td colspan="4">No assigned products.</td></tr>'));
  }



  function portalPage() {
    const portalLinks=links.filter(l=>l.subject==='portal'&&l.url),portalAssignments=assigned('portal');
    const nav=`<nav class="profile-tabs" aria-label="Student portal sections">${[['performance','Performance'],['links','Products & links']].map(([id,label])=>btn(label,'coo:portal-tab/'+id,`small ${state.portalTab===id?'primary':''}`,`aria-current="${state.portalTab===id?'page':'false'}"`)).join('')}</nav>`;
    if(state.portalTab==='links')return nav+inventoryNote()+assignmentsPage('portal')+resourceInventory()
      + (isOwner()?`<div class="actions">${btn('Record historical link','coo:portal-history','ghost small')}</div>`:'');
    // This view has no connected vendor purchase records. A recorded URL is
    // evidence of link ownership, never evidence of a purchase or revenue.
    const ids=[...new Set([...portalAssignments.map(a=>a.product),...portalLinks.map(l=>l.product)])];
    const rows=products.filter(p=>ids.includes(p.id));
    const body=rows.map(p=>{
      const a=portalAssignments.find(a=>a.product===p.id),current=activeLinks('portal',p.id).find(l=>l.url),historical=portalLinks.filter(l=>l.product===p.id&&!l.active).length;
      const status=!a?['Historical links only','neutral']:!portalEligible(p)?['Availability needed','warn']:!current?['Link needed','warn']:['Link recorded','good'];
      return `<tr><td><strong>${esc(p.name)}</strong><small>Student portal</small></td><td>${badge(...status)}${historical?`<small>${historical} historical ${historical===1?'link':'links'}</small>`:''}</td><td class="num">Unknown</td><td class="num">Unknown</td><td>Unknown</td><td>${btn('View activity','coo:portal-product/'+p.id,'ghost small',`aria-label="View ${esc(p.name)} portal activity"`)}</td></tr>`;
    }).join('')||'<tr><td colspan="6">No portal products or historical links recorded.</td></tr>';
    return nav+inventoryNote()+`<div class="grid metrics">${metric('Portal revenue','Unknown','Company revenue · CAD')}${metric('Confirmed purchases','Unknown','Vendor-confirmed purchases')}${metric('Assigned products',portalAssignments.length,'Current portal assignments')}${metric('Recorded links',portalLinks.length,'Current & historical URLs')}</div>`
      + section('Portal performance by product',`<div class="toolbar"><span class="hint">${monthLabel()} · Student portal</span></div>${table('<th>Product</th><th>Link status</th><th class="num">Confirmed purchases</th><th class="num">Company revenue · CAD</th><th>Last purchase</th><th></th>',body,'Portal performance by product')}`,btn(isOwner()?'Manage products & links':'View products & links','coo:portal-tab/links','small'))
      + `<p class="hint coo-note">Purchase and revenue figures remain unknown until dated vendor sales records are connected. Recording a link does not record a sale.</p>`;
  }
  function portalProductActivity(id) {
    const p=product(id);if(!p)return;
    const records=links.filter(l=>l.subject==='portal'&&l.product===id);
    show(`${p.name} · Student portal`,`<p>${esc(monthLabel())}</p><div class="grid detail-grid">${metric('Confirmed purchases','Unknown','Vendor sales not connected')}${metric('Company revenue','Unknown','CAD · no verified revenue records')}</div><h3>Recorded portal links</h3>${table('<th>Affiliate link / tracking ID</th><th>Status</th>',records.map(l=>`<tr><td><span class="link-text">${esc(l.url||'URL not recorded')}</span><small>${esc(l.token)}${l.inventory?' · CSV row '+l.inventory.row+' · '+esc(l.inventory.status)+' · last seen '+esc(l.inventory.last):''}</small></td><td>${badge(l.active?'Current':'Historical',l.active?'good':'neutral')}</td></tr>`).join('')||'<tr><td colspan="2">No portal links recorded for this product.</td></tr>')}<p class="hint">Only vendor-confirmed purchases attributed to portal links belong in this report. Coach sales and coach compensation stay separate.</p>`,btn('Close','close'));
  }
  function portalHistoricalLinkForm() {
    show('Record historical portal link',`<form id="portal-history-form" class="form-grid"><label>Existing product<select name="product" required>${options(products.map(p=>[p.id,p.name+(p.retired?' · retired':'' )]),'base44')}</select></label>${affiliateLinkFields()}<p class="hint">Record a previously used portal link. This retains its ownership without replacing the current link or creating a sale.</p><p class="error" id="form-error" role="alert"></p><button class="btn primary" type="submit">Record historical link</button></form>`,btn('Cancel','close'));
    const readLink=bindAffiliateLinkFields($('#portal-history-form'));
    $('#portal-history-form').addEventListener('submit',event=>{
      event.preventDefault();const id=String(new FormData(event.target).get('product')),{url,token,error}=readLink(),validation=error||linkValidation('portal',url,token);
      if(!product(id))return formError('Select an existing product.');
      if(validation)return formError(validation);
      if(links.some(l=>l.subject==='portal'&&l.url===url))return formError('This portal link is already recorded.');
      links.push({id:'portal-history-'+Date.now(),subject:'portal',product:id,url,token,active:false});
      afterSave('Historical portal link recorded. The current link and revenue are unchanged.');
    });
  }

  function coachForm(id) {
    const c=id?coach(id):null;
    show(c?'Edit coach':'Add coach',`<form id="coach-form" class="form-grid"><label>Name<input name="name" required maxlength="100" value="${esc(c?.name||'')}"></label><label>Roster email<input name="email" type="email" ${c?'':'required'} value="${esc(c?.email||'')}"></label><label>Focus<input name="focus" maxlength="120" value="${esc(c?.focus||'')}"></label><p class="hint">Set the coach's rate card and assigned links from their profile. No default rate is added.</p><p class="error" id="form-error" role="alert"></p><button class="btn primary" type="submit">${c?'Save coach':'Add coach'}</button></form>`,btn('Cancel','close'));
    $('#coach-form').addEventListener('submit',event=>{
      event.preventDefault(); const f=new FormData(event.target),name=String(f.get('name')).trim(),email=String(f.get('email')).trim(),focus=String(f.get('focus')).trim();
      if(!name||(!c&&!email))return formError('Enter a name and roster email.');
      if(email&&coaches.some(x=>x!==c&&x.email.toLowerCase()===email.toLowerCase()))return formError('That roster email is already assigned.');
      if(c)Object.assign(c,{name,email,focus,initials:name.split(/\s+/).slice(0,2).map(n=>n[0]).join('')});
      else {const entry={id:'coach-'+Date.now(),name,email,focus,initials:name.split(/\s+/).slice(0,2).map(n=>n[0]).join(''),rate:null,archived:false};coaches.push(entry);state.profile=entry.id;state.profileTab='rates';state.tab='coaches';}
      afterSave(c?'Coach updated.':'Coach added. Set their commercial terms and links.');
    });
  }

  function archiveCoach(id) {
    const c=coach(id);if(!c)return;
    show(c.archived?'Restore coach':'Archive coach',`<p><strong>${esc(c.name)}</strong></p><p>${c.archived?'Restore this coach to the active roster.':'End this coach’s access and ability to file sessions. Their sessions, links, earnings and payment history stay available in reports.'}</p>`,btn(c.archived?'Restore coach':'Archive coach','coo:confirm-archive/'+id,c.archived?'primary':'danger')+btn('Cancel','close'));
  }

  function arrangementForm(id) {
    show('Add dated arrangement',`<form id="arrangement-form" class="form-grid"><label>Compensation arrangement<select name="unit" id="arrangement-unit">${options([['session','Per session'],['hour','Per hour'],['commission','Commission only']],'session')}</select></label><label id="arrangement-amount">Amount · CAD<input name="amount" type="number" min="0" step="0.01" required placeholder="Enter an agreed amount"></label><label>Effective date<input name="effective" type="date" min="2026-10-25" value="2026-10-25" required></label><p class="hint">Existing filed amounts and historical product commissions stay unchanged.</p><p id="form-error" class="error" role="alert"></p><button class="btn primary" type="submit">Save arrangement</button></form>`,btn('Cancel','close'));
    $('#arrangement-unit').addEventListener('change',event=>{const input=$('#arrangement-amount input'),commission=event.target.value==='commission';$('#arrangement-amount').hidden=commission;input.required=!commission;});
    $('#arrangement-form').addEventListener('submit',event=>{
      event.preventDefault();const f=new FormData(event.target),unit=String(f.get('unit')),effective=String(f.get('effective')),raw=String(f.get('amount')||'').trim(),amount=unit==='commission'?null:Number(raw);
      if(effective<='2026-10-24'||(unit!=='commission'&&(!raw||!Number.isFinite(amount)||amount<0)))return formError('Enter an explicit nonnegative amount and a future effective date.');
      if(arrangements.some(a=>a.coach===id&&a.effective===effective))return formError('An arrangement already exists for that date.');
      arrangements.push({coach:id,unit,amount,effective});if(unit==='session')sessionRates.push({coach:id,date:effective,amount});
      afterSave('Future arrangement saved. Existing filed amounts are unchanged.');
    });
  }



  // Only the tracking fields documented in this review are recognized. Campaign
  // UTMs and generic partner/referrer IDs must not be guessed to identify a coach.
  function trackingFromUrl(url) {
    let parsed; try { parsed = new URL(url); } catch { return { valid:false, values:[] }; }
    const values = [...new Set([...parsed.searchParams].filter(([key,value]) => ['subid1','affid','aff_sub','sid1'].includes(key.toLowerCase()) && value.trim()).map(([,value]) => value.trim()))];
    return { valid:parsed.protocol === 'https:', values };
  }
  function affiliateLinkFields(previous, optional = false) {
    return `<label>Affiliate link<input name="url" type="url" ${optional?'':'required'} placeholder="Paste the complete affiliate link" value="${esc(previous?.url||'')}"></label><p class="hint" data-tracking-status aria-live="polite">Paste the full link, including its tracking parameters.</p><label data-manual-tracking hidden>Tracking ID<input name="token" aria-label="Tracking ID" aria-describedby="affiliate-tracking-help" value="${esc(previous?.token||'')}" placeholder="ID shown in vendor sales reports"><span class="hint" data-tracking-help id="affiliate-tracking-help"></span></label>`;
  }
  function bindAffiliateLinkFields(form) {
    const urlInput=form.elements.url, tokenInput=form.elements.token, manual=form.querySelector('[data-manual-tracking]'), status=form.querySelector('[data-tracking-status]'), help=form.querySelector('[data-tracking-help]');
    let previousUrl=urlInput.value.trim();
    const update=()=>{
      const url=urlInput.value.trim(), tracking=trackingFromUrl(url);
      if(url!==previousUrl){tokenInput.value='';previousUrl=url;}
      const detected=tracking.valid&&tracking.values.length===1, needsId=tracking.valid&&!detected;
      manual.hidden=!needsId;tokenInput.disabled=!needsId;tokenInput.required=needsId;
      status.textContent=detected?'Tracking ID found in link: '+tracking.values[0]:needsId?'A separate tracking ID is needed for this link.':'Paste the full link, including its tracking parameters.';
      help.textContent=tracking.values.length>1?'Multiple tracking IDs appear in this link. Enter the one the vendor reports for this coach or portal.':'This link does not expose a recognized coach or portal ID. Enter the identifier shown in the vendor’s sales reports.';
      const error=form.querySelector('#form-error');if(error)error.textContent='';
    };
    urlInput.addEventListener('input',update);update();
    return ()=>{
      const url=urlInput.value.trim(), tracking=trackingFromUrl(url), token=tracking.valid&&tracking.values.length===1?tracking.values[0]:tokenInput.value.trim();
      return {url,token,error:tracking.values.length>1&&!tracking.values.includes(token)?'Enter a tracking ID that appears in this link.':''};
    };
  }
  function linkForm(subject,id) {
    const previous=activeLinks(subject,id)[0];
    show('Manage affiliate link',`<p>${esc(subjectName(subject))} · ${esc(product(id).name)}</p><form id="affiliate-link-form" class="form-grid">${affiliateLinkFields(previous)}<p class="hint">Replacing a link retires the old URL; historical attribution remains attached to its original profile.</p><p class="error" id="form-error" role="alert"></p><button class="btn primary" type="submit">Save affiliate link</button></form>`,btn('Cancel','close'));
    const readLink=bindAffiliateLinkFields($('#affiliate-link-form'));
    $('#affiliate-link-form').addEventListener('submit',event=>{
      event.preventDefault();const {url,token,error}=readLink(),validation=error||linkValidation(subject,url,token);
      if(validation)return formError(validation);
      if(previous?.url===url&&previous.token===token)return afterSave('Affiliate link unchanged.');
      activeLinks(subject,id).forEach(l=>l.active=false);links.push({id:'link-'+Date.now(),subject,product:id,url,token,active:true});afterSave('Affiliate link saved. Previous attribution retained.');
    });
  }

  function termsForm(subject,id) {
    const a=assignments.find(a=>a.subject===subject&&a.product===id);
    if(!a||subject==='portal')return;
    show('Product commission terms',`<p>${esc(subjectName(subject))} · ${esc(product(id).name)}</p><div class="rate-history">${a.rates.map(r=>`<p>${esc(r.effective)} · ${r.percent}% of preserved Products CPA</p>`).join('')||'<p>No agreed rate recorded.</p>'}</div><form id="terms-form" class="form-grid"><label>Commission · percent of Products CPA<input name="percent" type="number" min="0" max="100" step="0.01" required placeholder="Enter agreed percentage"></label><label>Effective date<input name="effective" type="date" min="2026-10-25" value="2026-10-25" required></label><p class="hint">Historical earnings keep their original terms. USD-to-CAD capture and rounding policy remain separate.</p><p class="error" id="form-error" role="alert"></p><button class="btn primary" type="submit">Save future terms</button></form>`,btn('Cancel','close'));
    $('#terms-form').addEventListener('submit',event=>{event.preventDefault();const f=new FormData(event.target),raw=String(f.get('percent')).trim(),percent=Number(raw),effective=String(f.get('effective'));if(!raw||!Number.isFinite(percent)||percent<0||percent>100||effective<=today)return formError('Enter an agreed percentage and future effective date.');if(a.rates.some(r=>r.effective===effective))return formError('Terms for that date already exist.');a.rates.push({percent,effective});afterSave('Future product terms saved. Historical earnings unchanged.');});
  }

  // One shared synthetic catalogue: existing product identities and fixture CPA inputs.
  // No production records or observed live financial figures are imported.
  const catalogueState = { expanded: params.get('product') || '', query: '', audience: 'all', returnTo: null };
  const catalogueVariants = products.flatMap(p => {
    const rows = earnings.filter(e => e.product === p.name && e.cpa != null && !/unknown/i.test(e.variant));
    return [...new Set(rows.map(e => e.variant))].map(name => {
      const evidence = rows.find(e => e.variant === name);
      return { product: p.id, name, cpa: evidence.cpa, cashValue:null, closer: null, setter: null };
    });
  });
  const audienceName = key => ({ both:'Coaches & closers', coach:'Coaches only', closer:'Closers only', unset:'Not configured' }[key]);
  const productVariants = id => catalogueRateCards.filter(c=>c.product===id&&c.effective<=today).sort((a,b)=>b.effective.localeCompare(a.effective))[0]?.rows || catalogueVariants.filter(v => v.product === id);
  const cpaRange = id => {
    const values = productVariants(id).map(v => v.cpa).filter(v=>v!=null);
    if (!values.length) return 'Unknown';
    const min = Math.min(...values), max = Math.max(...values);
    return usd(min) + (min === max ? '' : ' – ' + usd(max));
  };
  function linkValidation(subject, url, token) {
    let parsed; try { parsed = new URL(url); } catch { return 'Enter a valid affiliate URL.'; }
    if (['instagram.com','facebook.com','tiktok.com','twitter.com','x.com','youtube.com','youtu.be','linkedin.com','discord.com','discord.gg'].some(h=>parsed.hostname===h||parsed.hostname.endsWith('.'+h))) return 'Use a vendor affiliate link, not a social or community link.';
    if (parsed.username || parsed.password) return 'Do not include account credentials in a URL.';
    if (parsed.protocol !== 'https:' || !token) return 'Use an HTTPS affiliate link and its tracking ID.';
    if (coaches.some(c => [c.name,c.name.split(/\s+/)[0]].some(name => name.toLowerCase() === token.toLowerCase()))) return 'This token conflicts with a roster name. Use a distinct attribution token.';
    if (links.some(l => l.subject !== subject && l.token.toLowerCase() === token.toLowerCase())) return 'This tracking ID belongs to another profile, including its retained history.';
    if (links.some(l => l.subject !== subject && l.url === url)) return 'This URL belongs to another profile.';
    return '';
  }
  function catalogue(id) {
    if (!isOwner()) return;
    closeModal();
    if (state.tab !== 'products') catalogueState.returnTo = { tab:state.tab, profile:state.profile, profileTab:state.profileTab };
    state.tab = 'products';
    catalogueState.expanded = id || '';
    catalogueState.query = '';
    render();
  }
  function returnFromCatalogue() {
    const target = catalogueState.returnTo || { tab:'coaches', profile:'', profileTab:'links' };
    Object.assign(state,target); render();
  }
  const catalogueHistory = [];
  const catalogueRateCards = [];
  const productTone = id => ({wix:'#3D63C9',base44:'#5B7FDB',constant_contact:'#8DA4E4',hostinger:'#42517E',higgsfield:'#B9C6EE',doola:'#2DB8A8',revolut:'#5FD3C5',xero:'#1E6B63',nw_agent:'#A78BFA',trendtrack:'#FB923C'}[id] || 'var(--accent)');
  const catalogueMoney = (value, currency='USD') => value == null ? '—' : (currency==='CAD'?'C$':'$') + Number(value).toLocaleString('en-CA',{maximumFractionDigits:2});
  const catalogueSpan = (rows, field, currency='USD') => {
    const values=rows.map(r=>r[field]).filter(v=>v!=null);
    if(!values.length)return '—';
    const low=Math.min(...values),high=Math.max(...values);
    return catalogueMoney(low,currency)+(low===high?'':' – '+catalogueMoney(high,currency));
  };
  const fullCycleValue = row => row.closer==null||row.setter==null ? null : row.closer+row.setter;
  const catalogueDate = date => date?new Date(date+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'2-digit'}):'—';
  const catalogueChevron = '<svg class="chev" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>';

  function catalogueEdit(id) {
    const rows=productVariants(id);
    if(!rows.length)return;
    catalogueState.edit={id,effective:today,rows:rows.map(r=>({...r,cpa:r.cpa??'',cashValue:r.cashValue??'',closer:r.closer??'',setter:r.setter??''})),error:''};
    render();
  }
  function saveCatalogueRates() {
    const draft=catalogueState.edit;if(!draft)return;
    if(!/^\d{4}-\d{2}-\d{2}$/.test(draft.effective)||!Number.isFinite(Date.parse(draft.effective))||dateISO(draft.effective)!==draft.effective||draft.effective<today){draft.error='Historical repricing is not connected in this local review. Choose October 24, 2026 or a later effective date.';return render();}
    if(catalogueRateCards.some(c=>c.product===draft.id&&c.effective===draft.effective)){draft.error='A rate card already exists for that effective date. Choose another date.';return render();}
    const rows=draft.rows.map(row=>({...row,...Object.fromEntries(['cpa','cashValue','closer','setter'].map(field=>[field,row[field]===''?null:Number(row[field])]))}));
    if(rows.some(r=>r.cpa==null)){draft.error='Enter a CPA for each variant. An unknown CPA cannot be saved as zero.';return render();}
    if(rows.some(r=>['cpa','cashValue','closer','setter'].some(field=>r[field]!=null&&(!Number.isFinite(r[field])||r[field]<0)))){draft.error='Amounts must be nonnegative numbers. Leave unconfigured amounts blank.';return render();}
    const previous=productVariants(draft.id),changes=[];
    rows.forEach((row,i)=>['cpa','cashValue','closer','setter'].forEach(field=>{if(row[field]!==previous[i][field])changes.push(row.name+' · '+({cpa:'CPA',cashValue:'Cash value',closer:'Closer',setter:'Setter'}[field])+': '+catalogueMoney(previous[i][field],['closer','setter'].includes(field)?'CAD':'USD')+' → '+catalogueMoney(row[field],['closer','setter'].includes(field)?'CAD':'USD'));}));
    if(!changes.length){catalogueState.edit=null;render();return toast('No rate changes.');}
    catalogueRateCards.push({product:draft.id,effective:draft.effective,rows});
    catalogueHistory.push({product:draft.id,effective:draft.effective,changes});
    catalogueState.edit=null;render();toast('Dated product rates saved. Filed coaching earnings retain their recorded amounts.');
  }
  function catalogueRetirement(id,retired) {
    show(retired?'Retire product':'Restore product',`<p><strong>${esc(product(id).name)}</strong></p><p>${retired?'Remove this product from the active ADB catalogue. Existing coach assignments, links and recorded earnings are retained.':'Return this product to the active ADB catalogue. Its availability setting and history are retained.'}</p>`,btn(retired?'Retire product':'Restore product','coo:confirm-product-retire/'+id+'/'+(retired?'yes':'no'),retired?'danger':'primary')+btn('Cancel','close'));
  }
  function catalogueRateInput(row,index,field) {
    return `<input class="cellin" type="number" min="0" step="0.01" data-catalogue-rate="${index}/${field}" aria-label="${esc(row.name)} ${esc({cpa:'CPA USD',cashValue:'cash value USD',closer:'closer commission CAD',setter:'setter commission CAD'}[field])}" value="${esc(row[field])}" placeholder="—">`;
  }
  function catalogueDetails(p,readOnly=false) {
    const draft=!readOnly&&catalogueState.edit?.id===p.id?catalogueState.edit:null,rows=draft?draft.rows:productVariants(p.id),history=catalogueHistory.filter(h=>h.product===p.id);
    const variants=rows.map((v,i)=>`<tr class="var-row"><td></td><td><span class="vcell">${esc(v.name)}</span></td><td class="num">${draft?catalogueRateInput(v,i,'cpa'):catalogueMoney(v.cpa)}</td><td class="num">${draft?catalogueRateInput(v,i,'cashValue'):catalogueMoney(v.cashValue)}</td><td></td><td class="num">${draft?catalogueRateInput(v,i,'closer'):catalogueMoney(v.closer,'CAD')}</td><td class="num">${draft?catalogueRateInput(v,i,'setter'):catalogueMoney(v.setter,'CAD')}</td><td class="num"><span data-catalogue-sum="${i}" title="Derived from closer + setter">${catalogueMoney(draft?(v.closer===''||v.setter===''?null:Number(v.closer)+Number(v.setter)):fullCycleValue(v),'CAD')}</span><span class="sum-note">closer + setter</span></td><td></td><td></td></tr>`).join('')||'<tr class="prod-empty"><td colspan="10">Variant details are not recorded.</td></tr>';
    const foot=draft?`<div class="edit-foot"><div class="edit-fields"><label class="edit-date">Effective from <input type="date" data-catalogue-effective value="${esc(draft.effective)}" min="2020-01-01" aria-label="Product rates effective from"></label>${draft.error?`<p class="edit-err" role="alert">${esc(draft.error)}</p>`:''}</div><div class="edit-actions">${btn('Cancel','coo:product-cancel-edit','ghost small')}${btn('Save changes','coo:product-save','primary small')}</div></div>`:`<div class="pfoot"><span class="pmeta">${rows.length?rows.length+' variants':'Variants unknown'}</span><span class="pmeta">Full cycle · closer + setter, per variant</span><span class="pmeta">Sold here</span><button class="hist-toggle ${catalogueState.history===p.id?'open':''}" data-action="coo:product-history/${p.id}" aria-expanded="${catalogueState.history===p.id}" aria-label="${esc(p.name)} change history">${catalogueChevron} CHANGE HISTORY · ${history.length}</button><span class="spacer"></span>${readOnly?'':btn('Retire product','coo:product-retire/'+p.id,'ghost small')+btn('Edit CPA &amp; commissions','coo:product-edit/'+p.id,'ghost small',rows.length?'':'disabled title="Verified variant identities are needed before editing rates"')}</div>`;
    const audit=catalogueState.history===p.id?`<tr class="prod-hist"><td colspan="10"><div class="hist-body">${[...history].reverse().map(h=>`<div class="hist-row"><span class="hd" title="Effective from ${esc(h.effective)}">${catalogueDate(h.effective)}</span><div class="hv">${h.changes.map(change=>`<span class="hseg">${esc(change)}</span>`).join('')}</div><span class="hwho">Owner</span></div>`).join('')||'<p class="pmeta">No changes recorded.</p>'}</div></td></tr>`:'';
    return variants+`<tr class="prod-foot ${draft?'editing':''}"><td colspan="10">${foot}</td></tr>`+audit;
  }
  function cataloguePage(coachesOnly=false) {
    const active=products.filter(p=>coachesOnly?coachEligible(p):!p.retired),retired=coachesOnly?[]:products.filter(p=>p.retired);
    const head='<th aria-label="Expand product"></th><th>Product</th><th class="num">CPA · USD</th><th class="num">Cash value · USD</th><th class="num">Variants</th><th class="num">Closer comm · CAD</th><th class="num">Setter comm · CAD</th><th class="num" title="Derived from closer + setter">Full cycle · CAD</th><th>Last change</th><th>Available to</th>';
    const body=active.map(p=>{
      const rows=productVariants(p.id),expanded=catalogueState.expanded===p.id,history=catalogueHistory.filter(h=>h.product===p.id),last=history.at(-1),card=catalogueRateCards.filter(c=>c.product===p.id&&c.effective<=today).sort((a,b)=>b.effective.localeCompare(a.effective))[0];
      return `<tr class="prod-row ${expanded?'open':''}" data-catalogue-row="${p.id}"><td><button class="product-expander" data-action="coo:product-expand/${p.id}" aria-expanded="${expanded}" aria-label="${expanded?'Hide':'View'} ${esc(p.name)} details">${catalogueChevron}</button></td><td><span class="pcell"><span class="pdot" style="background:${productTone(p.id)}"></span>${esc(p.name)}</span></td><td class="num cpa-cell"><strong>${catalogueSpan(rows,'cpa')}</strong>${card?`<small class="cpa-sub">since ${catalogueDate(card.effective)}</small>`:''}</td><td class="num">${catalogueSpan(rows,'cashValue')}</td><td class="num">${rows.length||'—'}</td><td class="num">${catalogueSpan(rows,'closer','CAD')}</td><td class="num">${catalogueSpan(rows,'setter','CAD')}</td><td class="num">${catalogueSpan(rows.map(r=>({...r,fullCycle:fullCycleValue(r)})),'fullCycle','CAD')}</td><td class="last-change">${last?catalogueDate(last.effective):'—'}</td><td>${coachesOnly?`<span class="product-audience">${esc(audienceName(p.audience))}</span>`:`<select data-product-audience="${p.id}" aria-label="${esc(p.name)} availability">${options([['unset','Not configured'],['coach','Coaches only'],['closer','Closers only'],['both','Coaches & closers']],p.audience)}</select>`}</td></tr>`+(expanded?catalogueDetails(p,coachesOnly):'');
    }).join('');
    return `<div class="products-review">${coachesOnly?'':`<div class="page-note"><span class="ic">⬢</span><span><b>Changes are effective-dated.</b> A new CPA or commission applies to closes from the date you pick <b>forward</b>. Pick a date in the past and the closes already filed since it are repriced too — you will be shown exactly what moves before anything is saved. Every dashboard, form and payout reads from this page. <b>CPA is USD</b> (what the company is paid, owner-only), <b>commissions are CAD</b> (what reps are paid and invoice).</span></div>`}<div class="card pcat"><div class="pcat-bar"><span class="pcat-count">Products · <b>${active.length}</b></span><span class="pcat-note">${coachesOnly?'Active products available to coaches.':'This offer’s products. A new one is a migration.'}</span></div><div class="table-scroll" role="region" aria-label="Product catalogue — scroll right for more columns" tabindex="0"><table class="rank-table"><thead><tr>${head}</tr></thead><tbody>${body||`<tr class="prod-empty"><td colspan="10">${coachesOnly?'No products are currently available to coaches.':'No products on this offer.'}</td></tr>`}</tbody></table></div></div>${retired.length?`<div class="card pcat pcat-retired"><div class="pcat-bar"><span class="pcat-count">Not sold here · <b>${retired.length}</b></span><span class="pcat-note">Retired for this offer. Other offers are unaffected.</span></div><div class="retired-strip">${retired.map(p=>`<div class="retired-row"><span class="pdot" style="background:${productTone(p.id)}"></span><span class="product-name">${esc(p.name)}</span><span class="spacer"></span>${btn('Restore product','coo:product-restore/'+p.id,'ghost small',`aria-label="Restore ${esc(p.name)} product"`)}</div>`).join('')}</div></div>`:''}</div>`;
  }

  function assignmentsPage(subject) {
    const rows = assigned(subject), portal = subject === 'portal';
    const body = rows.map(a => {
      const p = product(a.product), l = activeLinks(subject,a.product)[0], percent = currentPercent(a);
      const available = portal ? portalEligible(p) : coachEligible(p), configured = portal || percent !== undefined;
      const status = !available ? ['Availability needed','warn'] : !l?.url ? ['Link needed','warn'] : !configured ? ['Terms needed','warn'] : ['Assigned','good'];
      const future = a.rates.filter(r=>r.effective>today).sort((a,b)=>a.effective.localeCompare(b.effective))[0];
      return `<tr><td><strong>${esc(p.name)}</strong><small>${esc(audienceName(p.audience))}</small>${isOwner()?btn('View shared product','coo:catalogue/'+p.id,'ghost small'):''}</td>${!own()?`<td class="num">${cpaRange(p.id)}<small>Company CPA · USD</small></td>`:''}<td>${portal&&l?.url?`<a class="link-text" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.url)}</a>`:`<span class="link-text">${l?.url?esc(l.url):'URL not recorded'}</span>`}<small>${l?.token?'Tracking ID: '+esc(l.token):l?.url?'Vendor tracking ID unverified':'Assigned link required'}</small></td><td>${portal?'Not a payee':percent===undefined?'Not configured':percent+'% of Products CPA'}${!portal&&future?`<small>${future.percent}% from ${future.effective}</small>`:''}</td><td>${badge(...status)}</td><td><div class="actions">${isOwner()?btn('Manage link','coo:link/'+subject+'/'+a.product,'ghost small')+(!portal?btn('Manage terms','coo:terms/'+subject+'/'+a.product,'ghost small'):'')+btn('Retire','coo:retire/'+subject+'/'+a.product,'ghost small'):badge('Read-only')}</div></td></tr>`;
    }).join('');
    return section('Assigned products & affiliate links',table(`<th>Existing product</th>${!own()?'<th class="num">Company CPA</th>':''}<th>Coach / portal affiliate link</th><th>${portal?'Compensation':'Coach commission'}</th><th>Assignment</th><th></th>`,body||'<tr><td colspan="6">No products assigned.</td></tr>'),isOwner()?`<div class="actions">${btn('Browse coach products','coo:coach-products','ghost small')}${btn('+ Assign product','coo:assign/'+subject,'small')}</div>`:'')
      + section('Link history',table('<th>Product</th><th>Affiliate link / tracking ID</th><th>Status</th>',links.filter(l=>l.subject===subject).map(l=>`<tr><td>${esc(product(l.product)?.name)}</td><td><span class="link-text">${esc(l.url||'URL not recorded')}</span><small>${esc(l.token)}${l.inventory?' · CSV row '+l.inventory.row+' · '+esc(l.inventory.status)+' · last seen '+esc(l.inventory.last):''}</small></td><td>${badge(l.inventory?(l.active?'Observed live':'Historical / removed'):(l.active?'Current':'Retired'))}</td></tr>`).join('')||'<tr><td colspan="3">No link history recorded.</td></tr>'));
  }
  function assignForm(subject) {
    const portal = subject === 'portal';
    const available = products.filter(p => coachEligible(p) && !assigned(subject).some(a=>a.product===p.id));
    show('Assign existing product',available.length?`<p>${esc(subjectName(subject))} · ADB</p><form id="assign-form" class="form-grid"><label>Existing product<select name="product" id="assign-product" required>${options(available.map(p=>[p.id,p.name]),available[0].id)}</select></label><div id="assign-product-context" class="assignment-context"></div>${affiliateLinkFields(undefined,portal)}${portal?'<p class="hint">Portal attribution does not create coach compensation.</p>':'<div class="form-grid two"><label>Coach commission · % of Products CPA<input name="percent" type="number" min="0" max="100" step="0.01" required placeholder="Agreed percentage"></label><label>Effective date<input name="effective" type="date" min="2026-10-24" value="2026-10-24" required></label></div>'}<p class="error" id="form-error" role="alert"></p><button class="btn primary" type="submit">Save assignment</button></form>`:empty('No additional eligible products','Set availability in the shared Products catalogue. No duplicate products are created.'),btn('Cancel','close'));
    if(!available.length)return;
    const readLink=bindAffiliateLinkFields($('#assign-form'));
      const context=()=>{const p=product($('#assign-product').value);$('#assign-product-context').innerHTML=`<strong>${esc(p.name)}</strong><span>Company CPA · USD: ${cpaRange(p.id)}</span><small>Shared catalogue rate; closer and setter commissions are unchanged.</small>`;};
    context();$('#assign-product').addEventListener('change',context);
    $('#assign-form').addEventListener('submit',event=>{
      event.preventDefault();const f=new FormData(event.target),id=String(f.get('product')),{url,token,error:trackingError}=readLink(),raw=String(f.get('percent')||'').trim(),percent=Number(raw),effective=String(f.get('effective')||today);
      const p=product(id),error=(portal&&!url)?'':trackingError||linkValidation(subject,url,token);
      if(!coachEligible(p))return formError('Select a product available to coaches.');
      if(assigned(subject).some(a=>a.product===id))return formError('This product is already assigned.');
      if(error)return formError(error);
      if(!portal&&(!raw||!Number.isFinite(percent)||percent<0||percent>100||effective<today))return formError('Enter an agreed percentage and an effective date on or after October 24.');
      const prior=assignments.find(a=>a.subject===subject&&a.product===id);
      if(!portal&&prior?.rates.some(r=>r.effective===effective))return formError('Retained terms already exist for this effective date. Choose a later date.');
      const a=prior||{subject,product:id,rates:[],retired:false};
      if(!portal)a.rates.push({effective,percent});
      a.retired=false;if(!prior)assignments.push(a);
      activeLinks(subject,id).forEach(l=>l.active=false);if(url)links.push({id:'link-'+Date.now(),subject,product:id,url,token,active:true});
      afterSave('Existing product assigned. Link and terms saved; shared product rates unchanged.');
    });
  }


  function monthRows(id, earningMonth) {
    const result=[];
    for(const c of coaches.filter(c=>(!own()||c.id==='avery')&&(!id||c.id===id))) {
      const ss=(earningMonth?sessions.filter(s=>s.date.startsWith(earningMonth)&&s.date<=today):allSessions()).filter(s=>s.coach===c.id),ee=(earningMonth?earnings.filter(e=>e.approval?.startsWith(earningMonth)&&e.approval<=today):periodEarnings()).filter(e=>e.coach===c.id);
      const months=[...new Set([...ss.map(s=>s.date.slice(0,7)),...ee.map(e=>e.approval.slice(0,7))])].sort().reverse();
      for(const month of months) {
        const s=ss.filter(s=>s.date.startsWith(month)),e=ee.filter(e=>e.approval.startsWith(month)),known=complete(e);
        const affiliate=round(known.reduce((sum,e)=>sum+e.cpa*e.commissionPct/100,0)*FX),revenue=round(known.reduce((sum,e)=>sum+e.revenue,0)*FX),session=totalSessions(s);
        result.push({id:c.id,month,s,e,calls:s.length,session,affiliate,revenue,net:round(revenue-session-affiliate),holds:e.filter(e=>['variant','hf','approval','late'].includes(e.issue)).length});
      }
    }
    return result;
  }

  function performanceTable(id) {
    const rows=monthRows(id).filter(r=>subjectName(r.id).toLowerCase().includes(state.performanceQuery.toLowerCase()));
    let body=rows.map(r=>`<tr><td>${person(r.id)}${coach(r.id).archived?badge('Archived'):''}</td><td>${fmtMonth(r.month)}<small>Selected dates</small></td>${!own()?`<td class="num">${cad(r.revenue)}</td>`:''}<td class="num">${r.calls}</td><td class="num">${cad(r.session)}</td><td class="num">${cad(r.affiliate)}${r.holds?`<small>${r.holds} incomplete</small>`:''}</td>${!own()?`<td class="num">${cad(r.net)}</td>`:''}<td>${btn('View breakdown','coo:month/'+r.id+'/'+r.month,'ghost small')}</td></tr>`).join('');
    if(!own()&&!id&&state.sourceFilter!=='coaches'&&'student portal'.includes(state.performanceQuery.toLowerCase()))body+=`<tr><td><div class="name-cell"><span class="avatar">SP</span><span><strong>Student portal</strong><small>Portal attribution</small></span></div></td><td>Selected period</td><td class="num">Unknown</td><td class="num">—</td><td class="num">—</td><td class="num">Not a payee</td><td class="num">Unknown</td><td>${btn('View profile','tab:portal','ghost small')}</td></tr>`;
    if(!own()&&state.sourceFilter==='portal'&&!id)body=`<tr><td>Student portal</td><td>Selected period</td><td class="num">Unknown</td><td class="num">—</td><td class="num">—</td><td class="num">Not a payee</td><td class="num">Unknown</td><td>${btn('View profile','tab:portal','ghost small')}</td></tr>`;
    return table(`<th>${own()?'Coach':'Revenue source'}</th><th>Month</th>${!own()?'<th class="num">Company revenue</th>':''}<th class="num">Calls</th><th class="num">Session cost</th><th class="num">Affiliate compensation</th>${!own()?'<th class="num">Net</th>':''}<th></th>`,body||`<tr><td colspan="8">No monthly results match this range.</td></tr>`,'Monthly coaching performance');
  }

  // Uses the shared MetricChart interaction pattern: metric pickers, bar/line series,
  // day/week/month buckets, and a paginated table with the same bucket values.
  const reportState = { granularity:'month', primary:'revenue', overlay:'calls', page:0, pageSize:10, windowKey:'' };
  function reportMetrics() {
    const metrics=[
      {key:'affiliate',label:'Affiliate commission',format:cad},
      {key:'session',label:'Session pay',format:cad},
      {key:'calls',label:'Calls',format:v=>String(v)},
      {key:'sales',label:'Approved sales',format:v=>String(v)}
    ];
    if(!own())metrics.unshift({key:'revenue',label:'Company revenue',format:cad});
    return metrics;
  }
  function reportValue(s,e) {
    const known=complete(e),groups=new Map();
    known.forEach(e=>{const k=e.coach+'@'+e.approval.slice(0,7);groups.set(k,(groups.get(k)||0)+e.cpa*e.commissionPct/100);});
    return {revenue:round(known.reduce((n,e)=>n+e.revenue,0)*FX),affiliate:round([...groups.values()].reduce((n,v)=>n+round(v*FX),0)),session:totalSessions(s),calls:s.length,sales:known.length};
  }
  function reportBuckets(subject) {
    const id=own()?'avery':subject,ss=allSessions().filter(s=>!id||s.coach===id),ee=periodEarnings().filter(e=>!id||e.coach===id),bins=new Map();
    for(let date=state.from;date<=state.to;date=dateISO(Date.parse(date)+86400000)) {
      let key=date;
      if(reportState.granularity==='month')key=date.slice(0,7);
      if(reportState.granularity==='week'){const day=new Date(date+'T12:00:00Z').getUTCDay();key=dateISO(Date.parse(date)-(day===0?6:day-1)*86400000);}
      if(!bins.has(key))bins.set(key,{key,from:date,to:date});else bins.get(key).to=date;
    }
    return [...bins.values()].map(b=>{
      const known=b.from>='2026-08-01'&&b.to<=today;
      return {...b,known,label:reportState.granularity==='month'?fmtMonth(b.key):b.from===b.to?shortDate(b.from):shortDate(b.from)+' – '+shortDate(b.to),
        values:known?reportValue(ss.filter(s=>s.date>=b.from&&s.date<=b.to),ee.filter(e=>e.approval>=b.from&&e.approval<=b.to)):{revenue:null,affiliate:null,session:null,calls:null,sales:null}};
    });
  }
  function reportChart(bins,primary,overlay) {
    const W=960,H=250,left=96,right=96,top=20,bottom=42,plotW=W-left-right,plotH=H-top-bottom;
    const values=bins.map(b=>b.values[primary.key]).filter(v=>v!=null),lo=Math.min(0,...values),hi=Math.max(1,...values),spread=hi-lo;
    const compareMax=overlay?Math.max(1,...bins.map(b=>b.values[overlay.key]||0)):1;
    const x=i=>left+(i+.5)*plotW/Math.max(1,bins.length),y=v=>top+(hi-v)/spread*plotH,cy=v=>top+(1-v/compareMax)*plotH;
    const barWidth=Math.min(96,plotW/Math.max(1,bins.length)*.62),interval=Math.max(1,Math.ceil(bins.length/8));
    const grid=[0,1,2,3,4].map(i=>{const value=lo+spread*i/4,py=y(value);return `<line x1="${left}" y1="${py}" x2="${W-right}" y2="${py}" class="report-grid"/><text x="${left-10}" y="${py+4}" text-anchor="end" class="report-axis">${esc(primary.format(round(value)))}</text>${overlay?`<text x="${W-right+10}" y="${py+4}" class="report-axis report-compare">${esc(overlay.format(round(compareMax*i/4)))}</text>`:''}`;}).join('');
    const bars=bins.map((b,i)=>{const value=b.values[primary.key];if(value==null)return `<text x="${x(i)}" y="${top+plotH}" text-anchor="middle" class="report-axis">?</text>`;const zero=y(0),vY=y(value),height=Math.abs(zero-vY);return `<rect x="${x(i)-barWidth/2}" y="${Math.min(zero,vY)}" width="${barWidth}" height="${height}" rx="3" class="report-bar"><title>${esc(b.label)} · ${esc(primary.label)} ${esc(primary.format(value))}</title></rect>`;}).join('');
    let segments=[],segment=[];
    if(overlay)for(let i=0;i<bins.length;i++){const value=bins[i].values[overlay.key];if(value==null){if(segment.length)segments.push(segment);segment=[];}else segment.push(`${x(i)},${cy(value)}`);}if(segment.length)segments.push(segment);
    const line=overlay?segments.map(points=>`<polyline points="${points.join(' ')}" fill="none" class="report-line"/>`).join('')+bins.map((b,i)=>b.values[overlay.key]==null?'':`<circle cx="${x(i)}" cy="${cy(b.values[overlay.key])}" r="3" class="report-dot"><title>${esc(b.label)} · ${esc(overlay.label)} ${esc(overlay.format(b.values[overlay.key]))}</title></circle>`).join(''):'';
    const labels=bins.map((b,i)=>i%interval===0||i===bins.length-1?`<text x="${x(i)}" y="${H-10}" text-anchor="middle" class="report-axis">${esc(reportState.granularity==='month'?b.key:shortDate(b.from))}</text>`:'').join('');
    return `<div class="report-plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(primary.label)} by ${reportState.granularity}${overlay?' with '+esc(overlay.label)+' overlay':''}. Exact values are in the table below.">${grid}${bars}${line}${labels}</svg></div>`;
  }
  function reportPanel(subject) {
    const windowKey=[state.role,own()?'avery':subject||'all',state.from,state.to].join('|');
    if(reportState.windowKey!==windowKey){reportState.windowKey=windowKey;reportState.page=0;}
    if(reportState.granularity==='day'&&(Date.parse(state.to)-Date.parse(state.from))/86400000>62)reportState.granularity='week';
    const metrics=reportMetrics();
    if(!metrics.some(m=>m.key===reportState.primary))reportState.primary=own()?'affiliate':'revenue';
    if(!metrics.some(m=>m.key===reportState.overlay)||reportState.overlay===reportState.primary)reportState.overlay='none';
    const primary=metrics.find(m=>m.key===reportState.primary),overlay=metrics.find(m=>m.key===reportState.overlay),bins=reportBuckets(subject);
    const scope=own()?'avery':subject,ss=allSessions().filter(s=>!scope||s.coach===scope),ee=periodEarnings().filter(e=>!scope||e.coach===scope),total=reportValue(ss,ee),known=bins.every(b=>b.known);
    const reverse=[...bins].reverse(),maxPage=Math.max(0,Math.ceil(reverse.length/reportState.pageSize)-1);reportState.page=Math.min(reportState.page,maxPage);
    const shown=reverse.slice(reportState.page*reportState.pageSize,(reportState.page+1)*reportState.pageSize),word=reportState.granularity;
    const grouping=`<div class="report-chips report-granularity" role="group" aria-label="Bar grouping">${[['day','Day'],['week','Week'],['month','Month']].map(([key,label])=>`<button class="report-chip ${word===key?'on':''}" data-report-granularity="${key}" aria-pressed="${word===key}" ${key==='day'&&(Date.parse(state.to)-Date.parse(state.from))/86400000>62?'disabled title="Use Week or Month for this range"':''}>${label}</button>`).join('')}</div>`;
    const controls=`<div class="report-picker-row"><span class="report-control-label">Bars</span><div class="report-chips" role="group" aria-label="Chart metric (bars)">${metrics.map(m=>`<button class="report-chip ${m.key===primary.key?'on':''}" data-report-primary="${m.key}" aria-pressed="${m.key===primary.key}">${esc(m.label)}</button>`).join('')}</div></div>
      <div class="report-picker-row"><span class="report-control-label">Overlay</span><div class="report-chips" role="group" aria-label="Overlay metric (line)">${[{key:'none',label:'None'},...metrics.filter(m=>m.key!==primary.key)].map(m=>`<button class="report-chip compare ${reportState.overlay===m.key?'on':''}" data-report-overlay="${m.key}" aria-pressed="${reportState.overlay===m.key}">${esc(m.label)}</button>`).join('')}</div></div>`;
    const tableHead=`<th>${word[0].toUpperCase()+word.slice(1)}</th>${metrics.map(m=>`<th class="num">${esc(m.label)}${['revenue','affiliate'].includes(m.key)?'<small>Known · CAD</small>':m.key==='session'?'<small>CAD</small>':''}</th>`).join('')}<th></th>`;
    const tableBody=shown.map(b=>`<tr><td><strong>${esc(b.label)}</strong></td>${metrics.map(m=>`<td class="num">${b.values[m.key]==null?'Unknown':m.format(b.values[m.key])}</td>`).join('')}<td>${btn('View records','coo:period/'+(scope||'all')+'/'+b.from+'/'+b.to,'ghost small')}</td></tr>`).join('')
      +`<tr class="report-total"><td>Selected period</td>${metrics.map(m=>`<td class="num">${known?m.format(total[m.key]):'Unknown'}</td>`).join('')}<td></td></tr>`;
    const count=reverse.length,start=reportState.page*reportState.pageSize+1,end=Math.min(count,(reportState.page+1)*reportState.pageSize);
    const pagination=`<div class="report-pagination"><label>Rows per page <select id="report-page-size" aria-label="Report rows per page">${options([['10','10'],['25','25'],['50','50']],String(reportState.pageSize))}</select></label><span>${count?start:0}–${end} of ${count}</span>${btn('←','coo:report-page/-1','small',`${reportState.page===0?'disabled':''} aria-label="Previous report page"`)}${btn('→','coo:report-page/1','small',`${reportState.page===maxPage?'disabled':''} aria-label="Next report page"`)}</div>`;
    return `<section class="panel report-panel"><div class="panel-body report-chart"><h2 class="report-panel-title">Performance</h2><div class="report-topline"><div class="report-headline"><div><div class="eyebrow">${esc(primary.label)}${['revenue','affiliate','session'].includes(primary.key)?' · CAD':''}</div><strong>${known?primary.format(total[primary.key]):'Unknown'}</strong></div>${overlay?`<span class="report-compare">${known?overlay.format(total[overlay.key]):'Unknown'} ${esc(overlay.label.toLowerCase())}</span>`:''}</div>${grouping}</div>${controls}${reportChart(bins,primary,overlay)}<p class="hint report-footnote">Revenue and affiliate commission show known dated evidence. Missing and unassigned activity remains available in Activity details.</p><h3 class="report-table-title">Every ${word}, every metric</h3></div>${table(tableHead,tableBody,'Performance at selected granularity')}${pagination}</section>`;
  }
  function periodDetails(id,from,to) {
    if(own()&&id!=='avery')return;
    const subject=id==='all'?null:id,ss=allSessions().filter(s=>(!subject||s.coach===subject)&&s.date>=from&&s.date<=to),ee=periodEarnings().filter(e=>(!subject||e.coach===subject)&&e.approval>=from&&e.approval<=to);
    show('Performance records',`<p>${esc(subject?subjectName(subject):'Coaching')} · ${esc(from)} – ${esc(to)}</p><h3>Affiliate records</h3><div class="actions">${ee.map(e=>btn(e.product+' · '+earningLabel(e)[0],'earning:'+e.id,'ghost small')).join('')||'<p>No dated affiliate records.</p>'}</div><h3>Sessions</h3>${sessionRows(ss)}`);
  }
  affiliatePage = function () {
    if(!own()&&state.sourceFilter==='portal')return section('Monthly performance',`<div class="toolbar"><select id="source-filter" aria-label="Revenue source">${options([['all','All sources'],['coaches','Coaches'],['portal','Student portal']],state.sourceFilter)}</select><span class="hint">${monthLabel()}</span></div><div class="grid detail-grid panel-body">${metric('Portal revenue','Unknown','Historical vendor evidence not connected')}${metric('Coach compensation','Not applicable','The portal is not a payee')}</div>${performanceTable()}`);
    const f=financial(),rows=monthRows(),holds=rows.reduce((n,r)=>n+r.holds,0)+unassignedEarnings().length;
    const totals=`<div class="grid metrics">${!own()?metric('Known company revenue',cad(f.revenue),'Attributed coaching activity'):metric('Affiliate compensation',cad(f.affiliate),'Preserved product terms')}${metric('Coaching calls',allSessions().length,'Self-reported session dates')}${metric('Session compensation',cad(f.session),'Filed amounts')}${metric('Incomplete records',holds,'Missing evidence stays separate')}</div>`;
    const toolbar=`<div class="toolbar"><input id="performance-query" type="search" aria-label="Search performance" placeholder="Search ${own()?'your results':'coach or portal'}…" value="${esc(state.performanceQuery)}">${!own()?`<select id="source-filter" aria-label="Revenue source">${options([['all','All sources'],['coaches','Coaches'],['portal','Student portal']],state.sourceFilter)}</select>`:''}<span class="hint">Monthly · ${monthLabel()}</span></div>`;
    return totals+reportPanel()+section('Monthly performance by coach',toolbar+`<div id="performance-table">${performanceTable()}</div>`,btn('Activity details','coo:activity','ghost small'));
  };


  function activityDetails() {
    const rows=[...periodEarnings(),...unassignedEarnings()];
    show('Affiliate activity details',table(`<th>Product / sale</th>${!own()?'<th>Coach</th>':''}<th>Vendor approval</th><th>Status</th><th></th>`,rows.map(e=>`<tr><td><strong>${esc(e.product)}</strong><small>${e.sale||'Sale date unknown'}</small></td>${!own()?`<td>${esc(subjectName(e.coach))}</td>`:''}<td>${e.approval||'Unknown'}</td><td>${badge(...earningLabel(e))}</td><td>${btn('Details','earning:'+e.id,'ghost small')}</td></tr>`).join('')||'<tr><td colspan="5">No attributed records.</td></tr>'));
  }

  function monthlyDetail(id,month, fullMonth=false) {
    if(own()&&id!=='avery')return;
    const row=monthRows(id,fullMonth?month:undefined).find(r=>r.month===month);if(!row)return;
    const grouped=[...new Set(row.e.map(e=>e.product))];
    show(`${subjectName(id)} · ${fmtMonth(month)}`,`<div class="grid detail-grid">${!own()?metric('Company revenue',cad(row.revenue),'Known attributed revenue'):''}${metric('Session compensation',cad(row.session),'Filed session amounts')}${metric('Affiliate compensation',cad(row.affiliate),'Preserved coach/product terms')}</div><h3>Product breakdown</h3>${table(`<th>Product</th><th>Approved sales</th>${!own()?'<th class="num">Company revenue</th>':''}<th class="num">Coach compensation</th>`,grouped.map(name=>{const ee=row.e.filter(e=>e.product===name),known=complete(ee),held=ee.some(e=>['variant','hf','approval','late'].includes(e.issue));return `<tr><td>${esc(name)}</td><td>${known.length}${held?'<small>Additional evidence missing</small>':''}</td>${!own()?`<td class="num">${cad(round(known.reduce((n,e)=>n+e.revenue,0)*FX))}</td>`:''}<td class="num">${held?'Unknown':cad(round(known.reduce((n,e)=>n+e.cpa*e.commissionPct/100,0)*FX))}</td></tr>`;}).join('')||'<tr><td colspan="4">Session-only month.</td></tr>')}<h3>Affiliate records</h3><div class="actions">${row.e.map(e=>btn(e.product+' · '+earningLabel(e)[0],'earning:'+e.id,'ghost small')).join('')||'<p>No affiliate records.</p>'}</div><h3>Sessions</h3>${sessionRows(row.s)}`);
  }

  function sessionRows(rows) {
    return table('<th>Session</th><th>Type</th><th>Session status</th><th class="num">Filed amount</th><th>AI review</th><th></th>',rows.map(s=>`<tr><td><strong>${esc(s.topic)}</strong><small>${shortDate(s.date)} · ${esc(subjectName(s.coach))}</small></td><td>${esc(typeName(s.typeId))}</td><td>${badge(s.status,s.status==='rejected'?'bad':s.status==='approved'?'good':'neutral')}</td><td class="num">${cad(s.amount)}</td><td>${badge('Not reviewed')}<small>No score yet</small></td><td><div class="actions">${btn('Details','session:'+s.id,'ghost small')}${isOwner()?btn('Review call','coo:review/'+s.id,'small',`aria-label="Review ${esc(s.topic)}"`):''}</div></td></tr>`).join('')||'<tr><td colspan="6">No sessions match this range.</td></tr>');
  }

  function reviewSessions(){return visibleSessions().filter(s=>(state.sessionTypeFilter==='all'||s.typeId===state.sessionTypeFilter)&&(own()||state.reviewCoach==='all'||s.coach===state.reviewCoach)).sort((a,b)=>b.date.localeCompare(a.date)||a.id.localeCompare(b.id));}
  sessionPage = function () {
    const rows=reviewSessions();
    const filters=`<div class="toolbar call-list-filters">${!own()?`<label>Coach<select id="review-coach-filter" aria-label="Filter calls by coach">${options([['all','All coaches'],...coaches.map(c=>[c.id,c.name+(c.archived?' · Archived':'')])],state.reviewCoach)}</select></label>`:''}<input id="coo-session-query" type="search" aria-label="Search sessions" value="${esc(state.search)}" placeholder="Search topic or coach…"><select id="coo-session-status" aria-label="Session status">${options([['all','All session states'],['submitted','Submitted'],['approved','Approved'],['rejected','Rejected']],state.status)}</select><select id="session-type-filter" aria-label="Filter session type">${options([['all','All session types'],...types.map(t=>[t.id,t.name])],state.sessionTypeFilter)}</select>${own()?btn('+ File a session','file','primary small'):''}</div>`;
    if(own())return section('Your session history',filters+`<div id="coo-session-table">${sessionRows(rows)}</div>`);
    return `<div class="review-intro"><div><h2>Calls by coach</h2><p>Find the coach, then review their recordings. Newest calls appear first within each coach.</p></div>${isOwner()?btn('Manage session types','tab:types','small'):''}</div>`
      + `<section class="panel call-filter-panel">${filters}<div class="call-list-summary">${rows.length} recordings · ${new Set(rows.map(s=>s.coach)).size} coaches with calls · ${monthLabel()}</div></section>`
      + `<div id="coo-session-table">${coachCallGroups(rows)}</div>`
      + (!own()?'<p class="hint coo-note">AI reviews are requested per recording. A quality score does not approve, reject or change payment for a session.</p>':'');
  };

  function coachCallGroups(rows) {
    const filtering=state.search.trim()||state.status!=='all'||state.sessionTypeFilter!=='all';
    const people=coaches.filter(c=>(state.reviewCoach==='all'||c.id===state.reviewCoach)&&(!filtering||rows.some(s=>s.coach===c.id)));
    if(!people.length)return empty('No calls match these filters','Try another coach, session type or reporting date range.');
    return people.map(c=>{
      const calls=rows.filter(s=>s.coach===c.id);
      return `<section class="panel coach-call-group" aria-label="${esc(c.name)} calls"><div class="coach-call-header"><div class="name-cell"><span class="avatar">${esc(c.initials)}</span><span><h2>${esc(c.name)}</h2><small>${esc(c.focus)}${c.archived?' · Archived':''}</small></span></div><div class="coach-call-stats"><span><b>${calls.length}</b> recordings</span><span><b>0</b> AI reviewed</span><span>Coach score <b>— / 10</b></span></div></div>${calls.length?table('<th>Date</th><th>Session / recording</th><th>Session type</th><th>AI review</th><th></th>',calls.map(s=>`<tr><td class="call-date">${shortDate(s.date)}<small>${s.date.slice(0,4)}</small></td><td><strong>${esc(s.topic)}</strong><small>${badge(s.status,s.status==='rejected'?'bad':s.status==='approved'?'good':'neutral')} · Session status</small></td><td>${esc(typeName(s.typeId))}</td><td>${badge('Not reviewed')}<small>No score yet</small></td><td><div class="actions">${btn('Details','session:'+s.id,'ghost small',`aria-label="Details for ${esc(c.name)} · ${esc(s.topic)}"`)}${isOwner()?btn('Review call','coo:review/'+s.id,'small',`aria-label="Review ${esc(c.name)} · ${esc(s.topic)}"`):''}</div></td></tr>`).join(''),`${c.name} recordings`):`<div class="coach-calls-empty">No recordings for ${esc(c.name)} in these dates. Change the reporting date range to check older calls.</div>`}</section>`;
    }).join('');
  }

  sessionDetail = function(id) {
    original.sessionDetail(id);
    const s=sessions.find(s=>s.id===id);if(!s||own()&&s.coach!=='avery')return;
    const dl=$('#modal .detail-list');if(dl)dl.insertAdjacentHTML('beforeend',`<dt>Session type</dt><dd>${esc(typeName(s.typeId))}</dd><dt>AI assessment</dt><dd>Not assessed</dd>`);
    if(isOwner()){const b=document.createElement('button');b.className='btn';b.textContent='Review call';b.addEventListener('click',()=>reviewCall(id));$('#modal .modal-foot').prepend(b);}
  };

  filing = function () {
    if(coach('avery').archived)return;
    show('File a coaching session',`<p>Your offer is <strong>ADB</strong>.</p><form id="session-form" class="form-grid"><label>Session type<select name="typeId" required>${options(types.map(t=>[t.id,t.name]),'qa')}</select></label><label>Fathom recording link<input required type="url" name="link" placeholder="https://fathom.video/share/…"></label><label>Session date<div id="filing-calendar"></div></label><div id="rate-preview"></div><label>Short topic<input required maxlength="200" name="topic" placeholder="What did the session cover?"></label><p class="error" id="form-error" role="alert"></p><p class="hint">Only the recording link can be corrected after filing.</p><button class="btn primary" id="submit-session" type="submit">Submit session</button></form>`,btn('Cancel','close'));
    const applicable=date=>{const a=arrangements.filter(a=>a.coach==='avery'&&a.effective<=date).sort((a,b)=>b.effective.localeCompare(a.effective))[0];return a?.unit==='session'?rateAt('avery',date):null;};
    const preview=()=>{const date=$('#session-form [name="date"]').value,rate=applicable(date);$('#rate-preview').innerHTML=rate===null?notice('No applicable session rate','An explicit per-session arrangement is needed. Hourly duration/rounding rules are not configured. No default is used.'):notice('Payable on submission',cad(rate)+' CAD will be frozen for this session.');$('#submit-session').disabled=rate===null;};
    CoachingDatePicker.mount($('#filing-calendar'),{mode:'single',value:today,name:'date',ariaLabel:'Session date',onApply:preview});preview();
    $('#session-form').addEventListener('submit',event=>{event.preventDefault();const f=new FormData(event.target),link=String(f.get('link')).trim(),date=String(f.get('date')),topic=String(f.get('topic')).trim(),typeId=String(f.get('typeId')),rate=applicable(date);const error=validateLink(link)||(!date||!topic?'Enter a session date and short topic.':'')||(!types.some(t=>t.id===typeId)?'Choose a session type.':'')||(rate===null?'No applicable per-session rate for this date.':'');if(error)return formError(error);sessions.unshift({id:'s'+Date.now(),coach:'avery',date,filed:today,paidOn:null,topic,link,typeId,status:'submitted',amount:rate,paid:false,reason:''});afterSave('Session filed. Amount and selected session type recorded.');});
  };

  function typesPage() {
    return `<div class="review-intro"><div><h2>Define what a good call looks like</h2><p>Write a short paragraph for each session type. The reviewer uses it alongside the call transcript.</p></div>${btn('View sessions','tab:sessions','small')}</div>`
      + section('Session types & assessment requirements',table('<th>Session type</th><th>What makes a good session?</th><th>Criteria version</th><th></th>',types.map(t=>`<tr><td><strong>${esc(t.name)}</strong><small>${allSessions().filter(s=>s.typeId===t.id).length} calls in selected dates</small></td><td>${t.requirements?`<span class="requirements-preview">${esc(t.requirements)}</span>`:badge('Requirements needed','warn')}</td><td>v${t.version}</td><td>${isOwner()?btn(t.requirements?'Edit requirements':'Set requirements','coo:type/'+t.id,'ghost small'):badge('Read-only')}</td></tr>`).join('')))
      + `<div class="review-conduct-note"><strong>Always check student treatment</strong><p>Identify disrespectful language, talking down to students and vulgar language, with the surrounding context and transcript evidence.</p></div><p class="hint coo-note">Reviews run only when requested. A completed review should retain the criteria version it used, even after requirements change.</p>`;
  }

  function typeForm(id) {
    const t=types.find(t=>t.id===id);
    show(t?'Edit session type':'Add session type',`<form id="type-form" class="form-grid"><label>Session type name<input name="name" required maxlength="80" value="${esc(t?.name||'')}"></label><label>What makes this a good session?<textarea name="requirements" required rows="7" placeholder="Describe what the coach should cover and what good delivery looks like.">${esc(t?.requirements||'')}</textarea></label><button class="btn ghost small" type="button" id="starter-criteria">Use starter wording</button><p class="hint">Starter wording is a suggested draft. Edit it before saving. Student treatment is checked alongside these requirements.</p><p class="error" id="form-error" role="alert"></p><button class="btn primary" type="submit">Save requirements</button></form>`,btn('Cancel','close'));
    $('#starter-criteria').addEventListener('click',()=>{$('#type-form textarea').value=t?.id==='onboarding'?'Welcome students and explain the onboarding goals. Demonstrate the essential setup steps clearly, explain relevant tools and links, check understanding, and end with practical next steps. Use patient, respectful language and make questions feel welcome.':'Explain the session goal, give accurate and practical answers, and demonstrate the steps students can follow. Check understanding, make room for questions without judgment, and finish with clear next actions. Keep the conversation respectful and supportive.';});
    $('#type-form').addEventListener('submit',event=>{event.preventDefault();const f=new FormData(event.target),name=String(f.get('name')).trim(),requirements=String(f.get('requirements')).trim();if(!name||!requirements)return formError('Enter a name and assessment requirements.');if(types.some(x=>x!==t&&x.name.toLowerCase()===name.toLowerCase()))return formError('A session type already uses that name.');if(t){if(t.name!==name||t.requirements!==requirements){t.name=name;t.requirements=requirements;t.version++;}}else types.push({id:'type-'+Date.now(),name,requirements,version:1});afterSave('Session type saved. Existing assessments are unchanged.');});
  }

  function reviewCall(id) {
    const s=sessions.find(s=>s.id===id);if(!s||!isOwner())return;
    closeModal();state.tab='sessions';state.profile='';state.review=id;state.reviewExample=false;render();window.scrollTo(0,0);
  }

  function coachReviewSummary(id) {
    return `<section class="panel"><div class="panel-head"><h2>Call quality</h2>${isOwner()?btn('Review sessions','coo:coach-reviews/'+id,'small'):''}</div><div class="coach-review-summary"><strong>— <small>/ 10</small></strong><div><b>No calls assessed</b><p>0 reviewed calls. The coach score will summarize completed reviews; unreviewed calls are excluded.</p></div></div></section>`;
  }

  function reviewPage(s) {
    const t=types.find(t=>t.id===s.typeId);
    const body=state.reviewExample?exampleScorecard():`<div class="review-score-empty"><span class="review-score-placeholder">— <small>/ 10</small></span><h3>No review yet</h3><p>The score, explanation and transcript evidence will appear here after this call is reviewed.</p>${btn('Preview example scorecard','coo:review-example','small')}</div>`;
    return `<div class="review-page"><button class="review-back" data-action="coo:review-back">← <span>Back to call reviews</span></button><div class="review-page-title"><div><div class="review-eyebrow">CALL REVIEW</div><h1>${esc(s.topic)}</h1><p>${esc(subjectName(s.coach))} · ${shortDate(s.date)} · ${esc(t?.name||'Type not set')}</p></div>${badge('Not reviewed')}</div>
      <div class="review-steps"><span><b>1</b> Session requirements</span><span><b>2</b> Fathom transcript</span><span><b>3</b> Score & evidence</span></div>
      <div class="review-layout"><div class="review-context">${section('Review setup',`<div class="panel-body"><dl class="detail-list"><dt>Coach</dt><dd><strong>${esc(subjectName(s.coach))}</strong></dd><dt>Session type</dt><dd>${esc(t?.name||'Not set')}</dd><dt>Criteria</dt><dd>${t?.requirements?'Version '+t.version:badge('Requirements needed','warn')}</dd><dt>Recording</dt><dd><span class="recording-url">${esc(s.link)}</span></dd></dl><div class="review-criteria"><h3>What makes this a good session?</h3><p>${esc(t?.requirements||'Add the goals, expected content and delivery standards for this session type.')}</p>${t?btn(t.requirements?'Edit requirements':'Set requirements','coo:type/'+t.id,'ghost small'):btn('Manage session types','tab:types','ghost small')}</div><div class="review-conduct-note"><strong>Student treatment · priority check</strong><p>Check for disrespect, talking down to students and vulgar language. Flag relevant passages with context for management review.</p></div></div>`)}
      ${section('Run on demand',`<div class="panel-body"><div class="review-readiness"><span>Fathom transcript</span>${badge('Not connected','warn')}</div><div class="review-readiness"><span>AI reviewer</span>${badge('Not connected','warn')}</div><button class="btn primary review-run" disabled title="Requires saved criteria, a Fathom transcript and an AI connection">Run review</button><p class="hint">This local mockup does not fetch transcripts or run AI. No review starts automatically.</p></div>`)}</div>
      <div class="review-result">${section('Call scorecard',body,state.reviewExample?btn('Hide example','coo:review-example','ghost small'):'')}${section('Review history','<div class="panel-body"><p class="muted">No completed reviews for this recording.</p><p class="hint">A completed review should retain its score, explanation, transcript evidence, criteria version and review date.</p></div>')}</div></div></div>`;
  }

  function exampleScorecard() {
    return `<div class="panel-body review-example"><div class="review-example-note"><strong>Example only</strong><p>Illustrative score and fictional evidence. This is not an assessment of this recording and does not affect the coach score.</p></div><div class="review-score-line"><div><strong>8.0 <small>/ 10</small></strong><span>Example overall score</span></div>${badge('Conduct needs attention','warn')}</div><h3>Why this score?</h3><p>The example coach explains the setup clearly and gives practical next steps. Understanding is checked unevenly, and one response to a question needs management review.</p><div class="review-findings"><div><h3>What went well</h3><p>Clear demonstration, relevant examples and a concrete action plan.</p></div><div><h3>What to improve</h3><p>Pause after key steps and confirm students understand before moving on.</p></div></div><div class="review-flag"><div><strong>Student treatment</strong>${badge('Example flag','warn')}</div><blockquote>“We already covered this; you should know that.”</blockquote><p><span class="review-timestamp">00:42 · fictional excerpt</span></p><p>This response may discourage questions. Review the surrounding context before taking action.</p></div><h3>Evidence supporting the assessment</h3><div class="review-evidence"><span class="review-timestamp">02:15 · example</span><p>Step-by-step demonstration supports the clarity finding.</p></div><div class="review-evidence"><span class="review-timestamp">05:30 · example</span><p>The session ends with specific actions students can take.</p></div><p class="hint">A completed review would use actual transcript passages and timestamps. This example is not saved as a review.</p></div>`;
  }

  function paymentDetails(c) {
    return section('Payment setup',`<div class="panel-body"><dl class="detail-list"><dt>Payee</dt><dd>${esc(c.name)} ${badge('Coach','blue')}</dd><dt>Wise account</dt><dd>${wiseDetails.has(c.id)?'<span class="link-text">'+esc(wiseDetails.get(c.id))+'</span>':'Not recorded'}</dd><dt>Invoices</dt><dd>Required through existing Payouts</dd></dl>${isOwner()?btn('Manage Wise details','coo:wise/'+c.id)+btn('Open Payouts','tab:payouts','ghost'):''}</div>`);
  }

  function wiseForm(id) {
    show('Wise payment details',`<form id="wise-form" class="form-grid"><label>Wise payment URL<input name="url" type="url" ${optional?'':'required'} placeholder="https://wise.com/…" value="${esc(wiseDetails.get(id)||'')}"></label><p class="error" id="form-error" role="alert"></p><button class="btn primary" type="submit">Save details</button></form>`,btn('Cancel','close'));
    $('#wise-form').addEventListener('submit',event=>{event.preventDefault();const value=String(new FormData(event.target).get('url')).trim();let u;try{u=new URL(value);}catch{return formError('Enter a valid Wise URL.');}if(u.protocol!=='https:'||!(u.hostname==='wise.com'||u.hostname.endsWith('.wise.com')))return formError('Use an HTTPS Wise URL.');wiseDetails.set(id,value);afterSave('Payment details recorded for this review.');});
  }

  payoutPage = function () {
    if(!isOwner())return empty('Payout access unavailable');
    const all=payoutRows(state.payoutMonth),rows=['closer','setter'].includes(state.payeeFilter)?[]:all;
    const searched=rows.filter(r=>subjectName(r.id).toLowerCase().includes(state.payoutQuery.trim().toLowerCase()));
    const matches=(r,status)=>status==='all'||status==='paid'&&r.paid||status==='unpaid'&&!r.paid||status==='attention'&&r.attention;
    const filtered=searched.filter(r=>matches(r,state.payStatus));
    const knownDue=round(rows.reduce((n,r)=>n+r.due,0)),hasHolds=rows.some(r=>r.holds);
    const tile=(value,label,note)=>`<div class="payout-tile"><strong>${value}</strong><span>${label}</span><small>${note}</small></div>`;
    return `<div class="payout-month-head">${btn('‹','coo:payout-month/-1','ghost','aria-label="Previous month"')}<div><small>PAYOUT MONTH</small><h2>${fmtMonth(state.payoutMonth)}</h2></div>${btn('›','coo:payout-month/1','ghost','aria-label="Next month"')}</div>
      <div class="payout-strip">${tile(hasHolds?'Unknown':cad(knownDue),'To pay',hasHolds?`${cad(knownDue)} known · evidence missing`:`${rows.filter(r=>!r.paid).length} unpaid payees`)}${tile(cad(round(rows.reduce((n,r)=>n+r.paidAmount,0))),'Paid out','Recorded against this earning month')}${tile(`${rows.filter(r=>r.invoice).length} / ${rows.length}`,'Invoices received','For this payout month')}${tile(cad(0),'Bonuses','None recorded')}${tile(cad(0),'Adjustments','None recorded')}</div>
      <section class="panel payout-card"><div class="payout-toolbar"><input id="payout-query" type="search" placeholder="Search names…" aria-label="Search payout names" value="${esc(state.payoutQuery)}"><select id="payee-filter" aria-label="Payee type">${options([['all','All payee types'],['closer','Closers'],['setter','Setters'],['coach','Coaches']],state.payeeFilter)}</select><div class="payout-filters">${[['all','All'],['unpaid','Unpaid'],['paid','Paid'],['attention','Needs attention']].map(([value,label])=>btn(`${label} · ${searched.filter(r=>matches(r,value)).length}`,'coo:payout-status/'+value,`payout-chip ${state.payStatus===value?'on':''}`,`aria-pressed="${state.payStatus===value}"`)).join('')}</div></div>
      ${table('<th>Rep</th><th>Invoice</th><th>Wise</th><th class="num">Session pay</th><th class="num">Commission</th><th class="num">Docked</th><th class="num">Bonus</th><th class="num">Adjustment</th><th class="num">Final pay</th><th>Pay</th><th>Paid</th>',filtered.map(r=>`<tr><td><button class="payout-name" data-action="coo:payout/${r.id}/${r.month}">${esc(subjectName(r.id))}</button><small>${badge('Coach','blue')}${coach(r.id).archived?' · Archived':''}</small></td><td>${r.invoice?`${badge('Received','good')}${btn('View','coo:payout-invoice/'+r.id+'/'+r.month,'ghost small')}`:btn('Missing','coo:invoice/'+r.id+'/'+r.month,'ghost small invoice-missing')}</td><td>${btn(wiseDetails.has(r.id)?'Linked':'Missing','coo:wise/'+r.id,'ghost small')}</td><td class="num">${cad(r.session)}</td><td class="num">${r.holds?'Unknown':cad(r.affiliate)}${r.holds?'<small>Evidence needed</small>':''}</td><td class="num">—</td><td class="num"><button class="btn ghost small" disabled title="Bonus editing is not connected in this local mockup">+ bonus</button></td><td class="num"><button class="btn ghost small" disabled title="Adjustment editing is not connected in this local mockup">+ adjust</button></td><td class="num"><strong>${r.holds?'Unknown':cad(r.total)}</strong>${r.paidAmount?`<small>${cad(r.paidAmount)} paid</small>`:''}</td><td><button class="btn small" disabled title="Money transfers are not connected in this local mockup">Pay</button></td><td><input type="checkbox" aria-label="Mark ${esc(subjectName(r.id))} paid" data-payout-paid="${r.id}/${r.month}" ${r.paid?'checked':''} ${canRecordPayout(r)?'':'disabled'} title="${r.paid?'Recorded payment':r.e.length?'Affiliate payout finalization is not connected':'Record session-only payment locally'}"></td></tr>`).join('')||'<tr><td colspan="11" class="payout-empty">No payees match. This local review contains coach records only.</td></tr>','Team payouts')}
      <div class="payout-table-foot">${filtered.length} payees · ADB · CAD</div></section>`;
  };

  function payoutRows(month) {
    return monthRows(undefined,month).map(r=>{
      const paidSessions=entitled(r.s).filter(s=>s.paid).reduce((n,s)=>n+s.amount,0);
      const paidAffiliate=r.e.reduce((n,e)=>n+(e.paidCad||0),0);
      // Paid reversals retain their recorded amount; they never reduce future pay.
      const preserved=r.e.filter(e=>e.issue!=='fx').reduce((n,e)=>n+(e.paidCad||0),0);
      const paidAmount=round(paidSessions+paidAffiliate),total=round(r.session+r.affiliate+preserved),due=Math.max(0,round(total-paidAmount));
      const paid=paidAmount>0&&due===0&&!r.holds,invoice=invoices.find(i=>i.coach===r.id&&i.month===month);
      return {...r,paidAmount,total,due,paid,invoice,attention:!paid&&(!invoice||!wiseDetails.has(r.id)||r.holds>0)};
    }).filter(r=>r.total>0||r.holds);
  }
  function canRecordPayout(r) { return !!r&&isOwner()&&!r.paid&&!r.e.length&&r.due>0&&r.month<=today.slice(0,7); }
  function recordPayout(id,month,confirm=false) {
    const r=payoutRows(month).find(r=>r.id===id);if(!canRecordPayout(r))return;
    if(!confirm)return show('Mark payout paid',`<p><strong>${esc(subjectName(id))}</strong> · ${fmtMonth(month)}</p><div class="money-line"><span>Unpaid session compensation</span><strong>${cad(r.due)}</strong></div><p class="hint">Records payment in this local review only. No funds are transferred.</p>`,btn('Mark paid','coo:payout-confirm/'+id+'/'+month,'primary')+btn('Cancel','close'));
    entitled(r.s).filter(s=>!s.paid).forEach(s=>{s.paid=true;s.paidOn=today;});afterSave('Session payout recorded locally. No funds transferred.');
  }
  function payoutReview(id,month) {
    const r=payoutRows(month).find(r=>r.id===id);if(!r)return;
    show(`${subjectName(id)} · ${fmtMonth(month)}`,`<dl class="detail-list"><dt>Payee type</dt><dd>Coach</dd><dt>Session compensation</dt><dd>${cad(r.session)}</dd><dt>Affiliate compensation</dt><dd>${r.holds?'Unknown':cad(r.affiliate)}</dd><dt>Final pay</dt><dd>${r.holds?'Unknown':cad(r.total)}</dd><dt>Recorded payments</dt><dd>${cad(r.paidAmount)}</dd><dt>Invoice</dt><dd>${r.invoice?esc(r.invoice.name):'Not received'}</dd><dt>Wise details</dt><dd>${wiseDetails.has(id)?'Recorded':'Not recorded'}</dd><dt>Payment state</dt><dd>${r.paid?'Paid':r.holds?'Evidence needed':'Not marked paid'}</dd></dl><div class="actions">${btn('Record invoice','coo:invoice/'+id+'/'+month)}${btn('Manage Wise details','coo:wise/'+id)}${btn('Earning breakdown','coo:payout-breakdown/'+id+'/'+month,'ghost')}</div>`,(canRecordPayout(r)?btn('Mark paid','coo:payout-record/'+id+'/'+month,'primary'):'')+btn('Close','close'));
  }

  function invoiceForm(id,month) {
    show('Record coach invoice',`<p>${esc(subjectName(id))} · ${fmtMonth(month)}</p><form id="invoice-form" class="form-grid"><label>Invoice document<input type="file" name="document" accept="application/pdf,.pdf" required></label><p class="hint">The local review retains only the filename. No document is uploaded.</p><p id="form-error" class="error" role="alert"></p><button class="btn primary" type="submit">Record invoice</button></form>`,btn('Cancel','close'));
    $('#invoice-form').addEventListener('submit',event=>{event.preventDefault();const file=event.target.elements.document.files[0];if(!file||!file.name.toLowerCase().endsWith('.pdf'))return formError('Choose a PDF invoice.');if(!invoices.some(i=>i.coach===id&&i.month===month))invoices.push({coach:id,month,name:file.name});else invoices.find(i=>i.coach===id&&i.month===month).name=file.name;afterSave('Invoice filename recorded locally. No file uploaded.');});
  }

  function bindReview() {
    document.querySelectorAll('[data-product-audience]').forEach(el=>{el.addEventListener('click',event=>event.stopPropagation());el.addEventListener('change',()=>{const p=product(el.dataset.productAudience);catalogueHistory.push({product:p.id,effective:today,changes:['Available to: '+audienceName(p.audience)+' → '+audienceName(el.value)]});p.audience=el.value;render();toast('Product availability updated. Existing assignments and history retained.');});});
    document.querySelectorAll('[data-catalogue-row]').forEach(el=>el.addEventListener('click',event=>{if(!event.target.closest('button,select,input'))act('coo:product-expand/'+el.dataset.catalogueRow);}));
    document.querySelectorAll('[data-catalogue-rate]').forEach(el=>el.addEventListener('input',()=>{const [index,field]=el.dataset.catalogueRate.split('/'),draft=catalogueState.edit;draft.rows[index][field]=el.value;const row=draft.rows[index],sum=document.querySelector('[data-catalogue-sum="'+index+'"]');if(sum)sum.textContent=catalogueMoney(row.closer===''||row.setter===''?null:Number(row.closer)+Number(row.setter),'CAD');}));
    document.querySelector('[data-catalogue-effective]')?.addEventListener('input',event=>{catalogueState.edit.effective=event.target.value;});
    $('#catalogue-query')?.addEventListener('input',event=>{catalogueState.query=event.target.value;const pos=event.target.selectionStart;render();$('#catalogue-query').focus();$('#catalogue-query').setSelectionRange(pos,pos);});
    $('#catalogue-audience')?.addEventListener('change',event=>{catalogueState.audience=event.target.value;render();});
    document.querySelectorAll('[data-report-primary]').forEach(el=>el.addEventListener('click',()=>{reportState.primary=el.dataset.reportPrimary;reportState.page=0;render();}));
    document.querySelectorAll('[data-report-overlay]').forEach(el=>el.addEventListener('click',()=>{reportState.overlay=el.dataset.reportOverlay;render();}));
    document.querySelectorAll('[data-report-granularity]').forEach(el=>el.addEventListener('click',()=>{reportState.granularity=el.dataset.reportGranularity;reportState.page=0;render();}));
    $('#report-page-size')?.addEventListener('change',event=>{reportState.pageSize=Number(event.target.value);reportState.page=0;render();});
    $('#roster-query')?.addEventListener('input',event=>{state.rosterQuery=event.target.value;const pos=event.target.selectionStart;render();$('#roster-query').focus();$('#roster-query').setSelectionRange(pos,pos);});
    $('#roster-filter')?.addEventListener('change',event=>{state.rosterFilter=event.target.value;render();});
    $('#performance-query')?.addEventListener('input',event=>{state.performanceQuery=event.target.value;$('#performance-table').innerHTML=performanceTable();bind($('#performance-table'));});
    $('#source-filter')?.addEventListener('change',event=>{state.sourceFilter=event.target.value;render();});
    $('#payee-filter')?.addEventListener('change',event=>{state.payeeFilter=event.target.value;render();});
    $('#payout-query')?.addEventListener('input',event=>{state.payoutQuery=event.target.value;const pos=event.target.selectionStart;render();$('#payout-query').focus();$('#payout-query').setSelectionRange(pos,pos);});
    document.querySelectorAll('[data-payout-paid]').forEach(el=>el.addEventListener('change',()=>{el.checked=false;const [id,month]=el.dataset.payoutPaid.split('/');recordPayout(id,month);}));
    $('#coo-session-query')?.addEventListener('input',event=>{state.search=event.target.value;const pos=event.target.selectionStart;render();$('#coo-session-query').focus();$('#coo-session-query').setSelectionRange(pos,pos);});
    $('#session-type-filter')?.addEventListener('change',event=>{state.sessionTypeFilter=event.target.value;render();});
    $('#review-coach-filter')?.addEventListener('change',event=>{state.reviewCoach=event.target.value;render();});
    $('#coo-session-status')?.addEventListener('change',event=>{state.status=event.target.value;render();});
  }

  act = function(action) {
    if(own()&&coach('avery').archived&&action!=='close')return;
    if(action.startsWith('coo:')) {
      const [kind,id,extra]=action.slice(4).split('/');
      if(kind==='portal-tab'&&!own()){state.tab='portal';state.profile='';state.portalTab=id==='links'?'links':'performance';closeModal();return render();}
      if(kind==='portal-product'&&!own())return portalProductActivity(id);
      if(kind==='coach-products'&&!own()){state.tab='coach-products';state.profile='';catalogueState.expanded='';catalogueState.edit=null;closeModal();return render();}
      if(kind==='profile'&&!own()){state.tab='coaches';state.profile=id;state.profileTab='performance';closeModal();render();return;}
      if(kind==='back'){state.tab='coaches';state.profile='';render();return;}
      if(kind==='profile-tab'){state.profileTab=id;render();return;}
      if(kind==='open-reviews'&&!own()){state.reviewCoach='all';state.tab='sessions';state.profile='';state.review='';state.reviewExample=false;state.search='';state.status='all';state.sessionTypeFilter='all';closeModal();render();window.scrollTo(0,0);return;}
      if(kind==='month')return monthlyDetail(id,extra);
      if(kind==='activity')return activityDetails();
      if(kind==='report-page'){reportState.page=Math.max(0,reportState.page+Number(id));return render();}
      if(kind==='period'){const fields=action.slice(4).split('/');return periodDetails(id,fields[2],fields[3]);}
      if(kind==='invoice'&&own()&&id==='avery')return invoiceForm(id,extra);
      if(kind==='product-history'&&!own()){catalogueState.history=catalogueState.history===id?'':id;return render();}
      if(kind==='product-expand'&&!own()){catalogueState.expanded=catalogueState.expanded===id?'':id;catalogueState.edit=null;return render();}
      if(!isOwner())return;
      if(kind==='review-back'){state.review='';state.reviewExample=false;render();window.scrollTo(0,0);return;}
      if(kind==='review-example'){state.reviewExample=!state.reviewExample;return render();}
      if(kind==='coach-reviews'){state.tab='sessions';state.profile='';state.review='';state.reviewCoach=id;state.search='';state.status='all';state.sessionTypeFilter='all';return render();}
      if(kind==='payout-month'){const d=new Date(state.payoutMonth+'-15T12:00:00');d.setMonth(d.getMonth()+Number(id));state.payoutMonth=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');return render();}
      if(kind==='payout-status'){state.payStatus=id;return render();}
      if(kind==='payout-breakdown')return monthlyDetail(id,extra,true);
      if(kind==='payout-record')return recordPayout(id,extra);
      if(kind==='payout-confirm')return recordPayout(id,extra,true);
      if(kind==='payout-invoice'){const invoice=invoices.find(i=>i.coach===id&&i.month===extra);if(invoice)return show('Coach invoice',`<p>${esc(subjectName(id))} · ${fmtMonth(extra)}</p><p>${esc(invoice.name)}</p><p class="hint">Only this filename was retained locally. No PDF was uploaded.</p>`,btn('Close','close'));return;}
      if(kind==='portal-history')return portalHistoricalLinkForm();
      if(kind==='add')return coachForm();
      if(kind==='edit')return coachForm(id);
      if(kind==='archive')return archiveCoach(id);
      if(kind==='confirm-archive'){const c=coach(id);c.archived=!c.archived;return afterSave(c.archived?'Coach archived. Historical records retained.':'Coach restored.');}
      if(kind==='arrangement')return arrangementForm(id);
      if(kind==='assign')return assignForm(id);
      if(kind==='link')return linkForm(id,extra);
      if(kind==='terms')return termsForm(id,extra);
      if(kind==='retire')return show('Retire product assignment',`<p>Retire ${esc(product(extra)?.name)} for ${esc(subjectName(id))}? Historical links, earnings and payments are retained.</p>`,btn('Retire assignment','coo:confirm-retire/'+id+'/'+extra,'danger')+btn('Cancel','close'));
      if(kind==='confirm-retire'){const a=assignments.find(a=>a.subject===id&&a.product===extra);if(a)a.retired=true;activeLinks(id,extra).forEach(l=>l.active=false);return afterSave('Assignment retired. Historical attribution retained.');}
      if(kind==='catalogue')return catalogue(id);
      if(kind==='catalogue-back')return returnFromCatalogue();
      if(kind==='product-edit')return catalogueEdit(id);
      if(kind==='product-cancel-edit'){catalogueState.edit=null;return render();}
      if(kind==='product-save')return saveCatalogueRates();
      
      if(kind==='product-retire')return catalogueRetirement(id,true);
      if(kind==='product-restore')return catalogueRetirement(id,false);
      if(kind==='confirm-product-retire'){const p=product(id);p.retired=extra==='yes';catalogueHistory.push({product:id,effective:today,changes:[p.retired?'Retired for ADB':'Restored for ADB']});catalogueState.edit=null;return afterSave(p.retired?'Product retired. Assignment history retained.':'Product restored.');}
      if(kind==='product-coach'){state.tab='coaches';state.profile=id;state.profileTab='links';return render();}
      if(kind==='team'){state.tab='coaches';state.profile='';return render();}
      if(kind==='type')return typeForm(id);
      if(kind==='review')return reviewCall(id);
      if(kind==='wise')return wiseForm(id);
      if(kind==='payout')return payoutReview(id,extra);
      if(kind==='invoice')return invoiceForm(id,extra);
      return;
    }
    if(action.startsWith('tab:')){if(action==='tab:sessions')state.reviewCoach='all';state.profile='';state.performanceQuery='';state.review='';state.reviewExample=false;}
    if(action.startsWith('rate:')&&isOwner())return arrangementForm(action.split(':')[1]);
    if(action.startsWith('coach:')&&!own()){state.tab='coaches';state.profile=action.split(':')[1];state.profileTab='performance';return render();}
    return original.act(action);
  };

  render();
})();
