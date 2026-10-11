const b64a=(s,T)=>{const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return new T(u.buffer)};
function buildBoiled(){const g=new THREE.Group(),tl=new THREE.TextureLoader();
 BOILED.parts.forEach(p=>{const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(b64a(p.p,Float32Array),3));geo.setAttribute('normal',new THREE.BufferAttribute(b64a(p.nm,Float32Array),3));geo.setAttribute('uv',new THREE.BufferAttribute(b64a(p.uv,Float32Array),2));
  geo.setIndex(new THREE.BufferAttribute(b64a(p.ix,p.i32?Uint32Array:Uint16Array),1));const t=tl.load(p.tex);t.flipY=false;t.anisotropy=4;
  const m=new THREE.MeshStandardMaterial({map:t,roughness:.9,metalness:0,emissive:0x240606,side:THREE.DoubleSide,transparent:p.blend,alphaTest:p.blend?.4:0,depthWrite:!p.blend});
  const me=new THREE.Mesh(geo,m);me.frustumCulled=false;g.add(me)});return g}
class Enemy{
constructor(scene,c){this.g=new THREE.Group();this.pv=new THREE.Group();this.g.add(this.pv);scene.add(this.g);const p=Level.wp(c);this.g.position.set(p.x,0,p.z);
 this.light=new THREE.PointLight(0xff1a1a,.6,7);this.light.position.set(0,2.4,.7);this.g.add(this.light);
 this.state='patrol';this.T=null;this.lost=0;this.t=0;this.dist=99;this.st=0;this.found=false;this.seen=false;this.cool=0;this.kill=false;this.wait=0;this.inv=0;this.it=0;this.cfg={spd:1,hear:11,sight:16};
 this.acc=0;this.mv=false;this.g.rotation.y=Math.random()*6.28;
 this.pv.add(buildBoiled())}
face(x,z,k=.15){const a=Math.atan2(x-this.g.position.x,z-this.g.position.z);let d=a-this.g.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));this.g.rotation.y+=d*k}
/* rotate toward heading a at a limited turn rate; returns the remaining angle error */
turn(a,dt,rate){let d=a-this.g.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));const m=Math.max(-rate*dt,Math.min(rate*dt,d));this.g.rotation.y+=m;return d-m}
blk(x,z){const r=.32;return Level.wall(x+r,z+r)||Level.wall(x-r,z+r)||Level.wall(x+r,z-r)||Level.wall(x-r,z-r)}
anim(dt){this.t+=dt;const ch=this.state==='chase'||this.state==='scare';this.pv.rotation.z=Math.sin(this.t*(ch?7:2.2))*(ch?.07:.05)+(this.state==='stare'?Math.sin(this.t*.9)*.06:0);
 this.pv.rotation.x=(ch?.2:0)+Math.sin(this.t*1.7)*.03+(this.wait>0&&this.state!=='scare'?.14:0);
 /* heavy walking bob in time with his footsteps */
 this.pv.position.y=this.mv?Math.abs(Math.sin(this.acc/this.stride*Math.PI))*(ch?.1:.06):this.pv.position.y*.8;this.mv=false;
 this.light.intensity=Level.safe?.6:.4+Math.random()*.4}
get stride(){return this.state==='chase'?2:1.3}
go(dt,sp){if(this.wait>0)return;const g=this.g.position,c=Level.cell(g.x,g.z),w=Level.wp(Level.next(c,this.T)),mx=w.x-g.x,mz=w.z-g.z,md=Math.hypot(mx,mz);if(md<.04)return;
 if(md<.5&&c[0]===this.T[0]&&c[1]===this.T[1]){const v=Math.min(md,sp*dt);this.face(w.x,w.z,Math.min(1,dt*8));g.x+=mx/md*v;g.z+=mz/md*v;this.acc+=v;this.mv=true;return}
 /* steer: turn at a limited rate, slow down for sharp turns, move along the facing direction */
 const err=Math.abs(this.turn(Math.atan2(mx,mz),dt,this.state==='chase'?5.5:3.2)),v=sp*dt*(err>1.2?.1:err>.6?.5:1),h=this.g.rotation.y,nx=g.x+Math.sin(h)*v,nz=g.z+Math.cos(h)*v;
 if(!this.blk(nx,nz)){g.x=nx;g.z=nz}else if(!this.blk(nx,g.z))g.x=nx;else if(!this.blk(g.x,nz))g.z=nz;
 this.acc+=v;this.mv=v>0}
