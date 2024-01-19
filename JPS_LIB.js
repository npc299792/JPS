// JPS.LIB - Javascript Particle System Libary  |  v1.00  |  npc299792  |  MIT Licence

JPS.LIB ??= {}

// #################################################################################################################################
// ###################################################### Default Settings #########################################################
// #################################################################################################################################


JPS.TYPES.COLOR			= {r:[128,64], g:[128,64], b:[128,64], a:[0.6,0.4]}
JPS.TYPES.GRADIENT		= [{i:0.3, r:[200,50], g:[200,50], b:[200,50], a:1}, {i:1, r:0, g:0, b:0, a:.01}]
JPS.TYPES.FILTER		= {A:['type'], E:['w','h','d','rate','spawn'], P:['type','points','edges','rnd'], T:['type','points']}

JPS.TYPES.RECTANGLE		= {w:[20,10,1], h:[20,10,1], color:JPS.TYPES.COLOR}
JPS.TYPES.TRIANGLE		= {w:[20,10,1], h:[20,10,1], color:JPS.TYPES.COLOR, points:[{x:1, y:0},{x:-1, y:1},{x:-1, y:-1}]}
JPS.TYPES.POLYGON		= {w:[30,10,1], h:[30,10,1], color:JPS.TYPES.COLOR, edges:8, rnd: 0.3}
JPS.TYPES.CIRCLE		= {radius:[10,5,1], color:JPS.TYPES.COLOR}
JPS.TYPES.SPHERE		= {radius:[10,5,1], gradient:JPS.TYPES.GRADIENT}
JPS.TYPES.TEXT			= {h:[20,10,1], color:JPS.TYPES.COLOR, text:['A','B','C']}
JPS.TYPES.COLORS		= {red:[100,100], green:[100,100], blue:[100,100], alpha:1}

JPS.TYPES.EMITTER		= {x:[100,100], y:[100,100], spawn:0, rate:1}
JPS.TYPES.ALIGN			= {id:'v', offset:0}
JPS.TYPES.ANIMATE		= {id:'v', x:[0,100], y:[0,100]}
JPS.TYPES.WALL			= {id:'v', x:0, y:0, w:0, h:1000, bounce:0.6, line:1}
JPS.TYPES.BOX			= {id:'v', x:0, y:0, w:1000, h:1000, bounce:1}
JPS.TYPES.COLLISION		= {id:'v', extend:50, bounce:1}
JPS.TYPES.MAGNET		= {id:'', x:-500, y:-500, radius:300, charge:-20, pcharge:[20,10], pow:1}
JPS.TYPES.TWEEN			= {prop:'s', start:0, end:2, starttime:0, endtime:[5000,2000], ease:'easein'}

JPS.TYPES.CAMERA		= {x:0, y:0, z:-1000, depth:2000, fov:Math.PI/2, center:{x:window.innerWidth/2,y:window.innerHeight/2}, mode:2}
JPS.TYPES.CONNECT		= {radius:200, color1:{r:50, g:50, b:250, a:0}, color2:{r:250, g:250, b:250, a:1}, line:1, pow:2}
JPS.TYPES.BACKSCREEN	= {w:window.innerWidth, h:window.innerHeight, filter:'opacity(30%) blur(4px)'}
JPS.TYPES.VISIBLE		= {mx:0, my:0, min:1, mode:2}

JPS.TYPES.SLIDER		= {x:10, y:10, w:250, h:25, text:'%%value', start:0, end:100, prop:'x', color1:'white', color2:'grey'}
JPS.TYPES.INFO			= {x:10, y:10, h:15, color:'white', text:'Particles: %%p  -  Rendertime: %%render'}
JPS.TYPES.DRAG			= {button:0, dragspeed:1, zoomspeed:.1, pause:'Space'}
JPS.TYPES.GRID			= {cx:200, cy:200, cw:50, ch:50}
JPS.TYPES.RENDERTIME	= {count:30}


// #################################################################################################################################
// ############################################################ TOOLS ##############################################################
// #################################################################################################################################


