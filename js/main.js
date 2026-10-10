(function(){
const $=i=>document.getElementById(i),R=Math.random;
const DEF={sens:1,vol:.8,br:.4,fov:72,bob:true,grain:true,cmus:true,invy:false,hints:true,diff:1};
let SET=Object.assign({},DEF);try{Object.assign(SET,JSON.parse(localStorage.getItem('lh2')))}catch(e){}
const DIFF=[
{n:'Easy',spd:.8,hear:7,sight:12,amb:.1,d:['The Boiled One is slower than your sprint all game','He only hears you up close','The halls are a little brighter']},
{n:'Normal',spd:1,hear:11,sight:16,amb:0,d:['Faster than your walk, slower than your sprint','Hears sprinting from a room away','The way it was meant to be']},
{n:'Hard',spd:1.15,hear:14,sight:20,amb:-.05,d:['Faster than your sprint once you hold all 4 fuses','Sprinting carries far','Darker halls']},
{n:'Nightmare',spd:1.35,hear:18,sight:26,amb:-.1,d:['Faster than your sprint by the second fuse','He hears almost everything','Almost no light. Lockers are your only friend']}];
let scene,cam,ren,clock,en,amb,fl,keys=0,state='menu',started=false,stam=1,yaw=0,pitch=0,bob=0,stepT=0,beatT=0,eStep=0,eventT=15,blackout=0,msgT=0,time=0,H=null,hideT=0,wasCh=false,scareT=0,from='menu',grace=0,lockTry=0,mxn=0,myn=0,bat=1,bot=0,hasKey=false,nNotes=0,proj=[],noteT=0,dust=null,fon=true,NT=6;
const P={x:0,z:0,noisy:false,hidden:false,lk:null},K={};
const say=(t,ms=3500)=>{const m=$('msg');m.textContent=t;m.style.opacity=1;clearTimeout(msgT);msgT=setTimeout(()=>m.style.opacity=0,ms)};
const save=()=>{try{localStorage.setItem('lh2',JSON.stringify(SET))}catch(e){}};
const fmt=t=>Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');
const show=id=>$(id).classList.remove('hidden'),hide_=id=>$(id).classList.add('hidden');
function apply(){const D=DIFF[SET.diff];if(amb)amb.intensity=Math.max(.02,.15+SET.br*.5+D.amb);Aud.vol=SET.vol;Aud.setVol(SET.vol);Aud.cm=SET.cmus;$('grain').style.display=SET.grain?'':'none';
 const dn=$('dName');if(dn){dn.textContent='Difficulty - '+D.n;$('dBox').innerHTML=`<h4>Difficulty: ${D.n}</h4><ul>${D.d.map(x=>`<li>${x}</li>`).join('')}</ul>`}}
function buildOpts(){const cb=(k,t)=>`<label class="cb"><input type="checkbox" data-k="${k}"><i></i><span>${t}</span></label>`,sl=(k,t,a,b,s)=>`<label class="sl"><span>${t}</span><input type="range" data-k="${k}" min="${a}" max="${b}" step="${s}"></label>`;
 $('optBox').innerHTML=`<div class="col"><h3>General</h3><div class="cbs">${cb('grain','Film grain')}${cb('bob','Head bob')}${cb('cmus','Chase music')}${cb('invy','Invert Y')}${cb('hints','Prompts')}</div>
 <h3>Audio &amp; View</h3>${sl('vol','Audio volume',0,1,.05)}${sl('sens','Mouse sensitivity',.4,2.5,.05)}${sl('br','Brightness',0,1,.05)}${sl('fov','Field of view',60,100,1)}</div>
 <div class="col"><div id="dName"></div>${sl('diff','',0,3,1)}<div id="dBox"></div><button class="rs" id="rs">Reset to defaults</button></div>`;
 const bind=()=>document.querySelectorAll('[data-k]').forEach(e=>{const k=e.dataset.k;if(e.type==='checkbox')e.checked=!!SET[k];else e.value=SET[k];
  e.oninput=()=>{SET[k]=e.type==='checkbox'?e.checked:+e.value;save();apply()}});bind();$('rs').onclick=()=>{SET=Object.assign({},DEF);save();bind();apply()}}
function init(){
 scene=new THREE.Scene();scene.background=new THREE.Color(0x050303);scene.fog=new THREE.FogExp2(0x050303,.075);
 cam=new THREE.PerspectiveCamera(72,innerWidth/innerHeight,.05,80);cam.rotation.order='YXZ';
 ren=new THREE.WebGLRenderer({canvas:$('gl'),antialias:true});ren.setPixelRatio(Math.min(devicePixelRatio,1.5));ren.setSize(innerWidth,innerHeight);
 amb=new THREE.AmbientLight(0x2a2420,.35);scene.add(amb);
 fl=new THREE.SpotLight(0xffe9c4,2.2,30,.5,.6,1.4);cam.add(fl);fl.position.set(.2,-.1,0);const tg=new THREE.Object3D();tg.position.set(0,0,-1);cam.add(tg);fl.target=tg;scene.add(cam);
 Level.build(scene);const s=Level.wp([1,1]);P.x=s.x;P.z=s.z;en=new Enemy(scene,Level.enemyStart);clock=new THREE.Clock();Menu3D.init();initDust();buildOpts();apply();
 addEventListener('resize',()=>{cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();ren.setSize(innerWidth,innerHeight)});
 addEventListener('keydown',e=>{K[e.code]=1;if(e.code==='Escape'&&state==='pause'&&!$('pause').classList.contains('hidden'))return resume();if(state!=='play')return;
  if(e.code==='KeyF'&&!H){fon=!fon;Aud.tone(fon&&bat>0?1200:700,.05,'square',.1)}if((e.code==='KeyG'||e.code==='KeyQ')&&!H)throwBottle();if(e.code==='KeyE')interact();if(e.code==='KeyP')pause()});
 addEventListener('keyup',e=>K[e.code]=0);
 addEventListener('mousemove',e=>{mxn=e.clientX/innerWidth-.5;myn=e.clientY/innerHeight-.5;if(document.pointerLockElement&&state==='play'){yaw-=e.movementX*.0022*SET.sens;pitch=Math.max(-1.4,Math.min(1.4,pitch+(SET.invy?1:-1)*e.movementY*.0022*SET.sens))}});
 document.addEventListener('pointerdown',()=>{if(!Aud.ctx){Aud.init();apply()}},{once:true});
 document.addEventListener('click',()=>{if(state==='play'&&!document.pointerLockElement)lock()});
 document.addEventListener('pointerlockchange',()=>{if(document.pointerLockElement)hide_('lockhint');else if(state==='play'&&performance.now()>grace)pause()});
 const away=()=>{Aud.fade(false);pause()};
 document.addEventListener('visibilitychange',()=>document.hidden?away():Aud.fade(true));addEventListener('blur',away);addEventListener('focus',()=>{if(!document.hidden)Aud.fade(true)});
 document.querySelectorAll('.gb').forEach(b=>b.addEventListener('mouseenter',()=>{if(Aud.ctx&&Aud.ctx.state==='running')Aud.tone(170,.08,'sine',.08)}));
 $('start').onclick=begin;$('mSet').onclick=()=>openSet('menu');$('pSet').onclick=()=>openSet('pause');$('pRes').onclick=resume;
 $('mHow').onclick=()=>{hide_('menu');show('how')};$('hBack').onclick=()=>{hide_('how');show('menu')};
 $('sBack').onclick=()=>{hide_('settings');show(from)};$('mQuit').onclick=()=>{show('quit');setTimeout(()=>hide_('quit'),2200)};
 loop()}
function openSet(f){from=f;hide_(f);show('settings')}
function lock(){try{const p=ren.domElement.requestPointerLock();if(p&&p.catch)p.catch(()=>{})}catch(e){}}
function begin(){if(!Aud.ctx){Aud.init();apply()}Aud.fade(true);Aud.level(1);hide_('menu');show('hud');started=true;state='play';grace=performance.now()+1500;lock();show('card');say('Find the fuses.',4500);hud()}
function pause(){if(state!=='play')return;state='pause';for(const k in K)K[k]=0;document.exitPointerLock();$('pFuses').textContent=`FUSES ${keys}/4  ·  NOTES ${nNotes}/${NT}`;$('pTime').textContent=fmt(time);hide_('lockhint');show('pause');Aud.level(.25)}
function resume(){if(state!=='pause')return;hide_('pause');hide_('settings');state='play';Aud.fade(true);Aud.level(1);grace=performance.now()+1800;lock();setTimeout(()=>{if(state==='play'&&!document.pointerLockElement)show('lockhint')},1900)}
function take(f){f.taken=true;f.g.visible=false;f.l.intensity=0;keys++;Aud.pickup();document.querySelectorAll('#fuses i').forEach((e,i)=>e.classList.toggle('on',i<keys));
 say(keys<4?['It hums in your hand.','Something heard that.','It knows where you are.'][keys-1]:'Four fuses. The exit is waiting.');
 if(keys===4){Level.xd.lt.color.set(0x33ff66);Level.xd.sg.material.color.set(0x66ff88);$('obj').textContent='REACH THE EXIT'}}
function hide(l){H=l;hideT=0;l.open=false;P.x=l.cx;P.z=l.cz;yaw=l.yaw;pitch=0;if(en.seen&&en.dist<DIFF[SET.diff].sight)en.check(l,true);
 show('lockerfx');Level.lockLight.position.set(l.cx,1.9,l.cz);Level.lockLight.intensity=.4;Aud.locker();Aud.muffle(true)}
function leave(){const l=H;H=null;l.open=true;setTimeout(()=>{if(H!==l)l.open=false},2500);P.x=l.px;P.z=l.pz;hide_('lockerfx');Level.lockLight.intensity=0;Aud.locker();Aud.muffle(false)}
function target(){if(H)return null;let best=null,bs=99;const fx=-Math.sin(yaw),fz=-Math.cos(yaw);
 const tr=(k,o,x,z,lim,fac,label)=>{const dx=x-P.x,dz=z-P.z,d=Math.hypot(dx,dz);if(d>lim)return;const dot=d>.01?(dx*fx+dz*fz)/d:1;if(fac&&dot<.25&&d>1.1)return;const s=d-dot*.8;if(s<bs){bs=s;best={k,o,label}}};
 for(const f of Level.fuses)if(!f.taken)tr('fuse',f,f.x,f.z,1.9,0,'[E] TAKE FUSE');
 for(const it of Level.items)if(!it.taken)tr('item',it,it.x,it.z,1.7,1,it.t==='note'?'[E] READ NOTE':it.t==='key'?'[E] TAKE BRASS KEY':it.t==='battery'?'[E] TAKE BATTERY':'[E] TAKE BOTTLE');
 const x=Level.xd;if(!x.open)tr('exit',x,x.x,x.z,2.4,0,keys>=4?'[E] OPEN EXIT':`EXIT SEALED (${keys}/4)`);
 for(const l of Level.lockers)tr('locker',l,l.cx,l.cz,1.9,0,'[E] HIDE');
 for(const d of Level.doors){const dd=Math.hypot(d.wx-P.x,d.wz-P.z);if(d.target&&dd<.9)continue;tr('door',d,d.wx,d.wz,2.2,1,d.locked?(hasKey?'[E] UNLOCK DOOR':'LOCKED'):d.target?'[E] CLOSE DOOR':'[E] OPEN DOOR')}
 return best}
function hud(){const set=(id,v)=>{const e=$(id);if(e)e.textContent=v};set('botc',bot);set('notc',nNotes);const b=$('botn'),k=$('keyn');if(b)b.classList.toggle('hidden',bot<=0);if(k)k.classList.toggle('hidden',!hasKey)}
function showNote(i){const L=['Day 41. The boiler never stopped. We stopped hearing it. That was the first mistake.','They sent the night watchman down to check the pipes. Nobody saw him come back up. Something did.','Do not run. He hears running. He does not hear breathing, so breathe slowly.','The lockers are safe only because he dislikes the smell. Do not let him watch you climb in.','Four fuses, one for each valve. Someone hid them in the rooms. I think it was me.','The green light means the exit is ready. I never saw green.','If a door is open and you did not open it, he has already been through it.','Throw something. He will go and look. He always goes to look.'],t=L[i%L.length];
 const n=$('note');n.querySelector('p').textContent=t;n.classList.remove('hidden');noteT=Math.min(9,3.5+t.length*.045)}
function takeItem(it){if(it.t==='battery'){if(bat>.92){say('Your flashlight is already full.',2200);return}bat=Math.min(1,bat+.55);Aud.battery();say('Fresh batteries.',2200)}
 else if(it.t==='bottle'){if(bot>=5){say("You can't carry any more.",2200);return}bot++;Aud.pickup();say('A bottle. Press G to throw it.',3000)}
 else if(it.t==='key'){hasKey=true;Aud.keyget();say('A brass key. Something is locked.',3200)}
 else{nNotes++;Aud.paper();showNote(it.i)}
 it.taken=true;it.g.visible=false;it.sp.visible=false;hud()}
function interact(){if(state!=='play')return;if(H){if(hideT>.8)leave();return}
 const t=target();if(!t)return;
 if(t.k==='fuse')take(t.o);
 else if(t.k==='item')takeItem(t.o);
 else if(t.k==='exit'){const x=t.o;if(keys>=4){x.open=true;Aud.door();say('The door grinds open. Go.')}else{say(`It needs power. ${keys}/4 fuses.`);Aud.tone(90,.3,'square',.1)}}
 else if(t.k==='locker')hide(t.o);
 else if(t.k==='door'){const d=t.o;if(d.locked){if(hasKey){hasKey=false;Level.unlock(d);d.target=1;Aud.keyget();Aud.dopen();say('The lock gives.',2500);hud()}else{Aud.locked();say('Locked. There must be a key somewhere.',2800)}return}
  d.target=d.target?0:1;d.target?Aud.dopen():Aud.dclose()}}
function throwBottle(){if(state!=='play'||H||bot<=0)return;bot--;const cp=Math.cos(pitch),f=[-Math.sin(yaw)*cp,Math.sin(pitch),-Math.cos(yaw)*cp];
 const mt=new THREE.Mesh(new THREE.CylinderGeometry(.035,.045,.22,8),new THREE.MeshStandardMaterial({color:0x4a7a4a,transparent:true,opacity:.8,roughness:.2}));mt.position.set(P.x+f[0]*.4,1.5,P.z+f[2]*.4);scene.add(mt);
 proj.push({m:mt,vx:f[0]*12,vy:f[1]*12+1.6,vz:f[2]*12});Aud.tone(300,.1,'sine',.1,200);hud()}
function shatter(x,y,z){Aud.glass(1);en.hearNoise(x,z);const n=10,pg=new THREE.BufferGeometry(),a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=x+(R()-.5)*.3;a[i*3+1]=y+R()*.2;a[i*3+2]=z+(R()-.5)*.3}pg.setAttribute('position',new THREE.BufferAttribute(a,3));
 const pt=new THREE.Points(pg,new THREE.PointsMaterial({color:0x9fd8a8,size:.05,transparent:true,opacity:.9}));scene.add(pt);setTimeout(()=>{scene.remove(pt);pg.dispose()},900)}
function initDust(){const n=220,pg=new THREE.BufferGeometry(),a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=(R()-.5)*16;a[i*3+1]=R()*3;a[i*3+2]=(R()-.5)*16}pg.setAttribute('position',new THREE.BufferAttribute(a,3));
 dust=new THREE.Points(pg,new THREE.PointsMaterial({color:0xccbbaa,size:.03,transparent:true,opacity:.45,depthWrite:false}));dust.frustumCulled=false;scene.add(dust)}
