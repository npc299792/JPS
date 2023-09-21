// JPS - Javascript Particle System  |  v0.98  |  npc299792  |  MIT Licence

JPS.LIB ??= {}

// #################################################################################################################################

JPS.TYPES.COLOR			= {r:[128,64], g:[128,64], b:[128,64], a:[0.6,0.4]}
JPS.TYPES.GRADIENT		= [{i:0.3, r:[200,50], g:[200,50], b:[200,50], a:1}, {i:1, r:0, g:0, b:0, a:.01}]

JPS.TYPES.RECTANGLE		= {w:[10,5], h:[10,5], color:JPS.TYPES.COLOR}
JPS.TYPES.CIRCLE		= {radius:[10,8], color:JPS.TYPES.COLOR}
JPS.TYPES.TRIANGLE		= {w:[10,5], h:[10,5], color:JPS.TYPES.COLOR}
JPS.TYPES.SPHERE		= {radius:[10,5], gradient:JPS.TYPES.GRADIENT}
JPS.TYPES.TEXT			= {h:[10,5], font:'Arial', text:['A','B','C'], color:JPS.TYPES.COLOR}

JPS.TYPES.ALIGN			= {id:'v', offset:0}
JPS.TYPES.ANIMATE		= {id:'v', x:[0,100], y:[0,100]}
JPS.TYPES.EMITTER		= {x:[100,100], y:[100,100], z:0, spawn:0, rate:1}
JPS.TYPES.WALL			= {id:'v', x:0, y:0, w:100, h:100, size:2, bounce:0.6}
JPS.TYPES.MAGNET		= {id:'', x:-500, y:-500, radius:300, charge:-20, pcharge:[20,10], pow:1}
JPS.TYPES.CAMERA		= {x:0, y:0, z:-1000, depth:2000, fov:Math.PI/2, center:{x:window.innerWidth/2,y:window.innerHeight/2}, mode:2}
JPS.TYPES.TWEEN			= {id:'tw', prop:'s', start:0, end:2, starttime:0, endtime:5000, ease:'easein'}

JPS.TYPES.DRAG			= {button:0, dragspeed:1, zoomspeed:.1, pause:'Space'}
JPS.TYPES.BACKSCREEN	= {w:window.innerWidth, h:window.innerHeight, filter:'opacity(30%) blur(4px)'}

JPS.TYPES.VISIBLE		= {mx:0, my:0, mode:2}
JPS.TYPES.SLIDER		= {x:10, y:10, w:250, h:25, text:'%%value', start:0, end:100, prop:'x', color1:'white', color2:'grey'}
JPS.TYPES.INFO			= {x:10, y:20, size:15, color:'grey', font:'Arial', method:'fillText', digits:2, text1:'fps: %%fps  /  particles: %%p  /  rendertime: %%rt'}

// #################################################################################################################################

JPS.TOOLS.RNDASN = function(d, ...a) {
	var f = []
	for (o of a) {
		if (Array.isArray(o)) { var f = o; continue }
		for (i in o) !f.includes(i) && (d[i] ??= JPS.TOOLS.RND(o[i]))
	}
	return d
}

JPS.TOOLS.LINE = (ctx, x, y, w, h, stroke, size) => {
	if (stroke) ctx.strokeStyle = stroke
	if (size) ctx.lineWidth = size
	ctx.beginPath(); ctx.moveTo(x, y)
	ctx.lineTo(x+w, y+h); ctx.stroke()
}

JPS.TOOLS.RECT = (ctx, x, y, w, h, fill, stroke, size, round) => {
	if (fill) ctx.fillStyle = fill
	if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = size||1 }
	if (round) { ctx.beginPath(); ctx.roundRect(x,y,w,h,round) }
	fill && (round && ctx.fill() || ctx.fillRect(x,y,w,h))
	stroke && (round && ctx.stroke() || ctx.strokeRect(x,y,w,h))
}

JPS.TOOLS.CIRC = (ctx, x, y, radius, fill, stroke, size, start = 0, end = 360) => {
	if (fill) ctx.fillStyle = fill
	if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = size||1 }
	ctx.beginPath(); ctx.arc(x, y, radius, start, end)
	fill && ctx.fill(); stroke && ctx.stroke()
}

JPS.TOOLS.PRINT = (ctx, text, x=0, y=0, height, color, font, align, base, method='fillText') => {
	if (color) ctx.fillStyle = color
	if (align) ctx.textAlign = align
	if (base)  ctx.textBaseline = base
	if (height) ctx.font = height + 'px ' + (font && font || '')
	ctx[method](String(text),x,y)
}