JPS.TOOLS.RNDASN = function(target, ...args) {
	var filter = [], over = true
	for (o of args) {
		if (Array.isArray(o)) { filter = o; continue }
		if (typeof o == 'boolean') { over = o; continue }
		for (i in o) !filter.includes(i) && (over || !target[i]) && (target[i] = JPS.TOOLS.RND(o[i]))
	}
	return target
}

JPS.TOOLS.DRAW = (ctx, fill, stroke, line) => {
	if (fill)	ctx.fillStyle = fill
	if (stroke)	ctx.strokeStyle = stroke
	if (line)	ctx.lineWidth = line
}

JPS.TOOLS.LINE = (ctx, x, y, w, h, stroke, line) => {
	JPS.TOOLS.DRAW(ctx,0,stroke,line)
	ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x+w, y+h); ctx.stroke()
}

JPS.TOOLS.RECT = (ctx, x, y, w, h, fill, stroke, line, round) => {
	JPS.TOOLS.DRAW(ctx,fill,stroke,line)
	if (round) { 
		ctx.beginPath(); ctx.roundRect(x,y,w,h,round)
		fill && ctx.fill(); stroke && ctx.stroke() 
	} else { 
		fill && ctx.fillRect(x,y,w,h)
		stroke && ctx.strokeRect(x,y,w,h)
	}
}

JPS.TOOLS.CIRC = (ctx, x, y, radius, fill, stroke, line, start = 0, end = Math.PI*2) => {
	JPS.TOOLS.DRAW(ctx,fill,stroke,line)
	ctx.beginPath(); ctx.arc(x, y, radius, start, end)
	fill && ctx.fill(); stroke && ctx.stroke()
}

JPS.TOOLS.POLY = (ctx, points, x=0, y=0, w=1, h=1, fill, stroke, line) => {
	JPS.TOOLS.DRAW(ctx,fill,stroke,line); w /= 2; h /= 2
	ctx.beginPath(); ctx.moveTo(x+points[0].x*w, y+points[0].y*h)
	for (var i = 1; i < points.length; i++) ctx.lineTo(x+points[i].x*w, y+points[i].y*h)
	fill && ctx.fill(); stroke && (ctx.lineTo(x+points[0].x*w, y+points[0].y*h) || ctx.stroke())
}

JPS.TOOLS.PRINT = (ctx, text, x, y, h, fill, stroke, line, font, align, base) => {
	JPS.TOOLS.DRAW(ctx,fill,stroke,line)
	if (font) ctx.font = (h ? h + 'px ' : '') + font
	else if (h) ctx.font = ctx.font.replace(/(?<value>\d+\.?\d*)/, h)
	align && (ctx.textAlign = align)
	base && (ctx.textBaseline = base)
	stroke && ctx.strokeText(String(text),x,y)
	fill && ctx.fillText(String(text),x,y)
}

JPS.TOOLS.INRECT = (x,y,a,b,c,d) => x>a && x<a+c && y>b && y<b+d
JPS.TOOLS.OUTRECT = (x,y,a,b,c,d) => x<a && 1 || x>a+c && 2 || y<b && 3 || y>b+d && 4
JPS.TOOLS.INBOUND = (x,y,w,h,a,b,c,d) => x+w>a && x<a+c && y+h>b && y<b+d
JPS.TOOLS.OUTBOUND = (x,y,w,h,a,b,c,d) => x+w<a && 1 || x>a+c && 2 || y+h<b && 3 || y>b+d && 4
JPS.TOOLS.INTERSECT = (x,y,w,h,a,b,c,d) => {
	l = w * d - h * c
	t = -(x * d - y * c - a * d + b * c) / l
	if (t < 0 || t > 1) return false
	s = -(x * h - y * w + w * b - h * a) / l
	return s > 0 && s < 1
}

JPS.TOOLS.EASING = {
	linear: (v1,v2,r) => (v2-v1)*r+v1,
	easein: (v1,v2,r,p=2) => (v2-v1)*r**p+v1,
	easeout: (v1,v2,r,p=2) => -(v2-v1)*r**p*(r-2)+v1
}