function updDust(dt){const a=dust.geometry.attributes.position;for(let i=0;i<a.count;i++){let x=a.getX(i),y=a.getY(i)+dt*.05,z=a.getZ(i);const dx=x-P.x,dz=z-P.z;if(dx>8)x-=16;else if(dx<-8)x+=16;if(dz>8)z-=16;else if(dz<-8)z+=16;if(y>3)y=0;a.setXYZ(i,x,y,z)}a.needsUpdate=true}
function scare(){state='scare';scareT=0;en.state='scare';const ex=H?H.nx:-Math.sin(yaw),ez=H?H.nz:-Math.cos(yaw);en.g.position.set(P.x+ex*1.8,0,P.z+ez*1.8);en.g.rotation.y=Math.atan2(-ex,-ez);
 yaw=Math.atan2(-ex,-ez);pitch=.05;if(H){H.open=true;hide_('lockerfx');Aud.muffle(false);Level.lockLight.intensity=.8}Aud.scream();Aud.chase(false);Aud.setHum(0,0);$('flash').style.background='#700';$('flash').style.opacity=1;$('msg').style.opacity=0;document.exitPointerLock()}
function over(w){state=w?'won':'dead';document.exitPointerLock();hide_('hud');hide_('lockerfx');show('over');
 $('overT').textContent=w?'YOU ESCAPED':'IT FOUND YOU';$('overP').textContent=w?'The halls fall silent. For now.':['Lockers are not guaranteed.','If he watches you hide, it is over.','Sprinting is loud.'][R()*3|0];$('overS').textContent=`FUSES ${keys}/4 · NOTES ${nNotes}/${NT} · TIME ${fmt(time)}`}
