// E-Waste Report — Dynamic Content & D3 Charts
const D = SURVEY_DATA, TT = d3.select('#tooltip');
const COLORS = ['#1B4332','#2D6A4F','#40916C','#52B788','#74C69D','#95D5B2','#D4A843','#E8C96A','#E63946','#457B9D','#F4A261','#B7E4C7'];

// === SCROLL REVEAL ===
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }});
}, {threshold: 0.1});
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// === HERO COUNTERS ===
document.getElementById('hero-counters').innerHTML = [
  {n:'87%',l:'Aware of E-Waste Term',c:''},
  {n:'2-8%',l:'Use Formal Recycling',c:'danger'},
  {n:'92%',l:'Have Unused Devices at Home',c:'accent'},
  {n:'95-98%',l:'Goes to Informal Sector',c:'danger'}
].map(s=>`<div class="stat-card reveal"><div class="stat-number ${s.c}">${s.n}</div><div class="stat-label">${s.l}</div></div>`).join('');

// === EXEC CARDS ===
document.getElementById('exec-cards').innerHTML = [
  {icon:'🔍',title:'Survey Sample',desc:`<strong>${D.totalResponses} respondents</strong> from the CSV dataset (75 validated in UX report). Urban residents of Ahmedabad, Gandhinagar — primarily 18-35 years, university-educated.`},
  {icon:'🏭',title:'Expert Interview',desc:'3-hour contextual inquiry with <strong>E.coli Waste Management Systems</strong> — authorized recycler operating at <strong>1.6-2.5% capacity</strong> despite 600-ton monthly capability.'},
  {icon:'📊',title:'Key Finding',desc:`Awareness is high (${D.pct.aware}%) but <strong>${D.pct.noService}%</strong> don't know safe disposal services. Only <strong>${D.pct.recycled}%</strong> actually recycled formally.`},
  {icon:'⚠️',title:'Critical Gap',desc:`<strong>${D.pct.keptHome}%</strong> kept their last device at home. <strong>${D.pct.dataPrivacy}%</strong> cite data privacy as primary concern. <strong>${D.pct.noCampaign}%</strong> never saw an awareness campaign.`}
].map(c=>`<div class="card reveal"><div style="font-size:2rem;margin-bottom:.75rem">${c.icon}</div><h4>${c.title}</h4><div class="divider"></div><p>${c.desc}</p></div>`).join('');

// === METHOD STEPS ===
document.getElementById('method-steps').innerHTML = [
  {n:'1',t:'Secondary Research',d:'GPCB, CPCB, MoEFCC reports & academic literature'},
  {n:'2',t:'Expert Interview',d:'3-hr contextual inquiry at E.coli Waste Management'},
  {n:'3',t:'Consumer Survey',d:'Online questionnaire, n=82, Jan 31 - Feb 5, 2026'},
  {n:'4',t:'Statistical Analysis',d:'Chi-square tests, T-tests, cross-tabulations'}
].map(s=>`<div class="method-step"><div class="step-num">${s.n}</div><h4>${s.t}</h4><p>${s.d}</p></div>`).join('');

// === STAKEHOLDER CARDS ===
document.getElementById('stakeholder-cards').innerHTML = [
  {t:'Household Consumers',d:'Primary e-waste generators. 92% have unused devices at home.'},
  {t:'Formal Recyclers',d:'Authorized facilities operating at 1.6-2.5% capacity. E.coli: 600 MT/month capability, 10-15 MT actual.'},
  {t:'Informal Sector',d:'800-1,050 workers processing 95-98% of e-waste through hazardous methods. Offer doorstep cash payment.'},
  {t:'Government Bodies',d:'Gujarat PCB, AMC, GMC — limited enforcement, minimal coordination with formal recyclers.'}
].map(c=>`<div class="card reveal"><h4>${c.t}</h4><p>${c.d}</p></div>`).join('');

