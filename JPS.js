// JPS - Javascript Particle System  |  v1.00  |  npc299792  |  MIT Licence

const JPS = { TYPES: {
	PARTICLE: {x:0, y:0, s:1, r:0, sx:1, sy:1, rx:0, ry:0, age:0}
}}

// #################################################################################################################################

JPS.TOOLS = {
	RND: function(v = 0, r, i) {
		if (Array.isArray(v)) {
			if (typeof v[0] == 'number') { i=v[2]||i; r=v[1]; v=v[0] }
			else return JPS.TOOLS.RND(v[~~(Math.random()*v.length)])
		}
		if (typeof v == 'object') return JPS.TOOLS.RGB(JPS.TOOLS.RND(v.r),JPS.TOOLS.RND(v.g),JPS.TOOLS.RND(v.b),JPS.TOOLS.RND(v.a))
		if (typeof v == 'string') return v
		if (r) v += Math.random()*2*r - r
		return i && ~~v || v
	},

	RGB: function(r = 0, g = 0, b = 0, a = 1) {
		if (typeof r == 'object') { a = r.a||1; b = r.b||0; g = r.g||0; r = r.r||0 }
		return 'rgba('+ ~~r +','+ ~~g +','+ ~~b +','+ a +')'
	},

	TYP: function(m, p) {
		if (!m || !p || m == p) return true
		if (Array.isArray(m)) return m.includes(p)
	}
}

// #################################################################################################################################

JPS.SYSTEM = class {
	x = 0; y = 0; s = 1; time = 0; speed = 1; skip = 0; iter = 0
	constructor() { this.clear(1,1); this.add(...arguments) }

	spawn(c = 1, data1, data2 = true, ctx) {
		var list = []
		while (c-- >= 1) {
			if (this.max && this.max <= this.particles.length) break
			var p = {...JPS.TYPES.PARTICLE, ...data1}
			this.modifiers.init.forEach(m => JPS.TOOLS.TYP(m.type,p.type) && m.init(p,ctx||this.ctx,this))
			this.particles.unshift(p); list.push(p); data2 && Object.assign(p, data2 == true ? data1 : data2)
		}
		return list.length == 1 && list[0] || list
	}

	count(type, collect) {
		if (!type) return this.particles.length
		if (!Array.isArray(type)) type = [type]
		var c=0,a=[]; this.particles.forEach(p => type.includes(p.type) && (collect ? a.push(p) : c++))
		return collect ? a : c
	}

	delete(p, ctx) {
		if (p <= this.iter && this.iter >= 0) this.iter--
		p = this.particles.splice(p,1)[0]
		this.modifiers.exit.forEach(m => JPS.TOOLS.TYP(m.type,p.type) && m.exit(p,ctx||this.ctx,this))
	}
	
	clear(p, m) {
		if (p) this.particles = []
		if (m) this.modifiers = {prev:[], init:[], render:[], exit:[], post:[]}
	}
	
	// #############################################################################################################################
	
	add() {
		for (var o of arguments) {
			if (Array.isArray(o)) { this.add(...o); continue }
			if (o.constructor.name == 'CanvasRenderingContext2D') { this.ctx = o; continue }
			o.add?.(this)
			for (var c in this.modifiers) if (o[c]) this.modifiers[c].push(o)
			if (o.init) for (var p of this.particles) o.init(p,this.ctx,this)
		}
	}

	remove() {
		for (var o of arguments) {
			if (Array.isArray(o)) { this.remove(...o); continue }
			var i = this.particles.findIndex(p => o === p)
			if (i >= 0) {
				this.delete(i)
			} else {
				for (var c in this.modifiers) if (o[c]) {
					i = this.modifiers[c].findIndex(m => o === m)
					if (i >= 0) this.modifiers[c].splice(i,1)
				}
				o.remove?.(this)
			}
		}
	}

	// #############################################################################################################################
	
	render(ctx, time = 16.66) {
		var mtime = this.speed*time, stime = mtime/1000
		this.time += mtime; this.skip = 0
		ctx = ctx || this.ctx

		this.modifiers.prev.forEach(m => m.prev(ctx,this,stime))
		var ctime = performance.now()
		ctx?.save()

		for (this.iter = 0; this.iter < this.particles.length; this.iter++) {
			var p = this.particles[this.iter]
			
			p.age += mtime
			if (p.life && p.age > p.life) { this.delete(this.iter,ctx); continue }
			
			if (ctx) {
				ctx.setTransform(p.s*p.sx, p.s*p.rx, p.s*p.ry, p.s*p.sy, this.s*p.x+this.x, this.s*p.y+this.y)
				ctx.scale(this.s, this.s)
				p.r && ctx.rotate(p.r)
			}
			for (var m of this.modifiers.render) {
				m = JPS.TOOLS.TYP(m.type,p.type) && m.render(p,ctx,this,stime)
				if(m) { m == 1 && this.remove(p); this.skip++; break }
			}
		}

		ctx?.restore()
		this.rendertime = performance.now() - ctime
		this.modifiers.post.forEach(m => m.post(ctx,this,stime))
	}
}