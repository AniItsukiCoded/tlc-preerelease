const Props={
glow(c0){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,c0+'1)');g.addColorStop(.3,c0+'.3)');g.addColorStop(1,c0+'0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)},
cv(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return new THREE.CanvasTexture(c)},
side(cell){const E=cell;return[[1,0],[-1,0],[0,1],[0,-1]].find(([a,b])=>Level.g[E[1]+b]&&Level.g[E[1]+b][E[0]+a]===1)},

wood(){return this._w||(this._w=this.cv(128,128,(x,w,h)=>{x.fillStyle='#3d2b1d';x.fillRect(0,0,w,h);for(let i=0;i<8;i++){x.fillStyle=`rgba(0,0,0,${.12+Math.random()*.15})`;x.fillRect(0,i*16,w,2)}for(let i=0;i<700;i++){const v=Math.random()*60|0;x.fillStyle=`rgba(${v},${v*.7|0},${v*.5|0},.2)`;x.fillRect(Math.random()*w,Math.random()*h,Math.random()*14+2,1)}}))},
doorTex(n){return this.cv(128,256,(x,w,h)=>{x.fillStyle='#1d1610';x.fillRect(0,0,w,h);for(let i=0;i<260;i++){const v=Math.random()*40|0;x.fillStyle=`rgba(${v+20},${v+10},${v},.25)`;x.fillRect(Math.random()*w,Math.random()*h,1+Math.random()*2,10+Math.random()*50)}
 x.strokeStyle='rgba(0,0,0,.65)';x.lineWidth=4;x.strokeRect(14,18,w-28,92);x.strokeRect(14,128,w-28,108);x.strokeStyle='rgba(120,90,50,.18)';x.lineWidth=1;x.strokeRect(17,21,w-34,86);x.strokeRect(17,131,w-34,102);
 x.fillStyle='#8a7a4a';x.fillRect(44,116,40,18);x.fillStyle='#141008';x.font='bold 15px Georgia';x.textAlign='center';x.fillText(String(n).padStart(2,'0'),64,130);
 for(let i=0;i<5;i++){const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.35)');x.fillStyle=g;x.fillRect(Math.random()*w,0,4+Math.random()*8,h)}})},
doors(scene){const H=Level.H,M=THREE.MeshStandardMaterial,fr=new M({color:0x15110d,roughness:.85}),mo=new M({map:this.noise(),color:0x66645a,roughness:.9}),br=new M({color:0xb08a3a,metalness:.9,roughness:.35}),lm=new M({color:0x5a0a0a,emissive:0x701010,roughness:.5});
 Level.doors.forEach((d,i)=>{const g=new THREE.Group();g.position.set(d.wx,0,d.wz);g.rotation.y=d.axis==='x'?Math.PI/2:0;scene.add(g);
  const bx=(w,h,dd,x,y,z,m,p=g)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,dd),m);o.position.set(x,y,z);p.add(o);return o};
  [-1,1].forEach(s=>bx(.75,H,.3,s*1.125,H/2,0,mo));bx(1.5,H-2.3,.3,0,2.3+(H-2.3)/2,0,mo);
  [-1,1].forEach(s=>bx(.09,2.3,.36,s*.795,1.15,0,fr));bx(1.68,.09,.36,0,2.3,0,fr);
  const rm=Level.rooms.find(r=>r.doors.includes(d)),num=rm?rm.id+1:i+1,hg=new THREE.Group();hg.position.set(-.72,0,0);g.add(hg);
  bx(1.44,2.25,.07,.72,1.125,0,new M({map:this.doorTex(num),roughness:.7}),hg);[-1,1].forEach(s=>bx(.05,.05,.1,1.25,1.05,s*.07,br,hg));
  d.lm=bx(.1,.15,.12,1.2,1.3,0,lm,hg);d.lm.visible=d.locked;d.hg=hg;
  const X=d.axis==='x';[-1,1].forEach(s=>{const c=s*1.125;Level.col.push(X?{x0:d.wx-.15,x1:d.wx+.15,z0:d.wz+c-.375,z1:d.wz+c+.375}:{x0:d.wx+c-.375,x1:d.wx+c+.375,z0:d.wz-.15,z1:d.wz+.15})});
  d.pc=X?{x0:d.wx-.06,x1:d.wx+.06,z0:d.wz-.75,z1:d.wz+.75,off:false}:{x0:d.wx-.75,x1:d.wx+.75,z0:d.wz-.06,z1:d.wz+.06,off:false};Level.col.push(d.pc)})},
fixtures(scene){const S=Level.S,H=Level.H,R=Math.random,src=Level.src,gt=this.glow('rgba(255,190,110,'),gr=this.glow('rgba(255,50,40,'),geo=new THREE.BoxGeometry(.55,.07,.55),cw=new THREE.Color(0xffb070),cr=new THREE.Color(0xff2a20);
 const add=(x,z,mode)=>{const col=mode==='r'?cr:cw,mat=new THREE.MeshBasicMaterial({color:col.clone()}),mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,H-.04,z);scene.add(mesh);
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:mode==='r'?gr:gt,blending:THREE.AdditiveBlending,depthWrite:false,fog:false,transparent:true,opacity:.5}));sp.scale.set(2.4,2.4,1);sp.position.set(x,H-.4,z);scene.add(sp);
  src.push({x,y:H-.45,z,mode,col,mat,sp,d:mode==='r'?8:11,i:mode==='r'?.8:1.15,ph:R()*6,k:1,lk:-1,vis:true,I(){return mode==='d'?0:this.k*this.i}})};
 for(const a of[1,11,21,31,41])for(const s0 of[1,11,21,31])for(const o of[3,7]){const p=s0+o;[[a,p],[p,a]].forEach(([x,z])=>{if(Level.g[z][x]!==0)return;const near=Math.hypot(x-1,z-1)<11,r=R();add(x*S,z*S,near?'n':r<.08?'r':r<.32?'d':r<.5?'f':'n')})}
 Level.rooms.forEach(r=>{const x=(r.x0+r.x1)>>1,z=(r.z0+r.z1)>>1,q=R();add(x*S,z*S,r===Level.lockRoom?'r':q<.5?'d':q<.7?'f':'n')});
 add(Level.exit[0]*S,Level.exit[1]*S,'r')},