// === EXPERT FINDINGS ===
document.getElementById('expert-findings').innerHTML = [
  {t:'Capacity Underutilization',d:'600 MT/month installed capacity vs 10-15 MT actual inflow. Operating at 1.6-2.5%.'},
  {t:'Gandhinagar Paradox',d:'Fewer facilities yet higher collection rates — attributed to festival-timed drives and government sector participation.'},
  {t:'Data Degaussing Service',d:'Physical data destruction with certification exists but unknown to 94% of consumers. Mainly used by corporates.'},
  {t:'Municipal Gaps',d:'No systematic e-waste segregation at municipal points. Limited AMC/GMC awareness campaigns.'},
  {t:'Economic Misalignment',d:'Informal collectors offer ₹50-100 cash at doorstep. Formal recyclers offer free pickup but no payment.'},
  {t:'EPR Non-Compliance',d:'Companies hold permits without operating facilities. Paper compliance without actual material flow.'}
].map(c=>`<div class="card reveal"><h4>${c.t}</h4><div class="divider"></div><p>${c.d}</p></div>`).join('');

// === GAP CARDS ===
document.getElementById('gap-cards').innerHTML = [
  {s:'high',t:'Economic Incentive Misalignment',d:'Informal sector offers immediate cash; formal recyclers cannot compete. <span class="gap-stat">95-98%</span> diverted to hazardous channels.'},
  {s:'high',t:'Infrastructure Underutilization',d:'Formal facilities at <span class="gap-stat">1.6-2.5%</span> capacity. 600-ton capability receiving only 10-15 tons monthly.'},
  {s:'high',t:'Convenience Friction',d:'<span class="gap-stat">3-5 km</span> to collection centers. Limited hours (9AM-5PM). No doorstep service at scale despite 76% wanting it.'},
  {s:'high',t:'Data Privacy Trust Deficit',d:'<span class="gap-stat">27%</span> avoid disposal due to data concerns. Certified destruction exists but <span class="gap-stat">94%</span> are unaware.'},
  {s:'medium',t:'Awareness Campaign Void',d:`<span class="gap-stat">${D.pct.noCampaign}%</span> never encountered an e-waste awareness campaign. Surface awareness without action triggers.`},
  {s:'medium',t:'Municipal Coordination Failure',d:'No systematic e-waste segregation. Limited AMC/GMC promotion of formal recyclers. Inconsistent enforcement.'},
  {s:'medium',t:'Home Accumulation Inertia',d:'<span class="gap-stat">92%</span> have unused devices stored indefinitely. No disposal trigger exists in the current system.'}
].map(c=>`<div class="gap-card severity-${c.s} reveal"><span class="severity-badge">${c.s} severity</span><h4>${c.t}</h4><p>${c.d}</p></div>`).join('');

// === KIOSK FEATURES ===
document.getElementById('kiosk-features').innerHTML = [
  {i:'🔒',t:'Certified Data Destruction',d:'Live visualization of data wiping process with unique tracking ID and downloadable certificate. Addresses 27% privacy barrier.'},
  {i:'📍',t:'Geo-Located Facility Finder',d:'Real-time map of nearest authorized recyclers with distance, hours, and capacity status. Bridges the 73% information gap.'},
  {i:'🎮',t:'Gamified Impact Dashboard',d:'Show CO₂ prevented, materials recovered, and community leaderboards. Convert environmental data into tangible personal impact.'},
  {i:'🌐',t:'Multi-Language Interface',d:'Hindi, Gujarati, and English support with voice guidance. Critical for non-digital-native users in the target demographic.'},
  {i:'💰',t:'Instant Micro-Incentive',d:'QR-code based reward points redeemable at local stores. Competes with informal sector\'s ₹50-100 cash offering.'},
  {i:'📅',t:'Cultural Calendar Integration',d:'Auto-prompt during Diwali, New Year, and other decluttering moments. Gandhinagar data shows festival drives yield 3x response rates.'},
  {i:'📱',t:'Device Identification Scanner',d:'Camera-based device recognition that explains what qualifies as e-waste. Addresses identification confusion in survey data.'},
  {i:'📊',t:'E-Waste Education Module',d:'Interactive infographics on health impacts (6-8x lead poisoning risk in informal zones) and environmental contamination data.'},
  {i:'🚚',t:'One-Tap Pickup Scheduling',d:'Schedule doorstep collection in under 2 minutes. Address the 76% who want door-to-door pickup with minimal friction.'},
  {i:'🤝',t:'Social Proof Engine',d:'"Join 2,450 people in Ahmedabad who recycled this month" — counter display showing community momentum and normalized behavior.'}
].map(f=>`<div class="feature-item reveal"><div class="feature-icon">${f.i}</div><div><h4>${f.t}</h4><p>${f.d}</p></div></div>`).join('');

