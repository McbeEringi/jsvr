const
dpp=1,
tr=w=>w[0].map((_,i)=>w.map(x=>x[i])),
heikin=w=>((
	p=tr(w).map(x=>x.reduce((a,x)=>a+x)/x.length)
)=>(
	p.r=w.reduce((a,x)=>Math.max(a,p.reduce((b,y,i)=>b+(y-x[i])**2,0)**.5),0),
	p
))(),
rosenzu=w=>(
	w=w.split(/\n{2,}/).map(x=>(
		x=x.split('\n'),
		x=((
			[name,col]=x.shift().split(/\s+/),
			i=0
		)=>({
			name,col,
			vert:x=x.filter(x=>x).map(x=>(
				x=x.split(/\s+/).map(x=>isNaN(+x)?x:+x),
				x[2]&&Object.assign(x,{name:x.pop(),i:++i,col}),
				x
			)),
			sta:x.filter(x=>x.name)
		}))()
	)),
	w.sta=w.reduce((a,x)=>(x.sta.forEach(x=>a[x.name]=[...(a[x.name]||[]),x]),a),{}),
	Object.assign(w,((
		x=w.flatMap(x=>x.vert).reduce((a,x)=>(
			a.minx=Math.min(a.minx||Infinity,x[0]),
			a.maxx=Math.max(a.maxx||-Infinity,x[0]),
			a.miny=Math.min(a.miny||Infinity,x[1]),
			a.maxy=Math.max(a.maxy||-Infinity,x[1]),
			a
		),{}),
		p=[128,256]
	)=>(
		x.minx-=p[0],x.maxx+=p[0],
		x.miny-=p[1],x.maxy+=p[1],
		x.width=x.maxx-x.minx,
		x.height=x.maxy-x.miny,
		x
	))()),
	`<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(w.width/80*dpp)*80}" height="${Math.ceil(w.height/80*dpp)*80}" viewBox="${
		[w.minx,w.miny,w.width,w.height].join(' ')
	}">
	<defs>
		<style>
			:root{
				font-family:"Zen Maru Gothic",sans-serif;font-weight:bold;font-size:64px;
				paint-order:stroke;stroke-linecap:round;stroke-linejoin:round;
			}
			.line{stroke-width:16;}
			.line_name{font-size:96px;stroke:#000c;stroke-width:16;dominant-baseline:hanging;}
			.sta_name{stroke:#0008;stroke-width:16;fill:#fff;dominant-baseline:middle;}
			#dot{stroke:#fffc;stroke-width:16px;}
			.title{fill:#fff;font-size:128px;dominant-baseline:ideographic;}
		</style>
		<circle id="dot" r="16"/>
		<pattern id="_grid" patternUnits="userSpaceOnUse" width="100" height="100">
			<rect width="100" height="100" style="stroke:#fff;fill:none;stroke-width:16;opacity:.5;"/>
		</pattern>
		<pattern id="grid" patternUnits="userSpaceOnUse" width="1000" height="1000">
			<rect width="1000" height="1000" fill="#223"/>
			<rect width="1000" height="1000" style="stroke:#fff;fill:url(#_grid);stroke-width:16;opacity:.2;"/>
		</pattern>
	</defs>
	<path fill="url(#grid)" d="M${[w.minx,w.miny]}v${w.height}h${w.width}v${-w.height}"/>
	<text class="title" x="${w.minx+64}" y="${w.maxy-64}">J鯖サバイバル 路線ネットワーク</text>
`+
	w.map((x,p)=>(
		p=x.sta.length/2-1|0,
		p=heikin(x.sta.slice(p,p+2)),
		`<g>
	<path fill="none" stroke="${x.col}" class="line" d="${x.vert.map((x,i)=>('ML'[i]||'')+x.join(',')).join(' ')}"/>
	<text class="line_name" x="${p[0]+16}" y="${p[1]+16}" fill="${x.col}">${x.name}</text>
</g>`
	)).join('\n')+
	`
<g class="sta">${Object.entries(w.sta).map(([i,x])=>`<g>
	${x.map(x=>`<use href="#dot" transform="translate(${x.join(',')})" fill="${x.col}"/>`).join('')}
	<g transform="translate(${heikin(x).join(',')})"><text class="sta_name" transform="rotate(-60)translate(${heikin(x).r+24},0)">${i}</text></g>
</g>`).join('\n')}</g>
</svg>`);
export{rosenzu};