pipes(scene){const S=Level.S,H=Level.H,g=Level.g,rs=Level.roomOf,A=[],B=[];
 for(let z=1;z<Level.D-1;z++)for(let x=1;x<Level.W-1;x++)if(g[z][x]===0&&rs[z][x]<0&&Math.random()<.6){
  const hx=g[z][x-1]!==1&&g[z][x+1]!==1&&g[z-1][x]===1&&g[z+1][x]===1,hz=g[z-1][x]!==1&&g[z+1][x]!==1&&g[z][x-1]===1&&g[z][x+1]===1,o=(Math.random()<.5?-1:1)*1.25;
  if(hx)A.push([x*S,H-.28,z*S+o]);else if(hz)B.push([x*S+o,H-.28,z*S])}
 const mat=new THREE.MeshStandardMaterial({color:0x34322d,roughness:.7,metalness:.6}),mk=(arr,r0,r2)=>{if(!arr.length)return;const im=new THREE.InstancedMesh(new THREE.CylinderGeometry(.075,.075,S,8),mat,arr.length),m=new THREE.Matrix4(),q=new THREE.Quaternion().setFromEuler(new THREE.Euler(r0,0,r2)),sc=new THREE.Vector3(1,1,1);
  arr.forEach((p,i)=>{m.compose(new THREE.Vector3(p[0],p[1],p[2]),q,sc);im.setMatrixAt(i,m)});scene.add(im)};
 mk(A,0,Math.PI/2);mk(B,Math.PI/2,0)},
stains(scene){const S=Level.S,fl=Level.walk,t=this.cv(128,128,(x,w,h)=>{for(let i=0;i<7;i++){const px=30+Math.random()*68,py=30+Math.random()*68,r=10+Math.random()*26,gr=x.createRadialGradient(px,py,0,px,py,r);gr.addColorStop(0,'rgba(70,8,6,.55)');gr.addColorStop(1,'rgba(70,8,6,0)');x.fillStyle=gr;x.fillRect(0,0,w,h)}}),
 mat=new THREE.MeshStandardMaterial({map:t,transparent:true,depthWrite:false,roughness:.4,polygonOffset:true,polygonOffsetFactor:-2});
 for(let i=0;i<24;i++){const c=fl[Math.random()*fl.length|0];if(Level.g[c[1]][c[0]]!==0)continue;const m=new THREE.Mesh(new THREE.PlaneGeometry(2,2),mat);m.rotation.set(-Math.PI/2,0,Math.random()*6);m.position.set(c[0]*S+(Math.random()-.5),.015,c[1]*S+(Math.random()-.5));scene.add(m)}},