// #################################################################################################################################
// ######################################################## Draw Modifiers #########################################################
// #################################################################################################################################


JPS.LIB.RECTANGLE = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.RECTANGLE, data)
	}
	init(p) {
		JPS.TOOLS.RNDASN(p, JPS.TYPES.FILTER.A, this)
	}
	render(p, ctx) {
		ctx && JPS.TOOLS.RECT(ctx, -p.w/2, -p.h/2, p.w, p.h, p.color, p.stroke, p.line, p.round)
	}
}


JPS.LIB.CIRCLE = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.CIRCLE, data)
	}
	init(p) {
		JPS.TOOLS.RNDASN(p, JPS.TYPES.FILTER.A, this)
	}
	render(p, ctx) {
		ctx && JPS.TOOLS.CIRC(ctx, 0, 0, p.radius, p.color, p.stroke, p.line, p.start, p.end)
	}
}


JPS.LIB.SPHERE = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.SPHERE, data)
	}
	init(p, ctx) {
		JPS.TOOLS.RNDASN(p, JPS.TYPES.FILTER.A, this)
		p.gradient = ctx.createRadialGradient(0,0,0,0,0,p.radius)
		this.gradient.forEach(c => p.gradient.addColorStop(c.i, JPS.TOOLS.RND(c)))
	}
	render(p, ctx) {
		ctx && JPS.TOOLS.CIRC(ctx, 0, 0, p.radius, p.gradient, p.stroke, p.line, p.start, p.end)
	}
}


JPS.LIB.TRIANGLE = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.TRIANGLE, data)
	}
	init(p) {
		JPS.TOOLS.RNDASN(p, JPS.TYPES.FILTER.T, this)
	}
	render(p, ctx) {
		ctx && JPS.TOOLS.POLY(ctx, this.points, 0, 0, p.w, p.h, p.color, p.stroke, p.line)
	}
}


JPS.LIB.POLYGON = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.POLYGON, data)
	}
	init(p) {
		JPS.TOOLS.RNDASN(p, JPS.TYPES.FILTER.P, this)
		if (this.points) { p.points = this.points; return }

		var a = JPS.TOOLS.RND(0, this.rnd), e = JPS.TOOLS.RND(this.edges)
		p.points = []
		for (var i = 0; i < e; i++) {
			var l = JPS.TOOLS.RND(1,this.rnd)
			a += Math.PI*2 / e * l
			p.points.push({x: Math.cos(a)*l, y: Math.sin(a)*l})
		}
	}
	render(p, ctx) {
		ctx && JPS.TOOLS.POLY(ctx, p.points, 0, 0, p.w, p.h, p.color, p.stroke, p.line)
	}
}


JPS.LIB.IMAGE = class {
	constructor(data) {
		Object.assign(this, data)
		this.pre = []
		this.image = new Image()
		this.image.onload = this.onload.bind(this)
		this.image.src = data.src
	}
	onload() {
		this.w = this.image.width; this.h = this.image.height
		this.pre.forEach(p => {p.w = this.w; p.h = this.h})
		this.pre = null; this.loaded = true
		this.callback?.(this)
	}
	init(p) {
		p.w = this.w; p.h = this.h
		if (!this.loaded) this.pre.push(p)
	}
	render(p, ctx) {
		ctx?.drawImage(this.image, -this.w/2, -this.h/2)
	}
}


JPS.LIB.TEXT = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.TEXT, data)
	}
	init(p, ctx) {
		JPS.TOOLS.RNDASN(p, JPS.TYPES.FILTER.A, this)
		ctx && (ctx.font = p.h + 'px ' + (p.font ? p.font : ''))
		p.w = ctx?.measureText(p.text).width || (p.text.length * p.h * .75)
	}
	render(p, ctx) {
		ctx && JPS.TOOLS.PRINT(ctx, p.text, 0, 0, p.h, p.color, p.stroke, p.line, p.font, p.align, p.base)
	}
}


