// E-Waste Report — D3.js Responsive Charts
(function(){
const D=SURVEY_DATA,TT=d3.select('#tooltip');
const C=['#1B4332','#2D6A4F','#40916C','#52B788','#74C69D','#D4A843','#E63946','#457B9D','#F4A261','#95D5B2'];
function show(e,html){TT.html(html).style('opacity',1).style('left',(e.pageX+12)+'px').style('top',(e.pageY-28)+'px');}
function hide(){TT.style('opacity',0);}
function dims(id){const el=document.getElementById(id);return{w:el.clientWidth||300,h:Math.max(el.clientHeight,300)};}
function clear(id){document.getElementById(id).innerHTML='';}

const charts={};

// 1. DONUT — Awareness
charts.donut=function(){
  const id='chart-donut';clear(id);const{w,h}=dims(id),r=Math.min(w,h)/2-20;
  const svg=d3.select('#'+id).append('svg').attr('viewBox',`0 0 ${w} ${h}`).attr('width','100%').append('g').attr('transform',`translate(${w/2},${h/2})`);
  const pie=d3.pie().value(d=>d.value).sort(null);
  const arc=d3.arc().innerRadius(r*0.55).outerRadius(r);
  const color=d3.scaleOrdinal().domain(D.awareness.map(d=>d.label)).range(['#1B4332','#E63946','#D4A843']);
  svg.selectAll('path').data(pie(D.awareness)).join('path').attr('d',arc).attr('fill',d=>color(d.data.label)).attr('stroke','#fff').attr('stroke-width',2)
    .on('mousemove',(e,d)=>show(e,`<strong>${d.data.label}</strong><br>${d.data.value} (${(d.data.value/D.totalResponses*100).toFixed(1)}%)`))
    .on('mouseout',hide);
  const lg=d3.select('#'+id).append('div').attr('class','chart-legend');
  D.awareness.forEach(d=>lg.append('div').attr('class','legend-item').html(`<div class="legend-swatch" style="background:${color(d.label)}"></div>${d.label}: ${d.value} (${(d.value/D.totalResponses*100).toFixed(1)}%)`));
};

// 2. SERVICE KNOWLEDGE
charts.service=function(){
  const id='chart-service';clear(id);const{w,h}=dims(id),r=Math.min(w,h)/2-20;
  const svg=d3.select('#'+id).append('svg').attr('viewBox',`0 0 ${w} ${h}`).attr('width','100%').append('g').attr('transform',`translate(${w/2},${h/2})`);
  const pie=d3.pie().value(d=>d.value).sort(null);
  const arc=d3.arc().innerRadius(r*0.55).outerRadius(r);
  const color=d3.scaleOrdinal().range(['#E63946','#D4A843','#52B788']);
  svg.selectAll('path').data(pie(D.serviceKnowledge)).join('path').attr('d',arc).attr('fill',(d,i)=>color(i)).attr('stroke','#fff').attr('stroke-width',2)
    .on('mousemove',(e,d)=>show(e,`<strong>${d.data.label}</strong><br>${d.data.value} (${(d.data.value/D.totalResponses*100).toFixed(1)}%)`))
    .on('mouseout',hide);
  const lg=d3.select('#'+id).append('div').attr('class','chart-legend');
  D.serviceKnowledge.forEach((d,i)=>lg.append('div').attr('class','legend-item').html(`<div class="legend-swatch" style="background:${['#E63946','#D4A843','#52B788'][i]}"></div>${d.label}: ${d.value}`));
};

// Helper: responsive horizontal bar
function hBar(id,data,hh,lm){
  clear(id);const{w}=dims(id);
  const ml=Math.min(lm,w*0.4),h=hh;
  const svg=d3.select('#'+id).append('svg').attr('viewBox',`0 0 ${w} ${h}`).attr('width','100%');
  const x=d3.scaleLinear().domain([0,d3.max(data,d=>d.value)]).range([0,w-ml-30]);
  const y=d3.scaleBand().domain(data.map(d=>d.label)).range([10,h-30]).padding(0.35);
  svg.selectAll('rect').data(data).join('rect').attr('x',ml).attr('y',d=>y(d.label)).attr('height',y.bandwidth()).attr('rx',4).attr('fill',(d,i)=>C[i%C.length])
    .on('mousemove',(e,d)=>show(e,`${d.label}: <strong>${d.value}</strong> (${(d.value/D.totalResponses*100).toFixed(1)}%)`)).on('mouseout',hide)
    .attr('width',d=>x(d.value));
  const maxChars=Math.floor(ml/6.5);
  svg.selectAll('.lbl').data(data).join('text').attr('x',ml-8).attr('y',d=>y(d.label)+y.bandwidth()/2).attr('dy','0.35em').attr('text-anchor','end').attr('font-size',w<500?'9px':'11px').attr('fill','#555').text(d=>d.label.length>maxChars?d.label.slice(0,maxChars)+'…':d.label);
  svg.selectAll('.val').data(data).join('text').attr('x',d=>ml+x(d.value)+6).attr('y',d=>y(d.label)+y.bandwidth()/2).attr('dy','0.35em').attr('font-size','11px').attr('font-weight','600').attr('fill','#1B4332').text(d=>d.value);
}

// 3. DISPOSAL
charts.disposal=function(){hBar('chart-disposal',D.disposalMethods,280,200);};

// 4. STACKED BAR
charts.stacked=function(){
  const id='chart-stacked';clear(id);const{w}=dims(id),h=320,m={t:10,r:20,b:80,l:40};
  const svg=d3.select('#'+id).append('svg').attr('viewBox',`0 0 ${w} ${h}`).attr('width','100%');
  const data=D.stackedDisposalReason,keys=D.disposalReasonKeys;
  const stack=d3.stack().keys(keys)(data);
  const x=d3.scaleBand().domain(data.map(d=>d.group)).range([m.l,w-m.r]).padding(0.3);
  const y=d3.scaleLinear().domain([0,d3.max(stack[stack.length-1],d=>d[1])]).range([h-m.b,m.t]);
  const color=d3.scaleOrdinal().domain(keys).range(C);
  svg.selectAll('g.layer').data(stack).join('g').attr('class','layer').attr('fill',d=>color(d.key))
    .selectAll('rect').data(d=>d).join('rect').attr('x',d=>x(d.data.group)).attr('width',x.bandwidth()).attr('rx',2)
    .attr('y',d=>y(d[1])).attr('height',d=>y(d[0])-y(d[1]))
    .on('mousemove',(e,d)=>{const k=d3.select(e.target.parentNode).datum().key;show(e,`${d.data.group}<br><strong>${k}</strong>: ${d[1]-d[0]}`);})
    .on('mouseout',hide);
  svg.append('g').attr('transform',`translate(0,${h-m.b})`).call(d3.axisBottom(x)).selectAll('text').attr('transform','rotate(-35)').attr('text-anchor','end').attr('font-size',w<500?'7px':'9px');
  const lg=d3.select('#'+id).append('div').attr('class','chart-legend');
  keys.forEach((k,i)=>lg.append('div').attr('class','legend-item').html(`<div class="legend-swatch" style="background:${C[i]}"></div>${k}`));
};

// 5. WAFFLE
charts.waffle=function(){
  const id='chart-waffle';clear(id);const{w}=dims(id);
  const cols=10,sz=Math.min((w-20)/cols,25),gap=3;
  const rows=Math.ceil(D.totalResponses/cols);
  const svg=d3.select('#'+id).append('svg').attr('viewBox',`0 0 ${cols*(sz+gap)} ${rows*(sz+gap)}`).attr('width','100%');
  let cells=[],idx=0;
  D.waffleData.forEach(g=>{for(let i=0;i<g.value;i++){cells.push({label:g.label,color:g.color,i:idx++});}});
  svg.selectAll('rect').data(cells).join('rect')
    .attr('x',d=>(d.i%cols)*(sz+gap)).attr('y',d=>Math.floor(d.i/cols)*(sz+gap))
    .attr('width',sz).attr('height',sz).attr('rx',3).attr('fill',d=>d.color)
    .on('mousemove',(e,d)=>show(e,d.label)).on('mouseout',hide);
  const lg=d3.select('#'+id).append('div').attr('class','chart-legend');
  D.waffleData.forEach(d=>lg.append('div').attr('class','legend-item').html(`<div class="legend-swatch" style="background:${d.color}"></div>${d.label}: ${d.value} (${(d.value/D.totalResponses*100).toFixed(1)}%)`));
};

// 6. SUNBURST
charts.sunburst=function(){
  const id='chart-sunburst';clear(id);const{w,h}=dims(id),r=Math.min(w,h)/2-10;
  const svg=d3.select('#'+id).append('svg').attr('viewBox',`0 0 ${w} ${h}`).attr('width','100%').append('g').attr('transform',`translate(${w/2},${h/2})`);
  const root=d3.hierarchy(D.sunburst).sum(d=>d.size).sort((a,b)=>b.value-a.value);
  d3.partition().size([2*Math.PI,r])(root);
  const arc=d3.arc().startAngle(d=>d.x0).endAngle(d=>d.x1).innerRadius(d=>d.y0).outerRadius(d=>d.y1).padAngle(0.01);
  const color=d3.scaleOrdinal().range(C);
  svg.selectAll('path').data(root.descendants().filter(d=>d.depth)).join('path').attr('d',arc)
    .attr('fill',d=>d.depth===1?color(d.data.name):d3.color(color(d.parent.data.name)).brighter(d.data.name==='Yes'?0:d.data.name==='No'?1.5:0.8))
    .attr('stroke','#fff').attr('stroke-width',1)
    .on('mousemove',(e,d)=>show(e,`<strong>${d.data.name}</strong>${d.parent?'<br>Parent: '+d.parent.data.name:''}<br>Count: ${d.value}`))
    .on('mouseout',hide);
  svg.append('text').attr('text-anchor','middle').attr('dy','0.35em').attr('font-size','14px').attr('font-weight','700').attr('fill','#1B4332').text('E-Waste Items');
};

// 7. TREEMAP
charts.treemap=function(){
  const id='chart-treemap';clear(id);const{w,h}=dims(id);
  const svg=d3.select('#'+id).append('svg').attr('viewBox',`0 0 ${w} ${h}`).attr('width','100%');
  const root=d3.hierarchy(D.treemap).sum(d=>d.value);
  d3.treemap().size([w,h]).padding(3).round(true)(root);
  const color=d3.scaleOrdinal().range(C);
  const nodes=svg.selectAll('g').data(root.leaves()).join('g').attr('transform',d=>`translate(${d.x0},${d.y0})`);
  nodes.append('rect').attr('width',d=>d.x1-d.x0).attr('height',d=>d.y1-d.y0).attr('rx',6).attr('fill',(_,i)=>color(i)).attr('opacity',0.85)
    .on('mousemove',(e,d)=>show(e,`<strong>${d.data.name}</strong><br>${d.data.value} responses (${(d.data.value/D.totalResponses*100).toFixed(1)}%)`))
    .on('mouseout',hide);
  nodes.append('text').attr('x',6).attr('y',18).attr('fill','#fff').attr('font-size','11px').attr('font-weight','600')
    .text(d=>{const bw=d.x1-d.x0;return bw>80?d.data.name.slice(0,Math.floor(bw/7)):''});
  nodes.append('text').attr('x',6).attr('y',34).attr('fill','rgba(255,255,255,0.8)').attr('font-size','10px')
    .text(d=>(d.x1-d.x0>60)?d.data.value:'');
};

// 8. RADAR
charts.radar=function(){
  const id='chart-radar';clear(id);const{w,h}=dims(id),r=Math.min(w,h)/2-50;
  const svg=d3.select('#'+id).append('svg').attr('viewBox',`0 0 ${w} ${h}`).attr('width','100%').append('g').attr('transform',`translate(${w/2},${h/2})`);
  const data=D.radarFactors,n=data.length,as=2*Math.PI/n;
  const rS=d3.scaleLinear().domain([0,35]).range([0,r]);
  [7,14,21,28,35].forEach(v=>{
    svg.append('circle').attr('r',rS(v)).attr('fill','none').attr('stroke','#E5E3DE').attr('stroke-dasharray','3,3');
    svg.append('text').attr('x',4).attr('y',-rS(v)-2).attr('font-size','9px').attr('fill','#8E8EA0').text(v+'%');
  });
  data.forEach((d,i)=>{
    const a=as*i-Math.PI/2;
    svg.append('line').attr('x1',0).attr('y1',0).attr('x2',rS(35)*Math.cos(a)).attr('y2',rS(35)*Math.sin(a)).attr('stroke','#E5E3DE');
    svg.append('text').attr('x',(r+25)*Math.cos(a)).attr('y',(r+25)*Math.sin(a)).attr('text-anchor','middle').attr('dy','0.35em').attr('font-size','11px').attr('font-weight','600').attr('fill','#1B4332').text(d.axis);
  });
  const line=d3.lineRadial().radius(d=>rS(d.value)).angle((_,i)=>i*as).curve(d3.curveLinearClosed);
  svg.append('path').datum(data).attr('d',line).attr('fill','rgba(27,67,50,0.15)').attr('stroke','#1B4332').attr('stroke-width',2);
  data.forEach((d,i)=>{
    const a=as*i-Math.PI/2;
    svg.append('circle').attr('cx',rS(d.value)*Math.cos(a)).attr('cy',rS(d.value)*Math.sin(a)).attr('r',5).attr('fill','#D4A843').attr('stroke','#fff').attr('stroke-width',2)
      .on('mousemove',e=>show(e,`<strong>${d.axis}</strong>: ${d.value}%`)).on('mouseout',hide);
  });
};

// 9-11. Bar charts
charts.dataActions=function(){hBar('chart-data-actions',D.dataActions,260,220);};
charts.lollipop=function(){
  const id='chart-lollipop';clear(id);const{w}=dims(id),h=280;
  const ml=Math.min(230,w*0.4);
  const svg=d3.select('#'+id).append('svg').attr('viewBox',`0 0 ${w} ${h}`).attr('width','100%');
  const data=D.recyclingMotivators;
  const x=d3.scaleLinear().domain([0,d3.max(data,d=>d.value)]).range([0,w-ml-40]);
  const y=d3.scaleBand().domain(data.map(d=>d.label)).range([10,h-30]).padding(0.4);
  const maxC=Math.floor(ml/6.5);
  svg.selectAll('line.stem').data(data).join('line').attr('x1',ml).attr('x2',d=>ml+x(d.value)).attr('y1',d=>y(d.label)+y.bandwidth()/2).attr('y2',d=>y(d.label)+y.bandwidth()/2).attr('stroke','#E5E3DE').attr('stroke-width',2);
  svg.selectAll('circle').data(data).join('circle').attr('cx',d=>ml+x(d.value)).attr('cy',d=>y(d.label)+y.bandwidth()/2).attr('r',7).attr('fill',(d,i)=>C[i]).attr('stroke','#fff').attr('stroke-width',2)
    .on('mousemove',(e,d)=>show(e,`${d.label}: <strong>${d.value}</strong>`)).on('mouseout',hide);
  svg.selectAll('.lbl').data(data).join('text').attr('x',ml-8).attr('y',d=>y(d.label)+y.bandwidth()/2).attr('dy','0.35em').attr('text-anchor','end').attr('font-size',w<500?'9px':'10px').attr('fill','#555').text(d=>d.label.length>maxC?d.label.slice(0,maxC)+'…':d.label);
  svg.selectAll('.val').data(data).join('text').attr('x',d=>ml+x(d.value)+14).attr('y',d=>y(d.label)+y.bandwidth()/2).attr('dy','0.35em').attr('font-size','11px').attr('font-weight','600').attr('fill','#1B4332').text(d=>d.value);
};
charts.campaign=function(){hBar('chart-campaign',D.campaignExposure,260,200);};

// 12. HEATMAP
charts.heatmap=function(){
  const id='chart-heatmap';clear(id);const{w}=dims(id);
  const labels=D.heatmap.labels,matrix=D.heatmap.matrix,n=labels.length;
  const sz=Math.min((w-120)/n,55),offX=Math.max((w-n*sz)/2,70),offY=50;
  const svg=d3.select('#'+id).append('svg').attr('viewBox',`0 0 ${w} ${n*sz+100}`).attr('width','100%');
  const color=d3.scaleSequential().domain([0,1]).interpolator(t=>t<0.05?d3.interpolateGreens(1-t*10):d3.interpolateReds(t));
  for(let i=0;i<n;i++){for(let j=0;j<n;j++){
    const v=matrix[i][j];
    svg.append('rect').attr('x',offX+j*sz).attr('y',offY+i*sz).attr('width',sz-2).attr('height',sz-2).attr('rx',4)
      .attr('fill',i===j?'#F3F1EE':color(v))
      .on('mousemove',e=>show(e,`${labels[i]} × ${labels[j]}<br>p-value: <strong>${v}</strong><br>${v<0.05?'✓ Significant':'✗ Not significant'}`))
      .on('mouseout',hide);
    if(i!==j&&sz>30)svg.append('text').attr('x',offX+j*sz+sz/2-1).attr('y',offY+i*sz+sz/2).attr('text-anchor','middle').attr('dy','0.35em').attr('font-size',sz>45?'9px':'7px').attr('fill',v<0.05?'#fff':'#333').attr('font-weight',v<0.05?'700':'400').text(v.toFixed(3));
  }}
  const fs=sz>45?'9px':'7px';
  labels.forEach((l,i)=>{
    svg.append('text').attr('x',offX+i*sz+sz/2).attr('y',offY-8).attr('text-anchor','middle').attr('font-size',fs).attr('fill','#555').attr('transform',`rotate(-35,${offX+i*sz+sz/2},${offY-8})`).text(l);
    svg.append('text').attr('x',offX-6).attr('y',offY+i*sz+sz/2).attr('text-anchor','end').attr('dy','0.35em').attr('font-size',fs).attr('fill','#555').text(l);
  });
};

// 13. ALLUVIAL
charts.alluvial=function(){
  const id='chart-sankey';clear(id);const{w}=dims(id),h=Math.max(450,dims(id).h),m={t:20,r:Math.min(140,w*0.12),b:20,l:Math.min(120,w*0.1)};
  const svg=d3.select('#'+id).append('svg').attr('viewBox',`0 0 ${w} ${h}`).attr('width','100%').style('height',h+'px').attr('preserveAspectRatio','xMidYMid meet');
  const nodes=D.sankey.nodes,links=D.sankey.links;
  const levels=[[],[],[]];
  const srcSet=new Set(links.map(l=>l.source)),tgtSet=new Set(links.map(l=>l.target));
  nodes.forEach((n,i)=>{
    const isSrc=srcSet.has(i),isTgt=tgtSet.has(i);
    if(isSrc&&!isTgt)levels[0].push(i);else if(isSrc&&isTgt)levels[1].push(i);else levels[2].push(i);
  });
  const nodeVal={};
  nodes.forEach((_,i)=>{
    nodeVal[i]=Math.max(links.filter(l=>l.target===i).reduce((s,l)=>s+l.value,0),links.filter(l=>l.source===i).reduce((s,l)=>s+l.value,0));
  });
  const colX=[m.l,w/2-9,w-m.r-18],nodeW=18,pad=6,nodePos={};
  levels.forEach((lev,col)=>{
    const totalH=lev.reduce((s,i)=>s+nodeVal[i],0),totalPad=(lev.length-1)*pad;
    const scale=(h-m.t-m.b-totalPad)/totalH;let y=m.t;
    lev.forEach(i=>{nodePos[i]={x:colX[col],y:y,h:Math.max(4,nodeVal[i]*scale),col:col};y+=nodePos[i].h+pad;});
  });
  const color=d3.scaleOrdinal().range(C);
  const linkG=svg.append('g');
  const sorted=[...links].sort((a,b)=>b.value-a.value);
  const srcOff={},tgtOff={};nodes.forEach((_,i)=>{srcOff[i]=0;tgtOff[i]=0;});
  sorted.forEach(l=>{
    const s=nodePos[l.source],t=nodePos[l.target];if(!s||!t)return;
    const sH=(l.value/nodeVal[l.source])*s.h,tH=(l.value/nodeVal[l.target])*t.h;
    const sy=s.y+srcOff[l.source],ty=t.y+tgtOff[l.target];
    srcOff[l.source]+=sH;tgtOff[l.target]+=tH;
    const sx=s.x+nodeW,tx=t.x;
    linkG.append('path').attr('d',`M${sx},${sy} C${(sx+tx)/2},${sy} ${(sx+tx)/2},${ty} ${tx},${ty} L${tx},${ty+tH} C${(sx+tx)/2},${ty+tH} ${(sx+tx)/2},${sy+sH} ${sx},${sy+sH} Z`)
      .attr('fill',color(nodes[l.source].name)).attr('opacity',0.25)
      .on('mousemove',e=>show(e,`${nodes[l.source].name} → ${nodes[l.target].name}<br><strong>${l.value}</strong>`)).on('mouseout',hide)
      .on('mouseenter',function(){d3.select(this).attr('opacity',0.5);}).on('mouseleave',function(){d3.select(this).attr('opacity',0.25);});
  });
  const maxC=Math.floor(m.l/5);
  nodes.forEach((n,i)=>{
    const p=nodePos[i];if(!p)return;
    svg.append('rect').attr('x',p.x).attr('y',p.y).attr('width',nodeW).attr('height',p.h).attr('rx',3).attr('fill',color(n.name))
      .on('mousemove',e=>show(e,`<strong>${n.name}</strong><br>Total: ${nodeVal[i]}`)).on('mouseout',hide);
    const anchor=p.col===0?'end':'start',tx=p.col===0?p.x-6:p.x+nodeW+6;
    svg.append('text').attr('x',tx).attr('y',p.y+p.h/2).attr('dy','0.35em').attr('text-anchor',anchor)
      .attr('font-size',w<500?'8px':'10px').attr('fill','#1A1A2E').attr('font-weight','500')
      .text(n.name.length>maxC?n.name.slice(0,maxC)+'…':n.name);
  });
};

// Draw all
function drawAll(){Object.values(charts).forEach(fn=>fn());}
drawAll();

// Debounced resize
let resizeTimer;
window.addEventListener('resize',function(){
  clearTimeout(resizeTimer);
  resizeTimer=setTimeout(drawAll,300);
});
})();