JPS.TOOLS.EASING = {
	linear: (v1,v2,r) => (v2-v1)*r+v1,
	easein: (v1,v2,r,p=2) => (v2-v1)*r**p+v1,
	easeout: (v1,v2,r,p=2) => -(v2-v1)*r**p*(r-2)+v1,
	easeinout: (v1,v2,r,p=2) => r<.5 && (v2-v1)*r**p+v1 || -(v2-v1)*r**p*(r-2)+v1
}

JPS.TOOLS.INRECT = (x,y,a,b,c,d) => x > a && x < a+c && y > b && y < b+d
JPS.TOOLS.INBOUND = (x,y,w,h,a,b,c,d) => x < a+c && x+w > a && y < b+d && y+h > b
JPS.TOOLS.INTERSECT = (x,y,w,h,a,b,c,d) => {
	l = w * d - h * c
	t = -(x * d - y * c - a * d + b * c) / l
	if (t < 0 || t > 1) return false
	s = -(x * h - y * w + w * b - h * a) / l
	return s > 0 && s < 1
}


// #################################################################################################################################


JPS.LIB.RECTANGLE = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.RECTANGLE, data)
	}
	init(p) {
		JPS.TOOLS.RNDASN(p, ['type'], this)
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
		JPS.TOOLS.RNDASN(p, ['type'], this)
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
		JPS.TOOLS.RNDASN(p, ['type'], this)
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
		JPS.TOOLS.RNDASN(p, ['type'], this)
	}
	render(p, ctx) {
		if (!ctx) return
		ctx.fillStyle = p.color
		ctx.beginPath()
   		ctx.moveTo(p.w/2, 0)
    	ctx.lineTo(-p.w/2, p.h/2)
    	ctx.lineTo(-p.w/2, -p.h/2)
    	ctx.fill()
	}
}


JPS.LIB.IMAGE = class {
	constructor(data) {
		Object.assign(this, data)
		this.image = new Image()
		this.image.src = data.src
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
		JPS.TOOLS.RNDASN(p, ['type'], this)
	}
	render(p, ctx) {
		ctx && JPS.TOOLS.PRINT(ctx, p.text, 0, 0, p.h, p.color, p.font, 0,0, p.method) //x:p.h?
	}
}


// #################################################################################################################################


JPS.LIB.EMITTER = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.EMITTER, data)
	}
	prev(ctx, time, sys) {
		this.spawn += time * this.rate
		var a = {}
		while (this.spawn >= 1) {
			a.x = JPS.TOOLS.RND(this.x, this.w && this.w/2)
			a.y = JPS.TOOLS.RND(this.y, this.h && this.h/2)
			a.z = JPS.TOOLS.RND(this.z, this.d && this.d/2)
			if (this.type) a.type = Array.isArray(this.type) && this.type[~~(Math.random()*this.type.length)] || this.type
			if (this.life) a.life = JPS.TOOLS.RND(this.life)

			sys.spawn(1, ctx, a)
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
	render(p, ctx, time) {
		for (var e in this.data) p[e] += p[this.id+e] * time
	}
}


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


JPS.LIB.WALL = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.WALL, data)
		this.post = this.color && function(ctx,time,sys) { if (ctx) {
			JPS.TOOLS.LINE(ctx, this.x + sys.x, this.y + sys.x, this.w, this.h, this.color, this.size * sys.s)
		}}
	}
	render(p, ctx, time, sys) {
		var vx = p[this.id+'x'], vy = p[this.id+'y'], len = Math.sqrt(vx**2 + vy**2)
		var ab = p.s * (p.radius || p.h || p.w || 10) + time * len + this.size

		if (JPS.TOOLS.INTERSECT(this.x,this.y, this.w,this.h, p.x,p.y, p.sx*ab*(vx/len), p.sy*ab*(vy/len))) {
			ab = Math.atan2(this.w,this.h)*2 + Math.PI/2 + Math.atan2(vy,vx)
			len *= -JPS.TOOLS.RND(this.bounce)
			p[this.id+'x'] = Math.sin(ab)*len
			p[this.id+'y'] = Math.cos(ab)*len
			this.callback?.(p,sys,this)
		}
	}
}


JPS.LIB.ALIGN = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.ALIGN, data)
	}
	render(p, ctx, time) {
		if (this.target) p.r = Math.atan2(p.y - this.target.y, p.x - this.target.x) + this.offset
		else p.r = Math.atan2(p[this.id+'y'], p[this.id+'x']) + this.offset
	}
}