JPS.LIB.COLORS = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.COLORS, data)
	}
	init(p) {
		JPS.TOOLS.RNDASN(p, JPS.TYPES.FILTER.A, this)
	}
	render(p) {
		p.color = 'rgba(' + ~~p.red + ',' + ~~p.green + ',' + ~~p.blue + ',' + p.alpha + ')'
	}
}


// #################################################################################################################################
// ###################################################### Animation Modifiers ######################################################
// #################################################################################################################################


JPS.LIB.EMITTER = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.EMITTER, data)
	}
	prev(ctx, sys, time) {
		this.spawn += time * this.rate
		var a = {}
		while (this.spawn >= 1) {
			JPS.TOOLS.RNDASN(a, JPS.TYPES.FILTER.E, this)
			if (this.w) a.x += JPS.TOOLS.RND(0, this.w/2)
			if (this.h) a.y += JPS.TOOLS.RND(0, this.h/2)
			if (this.d) a.z += JPS.TOOLS.RND(0, this.d/2)
			sys.spawn(1,a,true,ctx)
			this.spawn--
		}
	}
}


JPS.LIB.ANIMATE = class {
	id = 'v'
	constructor(data) {
		Object.assign(this, data || JPS.TYPES.ANIMATE)
		this.data = {...this}
		delete this.data.type
		delete this.data.id
	}
	init(p) {
		for (var e in this.data) p[this.id+e] ??= JPS.TOOLS.RND(this.data[e])
	}
	render(p, ctx, sys, time) {
		for (var e in this.data) p[e] += p[this.id+e] * time
	}
}


JPS.LIB.ALIGN = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.ALIGN, data)
	}
	render(p) {
		if (this.target) p.r = Math.atan2(p.y - this.target.y, p.x - this.target.x) + this.offset
		else p.r = Math.atan2(p[this.id+'y'], p[this.id+'x']) + this.offset
	}
}


JPS.LIB.MAGNET = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.MAGNET, data)
		this.init = p => { p.charge ??= JPS.TOOLS.RND(this.pcharge) }
		this.prev = p => { if (this.target) { this.x = this.target.x; this.y = this.target.y } }
	}
	render(p, ctx, sys, time) {
		var dx = this.x-p.x, dy = this.y-p.y
		var d = Math.sqrt(dx**2 + dy**2)
		if (d < this.radius) {
			var f = (1-d/this.radius) ** this.pow * this.charge * p.charge * time
			d = Math.abs(dx) + Math.abs(dy)
			p[this.id+'x'] -= dx/d * f
			p[this.id+'y'] -= dy/d * f
		}
	}
}


JPS.LIB.TWEEN = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.TWEEN, data)
		this.map = new Map()
		this.exit = p => this.map.delete(p)
	}
	init(p) {
		var d = JPS.TOOLS.RNDASN({}, JPS.TYPES.FILTER.A, this)
		if (d.starttime < 0 && p.life) d.starttime = p.life+d.starttime
		if (d.endtime < 0 && p.life) d.endtime = p.life+d.endtime
		d.start ??= p[d.prop]; d.end ??= p[d.prop]
		this.map.set(p,d)
	}
	render(p) {
		var s = 1, d = this.map.get(p)
		if (p.age < d.starttime) s = d.left
		if (p.age > d.endtime) s = d.right
		if (!s) return

		var t = d.endtime - d.starttime
		var v = Math.abs(p.age - d.starttime) % t / t
		if (p.age < d.starttime) v = 1 - v
		if (s == 2) {
			s = (p.age - d.starttime) / t
			if (~~(s < 0 ? s-1 : s) % 2) v = 1 - v
		}
		p[d.prop] = JPS.TOOLS.EASING[d.ease](d.start, d.end, v, d.pow)
	}
}


