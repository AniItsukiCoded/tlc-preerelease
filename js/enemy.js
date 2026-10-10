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
 this.pv.add(buildBoiled())}
face(x,z,k=.15){const a=Math.atan2(x-this.g.position.x,z-this.g.position.z);let d=a-this.g.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));this.g.rotation.y+=d*k}
anim(dt){this.t+=dt;const ch=this.state==='chase'||this.state==='scare';this.pv.rotation.z=Math.sin(this.t*(ch?7:2.2))*(ch?.07:.05)+(this.state==='stare'?Math.sin(this.t*.9)*.06:0);this.pv.rotation.x=(ch?.2:0)+Math.sin(this.t*1.7)*.03;this.light.intensity=.4+Math.random()*.4}
go(dt,sp){if(this.wait>0)return;const g=this.g.position,c=Level.cell(g.x,g.z),w=Level.wp(Level.next(c,this.T)),mx=w.x-g.x,mz=w.z-g.z,md=Math.hypot(mx,mz)||1;if(md>.05){g.x+=mx/md*sp*dt;g.z+=mz/md*sp*dt;this.face(g.x+mx,g.z+mz)}}
check(l,kill){this.state='check';this.lk=l;this.kill=kill;this.st=0}
hearNoise(x,z){if(this.state==='chase'||this.state==='check'||this.state==='stare'||this.state==='scare')return;const g=this.g.position;if(Math.hypot(x-g.x,z-g.z)>28)return;this.state='investigate';this.T=Level.cell(x,z);this.inv=0;this.it=0}
doors(){const g=this.g.position;for(const d of Level.doors){if(d.target<.5&&d.o<.5&&!d.locked&&Math.hypot(d.wx-g.x,d.wz-g.z)<1.9){d.target=1;this.wait=this.state==='chase'?.3:.55;const dd=Math.hypot(d.wx-this.pl.x,d.wz-this.pl.z);if(dd<22)Aud.dopen(Math.max(.15,1-dd/22));break}}}
update(dt,P,keys){const g=this.g.position,cf=this.cfg,vis=!P.hidden,d=Math.hypot(P.x-g.x,P.z-g.z);this.pl=P;this.dist=d;this.anim(dt);this.chaseStart=false;this.cool=Math.max(0,this.cool-dt);this.wait=Math.max(0,this.wait-dt);
 const lo=vis&&d<cf.sight+8&&Level.los(g.x,g.z,P.x,P.z),sees=lo&&d<cf.sight,hears=vis&&P.noisy&&d<cf.hear*(lo?1:.6),csp=(3.4+keys*.35)*cf.spd;this.seen=sees;this.doors();
 if(this.state==='check'||this.state==='stare'){const l=this.lk;
  if(sees){this.state='chase';this.last=Level.cell(P.x,P.z);this.chaseStart=true}
  else if(this.state==='check'){this.T=[l.gx,l.gz];if(Math.hypot(l.px-g.x,l.pz-g.z)<.4){this.state='stare';this.st=0}else{this.go(dt,csp*.8);return}}
  if(this.state==='stare'){this.face(l.cx,l.cz,.25);this.st+=dt;if(this.kill){if(this.st>.9)this.found=true}else if(this.st>5){this.state='patrol';this.T=null;this.cool=10}return}}
 if(sees||hears){if(this.state!=='chase')this.chaseStart=true;this.state='chase';this.lost=0;this.last=Level.cell(P.x,P.z)}
 else if(this.state==='chase'){this.lost+=dt;if(this.lost>6){this.state='patrol';this.T=null}}
 if(this.state==='chase'&&P.hidden&&P.lk&&!this.cool&&Math.hypot(P.lk.cx-g.x,P.lk.cz-g.z)<5){this.check(P.lk,false);return}
 const c=Level.cell(g.x,g.z);
 if(this.state==='investigate'){this.it+=dt;if(this.it>16){this.state='patrol';this.T=null;return}
  if(c[0]===this.T[0]&&c[1]===this.T[1]){this.inv+=dt;this.g.rotation.y+=dt*Math.sin(this.inv*1.6)*1.5;if(this.inv>3.5){this.state='patrol';this.T=null}return}
  this.go(dt,2.9*cf.spd);return}
 if(this.state==='chase')this.T=this.last;else if(!this.T||(c[0]===this.T[0]&&c[1]===this.T[1])){const f=Level.walk;this.T=f[Math.random()*f.length|0]}
 this.go(dt,this.state==='chase'?csp:1.7*cf.spd)}}
