const
avg=w=>w[0].map((_,i)=>w.reduce((a,x)=>a+x[i],0)/w.length),
o2p=w=>Object.entries(w).map(([k,v])=>`${k}="${v}"`).join(' '),
rosenzu=({line,config:w})=>(
	line=line.map(({name,color,vert})=>({
		name,color,
		vert:(vert.match(/^.+$/gm)??[]).map(x=>(
			x=x.split(/\s+/,3),
			Object.assign([+x[0],+x[1]],x[2]?{name:x[2],line:{name,color}}:{})
		)),
		get sta(){return this.vert.filter(x=>x.name);}
	})),
	w.sta=Object.entries(
		line.reduce((a,x)=>(x.sta.forEach(x=>a[x.name]=[...(a[x.name]||[]),x]),a),{})
	).map(([i,x])=>Object.assign(x,{
		name:i,
		avg:avg(x),
		get r(){return x.reduce((a,x)=>Math.max(a,Math.hypot(...x.map((x,i)=>x-this.avg[i]))),0);}
	})),
	w.bb=line.flatMap(x=>x.vert).reduce((a,x)=>x.map((x,i)=>[
		Math.min(x,a[i][0]),Math.max(x,a[i][1])
	]),[
		[Infinity,-Infinity],// x min max
		[Infinity,-Infinity],// y min max
	]),
	w.bb=[
		[w.bb[0][0]-w.padding[3],w.bb[0][1]+w.padding[1]],
		[w.bb[1][0]-w.padding[0],w.bb[1][1]+w.padding[2]],
	],
	w.size=w.bb.map(x=>x[1]-x[0]),
	w.text.title.anchor=(x=>[
		[1,2,0,1][x.includes('left')*2+x.includes('right')],
		[1,2,0,1][x.includes('top')*2+x.includes('bottom')]
	])(w.text.title.anchor),


	`<svg xmlns="http://www.w3.org/2000/svg" ${
		o2p((f=>w.size.reduce((a,x,i)=>(a[['width','height'][i]]=f(x*w.dpp),a),{}))(
			w.size_round?x=>Math.ceil(x/w.size_round)*w.size_round:x=>x
		))
	} viewBox="${
		[...w.bb.map(x=>x[0]),...w.size].join(' ')
	}">
	<defs>
		<style>
			:root{
				font-family:"Zen Maru Gothic",sans-serif;font-weight:bold;font-size:64px;
				paint-order:stroke;stroke-linecap:round;stroke-linejoin:round;
			}
			.line path{stroke-width:16;}
			.line text{font-size:96px;stroke:#000c;stroke-width:16;dominant-baseline:hanging;}
			.sta text{stroke:#0008;stroke-width:16;fill:#fff;dominant-baseline:middle;}
			#dot{stroke:#fffc;stroke-width:16px;}
			.title{
				fill:${w.text.title.color};
				font-size:${w.text.title.size}px;
				text-anchor:${['start','middle','end'][w.text.title.anchor[0]]};
				dominant-baseline:${['hanging','middle','ideographic'][w.text.title.anchor[1]]};
			}
		</style>
		<circle id="dot" r="16"/>
		<path id="fill" d="M${w.bb.map(x=>x[0])}v${w.size[1]}h${w.size[0]}v${-w.size[1]}"/>
		${w.grid.map((x,i)=>`
		<pattern id="grid${i}" patternUnits="userSpaceOnUse" x="${x.offset[0]}" y="${x.offset[1]}" width="${x.size[0]}" height="${x.size[1]}">
			<rect width="${x.size[0]}" height="${x.size[1]}" style="stroke:${x.color};fill:none;stroke-width:${x.width};"/>
		</pattern>`).join('')}
	</defs>
	<use href="#fill" fill="${w.background_color}"/>
	${w.grid.map((_,i)=>`<use href="#fill" fill="url(#grid${i})"/>`).join('')}
	<text class="title" ${
		o2p(w.bb.reduce((a,x,i)=>(a['xy'[i]]=[
			x[0]+w.text.title.margin[i],
			x[0]+w.size[i]/2,
			x[1]-w.text.title.margin[i]
		][w.text.title.anchor[i]],a),{}))
	}>${w.text.title.value}</text>
	<g class="line">${line.map((x,p)=>(p=x.sta.length/2-1|0,p=avg(x.sta.slice(p,p+2)),`
		<g>
			<path fill="none" stroke="${x.color}" d="${x.vert.map((x,i)=>('ML'[i]||'')+x.join(',')).join(' ')}"/>
			<text x="${p[0]+16}" y="${p[1]+16}" fill="${x.color}">${x.name}</text>
		</g>`
	)).join('')}
	</g>
	<g class="sta">${w.sta.map(x=>`
		<g>
			${x.map(x=>`<use href="#dot" transform="translate(${x.join(',')})" fill="${x.line.color}"/>`).join('')}
			<g transform="translate(${x.avg.join(',')})"><text transform="rotate(-60)translate(${x.r+24},0)">${x.name}</text></g>
		</g>`).join('')}
	</g>
</svg>
`
)

export{rosenzu};