rooms(scene){const S=Level.S,g=Level.g,R=Math.random,M=THREE.MeshStandardMaterial,D4=[[1,0],[-1,0],[0,1],[0,-1]],
 wood=new M({map:this.wood(),roughness:.85}),metal=new M({map:this.noise(),color:0x6d7d74,roughness:.55,metalness:.65}),dm=new M({color:0x1e211f,roughness:.8,metalness:.4}),rust=new M({map:this.noise(),color:0x6a4a36,roughness:.75,metalness:.5}),
 cloth=[0x4a2a2a,0x2a3040,0x3a3a2a,0x30403a].map(c=>new M({color:c,roughness:1}));
 const bx=(g,w,h,d,x,y,z,m)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);g.add(o);return o},cy=(g,r,h,x,y,z,m,s=12)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,s),m);o.position.set(x,y,z);g.add(o);return o};
 const K={
  crate(){const g=new THREE.Group(),s=.8+R()*.3;bx(g,s,s,s,0,s/2,0,wood);bx(g,s+.04,.07,s+.04,0,s*.2,0,dm);bx(g,s+.04,.07,s+.04,0,s*.8,0,dm);if(R()<.5){const t=.45+R()*.15;bx(g,t,t,t,(R()-.5)*.2,s+t/2,(R()-.5)*.2,wood).rotation.y=R()}return{g,w:s,d:s}},
  shelf(){const g=new THREE.Group();[-.72,.72].forEach(x=>[-.2,.2].forEach(z=>bx(g,.05,2,.05,x,1,z,metal)));[.12,.7,1.28,1.86].forEach(y=>{bx(g,1.5,.04,.45,0,y,0,wood);if(y<1.8)for(let i=0;i<3;i++)if(R()<.7){const w=.2+R()*.25,h=.15+R()*.25;bx(g,w,h,.28,-.55+i*.55+(R()-.5)*.1,y+.02+h/2,0,R()<.5?cloth[R()*4|0]:wood)}});return{g,w:1.5,d:.45}},
  barrel(){const g=new THREE.Group();cy(g,.3,.9,0,.45,0,rust);[.2,.7].forEach(y=>cy(g,.31,.04,0,y,0,dm));return{g,w:.64,d:.64}},
  desk(){const g=new THREE.Group();bx(g,1.5,.06,.75,0,.76,0,wood);[-.7,.7].forEach(x=>bx(g,.05,.74,.7,x,.37,0,wood));bx(g,1.4,.5,.04,0,.5,-.33,wood);bx(g,.4,.18,.6,.45,.62,.02,wood);
   const l=new THREE.Group();cy(l,.07,.02,0,0,0,dm);cy(l,.012,.28,0,.15,0,dm);bx(l,.14,.08,.14,0,.3,0,new THREE.MeshBasicMaterial({color:0x6a5a3a}));l.position.set(-.5,.79,-.1);g.add(l);
   bx(g,.3,.005,.4,-.1,.8,.1,new M({color:0x9a9684,roughness:1})).rotation.y=.4;
   const c=new THREE.Group();bx(c,.42,.05,.42,0,.45,0,wood);bx(c,.42,.5,.04,0,.72,-.2,wood);[-1,1].forEach(a=>[-1,1].forEach(b=>bx(c,.04,.45,.04,a*.18,.22,b*.18,dm)));c.position.set((R()-.5)*.5,0,.62);c.rotation.y=(R()-.5)*1.2;g.add(c);return{g,w:1.5,d:.75}},
  cabinet(){const g=new THREE.Group();bx(g,.9,1.9,.45,0,.95,0,metal);bx(g,.02,1.8,.02,0,.95,.23,dm);[-.2,.2].forEach(x=>bx(g,.03,.12,.04,x,1.0,.24,dm));return{g,w:.9,d:.45}},
  boiler(){const g=new THREE.Group();cy(g,.55,2.3,0,1.15,0,rust,16);[.4,1.2,2.0].forEach(y=>cy(g,.57,.06,0,y,0,dm,16));cy(g,.09,1.0,.2,2.8,.1,dm,8);cy(g,.09,.5,-.15,1.4,.58,dm,8).rotation.x=Math.PI/2;
   const ga=new THREE.Mesh(new THREE.CircleGeometry(.09,16),new THREE.MeshBasicMaterial({color:0xff2a1a}));ga.position.set(0,1.5,.56);g.add(ga);return{g,w:1.2,d:1.2}},
  cot(){const g=new THREE.Group();[-.85,.85].forEach(x=>[-.35,.35].forEach(z=>bx(g,.04,.35,.04,x,.17,z,dm)));bx(g,1.9,.05,.8,0,.36,0,dm);bx(g,1.8,.12,.72,0,.44,0,cloth[R()*4|0]);bx(g,.4,.1,.5,-.7,.55,0,new M({color:0x8a8678,roughness:1}));return{g,w:1.9,d:.85}},
  chair(){const g=new THREE.Group();bx(g,.45,.05,.45,0,.45,0,wood);bx(g,.45,.5,.04,0,.72,-.2,wood);[-1,1].forEach(a=>[-1,1].forEach(b=>bx(g,.04,.45,.04,a*.19,.22,b*.19,dm)));return{g,w:.5,d:.5}}};
 const th={storage:['crate','crate','shelf','barrel','crate'],office:['desk','cabinet','shelf','desk'],boiler:['boiler','boiler','barrel','crate'],cells:['cot','cot','cabinet','barrel'],empty:['chair','chair']},cnt={storage:4,office:3,boiler:3,cells:4,empty:1},names=Object.keys(th);
 const rug=this.cv(128,96,(x,w,h)=>{x.fillStyle='#3a1c19';x.fillRect(0,0,w,h);x.strokeStyle='#6b5030';x.lineWidth=4;x.strokeRect(6,6,w-12,h-12);x.strokeStyle='rgba(0,0,0,.4)';x.strokeRect(14,14,w-28,h-28);for(let i=0;i<400;i++){const v=Math.random()*50|0;x.fillStyle=`rgba(${v},${v},${v},.2)`;x.fillRect(Math.random()*w,Math.random()*h,2,2)}}),rm=new M({map:rug,roughness:1});
 Level.rooms.forEach(r=>{const tn=names[R()*5|0];r.theme=tn;const cells=[];
  for(let z=r.z0;z<=r.z1;z++)for(let x=r.x0;x<=r.x1;x++){if(Level.resv.has(x+','+z)||Level.lockers.some(l=>l.gx===x&&l.gz===z)||D4.some(([a,b])=>g[z+b][x+a]===2))continue;const sd=D4.filter(([a,b])=>g[z+b][x+a]===1);if(sd.length)cells.push([x,z,sd])}
  cells.sort(()=>R()-.5);const n=Math.min(cells.length,cnt[tn]+(R()*2|0));
  for(let i=0;i<n;i++){const[x,z,sd]=cells[i],s=sd[R()*sd.length|0],k=th[tn][R()*th[tn].length|0],o=K[k](),w=o.w,d=o.d,sh=(R()-.5)*Math.max(0,1.9-w),t=[-s[1],s[0]],px=x*S+s[0]*(S/2-d/2-.03)+t[0]*sh,pz=z*S+s[1]*(S/2-d/2-.03)+t[1]*sh;
   o.g.position.set(px,0,pz);o.g.rotation.y=k==='chair'?R()*6.28:Math.atan2(-s[0],-s[1]);scene.add(o.g);
   if(k!=='chair'){const hx=s[0]?d/2:w/2,hz=s[0]?w/2:d/2;Level.col.push({x0:px-hx,x1:px+hx,z0:pz-hz,z1:pz+hz})}}
  if((tn==='office'||tn==='cells')&&R()<.7){const cx=(r.x0+r.x1)>>1,cz=(r.z0+r.z1)>>1;if(!Level.resv.has(cx+','+cz)){const m=new THREE.Mesh(new THREE.PlaneGeometry(2.4,1.8),rm);m.rotation.set(-Math.PI/2,0,(R()<.5?0:Math.PI/2));m.position.set(cx*S,.012,cz*S);scene.add(m)}}})},