// === CAMPAIGN CARDS ===
document.getElementById('campaign-cards').innerHTML = [
  {n:'01',t:'"The Drawer of Shame"',tags:['Home Accumulation','Social Humor','Behavioral Nudge'],
   body:`<p><strong>Target Barrier:</strong> 92% home accumulation inertia</p><p><strong>Strategy:</strong> Social media campaign encouraging people to photograph their "drawer of shame" — the place where old devices go to be forgotten. Uses humor and peer accountability to normalize the conversation around device hoarding.</p><p><strong>Mechanism:</strong> Social proof + mild shame + community challenge format. "Post your drawer, pledge to clear it, tag 3 friends."</p><p><strong>Expected Outcome:</strong> Convert passive hoarding into active conversation; create social pressure for disposal action.</p>`},
  {n:'02',t:'"E-Waste ≠ Waste"',tags:['Economic Reframe','Value Recovery','Resource Awareness'],
   body:`<p><strong>Target Barrier:</strong> Economic incentive misalignment (16% motivated by money)</p><p><strong>Strategy:</strong> Educational campaign reframing e-waste as valuable urban mining resource. "Your old phone contains gold, silver, copper, and rare earth metals worth more than scrap price." Shows the actual material value chain.</p><p><strong>Mechanism:</strong> Economic reframing + value awareness. When people understand their device has real resource value, they're less likely to accept ₹50 from informal collectors.</p><p><strong>Expected Outcome:</strong> Shift perception from "worthless junk" to "valuable resource"; increase demand for fair-value formal recycling.</p>`},
  {n:'03',t:'"1 Device = 1 Impact"',tags:['Tangible Offset','Environmental','Gamification'],
   body:`<p><strong>Target Barrier:</strong> Only 8% cite environmental concerns — abstract harm doesn't drive action</p><p><strong>Strategy:</strong> Make environmental impact concrete and personal. Each device recycled = specific measurable impact displayed: "This phone prevented 2.3kg of toxic lead from entering groundwater." Partner with local environmental restoration projects.</p><p><strong>Mechanism:</strong> Concreteness + personal attribution + visible impact tracking. Abstract "save the planet" becomes tangible "your phone saved this much."</p><p><strong>Expected Outcome:</strong> Bridge the emotional gap between awareness and action by making impact personal and measurable.</p>`}
].map(c=>`<div class="campaign-card reveal"><div class="campaign-header"><div class="campaign-number">${c.n}</div><h3>${c.t}</h3></div><div class="campaign-body">${c.body}<div>${c.tags.map(t=>`<span class="campaign-tag">${t}</span>`).join('')}</div></div></div>`).join('');