function update(dt){
 time+=dt;let mx=(K.KeyD?1:0)-(K.KeyA?1:0),mz=(K.KeyS?1:0)-(K.KeyW?1:0),mv=!H&&(mx||mz),run=false;const D=DIFF[SET.diff];en.cfg=D;
 P.hidden=!!H;P.lk=H;
 if(H){hideT+=dt;yaw=H.yaw+Math.max(-.35,Math.min(.35,yaw-H.yaw));pitch=Math.max(-.22,Math.min(.22,pitch))}
 else{run=K.ShiftLeft&&mv&&stam>0;stam=Math.max(0,Math.min(1,stam+(run?-.25:.15)*dt));if(stam<=0)K.ShiftLeft=0;const sp=run?5.2:3.1;
  if(mv){const l=Math.hypot(mx,mz);mx/=l;mz/=l;const c=Math.cos(yaw),s=Math.sin(yaw),vx=(mx*c+mz*s)*sp*dt,vz=(-mx*s+mz*c)*sp*dt;
   const stuck=Level.blocked(P.x,P.z,.4);if(stuck||!Level.blocked(P.x+vx,P.z,.4))P.x+=vx;if(stuck||!Level.blocked(P.x,P.z+vz,.4))P.z+=vz;bob+=dt*(run?13:8);stepT-=dt;if(stepT<=0){Aud.step(run);stepT=run?.3:.5}}}
 P.noisy=!!(mv&&run);en.update(dt,P,keys);Props.update(dt,time,P);
 const ch=en.state==='chase';if(ch!==wasCh){wasCh=ch;Aud.chase(ch);if(ch)say('RUN.',1200)}
 const d=en.dist,fear=Math.max(0,1-d/18);
 if(en.found||(d<1.15&&!H&&en.state!=='patrol'||d<.9&&!H)){en.found=false;scare();return}
 if(d<16){eStep-=dt;if(eStep<=0){Aud.thud(1-d/16);eStep=ch?.4:.8}}
 const bs=SET.bob?1:0;if(H)cam.position.set(H.cx-H.nx*.08,1.55+Math.sin(time*1.6)*.004,H.cz-H.nz*.08);
 else{cam.position.set(P.x,1.65+Math.sin(bob)*(run?.07:.04)*bs,P.z);const sh=fear>.5?(fear-.5)*.02:0;cam.position.x+=(R()-.5)*sh;cam.position.z+=(R()-.5)*sh}
 cam.rotation.set(pitch,yaw,Math.sin(bob*.5)*.01*(mv?bs:0));cam.fov=(H?58:SET.fov)-fear*8;cam.updateProjectionMatrix();
 if(fon&&!H&&bat>0){const b0=bat;bat=Math.max(0,bat-dt/210);if(b0>0&&bat<=0){say('The flashlight dies.',2500);Aud.dead()}}let fi=2.4;if(fear>.3&&R()<fear*.35)fi=R()*.8;if(bat<.2&&bat>0&&R()<.1+(.2-bat)*1.5)fi*=.25;if(bat<=0||!fon)fi=0;if(blackout>0){blackout-=dt;fi=0}fl.intensity=H?0:fi;
 if(H)Level.lockLight.intensity=blackout>0?0:.3+fear*.3*(R()<.3?1:.4);
 Level.updLights(P.x,P.z,dt,blackout,time);updDust(dt);
 for(let i=proj.length-1;i>=0;i--){const p=proj[i],q=p.m;p.vy-=14*dt;const nx=q.position.x+p.vx*dt,ny=q.position.y+p.vy*dt,nz=q.position.z+p.vz*dt;if(ny<.06||ny>Level.H||Level.wall(nx,nz)||Level.hitCol(nx,nz)){shatter(q.position.x,Math.max(.06,q.position.y),q.position.z);scene.remove(q);proj.splice(i,1);continue}q.position.set(nx,ny,nz);q.rotation.x+=dt*14;q.rotation.z+=dt*9}
 if(noteT>0){noteT-=dt;if(noteT<=0)$('note').classList.add('hidden')}
 $('batfill').style.width=bat*100+'%';$('batfill').style.background=bat<.2?'#a31616':'';
 beatT-=dt;if(fear>.15&&beatT<=0){Aud.beat(Math.min(1,fear*1.4));beatT=1.1-fear*.7}Aud.setHum(fear*.35,fear);
 $('vig').style.opacity=.75+fear*.25;$('chasefx').style.opacity=ch?.55+Math.sin(time*9)*.25:0;
 eventT-=dt;if(eventT<=0){eventT=15+R()*25;if(R()<.5){blackout=1.2;Aud.bang()}else Aud.creak()}
 let pr='';if(H)pr=hideT>.8?'[E] LEAVE LOCKER':'';else{
  const x=Level.xd,xd=Math.hypot(x.x-P.x,x.z-P.z);if(x.open&&x.t>.8&&xd<1.3){$('flash').style.background='#fff';$('flash').style.opacity=1;state='won';setTimeout(()=>{$('flash').style.opacity=0;over(true)},900);return}
  const tg=target();pr=tg?tg.label:''}
 $('prompt').textContent=SET.hints?pr:'';$('stamfill').style.width=stam*100+'%'}
function updScare(dt){scareT+=dt;en.anim(dt);Props.update(dt,time,P);const p=en.g.position,dx=P.x-p.x,dz=P.z-p.z,dd=Math.hypot(dx,dz),k=Math.min(dd-.9,dt*7);if(k>0){p.x+=dx/dd*k;p.z+=dz/dd*k}
 pitch+=(.32-pitch)*dt*4;cam.position.set(P.x+(R()-.5)*.06,H?1.55:1.65,P.z+(R()-.5)*.06);cam.rotation.set(pitch,yaw,(R()-.5)*.05);cam.fov=62;cam.updateProjectionMatrix();
 $('flash').style.opacity=Math.max(0,1-scareT*.9)*(R()<.7?1:.3);if(scareT>1.8){$('flash').style.opacity=0;over(false)}}
function loop(){requestAnimationFrame(loop);const dt=Math.min(clock.getDelta(),.05);
 if(!started){Menu3D.update(dt,mxn,myn);ren.render(Menu3D.scene,Menu3D.cam)}
 else{if(state==='play')update(dt);else if(state==='scare')updScare(dt);ren.render(scene,cam)}}
init();
})();