items(scene){const M=THREE.MeshStandardMaterial,br=new M({color:0xb08a3a,metalness:.9,roughness:.35}),gl={battery:this.glow('rgba(170,255,120,'),bottle:this.glow('rgba(150,255,210,'),key:this.glow('rgba(255,205,90,'),note:this.glow('rgba(255,250,225,')},
 note=this.cv(64,80,(x,w,h)=>{x.fillStyle='#b9b08e';x.fillRect(0,0,w,h);x.fillStyle='rgba(30,25,15,.55)';for(let i=0;i<9;i++)x.fillRect(8,10+i*7,w-16-(i%3)*10,1.5)}),gm=new M({color:0x3f7a46,transparent:true,opacity:.8,roughness:.2});
 const cyl=(g,r1,r2,h,m,x,y)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,10),m);o.rotation.z=Math.PI/2;o.position.set(x,y,0);g.add(o)};
 Level.items.forEach(it=>{const g=new THREE.Group();g.position.set(it.x,0,it.z);g.rotation.y=it.a;g.scale.setScalar(1.5);scene.add(g);
  if(it.t==='battery'){cyl(g,.04,.04,.15,new M({color:0x1c1c1c,roughness:.5,metalness:.5}),0,.045);cyl(g,.042,.042,.07,new M({color:0xd8a020,roughness:.5}),0,.045);cyl(g,.015,.015,.03,br,.09,.045)}
  else if(it.t==='bottle'){cyl(g,.036,.04,.17,gm,0,.04);cyl(g,.014,.025,.09,gm,.12,.04)}
  else if(it.t==='key'){const r=new THREE.Mesh(new THREE.TorusGeometry(.035,.01,6,12),br);r.rotation.x=Math.PI/2;r.position.set(-.08,.02,0);g.add(r);const s=new THREE.Mesh(new THREE.BoxGeometry(.14,.012,.012),br);s.position.set(.02,.02,0);g.add(s);[.06,.085].forEach(x=>{const t=new THREE.Mesh(new THREE.BoxGeometry(.012,.012,.03),br);t.position.set(x,.02,.012);g.add(t)})}
  else{const p=new THREE.Mesh(new THREE.PlaneGeometry(.26,.32),new M({map:note,roughness:1,side:THREE.DoubleSide}));p.rotation.x=-Math.PI/2;p.position.y=.012;g.add(p)}
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:gl[it.t],blending:THREE.AdditiveBlending,depthWrite:false,fog:false,transparent:true,opacity:.5}));sp.scale.set(.6,.6,1);sp.position.set(it.x,.24,it.z);scene.add(sp);it.g=g;it.sp=sp})},
build(scene){this.doors(scene);this.fusesExit(scene);this.lockers(scene);this.rooms(scene);this.fixtures(scene);this.pipes(scene);this.stains(scene);this.items(scene)},
fusesExit(scene){const S=Level.S,M=THREE.MeshStandardMaterial,gt=this.glow('rgba(255,170,60,');Level.fuses=[];
 const dark=new M({color:0x1d1b18,roughness:.9}),brass=new M({color:0xb08a3a,metalness:.9,roughness:.35});
 Level.keys.forEach((k,i)=>{const p=Level.wp(k),g=new THREE.Group();g.position.set(p.x,0,p.z);scene.add(g);
  const ped=new THREE.Mesh(new THREE.BoxGeometry(.4,.8,.4),dark);ped.position.y=.4;g.add(ped);
  const top=new THREE.Mesh(new THREE.BoxGeometry(.52,.05,.52),brass);top.position.y=.83;g.add(top);
  const f=new THREE.Group();f.position.y=1.25;g.add(f);
  f.add(new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.34,16),new M({color:0xffe0a0,transparent:true,opacity:.4,emissive:0xff9a2a,emissiveIntensity:.9,roughness:.1})));
  [-.2,.2].forEach(y=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(.085,.085,.07,16),brass);c.position.y=y;f.add(c)});
  f.add(new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,.32),new THREE.MeshBasicMaterial({color:0xffe6a8,fog:false})));
  const h=new THREE.Sprite(new THREE.SpriteMaterial({map:gt,blending:THREE.AdditiveBlending,depthWrite:false,fog:false,transparent:true}));h.scale.set(1.6,1.6,1);f.add(h);
  const n=16,pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(n*3),3));
  const sp=new THREE.Points(pg,new THREE.PointsMaterial({color:0xffc060,size:.045,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));g.add(sp);
  const l={intensity:1};
  const fz={g,f,l,sp,n,x:p.x,z:p.z,i,taken:false};Level.fuses.push(fz);Level.src.push({x:p.x,y:1.4,z:p.z,col:new THREE.Color(0xffa640),d:7,I:()=>fz.taken?0:fz.l.intensity});Level.col.push({x0:p.x-.27,x1:p.x+.27,z0:p.z-.27,z1:p.z+.27})});
 // exit door
 const E=Level.exit,p=Level.wp(E),d=this.side(E)||[0,-1],g=new THREE.Group();g.position.set(p.x+d[0]*(S/2-.1),0,p.z+d[1]*(S/2-.1));g.rotation.y=Math.atan2(-d[0],-d[1]);scene.add(g);
 const fm=new M({color:0x15171a,metalness:.8,roughness:.5});
 const door=new THREE.Mesh(new THREE.BoxGeometry(1.5,2.55,.1),new M({roughness:.6,metalness:.6,map:this.cv(128,256,(x,w,h)=>{x.fillStyle='#3a3d40';x.fillRect(0,0,w,h);for(let i=0;i<900;i++){x.fillStyle=`rgba(0,0,0,${Math.random()*.3})`;x.fillRect(Math.random()*w,Math.random()*h,2,2)}x.fillStyle='#b8860b';for(let i=0;i<8;i++){x.save();x.translate(0,200+i*0);x.restore()}x.fillStyle='#a8861a';for(let i=-2;i<10;i++){x.beginPath();x.moveTo(i*20,h-30);x.lineTo(i*20+10,h-30);x.lineTo(i*20-10,h);x.lineTo(i*20-20,h);x.fill()}x.strokeStyle='#111';x.lineWidth=4;x.strokeRect(6,6,w-12,h-12)})}));
 door.position.y=1.275;g.add(door);
 [[-.81,1.3,.12,2.7],[.81,1.3,.12,2.7]].forEach(a=>{const m=new THREE.Mesh(new THREE.BoxGeometry(a[2],a[3],.24),fm);m.position.set(a[0],a[1],0);g.add(m)});
 const tp=new THREE.Mesh(new THREE.BoxGeometry(1.74,.14,.24),fm);tp.position.y=2.62;g.add(tp);
 const sg=new THREE.Mesh(new THREE.PlaneGeometry(.9,.24),new THREE.MeshBasicMaterial({map:this.cv(256,64,(x,w,h)=>{x.fillStyle='#000';x.fillRect(0,0,w,h);x.fillStyle='#ff3030';x.font='bold 46px Georgia';x.textAlign='center';x.fillText('EXIT',128,48)}),fog:false}));sg.position.set(0,2.88,.13);g.add(sg);
 const glow=new THREE.Mesh(new THREE.PlaneGeometry(1.5,2.55),new THREE.MeshBasicMaterial({color:0xffffff,fog:false}));glow.position.set(0,1.275,-.07);glow.visible=false;g.add(glow);
 const lt={color:new THREE.Color(0xff2020),intensity:1.2};Level.src.push({x:g.position.x-d[0]*.9,y:2.2,z:g.position.z-d[1]*.9,col:lt.color,d:9,I:()=>lt.intensity});
 Level.xd={g,door,glow,lt,sg,x:g.position.x,z:g.position.z,open:false,t:0};
},
 lockers(scene){const S=Level.S;Level.lockers=[];const used=[...Level.keys,Level.exit],cand=[];
 for(let z=1;z<Level.D-1;z++)for(let x=1;x<Level.W-1;x++)if(!Level.g[z][x]&&Level.dist[z][x]>4&&!used.some(u=>u[0]===x&&u[1]===z)&&!Level.resv.has(x+','+z)&&![[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>Level.g[z+b][x+a]===2)){const s=this.side([x,z]);if(s)cand.push([x,z,s])}
 cand.sort(()=>Math.random()-.5).forEach(([x,z,s])=>{if(Level.lockers.length>=9||Level.lockers.some(l=>Math.abs(l.gx-x)+Math.abs(l.gz-z)<5))return;
  const c=Level.wp([x,z]),lx=c.x+s[0]*(S/2-.42),lz=c.z+s[1]*(S/2-.42),L=this.locker(scene,lx,lz,Math.atan2(-s[0],-s[1]),10+Level.lockers.length*3+(Math.random()*3|0));
  Level.lockers.push({gx:x,gz:z,cx:lx,cz:lz,px:c.x,pz:c.z,nx:-s[0],nz:-s[1],yaw:Math.atan2(s[0],s[1]),hg:L,ang:0,open:false})});
 Level.lockLight=new THREE.PointLight(0xc8b48a,0,3);scene.add(Level.lockLight);
},
noise(){return this._n||(this._n=this.cv(128,128,(x,w,h)=>{x.fillStyle='#8a948e';x.fillRect(0,0,w,h);for(let i=0;i<1400;i++){const v=Math.random()*70|0;x.fillStyle=`rgba(${v},${v},${v},.25)`;x.fillRect(Math.random()*w,Math.random()*h,2,2)}}))},
doorOut(n){return this.cv(128,256,(x,w,h)=>{x.fillStyle='#46554d';x.fillRect(0,0,w,h);for(let i=0;i<1600;i++){const v=Math.random()*60|0;x.fillStyle=`rgba(${v},${v},${v},.25)`;x.fillRect(Math.random()*w,Math.random()*h,2,2)}
 for(let i=0;i<6;i++){const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(90,40,10,0)');g.addColorStop(.6,'rgba(90,40,10,.35)');g.addColorStop(1,'rgba(40,15,5,.5)');x.fillStyle=g;x.fillRect(Math.random()*w,0,3+Math.random()*6,h)}
 x.strokeStyle='#111';x.lineWidth=5;x.strokeRect(3,3,w-6,h-6);x.fillStyle='#b8b09a';x.fillRect(40,110,48,30);x.fillStyle='#222';x.font='bold 22px Georgia';x.textAlign='center';x.fillText(String(n).padStart(2,'0'),64,133)})},
doorIn(){return this.cv(128,256,(x,w,h)=>{x.fillStyle='#1f2220';x.fillRect(0,0,w,h);x.strokeStyle='rgba(200,195,180,.3)';x.lineWidth=1;for(let i=0;i<40;i++){x.beginPath();const a=Math.random()*w,b=Math.random()*h;x.moveTo(a,b);x.lineTo(a+(Math.random()-.5)*40,b+(Math.random()-.5)*60);x.stroke()}
 x.strokeStyle='rgba(200,195,180,.5)';x.lineWidth=2;x.beginPath();for(let i=0;i<5;i++){x.moveTo(30+i*6,60);x.lineTo(30+i*6,84)}x.moveTo(26,80);x.lineTo(60,64);x.stroke()})},
back(){return this._b||(this._b=new THREE.MeshStandardMaterial({roughness:.9,map:this.cv(128,256,(x,w,h)=>{x.fillStyle='#1b1d1b';x.fillRect(0,0,w,h);x.strokeStyle='rgba(190,185,170,.55)';x.lineWidth=1.5;
 for(let g=0;g<14;g++){const bx=14+(g%4)*26,by=24+((g/4)|0)*18;for(let i=0;i<4;i++){x.beginPath();x.moveTo(bx+i*4,by);x.lineTo(bx+i*4,by+12);x.stroke()}x.beginPath();x.moveTo(bx-2,by+10);x.lineTo(bx+16,by+2);x.stroke()}
 x.fillStyle='rgba(110,10,10,.7)';x.beginPath();x.ellipse(64,170,15,19,0,0,7);x.fill();for(let i=0;i<5;i++){x.beginPath();x.ellipse(50+i*7,146-(i%3==1?6:0),3,12,(i-2)*.12,0,7);x.fill()}
 x.strokeStyle='rgba(90,8,8,.5)';for(let i=0;i<8;i++){x.beginPath();x.moveTo(64+(i-4)*5,190);x.lineTo(64+(i-4)*5+3,240);x.stroke()}})}))},
locker(scene,lx,lz,ang,num){const M=THREE.MeshStandardMaterial,g=new THREE.Group();g.position.set(lx,0,lz);g.rotation.y=ang;scene.add(g);
 const W=.9,H=2.1,D=.7,t=.03,mo=this._mo||(this._mo=new M({map:this.noise(),color:0x6d7d74,roughness:.55,metalness:.65})),mi=this._mi||(this._mi=new M({color:0x1e211f,roughness:.8,metalness:.4})),
 cl=this._cl||(this._cl=new M({color:0x2a1616,roughness:1})),cl2=this._c2||(this._c2=new M({color:0x15181f,roughness:1})),lt=this._lt||(this._lt=new M({color:0x2b1d12,roughness:.7})),sv=this._sv||(this._sv=new M({color:0x9a9a94,metalness:.9,roughness:.3}));
 const bx=(w,h,d,x,y,z,m,p=g)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);p.add(o);return o};
 bx(W,H,t,0,H/2,-D/2,this.back());bx(t,H,D,-W/2,H/2,0,mo);bx(t,H,D,W/2,H/2,0,mo);bx(W,t,D,0,H,0,mo);bx(W,t,D,0,.02,0,mi);
 // interior: shelf, rail, hanging clothes, boots, bottle
 bx(W-.06,.03,.32,0,1.9,-.17,mi);bx(.2,.12,.16,.2,1.97,-.18,cl2);const bt=new THREE.Mesh(new THREE.CylinderGeometry(.03,.035,.2,10),new M({color:0x3a5a3a,transparent:true,opacity:.7}));bt.position.set(-.2,2.02,-.2);g.add(bt);
 bx(W-.08,.022,.022,0,1.76,-.3,sv);
 bx(.34,.7,.09,.2,1.38,-.28,cl);bx(.09,.55,.08,.01,1.42,-.28,cl);bx(.09,.55,.08,.39,1.42,-.28,cl);bx(.3,.9,.07,-.2,1.28,-.29,cl2);bx(.08,.12,.08,.2,1.78,-.28,cl);
 bx(.13,.14,.28,-.17,.1,-.08,lt);bx(.13,.14,.28,-.01,.1,-.1,lt);bx(.08,.03,.2,.25,.04,-.1,mo);
 // hinged door (front only)
 const hg=new THREE.Group();hg.position.set(-W/2+.02,0,D/2-.015);g.add(hg);const dw=W-.04,om=new M({map:this.doorOut(num),roughness:.55,metalness:.6}),im=new M({map:this.doorIn(),roughness:.8});
 [[1.25,.675],[.15,2.02]].forEach(([h,y])=>{const o=new THREE.Mesh(new THREE.BoxGeometry(dw,h,.03),[mo,mo,mo,mo,om,im]);o.position.set(dw/2,y,0);hg.add(o)});
 for(let i=0;i<10;i++){bx(dw-.08,.012,.075,dw/2,1.32+i*.066,0,mo,hg).rotation.x=.7}
 bx(.03,.72,.03,.02,1.65,0,mo,hg);bx(.03,.72,.03,dw-.02,1.65,0,mo,hg);bx(.03,.14,.05,dw-.08,1.0,.04,sv,hg);
 return hg},