JPS.LIB.WALL = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.WALL, data)
		this.prev = this.color && function(ctx,sys) { if (ctx) {
			JPS.TOOLS.LINE(ctx, this.x*sys.s+sys.x, this.y*sys.s+sys.y, this.w*sys.s, this.h*sys.s, this.color, this.line*sys.s)
		}}
	}
	render(p, ctx, sys, time) {
		var vx = p[this.id+'x'], vy = p[this.id+'y'], len = Math.sqrt(vx**2 + vy**2)
		var ab = p.s * (p.radius || p.h || p.w || 20) + time * len + this.line
		
		if (JPS.TOOLS.INTERSECT(this.x,this.y, this.w,this.h, p.x,p.y, p.sx*ab*(vx/len), p.sy*ab*(vy/len))) {
			ab = Math.atan2(this.w,this.h)*2 + Math.PI/2 + Math.atan2(vy,vx)
			len *= -JPS.TOOLS.RND(this.bounce)
			p[this.id+'x'] = Math.sin(ab)*len
			p[this.id+'y'] = Math.cos(ab)*len
			return this.callback?.(p,sys,this)
		}
	}
}


JPS.LIB.BOX = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.BOX, data)
		this.map = new Map()
		this.exit = p => this.map.delete(p)
		this.prev = this.color && function(ctx,sys) { if (ctx) {
			JPS.TOOLS.RECT(ctx, this.x*sys.s+sys.x, this.y*sys.s+sys.y, this.w*sys.s, this.h*sys.s, 0, this.color, this.line*sys.s)
		}}
	}
	init(p) {
		this.map.set(p, JPS.TOOLS.INRECT(p.x, p.y, this.x, this.y, this.w, this.h))
	}
	render(p,ctx,sys) {
		var w = (p.radius && p.radius*2 || p.w || 20) * p.s * p.sx
		var h = (p.radius && p.radius*2 || p.h || 20) * p.s * p.sy

		var m = this.map.get(p)
		var q = this.portal ? 0 : (m ? 1 : -1)
		var s = JPS.TOOLS.OUTRECT(p.x, p.y, this.x+(w/2)*q, this.y+(h/2)*q, this.w-(w/2)*q*2, this.h-(h/2)*q*2)
		
		if ((m && !s) || (!m && s)) return

		if (!s) {
			var a = Math.atan2(this.y+this.h/2-p.y, this.x+this.w/2-p.x)
			var b = Math.abs(a / Math.PI) * 4
			s = (b>1 && b<3) && (a<0 && 4 || 3) || (b>1 && 2 || 1)
		}

		var z = s-(s<3 ? 1 : 3), a = s<3 ? 'x' : 'y'
		this.portal ? (z = 1-z) : (p[this.id+a] *= -this.bounce)

		p[a] = this[a] + this[s<3?'w':'h'] * z + (s<3?w:h) * (.5-z) * q
		return this.callback?.(p,s,sys,this)
	}
}


JPS.LIB.COLLISION = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.COLLISION, data)
		this.test = this.test.bind(this)
		this.prev = () => {this.tests = 0; this.linked = new Map()}
		this.add = sys => (!this.grid && !sys.grid) && sys.add(new JPS.LIB.GRID())
	}
	render(p, ctx, sys) {
		(this.grid || sys.grid).test(p, (p.radius || (p.w && (p.w+p.h)/4) || 10)*p.s+this.extend, this.test)
	}
	test(p, q, d, dx, dy) {
		var l = this.linked.get(p)
		if (l?.includes(q)) return
		
		this.tests++
		l = this.linked.get(q)
		l && l.push(p) || this.linked.set(q, [p])

		var r = (p.radius || (p.w && (p.w+p.h)/4) || 10)*p.s + 
				(q.radius || (q.w && (q.w+q.h)/4) || 10)*q.s

		if (d <= r) {
			if (this.callback?.(p,q,d,this)) return
			if (this.double && this.callback?.(q,p,d,this)) return

			var a = Math.atan2(dy, dx), c = Math.cos(a), s = Math.sin(a), a = (r-d)/2
			p.x += c * a / p.s; p.y += s * a / p.s
			q.x -= c * a / q.s; q.y -= s * a / q.s

			dx/=d; dy/=d; r=this.id
			d = (q[r+'x']-p[r+'x'])*dx + (q[r+'y']-p[r+'y'])*dy
			p[r+'x'] += d * dx * this.bounce
			p[r+'y'] += d * dy * this.bounce
			q[r+'x'] -= d * dx * this.bounce
			q[r+'y'] -= d * dy * this.bounce
		}
	}
}


