// JPS - Javascript Particle System  |  v0.9  |  npc299792  |  MIT Licence

const JPS = { TYPES: {
	PARTICLE: {x:0, y:0, z:0, s:1, r:0, sx:1, sy:1, rx:0, ry:0, age:0}
}}

// #################################################################################################################################

JPS.TOOLS = {
	RND: function(v = 0, r, i) {
		switch(v.constructor) {
			case Object: return JPS.TOOLS.RNDRGB(v)
			case Array:  i=v[2]||i; r=v[1]; v=v[0]
		}
		if (r) v += Math.random()*2*r - r
		return i && ~~v || v
	},

	RGB: function(r = 0, g = 0, b = 0, a = 1) {
		r = ((1<<24) + (r<<16) + (g<<8) + b).toString(16).slice(1)
		a = (a*255 < 10 && '0' || '') + (~~(a*255)).toString(16)
		return "#" + (r + a).toUpperCase()
	},

	RNDRGB: function(c) {
		return JPS.TOOLS.RGB(JPS.TOOLS.RND(c.r,0,1), JPS.TOOLS.RND(c.g,0,1), JPS.TOOLS.RND(c.b,0,1), JPS.TOOLS.RND(c.a))
	}
}

// #################################################################################################################################

JPS.SYSTEM = class {
	x = 0; y = 0; s = 1; time = 0; skip = 0; speed = 1
	constructor() { this.clear(1,1); this.addModifier(...arguments) }

	spawn(c = 1, ctx) {
		var p = {...JPS.TYPES.PARTICLE}
		this.modifiers.init.forEach(m => m.type == p.type && m.init(p,ctx,this))
		this.particles.unshift(p)
		return (c > 1) && this.spawn(--c,ctx) || p
	}

	delete(p, ctx) {
		p = this.particles.splice(p,1)
		this.modifiers.exit.forEach(m => m.type == p.type && m.exit(p,ctx,this))
	}
	
	clear(p, m) {
		if (p) this.particles = []
		if (m) this.modifiers = {prev:[], init:[], render:[], exit:[], post:[]}
	}
	
	// #############################################################################################################################
	
	addModifier() {
		for (var c in this.modifiers) for (var m of arguments) if (m[c]) this.modifiers[c].push(m)
		for (m of arguments) if (m.init) for (c of this.particles) m.init(c,0,this)
	}

	removeModifier() {
		for (var c in this.modifiers) for (var m of arguments) if (m[c]) {
			m = this.modifiers[c].findIndex(s => m === s)
			if (m >= 0) this.modifiers[c].splice(m,1)
		}
	}
	
	removeParticle() {
		for (var p of arguments) {
			if (p.constructor !== Number) p = this.particles.findIndex(q => p === q)
			if (p >= 0) this.delete(p)
		}
	}

	// #############################################################################################################################
	
	render(ctx, time = 16.66) {
		var stime = this.speed*time/1000
		this.time += stime*1000; this.delta = time; this.skip = 0

		this.modifiers.prev.forEach(m => m.prev(ctx,stime,this))
		this.rendertime = performance.now()
		ctx?.save()

		for (var i = 0; i < this.particles.length; i++) {
			var p = this.particles[i]
			p.age += stime*1000
			
			if (p.life && p.age > p.life) 
				this.delete(i--)
			else {
				if (ctx) {
					ctx.setTransform(p.s*p.sx, p.s*p.rx, p.s*p.ry, p.s*p.sy, this.s*p.x+this.x, this.s*p.y+this.y)
					ctx.scale(this.s, this.s)
					p.r && ctx.rotate(p.r)
				}
				for (var m of this.modifiers.render) {
					m = m.type == p.type && m.render(p,ctx,stime,this,i)
					if(m) { m == 1 && this.delete(i--); this.skip++; break }
				}
			}
		}

		ctx?.restore()
		this.rendertime = performance.now() - this.rendertime
		this.modifiers.post.forEach(m => m.post(ctx,stime,this))
	}
}