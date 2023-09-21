// JPS - Javascript Particle System  |  v0.98  |  npc299792  |  MIT Licence

const JPS = { TYPES: {
	PARTICLE: {x:0, y:0, s:1, r:0, sx:1, sy:1, rx:0, ry:0, age:0}
}}

// #################################################################################################################################

JPS.TOOLS = {
	RND: function(v = 0, r, i) {
		if (Array.isArray(v)) {
			if (typeof v[0] == 'number') { i=v[2]||i; r=v[1]; v=v[0]||0 }
			else return JPS.TOOLS.RND(v[~~(Math.random()*v.length)])
		} 
		if (typeof v == 'object') return JPS.TOOLS.RNDRGB(v)
		if (typeof v == 'string') return v
		if (r) v += Math.random()*2*r - r
		return i && ~~v || v
	},

	RGB: function(r = 0, g = 0, b = 0, a = 1) {
		r = ((1<<24) + (r<<16) + (g<<8) + b).toString(16).slice(1)
		a = a < 0.07 && '00' || ((a*255 < 10 && '0' || '') + (~~(a*255)).toString(16))
		return "#" + (r + a).toUpperCase()
	},

	RNDRGB: function(c) {
		return JPS.TOOLS.RGB(JPS.TOOLS.RND(c.r,0,1), JPS.TOOLS.RND(c.g,0,1), JPS.TOOLS.RND(c.b,0,1), JPS.TOOLS.RND(c.a)) // ||0||1
	},

	TYP: function(m, p) {
		if (!m || !p || m == p) return true
		if (Array.isArray(m)) return m.includes(p)
	}
}

// #################################################################################################################################

JPS.SYSTEM = class {
	x = 0; y = 0; s = 1; time = 0; speed = 1; skip = 0
	constructor() { this.clear(1,1); this.addModifier(...arguments) }

	spawn(c = 1, ctx, data) {
		var list = []
		while (c-- >= 1) {
			if (this.max && this.max <= this.particles.length) break
			var p = {...JPS.TYPES.PARTICLE, ...data}
			this.modifiers.init.forEach(m => JPS.TOOLS.TYP(m.type,p.type) && m.init(p,ctx,this))
			this.particles.unshift(p); list.push(p)
		}
		return list.length == 1 && list[0] || list
	}

	delete(p, ctx) {
		p = this.particles.splice(p,1)
		this.modifiers.exit.forEach(m => JPS.TOOLS.TYP(m.type,p.type) && m.exit(p,ctx,this))
	}
	
	clear(p, m) {
		if (p) this.particles = []
		if (m) this.modifiers = {prev:[], init:[], render:[], exit:[], post:[]}
	}
	
	// #############################################################################################################################
	
	addModifier() {
		for (var m of arguments) {
			if (Array.isArray(m)) { this.addModifier(...m); continue }
			if (m.constructor.name == 'CanvasRenderingContext2D') { var ctx = m; break }
			m.add?.(this)
			for (var c in this.modifiers) if (m[c]) this.modifiers[c].push(m)
			if (m.init) for (var p of this.particles) m.init(p,ctx,this)
		}
	}

	removeModifier() {
		for (var m of arguments) {
			if (Array.isArray(m)) { this.removeModifier(...m); continue }
			for (var c in this.modifiers) if (m[c]) {
				m = this.modifiers[c].findIndex(s => m === s)
				if (m >= 0) this.modifiers[c].splice(m,1)
			}
			m.remove?.(this)
		}
	}
	
	removeParticle() {
		for (var p of arguments) {
			if (Array.isArray(p)) { this.removeParticle(...p); continue }
			if (p.constructor.name == 'CanvasRenderingContext2D') { var ctx = p; break }
			if (typeof p !== Number) p = this.particles.findIndex(q => p === q)
			if (p >= 0) this.delete(p,ctx)
		}
	}

	// #############################################################################################################################
	
	render(ctx, time = 16.66) {
		var stime = this.speed*time/1000
		this.time += stime*1000; this.delta = time; this.skip = 0

		this.modifiers.prev.forEach(m => m.prev(ctx,stime,this))
		var ctime = performance.now()
		ctx?.save()

		for (var i = 0; i < this.particles.length; i++) {
			var p = this.particles[i]
			p.age += stime*1000
			if (p.life && p.age > p.life) { this.delete(i--); continue }
			
			if (ctx) {
				ctx.setTransform(p.s*p.sx, p.s*p.rx, p.s*p.ry, p.s*p.sy, this.s*p.x+this.x, this.s*p.y+this.y)
				ctx.scale(this.s, this.s)
				p.r && ctx.rotate(p.r)
			}
			for (var m of this.modifiers.render) {
				m = JPS.TOOLS.TYP(m.type,p.type) && m.render(p,ctx,stime,this,i)
				if(m) { m == 1 && this.delete(i--); this.skip++; break }
			}
		}

		ctx?.restore()
		this.rendertime = performance.now() - ctime
		this.modifiers.post.forEach(m => m.post(ctx,stime,this))
	}
}