// #################################################################################################################################
// ####################################################### Effect Modifiers ########################################################
// #################################################################################################################################


JPS.LIB.CAMERA = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.CAMERA, data)
		this.init = p => p.z ??= 0
	}
	render(p, ctx) {
		if (!ctx) return
		
		var w = 1 - this.depth / (p.z-this.z)
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


JPS.LIB.VISIBLE = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.VISIBLE, data)
		document.addEventListener('mousemove', this.move.bind(this))
	}
	move(e) {
		this.mx = e.clientX
		this.my = e.clientY
	}
	init(p, ctx, sys) {
		this.render(p,ctx,0,sys)
	}
	prev(ctx, sys) {
		this.current = null
		this.x = (this.mx-sys.x) / sys.s; this.y = (this.my-sys.y) / sys.s
		if (ctx) { this.w = ctx.canvas.width/sys.s; this.h = ctx.canvas.height/sys.s }
	}
	post(ctx, sys) {
		this.selected != this.current && this.callback?.(this.current, this.selected, sys, this)
		this.selected = this.current
	}
	render(p, ctx, sys) {
		var w = ((p.w&&p.w/2)||p.radius||20)*2 * p.s * p.sx
		var h = ((p.h&&p.h/2)||p.radius||20)*2 * p.s * p.sy
		p.visible = JPS.TOOLS.INBOUND(p.x-w/2, p.y-h/2, w, h, -sys.x/sys.s, -sys.y/sys.s, this.w, this.h)
		p.mouseover = JPS.TOOLS.INRECT(this.x, this.y, p.x-w/2, p.y-h/2, w, h)
		p.mouseover && (this.current = p)
		return (!p.visible || w*h*sys.s < this.min) && this.mode
	}
}


JPS.LIB.CONNECT = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.CONNECT, data)
		this.add = sys => (!this.grid && !sys.grid) && sys.add(new JPS.LIB.GRID())
		this.test = this.test.bind(this)
		this.update()
	}
	update() {
		this.delta = {
			r: this.color2.r-this.color1.r, g: this.color2.g-this.color1.g, 
			b: this.color2.b-this.color1.b, a: this.color2.a-this.color1.a
		}
	}
	prev(ctx, sys, time) {
		this.ctx = ctx
		this.linked = new Map()
	}
	render(p, ctx, sys) {
		if (!ctx) return
		(this.grid || sys.grid).test(p, this.radius, this.test)
	}
	test(p, q, d, dx, dy) {
		var l = this.linked.get(p)
		if (l && l.includes(q)) return
		l = this.linked.get(q)
		l && l.push(p) || this.linked.set(q, [p])

		p.r && this.ctx.rotate(-p.r)
		var d = 1-(d/this.radius)**this.pow
		JPS.TOOLS.LINE(
			this.ctx, 0, 0, -dx/p.s/p.sx, -dy/p.s/p.sy, 
			JPS.TOOLS.RGB(
				this.color1.r+this.delta.r*d, this.color1.g+this.delta.g*d, 
				this.color1.b+this.delta.b*d, this.color1.a+this.delta.a*d, this.line/p.s
			), this.line
		)
		p.r && this.ctx.rotate(p.r)
	}
}


JPS.LIB.BACKSCREEN = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.BACKSCREEN, data)
		this.can = document.createElement('canvas')
		this.ctx = this.can.getContext('2d')
		this.can.width = this.w
		this.can.height = this.h
		this.ctx.filter = this.filter
		this.clear = () => this.ctx.clearRect(0, 0, this.w, this.h)
	}
	prev(ctx, sys, time) {
		if (!this.noback) ctx.drawImage(this.can, 0, 0)
	}
	post(ctx, sys, time) {
		this.ctx.drawImage(ctx.canvas, 0, 0)
		if (this.replace) { ctx.clearRect(0, 0, this.w, this.h); ctx.drawImage(this.can, 0, 0) }
	}
}


// #################################################################################################################################
// ##################################################### Development Modifiers #####################################################
// #################################################################################################################################