update(dt,t,P){Level.lockers.forEach(l=>{l.ang+=((l.open?-1.9:0)-l.ang)*Math.min(1,dt*7);l.hg.rotation.y=l.ang});Level.fuses.forEach(f=>{if(f.taken)return;f.f.rotation.y=t*1.5;f.f.position.y=1.25+Math.sin(t*2+f.i)*.07;f.l.intensity=.9+.25*Math.sin(t*7+f.i)+(Math.random()<.03?-.5:0);
  const a=f.sp.geometry.attributes.position;for(let i=0;i<f.n;i++){const ph=i*1.7+f.i,r=.12+.1*((i%3)/2),y=((t*.25+i/f.n)%1);a.setXYZ(i,Math.cos(t*.8+ph)*r,1.0+y*.7,Math.sin(t*.8+ph)*r)}a.needsUpdate=true});
 const x=Level.xd;if(x.open){x.t+=dt;x.glow.visible=true;x.door.position.y=Math.min(4,1.275+x.t*1.1)}
 Level.doors.forEach(d=>{d.o+=(d.target-d.o)*Math.min(1,dt*6);if(Math.abs(d.target-d.o)<.01)d.o=d.target;d.hg.rotation.y=d.o*d.sw*1.7;d.pc.off=d.o>.45;d.lm.visible=d.locked});
 Level.items.forEach(it=>{if(it.taken)return;it.sp.material.opacity=.3+.25*Math.sin(t*2.4+it.i*1.3)})}};
