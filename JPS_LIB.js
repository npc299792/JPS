
JPS.LIB ??= {}

// #################################################################################################################################

JPS.TYPES.BASE		= {s:1, r:1, life:1, type:1}
JPS.TYPES.COLOR		= {r:[128,64], g:[128,64], b:[128,64], a:[0.6,0.4]}
JPS.TYPES.GRADIENT	= [{i:0.3, r:[200,50], g:[200,50], b:[200,50], a:1}, {i:1, r:0, g:0, b:0, a:0}]

JPS.TYPES.RECT		= {w:[10,10], h:[10,10], color:JPS.TYPES.COLOR, method:'fillRect'}
JPS.TYPES.CIRCLE	= {radius:[10,10], color:JPS.TYPES.COLOR}
JPS.TYPES.SPHERE	= {radius:[10,10], gradient:JPS.TYPES.GRADIENT}
JPS.TYPES.TEXT		= {size:[20,10], color:JPS.TYPES.COLOR, font:'Arial', method:'fillText', text:['A','B','C']}
JPS.TYPES.IMAGE		= {x:0, y:0, s:[1,1]}

JPS.TYPES.EMITTER	= {x:0, y:0, z:0, w:100, h:100, d:0, spawn:0, rate:0}
JPS.TYPES.ANIMATE	= {id:'v', data:{x:[0,100], y:[0,100]}}
JPS.TYPES.WALL		= {id:'v', x:0, y:0, w:100, h:100, size:1, bounce:0.6}
JPS.TYPES.INFO		= {x:5, y:20, size:15, color:'grey', font:'Arial', method:'fillText', text1:'fps: %%fps  /  particles: %%p'}
JPS.TYPES.CAMERA	= {x:0, y:0, z:-1000, depth:2000, fov:Math.PI/2, center:{x:window.innerWidth/2,y:window.innerHeight/2}, mode:2}

JPS.TYPES.NEWTON	= {id:'v', mass:1, const:1.1}
JPS.TYPES.BOX		= {id:'v', x:0, y:0, w:500, h:500}

// #################################################################################################################################

JPS.TOOLS.RNDASN = function(r, ...a) {
	for (o of a) for (i in o) r[i] = JPS.TOOLS.RND(o[i])
	return r
}

JPS.TOOLS.RNDBASE = function(a, b) {
	for (i in JPS.TYPES.BASE) if (b[i]) a[i] = JPS.TOOLS.RND(b[i])
}

JPS.TOOLS.PRINT = function(ctx, t, h=20, x=0, y=0, f, c, a, b, m='fillText') {
	if (f) ctx.font = h + 'px ' + f
	if (c) ctx.fillStyle = c
	if (a) ctx.textAlign = a
	if (b) ctx.textBaseline = b
	if (t) ctx[m](t, x, y)
}

JPS.TOOLS.INRECT = (x,y,a,b,c,d) => x > a && x < c && y > b && y < d
JPS.TOOLS.INBOUND = (x,y,w,h,a,b,c,d) => x < a+c && x+w > a && y < b+d && y+h > b
JPS.TOOLS.INTERSECT = (x,y,u,v,a,b,c,d) => {
	l = u * d - v * c
	t = -(x * d - y * c - a * d + b * c) / l
	if (t < 0 || t > 1) return false
	s = -(x * v - y * u + u * b - v * a) / l
	return s > 0 && s < 1
}

// #################################################################################################################################


JPS.LIB.RECTANGLE = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.RECT, data)
	}
	init(p) {
		JPS.TOOLS.RNDASN(p, this)
	}
	render(p, ctx) {
		if (!ctx) return
		ctx.fillStyle = p.color
		ctx[this.method](-p.w/2, -p.h/2, p.w, p.h)
	}
}


JPS.LIB.CIRCLE = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.CIRCLE, data)
	}
	init(p) {
		JPS.TOOLS.RNDASN(p, this)
	}
	render(p, ctx) {
		if (!ctx) return
		ctx.fillStyle = p.color
		ctx.beginPath(); ctx.arc(0, 0, p.radius, 0, 360); ctx.fill()
	}
}


JPS.LIB.SPHERE = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.SPHERE, data)
	}
	init(p, ctx) {
		JPS.TOOLS.RNDBASE(p, this)
		p.radius = JPS.TOOLS.RND(this.radius)
		p.gradient = ctx.createRadialGradient(0,0,0,0,0,p.radius)
		this.gradient.forEach(c => p.gradient.addColorStop(c.i, JPS.TOOLS.RND(c)))
	}
	render(p, ctx) {
		if (!ctx) return
		ctx.fillStyle = p.gradient
		ctx.beginPath(); ctx.arc(0, 0, p.radius, 0, 360); ctx.fill()
	}
}