JPS.LIB.MAGNET = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.MAGNET, data)
		this.prev = this.target && function() {
			if (!this.target) return
			this.x = this.target.x; this.y = this.target.y
		}
	}
	init(p) {
		p.charge ??= JPS.TOOLS.RND(this.pcharge)
	}
	render(p, ctx, time) {
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
		this.data = Object.assign(this, JPS.TYPES.TWEEN, data)
		delete this.data.type
		delete this.data.id
	}
	init(p) {
		var d = JPS.TOOLS.RNDASN({}, this.data)
		if (d.starttime < 0 && p.life) d.starttime = p.life+d.starttime
		if (d.endtime < 0 && p.life) d.endtime = p.life+d.endtime
		d.start ??= p[d.prop]; d.end ??= p[d.end]
		p[this.id] = d
	}
	render(p) {
		var d = p[this.id]
		var t = d.endtime - d.starttime
		var s = p.age < d.starttime && d.left || (p.age > d.endtime && d.right || 0)
		var v = Math.abs(p.age - d.starttime) % t / t
		if (p.age < d.starttime) v = 1 - v
		if (s == 3) {
			s = (p.age - d.starttime) / t
			if (~~(s < 0 && s-1 || s) % 2) v = 1 - v
		}
		p[d.prop] = JPS.TOOLS.EASING[d.ease](d.start, d.end, v, d.pow)
	}
}


// #################################################################################################################################


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
	prev(ctx, time, sys) {
		this.select = null
		this.x = (this.mx-sys.x) / sys.s; this.y = (this.my-sys.y) / sys.s
		if (ctx) { this.w = ctx.canvas.width; this.h = ctx.canvas.height }
	}
	render(p, ctx, time, sys) {
		var w = (p.w&&p.w/2)||p.radius||20, h = (p.h&&p.h/2)||p.radius||20
		p.visible = JPS.TOOLS.INBOUND(p.x-w/2, p.y-h/2, w, h, -sys.x, -sys.y, (this.w || ctx.canvas.width)/sys.s, (this.h || ctx.canvas.height)/sys.s)
		p.mouseover = JPS.TOOLS.INRECT(this.x, this.y, 0, 0, this.w, this.h)
		p.mouseover && (this.select = p)
		return !p.visible && this.mode
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
	prev(ctx, time) {
		if (!this.noback) ctx.drawImage(this.can, 0, 0)
	}
	post(ctx, time) {
		this.ctx.drawImage(ctx.canvas, 0, 0)
		if (this.replace) { ctx.clearRect(0, 0, this.w, this.h); ctx.drawImage(this.can, 0, 0) }
	}
}


// #################################################################################################################################


JPS.LIB.INFO = class {
	constructor(data) {
		Object.assign(this, JPS.TYPES.INFO, data)
		this.render = this.text2 && function(p,ctx) { if (ctx) {
			for (var i in p) var txt = this.text2.replace('%%'+i, typeof p[i] == Number && p[i].toFixed(this.digits) || String(p[i]))
			JPS.TOOLS.PRINT(ctx, txt, this.size, this.x, this.y, this.font, this.color, this.align, this.base, this.method)
		}}
	}
	post(ctx, time, sys) {
		var txt = this.text1.replace('%%p', sys.particles.length).replace('%%fps', Math.round(1000/sys.delta)).replace('%%rt', sys.rendertime.toFixed(this.digits))
		txt = txt.replace('%%ft', time*1000).replace('%%time', ~~sys.time).replace('%%speed', sys.speed).replace('%%skip', sys.skip)
		JPS.TOOLS.PRINT(ctx, txt, this.x, this.y, this.size, this.color, this.font, this.align, this.base, this.method)
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
			this.sys.speed = !this.paused && this.pausespeed || 0
		}
	}
}


JPS.LIB.SLIDER = class {
	line = 2; margin = 5; slider = .1; digits = 2; font = 'Arial'
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
		var v = this.vertical && (1 - (e.clientY - this.y) / this.h) || ((e.clientX - this.x) / this.w)
		this.target[this.prop] = Math.min(this.end, Math.max(this.start, v * (this.end-this.start) + this.start))
	}
	post(ctx) {
		if (!ctx || !this.target) return

		ctx.save()
		ctx.setTransform(1, 0, 0, 1, this.x, this.y+(this.vertical&&this.h||0))
		
		JPS.TOOLS.RECT(ctx, 0, 0, this.w, this.h, this.color2, this.color1, this.line)
		
		var v = (this.target[this.prop] || 0)
		var w = this.w - this.margin*2 - this.w*this.slider
		var c = Math.min(1, Math.max(0, (v-this.start) / (this.end-this.start)))
		if (this.vertical) c = 1 - c

		JPS.TOOLS.PRINT(ctx, 
			this.text.replace('%%value', v.toFixed(this.digits)), 
			this.margin+(c<.5&&w+this.w*this.slider||0), this.margin, this.h-this.margin*2, 
			this.color1, this.font, c<.5 && 'right' || 'left', 'top'
		)

		JPS.TOOLS.RECT(ctx, this.margin+c*w, this.margin, this.w*this.slider, this.h-this.margin*2, this.color1)
		ctx.restore()
	}
}