// === SOLUTION CARDS ===
document.getElementById('solution-cards').innerHTML = [
  {n:'01',t:'Housing Society Collection Hubs',d:'Install permanent e-waste bins in residential complexes with monthly formal recycler pickups. Reduces the 3-5km friction to zero distance.'},
  {n:'02',t:'QR-Code Device Tracking',d:'Each deposited device gets a QR code. Users scan to track: collection → data wipe → dismantling → material recovery. Full transparency chain.'},
  {n:'03',t:'Corporate E-Waste Drives',d:'Partner with IT companies for quarterly employee e-waste drives. Leverage EPR obligations. Gandhinagar GIFT City is a prime pilot location.'},
  {n:'04',t:'Student Ambassador Program',d:'60%+ respondents are university-affiliated. Deploy campus ambassadors with collection targets and leaderboards. Peer influence in familiar environments.'},
  {n:'05',t:'Festival-Timed Pop-up Centers',d:'Gandhinagar data shows 3x response during Diwali drives. Deploy temporary collection points at festivals, malls, and markets during culturally relevant moments.'},
  {n:'06',t:'Integrated Scrap Dealer Network',d:'Formalize the informal: train and certify existing bhanganwalahs as authorized collection agents. They keep their doorstep advantage; e-waste enters formal channels.'}
].map(c=>`<div class="solution-card reveal"><div class="solution-num">${c.n}</div><h4>${c.t}</h4><p>${c.d}</p></div>`).join('');

// === CONCLUSION ===
document.getElementById('conclusion-insights').innerHTML = [
  {s:`${D.pct.aware}%`,t:'Awareness Without Action',d:'High awareness does not translate to behavior. The system needs action pathways, not more awareness campaigns.'},
  {s:'76%',t:'Convenience Is King',d:'Door-to-door pickup is the #1 motivator. Any solution that adds friction will fail against the informal sector\'s doorstep service.'},
  {s:'27%',t:'Trust Must Be Built',d:'Data privacy is a genuine behavioral barrier validated by 88% self-wiping behavior. Formal recyclers must make data destruction visible and certified.'},
  {s:'1.6%',t:'System Redesign Needed',d:'Formal infrastructure exists but operates near-idle. The problem is demand-side, not supply-side. Behavioral design can bridge this gap.'}
].map(c=>`<div class="insight-card reveal"><span class="stat-highlight">${c.s}</span><h4>${c.t}</h4><p>${c.d}</p></div>`).join('');

// === CHI-SQUARE TABLE ===
document.querySelector('#chi-table tbody').innerHTML = D.chiSquareResults.map(r=>
  `<tr><td>${r.pair}</td><td>${r.chi2}</td><td class="${r.significant?'significant':'not-significant'}">${r.pValue}</td><td>${r.dof}</td><td>${r.significant?'✓ Significant':'✗ Not Significant'}</td></tr>`
).join('');

// === T-TEST CARD ===
document.getElementById('ttest-card').innerHTML = `<h3>T-Test: Awareness vs Home Accumulation</h3><div class="divider"></div><p>Testing whether people who've heard of "E-waste" have different amounts of unused devices at home.</p><br>
<table class="data-table"><thead><tr><th>Metric</th><th>Value</th></tr></thead><tbody>
<tr><td>Mean (Aware group)</td><td>${D.ttest.meanAware}</td></tr>
<tr><td>Mean (Not Aware group)</td><td>${D.ttest.meanNotAware}</td></tr>
<tr><td>T-Statistic</td><td>${D.ttest.tStatistic}</td></tr>
<tr><td>P-Value</td><td class="${D.ttest.significant?'significant':'not-significant'}">${D.ttest.pValue}</td></tr>
<tr><td>Result</td><td>${D.ttest.significant?'Significant difference':'No significant difference'} (α=0.05)</td></tr>
</tbody></table>
<p style="margin-top:1rem;font-size:.9rem">Recognition depth: Aware group identifies <strong>${D.recognitionDepth.byAwareness['Yes']||'N/A'}</strong> items on average vs <strong>${D.recognitionDepth.byAwareness['No']||'N/A'}</strong> for unaware group.</p>`;

// Re-observe newly created reveal elements
document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