JPS.LIB.INFO = class {
	align = 'left'; base = 'top'; digits = 2
	constructor(data) {
		Object.assign(this, JPS.TYPES.INFO, data)
		this.render = this.text2 && function(p,ctx) { if (ctx) {
			for (var i in p) var txt = this.text2.replace('%%'+i, typeof p[i] == Number ? p[i].toFixed(this.digits) : String(p[i]))
			JPS.TOOLS.PRINT(ctx, txt, this.x, this.y, this.h, this.color, this.stroke, this.line, this.font, this.align, this.base)
		}}
	}
	post(ctx,sys,time) {
		if (!ctx || !this.text) return
		var txt = this.text.replace('%%p', sys.particles.length).replace('%%fps', Math.round(1/time)).replace('%%render', sys.rendertime.toFixed(this.digits))
		txt = txt.replace('%%frame', time*1000).replace('%%time', ~~sys.time).replace('%%speed', sys.speed).replace('%%skip', sys.skip)
		JPS.TOOLS.PRINT(ctx, txt, this.x, this.y, this.h, this.color, this.stroke, this.line, this.font, this.align, this.base)
	}
}


JPS.LIB.SLIDER = class {
	line = 2; margin = 5; slider = .1; digits = 2
	constructor(data) {
		Object.assign(this, JPS.TYPES.SLIDER, data)
		this.up = () => this.drag = 0
		this.add = sys => this.target ??= sys
		document.addEventListener('mouseup', this.up.bind(this))
		document.addEventListener('mousedown', this.down.bind(this))
		document.addEventListener('mousemove', this.move.bind(this))
	}
	down(e) {
		if (this.drag || !this.target) return
		if (!JPS.TOOLS.INRECT(e.clientX, e.clientY, this.x, this.y, this.w, this.h)) return
		this.drag = true
		this.move(e)
	}
	move(e) {
		if (!this.drag) return
		var v = this.vertical ? (1 - (e.clientY - this.y) / this.h) : ((e.clientX - this.x) / this.w)
		v = Math.min(this.end, Math.max(this.start, v * (this.end-this.start) + this.start))
		this.target[this.prop] = this.int ? ~~v : v
	}
	post(ctx) {
		if (!ctx || !this.target) return

		ctx.save()
		ctx.setTransform(1, 0, 0, 1, this.x, this.y+(this.vertical?this.h:0))
		
		JPS.TOOLS.RECT(ctx, 0, 0, this.w, this.h, this.color2, this.color1, this.line)
		
		var v = (this.target[this.prop] || 0)
		var w = this.w - this.margin*2 - this.w*this.slider
		var c = Math.min(1, Math.max(0, (v-this.start) / (this.end-this.start)))
		if (this.vertical) c = 1 - c

		JPS.TOOLS.PRINT(ctx, 
			this.text.replace('%%value', v.toFixed(this.digits)), 
			this.margin+(c<.5 ? w+this.w*this.slider : 0), this.margin, this.h-this.margin*2, 
			this.color1, this.stroke, this.line, this.font, c<.5 ? 'right' : 'left', 'top'
		)

		JPS.TOOLS.RECT(ctx, this.margin+c*w, this.margin, this.w*this.slider, this.h-this.margin*2, this.color1)
		ctx.restore()
	}
}