JPS.LIB.IMAGE = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.IMAGE, data)
		this.image = new Image()
		this.image.src = data.src
	}
	init(p) {
		JPS.TOOLS.RNDBASE(p, this)
	}
	render(p, ctx) {
		ctx?.drawImage(this.image, -this.image.width/2, -this.image.height/2)
	}
}


JPS.LIB.TEXT = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.TEXT, data)
	}
	init(p) {
		JPS.TOOLS.RNDBASE(p, this)
		p.h		= JPS.TOOLS.RND(this.size,0,1)
		p.color	= JPS.TOOLS.RNDRGB(this.color)
		p.text  = this.text[~~(Math.random()*this.text.length)]
	}
	render(p, ctx) {
		ctx && JPS.TOOLS.PRINT(ctx, p.text, p.h, 0, p.h, this.font, p.color, 0,0, this.method)
	}
}

// #################################################################################################################################


JPS.LIB.EMITTER = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.EMITTER, data)
	}
	post(ctx, time, sys) {
		this.spawn += time * this.rate
		while (this.spawn >= 1) {
			var p = sys.spawn(1, ctx)
			JPS.TOOLS.RNDBASE(p, this)
			if (Array.isArray(p.type)) p.type = p.type[~~(Math.random()*p.type.length)]
			p.x = JPS.TOOLS.RND(this.x, this.w/2)
			p.y = JPS.TOOLS.RND(this.y, this.h/2)
			p.z = JPS.TOOLS.RND(this.z, this.d/2)
			this.spawn--
		}
	}
}


JPS.LIB.ANIMATE = class {
	constructor(data, id) {
		Object.assign(this, JPS.TYPES.ANIMATE, data)
		this.data = data || this.data
	}
	init(p) {
		for (var e in this.data) p[this.id+e] = JPS.TOOLS.RND(this.data[e])
	}
	render(p, ctx, time, sys) {
		for (var e in this.data) p[e] += p[this.id+e] * time
	}
}


JPS.LIB.CAMERA = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.CAMERA, data)
	}
	render(p, ctx) {
		if (!ctx) return
		
		var w = 1 - this.depth / (p.z - this.z)
		if (w >= 0) return this.mode
		
		p.r && ctx.rotate(-p.r)
		ctx.translate(
			(this.x - p.x * this.fov) * w + this.center.x - this.x, 
			(this.y - p.y * this.fov) * w + this.center.y - this.y
		)
		ctx.scale(-w,-w)
		p.r && ctx.rotate(p.r)
	}
}


JPS.LIB.WALL = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.WALL, data)
		this.post = this.color && function(ctx) { if (ctx) {
			ctx.strokeStyle = this.color; ctx.lineWidth = this.size
			ctx.beginPath(); ctx.moveTo(this.x,this.y); ctx.lineTo(this.x+this.w,this.y+this.h); ctx.stroke()
		}}
	}
	render(p, ctx, time, sys) {
		var vx = p[this.id+'x'], vy = p[this.id+'y'], len = Math.sqrt(vx**2 + vy**2)
		var ab = p.s * (p.radius || p.h || p.w || 10) + time*len + this.size

		if (JPS.TOOLS.INTERSECT(this.x,this.y, this.w,this.h, p.x,p.y, p.sx*ab*(vx/len), p.sy*ab*(vy/len))) {
			ab = Math.atan2(this.w,this.h)*2 + Math.PI/2 + Math.atan2(vy,vx)
			len *= -JPS.TOOLS.RND(this.bounce)
			p[this.id+'x'] = Math.sin(ab)*len
			p[this.id+'y'] = Math.cos(ab)*len
			this.callback?.(p,sys,this)
		}
	}
}


JPS.LIB.INFO = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.INFO, data)
		this.render = this.text2 && function(ctx) { if (ctx) {
			var txt = this.text2
			for (i in p) txt = txt.replace('%%'+i, p[i])
			JPS.TOOLS.PRINT(
				ctx, txt, this.size, this.offset?.x || 0, this.offset?.y || 0, 
				this.font, this.color, this.align, this.base, this.method
			)
		}}
	}
	post(ctx, time, sys) {
		var txt = this.text1.replace('%%p', sys.particles.length).replace('%%fps', Math.round(1000/sys.delta)).replace('%%ms', time*1000)
		txt = txt.replace('%%time', ~~sys.time).replace('%%speed', sys.speed).replace('%%skip', sys.skip)
		JPS.TOOLS.PRINT(ctx, txt, this.size, this.x, this.y, this.font, this.color, this.align, this.base, this.method)
	}
}