footstep(){if(!Aud.ctx)return;const P=this.pl,g=this.g.position,dx=g.x-P.x,dz=g.z-P.z,d=Math.hypot(dx,dz)||1,ch=this.state==='chase',lo=d<6||Level.los(g.x,g.z,P.x,P.z),yw=P.yaw||0,pan=(dx*Math.cos(yw)-dz*Math.sin(yw))/d;Aud.estep(Math.max(0,1-d/32)*(lo?1:.55)*(P.hidden?.7:1),pan,ch)}
check(l,kill){this.state='check';this.lk=l;this.kill=kill;this.st=0}
hearNoise(x,z){if(this.state==='chase'||this.state==='check'||this.state==='stare'||this.state==='scare')return;const g=this.g.position;if(Math.hypot(x-g.x,z-g.z)>28)return;this.state='investigate';this.T=Level.cell(x,z);this.inv=0;this.it=0}
/* opens any closed, unlocked door in front of him; locked doors stay shut until the player unlocks them */
doors(){const g=this.g.position,fx=Math.sin(this.g.rotation.y),fz=Math.cos(this.g.rotation.y),ch=this.state==='chase';for(const d of Level.doors){if(d.locked||d.target>=.5||d.o>=.5)continue;const dx=d.wx-g.x,dz=d.wz-g.z,dd=Math.hypot(dx,dz);if(dd<2.1&&(dd<1||dx*fx+dz*fz>0)){d.target=1;d.rate=ch?9:2.6;this.wait=ch?.3:.8;const pd=Math.hypot(d.wx-this.pl.x,d.wz-this.pl.z);if(pd<24){Aud.dopen(Math.max(.2,1-pd/24));if(ch)setTimeout(()=>Aud.bang&&pd<14&&Aud.dclose(.8),180)}break}}}
update(dt,P,keys){const g=this.g.position,cf=this.cfg,vis=!P.hidden,d=Math.hypot(P.x-g.x,P.z-g.z);this.pl=P;this.dist=d;this.anim(dt);this.chaseStart=false;this.cool=Math.max(0,this.cool-dt);this.wait=Math.max(0,this.wait-dt);
 /* vision: a wide forward cone at full range, a small awareness bubble all round (wider while hunting) */
 const ch0=this.state==='chase',fx=Math.sin(this.g.rotation.y),fz=Math.cos(this.g.rotation.y),dot=d>.01?((P.x-g.x)*fx+(P.z-g.z)*fz)/d:1,sr=cf.sight*(P.crouch?.8:1);
 const lo=vis&&d<sr+8&&Level.los(g.x,g.z,P.x,P.z),sees=lo&&d<sr&&(d<(ch0?9:4.5)||dot>(ch0?-.25:.42)),hears=vis&&P.noisy&&d<cf.hear*(lo?1:.6),csp=(3.4+keys*.35)*cf.spd;this.seen=sees;this.doors();
 const a0=this.acc;
 this.think(dt,P,keys,sees,hears,csp);
 if(this.acc>a0&&this.acc>=this.nextStep){this.nextStep=this.acc+this.stride;this.footstep()}else if(this.nextStep===undefined)this.nextStep=this.acc+this.stride}
think(dt,P,keys,sees,hears,csp){const g=this.g.position,cf=this.cfg;
 if(this.state==='check'||this.state==='stare'){const l=this.lk;
  if(sees){this.state='chase';this.last=Level.cell(P.x,P.z);this.chaseStart=true}
  else if(this.state==='check'){this.T=[l.gx,l.gz];if(Math.hypot(l.px-g.x,l.pz-g.z)<.4){this.state='stare';this.st=0}else{this.go(dt,csp*.8);return}}
  if(this.state==='stare'){this.face(l.cx,l.cz,Math.min(1,dt*5));this.st+=dt;if(this.kill){if(this.st>.9)this.found=true}else if(this.st>5){this.state='patrol';this.T=null;this.cool=10}return}}
 if(sees||hears){if(this.state!=='chase')this.chaseStart=true;this.state='chase';this.lost=0;this.last=Level.cell(P.x,P.z)}
 else if(this.state==='chase'){this.lost+=dt;if(this.lost>6){this.state='patrol';this.T=null}}
 if(this.state==='chase'&&P.hidden&&P.lk&&!this.cool&&Math.hypot(P.lk.cx-g.x,P.lk.cz-g.z)<5){this.check(P.lk,false);return}
 const c=Level.cell(g.x,g.z);
 if(this.state==='investigate'){this.it+=dt;if(this.it>16){this.state='patrol';this.T=null;return}
  if(c[0]===this.T[0]&&c[1]===this.T[1]){this.inv+=dt;this.g.rotation.y+=dt*Math.sin(this.inv*1.6)*1.5;if(this.inv>3.5){this.state='patrol';this.T=null}return}
  this.go(dt,2.9*cf.spd);return}
 if(this.state==='chase')this.T=this.last;else if(!this.T||(c[0]===this.T[0]&&c[1]===this.T[1])){const f=Level.walk;this.T=f[Math.random()*f.length|0]}
 this.go(dt,this.state==='chase'?csp:1.7*cf.spd)}}