JPS.LIB.DRAG = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.DRAG, data)
		this.up = e => this.drag = 0
		this.add = sys => this.sys = sys
		this.remove = sys => this.sys = null
		document.addEventListener('keydown', this.key.bind(this))
		document.addEventListener('mouseup', this.up.bind(this))
		document.addEventListener('mousedown', this.down.bind(this))
		document.addEventListener('mousemove', this.move.bind(this))
		document.addEventListener('wheel', this.wheel.bind(this))
		if (this.exclude && !Array.isArray(this.exclude)) this.exclude = [this.exclude]
	}
	down(e) {
		if (e.button != this.button || !this.sys) return
		if (this.exclude) for (var a of this.exclude) if(JPS.TOOLS.INRECT(e.clientX, e.clientY, a.x, a.y, a.w, a.h)) return
		this.drag = true
	}
	move(e) {
		if (!this.drag || !this.sys) return
		this.sys.x += e.movementX * this.dragspeed
		this.sys.y += e.movementY * this.dragspeed
	}
	wheel(e) {
		if (!this.sys) return
		var s = (e.deltaY < 0 && -1 || 1) * (this.sys.s * this.zoomspeed)
		this.sys.x += (e.clientX-this.sys.x) / this.sys.s * s
		this.sys.y += (e.clientY-this.sys.y) / this.sys.s * s
		this.sys.s -= s
	}
	key(e) {
		if (!this.sys) return
		if (e.code == this.pause) {
			this.paused = !this.paused
			this.paused && (this.pausespeed = this.sys.speed)
			this.sys.speed = !this.paused ? this.pausespeed : 0
		}
	}
}


JPS.LIB.CONTROLLER = class {
	constructor(data) {
		Object.assign(this, data)
		this.keys = {}
		document.addEventListener('keyup', this.keyup.bind(this))
		document.addEventListener('keydown', this.keydown.bind(this))
	}
	keyup(e) {
		if (this.keys[e.code]) this.callback?.(e.code, false, this, e)
		delete this.keys[e.code]
	}
	keydown(e) {
		if (!this.keys[e.code]) this.callback?.(e.code, true, this, e)
		this.keys[e.code] = true
	}
	prev(ctx, sys, time) {
		if (!this.binds) return
		for (var b of this.binds) {
			var t = b.target || this.target
			if (t && this.keys[b.key]) {
				if (b.prop) {
					t[b.prop] += b.value * time
				} else {
					var a = (t.r||0) + (b.angle||0), id = b.id||''
					t[id+'x'] += b.value * Math.cos(a) * time
					t[id+'y'] += b.value * Math.sin(a) * time
				}
			}
		}
	}
}


JPS.LIB.GRID = class {
	grid = []
	constructor(data) {
		Object.assign(this, JPS.TYPES.GRID, data)
		this.add = sys => sys.grid ??= this
		this.remove = sys => sys.grid == this && (sys.grid = undefined)
		this.prev = () => this.temp = []
		this.post = () => this.grid = this.temp
	}
	exit(p) {
		var a = this.grid[~~Math.abs(p.x / this.cw % this.cx) * this.cx + ~~Math.abs(p.y / this.ch % this.cy)]
		if (!a) return
		var i = a.findIndex(q => p === q)
		if (i >= 0) a.splice(i,1)
	}
	render(p) {
		var pos = ~~Math.abs(p.x / this.cw % this.cx) * this.cx + ~~Math.abs(p.y / this.ch % this.cy)
		this.temp[pos] && this.temp[pos].push(p) || (this.temp[pos] = [p])
	}
	test(p, radius, callback) {
		var x = ~~Math.abs(p.x / this.cw % this.cx)
		var y = ~~Math.abs(p.y / this.ch % this.cy)
		var rx = Math.ceil(radius / this.cw)
		var ry = Math.ceil(radius / this.ch)

		for (var i = x-rx; i <= x+rx; i++) {
			for (var j = y-ry; j <= y+ry; j++) {
				var a = this.grid[(i%this.cx) * this.cx + (j%this.cy)]
				if (a) a.forEach(q => this.call(p,q,radius,callback))
			}
		}
	}
	call(p, q, radius, callback) {
		if (p == q) return
		var dx = p.x-q.x, dy = p.y-q.y
		var d = Math.sqrt(dx**2 + dy**2)
		d < radius && callback(p,q,d,dx,dy) 
	}
}


JPS.LIB.RENDERTIME = class {
	frames = 0; temp = 0
	constructor(data) {
		Object.assign(this, JPS.TYPES.RENDERTIME, data)
	}
	post(ctx, sys, time) {
		this.frames++
		this.temp += sys.rendertime
		sys.rendertime = this.time || (this.temp / this.frames)
		if (this.frames >= this.count) {
			this.time = this.temp / this.count
			this.frames = 0; this.temp = 0
		}
	}
}