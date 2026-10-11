(function(){
const $=i=>document.getElementById(i),R=Math.random;
const DEF={sens:1,vol:.8,fov:72,bob:true,grain:true,cmus:true,invy:false,hints:true,diff:1,safe:false},MAXD=5;
let SET=Object.assign({},DEF);try{Object.assign(SET,JSON.parse(localStorage.getItem('lh2')))}catch(e){}
const DIFF=[
{n:'Easy',spd:.8,hear:9,sight:26,amb:.1,d:['The Boiled One is slower than your sprint all game','He only hears you up close','The halls are a little brighter']},
{n:'Normal',spd:1,hear:11,sight:34,amb:0,d:['Faster than your walk, slower than your sprint','Hears sprinting from a room away','The way it was meant to be']},
{n:'Hard',spd:1.15,hear:14,sight:42,amb:-.05,d:['Faster than your sprint once you hold all 4 fuses','Sprinting carries far','Darker halls']},
{n:'Nightmare',spd:1.35,hear:18,sight:52,amb:-.1,d:['Faster than your sprint by the second fuse','He hears almost everything','Almost no light. Lockers are your only friend']}];
let scene,cam,ren,clock,en,amb,fl,keys=0,state='menu',started=false,stam=1,yaw=0,pitch=0,bob=0,stepT=0,beatT=0,eStep=0,eventT=15,blackout=0,msgT=0,time=0,H=null,hideT=0,wasCh=false,scareT=0,from='menu',grace=0,lockTry=0,mxn=0,myn=0,bat=1,bot=0,hasKey=false,bats=0,sel='bottle',crouch=0,fovK=1,day=1,RUN=null,wakeT=0,W0=.5,wk=0,HELD={},kick=0,SC=null,nNotes=0,proj=[],noteT=0,dust=null,fon=true,NT=6;
const P={x:0,z:0,noisy:false,hidden:false,lk:null,yaw:0},K={};
const RK='lhrun',loadRun=()=>{try{return JSON.parse(sessionStorage.getItem(RK))}catch(e){return null}},saveRun=r=>{try{r?sessionStorage.setItem(RK,JSON.stringify(r)):sessionStorage.removeItem(RK)}catch(e){}};
const DAYT=['The power failed in the night. Find the fuses.','The halls have moved. He is faster, and he remembers you.','Third day. He knows how you hide.','Fourth day. He is waiting at every door.','The last day. There will not be another.'];
const ease=u=>{u=Math.max(0,Math.min(1,u));return u*u*(3-2*u)};
const LID=[[0,0],[.5,.2],[.9,.03],[1.7,.55],[1.95,.1],[2.8,1],[99,1]],lidK=t=>{for(let i=1;i<LID.length;i++){if(t<=LID[i][0]){const a=LID[i-1],b=LID[i],u=(t-a[0])/(b[0]-a[0]);return a[1]+(b[1]-a[1])*u}}return 1};
const say=(t,ms=3500)=>{const m=$('msg');m.textContent=t;m.style.opacity=1;clearTimeout(msgT);msgT=setTimeout(()=>m.style.opacity=0,ms)};
const save=()=>{try{localStorage.setItem('lh2',JSON.stringify(SET))}catch(e){}};
const fmt=t=>Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');
const show=id=>$(id).classList.remove('hidden'),hide_=id=>$(id).classList.add('hidden');
function apply(){const D=DIFF[SET.diff];if(amb)Level.safe=!!SET.safe;amb.intensity=Math.max(.025,.12+D.amb*.5);Aud.vol=SET.vol;Aud.setVol(SET.vol);Aud.cm=SET.cmus;$('grain').style.display=SET.grain?'':'none';
 const dn=$('dName');if(dn){dn.textContent='Difficulty - '+D.n;$('dBox').innerHTML=`<h4>Difficulty: ${D.n}</h4><ul>${D.d.map(x=>`<li>${x}</li>`).join('')}</ul>`}}
function buildOpts(){const cb=(k,t)=>`<label class="cb"><input type="checkbox" data-k="${k}"><i></i><span>${t}</span></label>`,sl=(k,t,a,b,s)=>`<label class="sl"><span>${t}</span><input type="range" data-k="${k}" min="${a}" max="${b}" step="${s}"></label>`;
 $('optBox').innerHTML=`<div class="col"><h3>General</h3><div class="cbs">${cb('grain','Film grain')}${cb('bob','Head bob')}${cb('cmus','Chase music')}${cb('invy','Invert Y')}${cb('hints','Prompts')}${cb('safe','Reduce flashing (photosensitivity)')}</div>
 <h3>Audio &amp; View</h3>${sl('vol','Audio volume',0,1,.05)}${sl('sens','Mouse sensitivity',.4,2.5,.05)}${sl('fov','Field of view',60,100,1)}</div>
 <div class="col"><div id="dName"></div>${sl('diff','',0,3,1)}<div id="dBox"></div><button class="rs" id="rs">Reset to defaults</button></div>`;
 const bind=()=>document.querySelectorAll('[data-k]').forEach(e=>{const k=e.dataset.k;if(e.type==='checkbox')e.checked=!!SET[k];else e.value=SET[k];
  e.oninput=()=>{SET[k]=e.type==='checkbox'?e.checked:+e.value;save();apply()}});bind();$('rs').onclick=()=>{SET=Object.assign({},DEF);save();bind();apply()}}
function init(){
 scene=new THREE.Scene();scene.background=new THREE.Color(0x020101);scene.fog=new THREE.FogExp2(0x020101,.115);
 cam=new THREE.PerspectiveCamera(72,innerWidth/innerHeight,.05,80);cam.rotation.order='YXZ';
 ren=new THREE.WebGLRenderer({canvas:$('gl'),antialias:true});ren.setPixelRatio(Math.min(devicePixelRatio,1.5));ren.setSize(innerWidth,innerHeight);
 amb=new THREE.AmbientLight(0x2a2018,.12);scene.add(amb);
 fl=new THREE.SpotLight(0xffdfae,1.9,22,.5,.6,1.5);cam.add(fl);fl.position.set(0,0,0);const tg=new THREE.Object3D();tg.position.set(0,0,-1);cam.add(tg);fl.target=tg;scene.add(cam);
 Level.build(scene);P.x=Level.start.x;P.z=Level.start.z;yaw=Level.start.yaw;HELD=Props.held();for(const k in HELD){HELD[k].visible=false;HELD[k].position.set(.27,-.27,-.52);cam.add(HELD[k])}en=new Enemy(scene,Level.enemyStart);clock=new THREE.Clock();Menu3D.init();initDust();buildOpts();apply();
 addEventListener('resize',()=>{cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();ren.setSize(innerWidth,innerHeight)});
 addEventListener('keydown',e=>{K[e.code]=1;if(e.code==='Escape'&&state==='pause'&&!$('pause').classList.contains('hidden'))return resume();if(state!=='play')return;
  if(e.code==='KeyF'&&!H){fon=!fon;Aud.tone(fon&&bat>0?1200:700,.05,'square',.1)}if(e.code==='KeyG'&&!H)throwBottle();if(e.code==='KeyE')interact();if((e.code==='KeyQ'||e.code==='Space')&&!H){e.preventDefault();dropItem()}if(e.code==='KeyR'&&!H)useBattery();if(e.code==='Digit1')selItem('bottle');if(e.code==='Digit2')selItem('battery');if(e.code==='Digit3')selItem('key');if(e.code==='ControlLeft'||e.code==='ControlRight')e.preventDefault();if(e.code==='KeyP')pause()});
 addEventListener('keyup',e=>K[e.code]=0);
 addEventListener('wheel',e=>{if(state!=='play'||H)return;const a=['bottle','battery','key'].filter(t=>cnt(t)>0);if(a.length<2)return;const i=a.indexOf(sel);sel=a[(i+(e.deltaY>0?1:a.length-1))%a.length];hud()},{passive:true});
 addEventListener('mousemove',e=>{mxn=e.clientX/innerWidth-.5;myn=e.clientY/innerHeight-.5;if(document.pointerLockElement&&state==='play'){yaw-=e.movementX*.0022*SET.sens;pitch=Math.max(-1.4,Math.min(1.4,pitch+(SET.invy?1:-1)*e.movementY*.0022*SET.sens))}});
 document.addEventListener('pointerdown',()=>{if(!Aud.ctx){Aud.init();apply()}},{once:true});
 document.addEventListener('click',()=>{if((state==='play'||state==='wake')&&!document.pointerLockElement)lock()});
 document.addEventListener('pointerlockchange',()=>{if(document.pointerLockElement)hide_('lockhint');else if(state==='play'&&performance.now()>grace)pause()});
 const away=()=>{Aud.fade(false);pause()};
 document.addEventListener('visibilitychange',()=>document.hidden?away():Aud.fade(true));addEventListener('blur',away);addEventListener('focus',()=>{if(!document.hidden)Aud.fade(true)});
 document.querySelectorAll('.gb').forEach(b=>b.addEventListener('mouseenter',()=>{if(Aud.ctx&&Aud.ctx.state==='running')Aud.tone(170,.08,'sine',.08)}));
 $('start').onclick=begin;$('mSet').onclick=()=>openSet('menu');$('pRes').onclick=resume;
 $('mHow').onclick=()=>{hide_('menu');show('how')};$('hBack').onclick=()=>{hide_('how');show('menu')};
 $('sBack').onclick=()=>{hide_('settings');show(from)};$('mQuit').onclick=()=>{show('quit');setTimeout(()=>hide_('quit'),2200)};

 $('dayGo').onclick=begin;$('dayNew').onclick=()=>{saveRun(null);location.reload()};$('pAb').onclick=()=>{saveRun(null);location.reload()};
 RUN=loadRun();if(RUN&&RUN.day>=1&&RUN.day<=MAXD){day=RUN.day;time=RUN.time||0;hide_('menu');$('dayT').textContent='DAY '+day;const left=MAXD-day+1;$('dayP').textContent=(RUN.died?`It found you. ${left} ${left===1?'day':'days'} left. `:'')+DAYT[day-1];show('dayscr')}else RUN=null;
 try{if(!localStorage.getItem('lhw'))show('warn')}catch(e){show('warn')}
 const wok=()=>{try{localStorage.setItem('lhw','1')}catch(e){}hide_('warn')};$('wOk').onclick=wok;$('wSafe').onclick=()=>{SET.safe=true;save();buildOpts();apply();wok()};
 loop()}
function openSet(f){from=f;hide_(f);show('settings')}
function lock(){try{const p=ren.domElement.requestPointerLock();if(p&&p.catch)p.catch(()=>{})}catch(e){}}
function begin(){if(!Aud.ctx){Aud.init();apply()}Aud.fade(true);Aud.level(1);hide_('menu');hide_('dayscr');show('hud');show('lids');started=true;state='wake';wakeT=0;wk=0;W0=RUN?.6:2.8;grace=performance.now()+9000;fon=true;fl.intensity=0;
 if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();$('dayl').textContent='DAY '+day;lock();if(!RUN)show('card');hud()}
const lidSet=o=>{const h=(1-o)*52+'%',c=$('lids').children;c[0].style.height=h;c[1].style.height=h};
function endWake(){const st=Level.start;state='play';wk=9;P.x=st.x;P.z=st.z;yaw=st.yaw;pitch=0;ren.domElement.style.filter='';hide_('lids');grace=performance.now()+1500;if(!document.pointerLockElement)show('lockhint');say(day===1?'Find the fuses.':DAYT[day-1],4500);hud()}
function updWake(dt){wakeT+=dt;const t=wakeT-W0,st=Level.start,n=[-st.s[0],-st.s[1]];en.anim(dt);Props.update(dt,wakeT,P);Level.updLights(st.x,st.z,dt,0,wakeT);updDust(dt);
 const o=t<0?0:lidK(t),sit=ease((t-2.7)/1.5),stand=ease((t-4.2)/1.6);lidSet(o);
 ren.domElement.style.filter=t>5.4?'':`blur(${Math.max(0,(1-o)*9+Math.max(0,1-t/5.4)*5).toFixed(1)}px)`;
 let x=st.bx+n[0]*.4*sit,z=st.bz+n[1]*.4*sit,y=.84+.36*sit;x+=(st.x-x)*stand;z+=(st.z-z)*stand;y+=(1.65-y)*stand;
 const pt=(1.25*(1-sit)+.3*sit)*(1-stand);
 if(t>0&&!(wk&1)){wk|=1;Aud.wake()}if(t>2.7&&!(wk&2)){wk|=2;Aud.rustle()}
 if(t>3.3&&!(wk&4)){wk|=4;const b=$('daybn');b.textContent='DAY '+day;b.classList.remove('show');void b.offsetWidth;b.classList.add('show')}
 if(stand>.9&&!(wk&8)){wk|=8;Aud.tone(1200,.05,'square',.1)}
 if(t>0&&t<4){beatT-=dt;if(beatT<=0){Aud.beat(.7);beatT=.95}}
 fl.intensity=stand>.9?(R()<.15&&!SET.safe?.6:2.1):0;
 cam.position.set(x,y+Math.sin(wakeT*1.4)*.01,z);cam.rotation.set(pt+Math.sin(wakeT*.9)*.03,st.yaw+(1-stand)*.4*Math.sin(wakeT*.6),Math.sin(wakeT*1.3)*.05*(1-stand)+(1-sit)*.05);cam.fov=SET.fov;cam.updateProjectionMatrix();
 $('stamfill').style.width='100%';if(t>5.9)endWake()}
function pause(){if(state!=='play')return;state='pause';for(const k in K)K[k]=0;document.exitPointerLock();$('pFuses').textContent=`DAY ${day}  ·  FUSES ${keys}/4  ·  NOTES ${nNotes}/${NT}`;$('pTime').textContent=fmt(time);hide_('lockhint');show('pause');Aud.level(.25)}
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
const cnt=t=>t==='bottle'?bot:t==='battery'?bats:hasKey?1:0;
function hud(){const set=(id,v)=>{const e=$(id);if(e)e.textContent=v};set('botc',bot);set('batc',bats);set('notc',nNotes);
 if(cnt(sel)<=0){const n=['bottle','battery','key'].find(t=>cnt(t)>0);if(n)sel=n}
 [['botn','bottle'],['batn','battery'],['keyn','key']].forEach(([id,t])=>{const e=$(id);if(!e)return;e.classList.toggle('hidden',cnt(t)<=0);e.classList.toggle('sel',sel===t)})}
function selItem(t){if(cnt(t)>0){sel=t;hud()}}
function useBattery(){if(state!=='play'||H)return;if(bats<=0){say('You have no spare batteries.',2000);return}if(bat>.92){say('Your flashlight is already full.',2200);return}bats--;bat=Math.min(1,bat+.55);Aud.battery();say('Fresh batteries.',2000);hud()}
function dropItem(){if(state!=='play'||H)return;let t=cnt(sel)>0?sel:['bottle','battery','key'].find(x=>cnt(x)>0);if(!t){say('You are not carrying anything to drop.',2000);return}
 const fx=-Math.sin(yaw),fz=-Math.cos(yaw);let x=P.x,z=P.z;for(const d of[.9,.65,.4,.15]){const nx=P.x+fx*d,nz=P.z+fz*d;if(!Level.blocked(nx,nz,.15)&&Level.los(P.x,P.z,nx,nz)){x=nx;z=nz;break}}
 if(t==='bottle')bot--;else if(t==='battery')bats--;else hasKey=false;
 Props.dropItem(t,x,z);kick=1;Aud.tone(180,.08,'sine',.08);say(t==='bottle'?'Dropped a bottle.':t==='battery'?'Dropped a battery.':'Dropped the brass key.',1600);hud()}
function showNote(i){const L=['Day 41. The boiler never stopped. We stopped hearing it. That was the first mistake.','They sent the night watchman down to check the pipes. Nobody saw him come back up. Something did.','Do not run. He hears running. He does not hear breathing, so breathe slowly.','The lockers are safe only because he dislikes the smell. Do not let him watch you climb in.','Four fuses, one for each valve. Someone hid them in the rooms. I think it was me.','The green light means the exit is ready. I never saw green.','If a door is open and you did not open it, he has already been through it.','Throw something. He will go and look. He always goes to look.'],t=L[i%L.length];
 const n=$('note');n.querySelector('p').textContent=t;n.classList.remove('hidden');noteT=Math.min(9,3.5+t.length*.045)}
function takeItem(it){if(it.t==='battery'){if(bats>=3){say("You can't carry any more batteries.",2200);return}bats++;sel='battery';Aud.battery();say('A spare battery. R to use, Q to drop.',2800)}
 else if(it.t==='bottle'){if(bot>=5){say("You can't carry any more.",2200);return}bot++;sel='bottle';Aud.pickup();say('A bottle. G to throw, Q to drop.',3000)}
 else if(it.t==='key'){hasKey=true;sel='key';Aud.keyget();say('A brass key. Something is locked. Q to drop.',3200)}
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
function throwBottle(){if(state!=='play'||H||bot<=0)return;bot--;kick=1;const cp=Math.cos(pitch),f=[-Math.sin(yaw)*cp,Math.sin(pitch),-Math.cos(yaw)*cp];
 const mt=new THREE.Mesh(new THREE.CylinderGeometry(.035,.045,.22,8),new THREE.MeshStandardMaterial({color:0x4a7a4a,transparent:true,opacity:.8,roughness:.2}));mt.position.set(P.x+f[0]*.4,1.5,P.z+f[2]*.4);scene.add(mt);
 proj.push({m:mt,vx:f[0]*12,vy:f[1]*12+1.6,vz:f[2]*12});Aud.tone(300,.1,'sine',.1,200);hud()}
function shatter(x,y,z){Aud.glass(1);en.hearNoise(x,z);const n=10,pg=new THREE.BufferGeometry(),a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=x+(R()-.5)*.3;a[i*3+1]=y+R()*.2;a[i*3+2]=z+(R()-.5)*.3}pg.setAttribute('position',new THREE.BufferAttribute(a,3));
 const pt=new THREE.Points(pg,new THREE.PointsMaterial({map:Props.dot(),color:0x9fd8a8,size:.08,transparent:true,opacity:.9,depthWrite:false}));scene.add(pt);setTimeout(()=>{scene.remove(pt);pg.dispose()},900)}
function initDust(){const n=220,pg=new THREE.BufferGeometry(),a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=(R()-.5)*16;a[i*3+1]=R()*3;a[i*3+2]=(R()-.5)*16}pg.setAttribute('position',new THREE.BufferAttribute(a,3));
 dust=new THREE.Points(pg,new THREE.PointsMaterial({map:Props.dot(),color:0xccbbaa,size:.035,transparent:true,opacity:.5,depthWrite:false}));dust.frustumCulled=false;scene.add(dust)}
function updDust(dt){const a=dust.geometry.attributes.position;for(let i=0;i<a.count;i++){let x=a.getX(i),y=a.getY(i)+dt*.05,z=a.getZ(i);const dx=x-P.x,dz=z-P.z;if(dx>8)x-=16;else if(dx<-8)x+=16;if(dz>8)z-=16;else if(dz<-8)z+=16;if(y>3)y=0;a.setXYZ(i,x,y,z)}a.needsUpdate=true}
function update(dt){
 time+=dt;let mx=(K.KeyD?1:0)-(K.KeyA?1:0),mz=(K.KeyS?1:0)-(K.KeyW?1:0),mv=!H&&(mx||mz),run=false;const D=DIFF[SET.diff];en.cfg=Object.assign({},D,{spd:D.spd*(1+(day-1)*.07),sight:D.sight*(1+(day-1)*.04)});P.yaw=yaw;
 P.hidden=!!H;P.lk=H;if(H){P.crouch=false;crouch=0}
 if(H){hideT+=dt;yaw=H.yaw+Math.max(-.35,Math.min(.35,yaw-H.yaw));pitch=Math.max(-.22,Math.min(.22,pitch))}
 else{const cr=!!(K.KeyC||K.ControlLeft||K.ControlRight);P.crouch=cr;crouch+=((cr?1:0)-crouch)*Math.min(1,dt*10);run=!cr&&K.ShiftLeft&&mv&&stam>0;stam=Math.max(0,Math.min(1,stam+(run?-.25:.15)*dt));if(stam<=0)K.ShiftLeft=0;const sp=cr?1.6:run?5.2:3.1;
  if(mv){const l=Math.hypot(mx,mz);mx/=l;mz/=l;const c=Math.cos(yaw),s=Math.sin(yaw),vx=(mx*c+mz*s)*sp*dt,vz=(-mx*s+mz*c)*sp*dt;
   const stuck=Level.blocked(P.x,P.z,.4);if(stuck||!Level.blocked(P.x+vx,P.z,.4))P.x+=vx;if(stuck||!Level.blocked(P.x,P.z+vz,.4))P.z+=vz;bob+=dt*(run?13:cr?5:8);stepT-=dt;if(stepT<=0){if(!cr)Aud.step(run);stepT=run?.3:cr?.7:.5}}}
 P.noisy=!!(mv&&run);en.update(dt,P,keys);Props.update(dt,time,P);
 const ch=en.state==='chase';if(ch!==wasCh){wasCh=ch;Aud.chase(ch);if(ch)say('RUN.',1200)}
 const d=en.dist,fear=Math.max(0,1-d/18);
 if(en.found||(d<1.15&&!H&&en.state!=='patrol'||d<.9&&!H)){en.found=false;scare();return}
 if(d<16){eStep-=dt;if(eStep<=0){Aud.thud(1-d/16);eStep=ch?.4:.8}}
 const bs=SET.bob?1:0;if(H)cam.position.set(H.cx-H.nx*.08,1.55+Math.sin(time*1.6)*.004,H.cz-H.nz*.08);
 else{cam.position.set(P.x,1.65-.6*crouch+Math.sin(bob)*(run?.07:.04)*bs*(1-.6*crouch),P.z);const sh=fear>.5?(fear-.5)*.02:0;cam.position.x+=(R()-.5)*sh;cam.position.z+=(R()-.5)*sh}
 cam.rotation.set(pitch,yaw,Math.sin(bob*.5)*.01*(mv?bs:0));fovK+=((ch&&!H?1.3:1)-fovK)*Math.min(1,dt*6);cam.fov=Math.min(160,(H?58:SET.fov)*fovK-(ch?0:fear*8));cam.updateProjectionMatrix();
 if(fon&&!H&&bat>0){const b0=bat;bat=Math.max(0,bat-dt/210);if(b0>0&&bat<=0){say('The flashlight dies.',2500);Aud.dead()}}let fi=2.1;if(SET.safe){fi*=1-fear*.3;if(bat<.2)fi*=.6}else{if(fear>.3&&R()<fear*.35)fi=R()*.8;if(bat<.2&&bat>0&&R()<.1+(.2-bat)*1.5)fi*=.25}if(bat<=0||!fon)fi=0;if(blackout>0){blackout-=dt;fi=0}fl.intensity=H?0:fi;
 if(H)Level.lockLight.intensity=blackout>0?0:.3+fear*.3*(R()<.3?1:.4);
 Level.updLights(P.x,P.z,dt,blackout,time);updDust(dt);updHeld(dt,mv,run);
 for(let i=proj.length-1;i>=0;i--){const p=proj[i],q=p.m;p.vy-=14*dt;const nx=q.position.x+p.vx*dt,ny=q.position.y+p.vy*dt,nz=q.position.z+p.vz*dt;if(ny<.06||ny>Level.H||Level.wall(nx,nz)||Level.hitCol(nx,nz)){shatter(q.position.x,Math.max(.06,q.position.y),q.position.z);scene.remove(q);proj.splice(i,1);continue}q.position.set(nx,ny,nz);q.rotation.x+=dt*14;q.rotation.z+=dt*9}
 if(noteT>0){noteT-=dt;if(noteT<=0)$('note').classList.add('hidden')}
 $('batfill').style.width=bat*100+'%';$('batfill').style.background=bat<.2?'#a31616':'';
 beatT-=dt;if(fear>.15&&beatT<=0){Aud.beat(Math.min(1,fear*1.4));beatT=1.1-fear*.7}Aud.setHum(fear*.35,fear);
 $('vig').style.opacity=.75+fear*.25;$('chasefx').style.opacity=ch?.55+Math.sin(time*(SET.safe?3:9))*(SET.safe?.1:.25):0;
 eventT-=dt;if(eventT<=0){eventT=15+R()*25;if(R()<.5){blackout=1.2;Aud.bang()}else Aud.creak()}
 let pr='';if(H)pr=hideT>.8?'[E] LEAVE LOCKER':'';else{
  const x=Level.xd,xd=Math.hypot(x.x-P.x,x.z-P.z);if(x.open&&x.t>.8&&xd<1.3){$('flash').style.background='#fff';$('flash').style.opacity=1;state='won';setTimeout(()=>{$('flash').style.opacity=0;over(true)},900);return}
  const tg=target();pr=tg?tg.label:''}
 $('prompt').textContent=SET.hints?pr:'';$('stamfill').style.width=stam*100+'%'}
function updHeld(dt,mv,run){const t=!H&&state==='play'&&cnt(sel)>0?sel:null;for(const k in HELD)HELD[k].visible=k===t;if(!t)return;kick=Math.max(0,kick-dt*3.2);const h=HELD[t],bs=SET.bob&&mv?1:0;
 h.position.set(.27+Math.sin(bob*.5)*.01*bs,-.27+Math.abs(Math.sin(bob))*.014*bs-kick*.3-crouch*.02,-.52+kick*.16);h.rotation.set(-.35-kick*1.2,.5+Math.sin(time*.7)*.03,.15+Math.sin(time*1.1)*.02)}
function scare(){state='scare';scareT=0;en.state='scare';for(const k in HELD)HELD[k].visible=false;hide_('hud');const g=en.g.position,dx=g.x-P.x,dz=g.z-P.z,dd=Math.hypot(dx,dz);let ux,uz;
 if(H){ux=H.nx;uz=H.nz}else if(dd>.05){ux=dx/dd;uz=dz/dd}else{ux=-Math.sin(yaw);uz=-Math.cos(yaw)}
 SC={ux,uz,H:!!H,y0:H?1.55:1.65};
 if(H){SC.ex=P.x+ux*1.8;SC.ez=P.z+uz*1.8;SC.d=1.8;H.open=true;hide_('lockerfx');Aud.muffle(false);Level.lockLight.intensity=.8}else{SC.ex=g.x;SC.ez=g.z;SC.d=Math.max(.6,dd)}
 g.set(SC.ex,0,SC.ez);en.g.rotation.y=Math.atan2(-ux,-uz);pitch=.05;show('killfx');$('killfx').style.background='transparent';
 Aud.scream();Aud.kill();Aud.chase(false);Aud.setHum(0,0);$('flash').style.background=SET.safe?'#300':'#fff';$('flash').style.opacity=SET.safe?.6:1;$('msg').style.opacity=0;document.exitPointerLock()}
function updScare(dt){scareT+=dt;const t=scareT;en.anim(dt);Props.update(dt,time,P);
 /* 1) he lunges  2) you are knocked down, looking up at him  3) hard cut to his face  4) the world closes in */
 const cut=!SET.safe&&t>.9&&t<1.12,tgt=t<.3?.85:cut?.36:t<1.5?.62:.5;SC.d+=(tgt-SC.d)*Math.min(1,dt*(cut?60:t<.3?16:6));
 if(SC.H){P.x=SC.ex-SC.ux*SC.d;P.z=SC.ez-SC.uz*SC.d}else en.g.position.set(P.x+SC.ux*SC.d,0,P.z+SC.uz*SC.d);
 en.pv.rotation.x=.25+Math.min(1,t/.8)*.75;en.pv.rotation.z=(R()-.5)*.25*Math.min(1,t*3);en.light.intensity=SET.safe?3:2+R()*3;
 let dy=Math.atan2(-SC.ux,-SC.uz)-yaw;dy=Math.atan2(Math.sin(dy),Math.cos(dy));yaw+=dy*Math.min(1,dt*18);
 const fall=ease((t-.25)/.75),cy=SC.y0*(1-fall)+.4*fall,tp=Math.atan2(2.15-cy,SC.d);pitch=t<.2?.08:.08+(tp-.08)*ease((t-.15)/.5);
 const shk=(t<.3?.02:.07)*(t<2.1?1:Math.max(0,(2.5-t)/.4));let back=.45*fall;const bx=P.x-SC.ux*back,bz=P.z-SC.uz*back;if(Level.wall(bx,bz))back=0;
 cam.position.set(P.x-SC.ux*back+(R()-.5)*shk,cy+(R()-.5)*shk,P.z-SC.uz*back+(R()-.5)*shk);
 cam.rotation.set(pitch,yaw,ease((t-.3)/.6)*.5+(R()-.5)*.07*Math.min(1,t*2));
 cam.fov=t<.3?72-28*(t/.3):cut?30:t<.9?44+56*ease((t-.3)/.6):100-(Math.min(t,2.4)-1.12)*30;cam.updateProjectionMatrix();
 const f=$('flash');let fo=0,bg='#700';if(t<.18){fo=(SET.safe?.5:1)*(1-t/.18);bg=SET.safe?'#400':'#fff'}else if(cut){fo=.95;bg='#fff'}else if(t<2&&R()<.1&&!SET.safe)fo=.45;f.style.background=bg;f.style.opacity=fo;
 ren.domElement.style.filter=(!SET.safe&&t>.3&&t<2.2&&R()<.07)?'invert(1) contrast(1.8)':`contrast(1.4) saturate(${(.7-Math.min(.5,t*.3)).toFixed(2)}) blur(${Math.max(0,(t-1.2)*3).toFixed(1)}px)`;
 const r=Math.max(0,100-Math.max(0,t-.5)/1.9*105);$('killfx').style.background=t>2.45?'#000':`radial-gradient(circle at 50% 45%,rgba(0,0,0,0) ${r}%,rgba(45,0,0,.85) ${r+14}%,#000 ${r+34}%)`;
 if(t>3.1){f.style.opacity=0;over(false)}}
function over(w){state=w?'won':'dead';document.exitPointerLock();hide_('hud');hide_('lockerfx');hide_('killfx');ren.domElement.style.filter='';$('flash').style.opacity=0;const st=`FUSES ${keys}/4 · NOTES ${nNotes}/${NT} · TIME ${fmt(time)}`;
 /* Granny rules: getting caught costs you a day. Survive the five days and you are out; escape on any day and you win. */
 if(!w&&day<MAXD){saveRun({day:day+1,time,died:1});location.reload();return}
 if(w)saveRun(null);else saveRun(null);show('over');
 $('overT').textContent=w?'YOU ESCAPED':'THE FIFTH DAY IS OVER';$('overP').textContent=w?(day===1?'On the very first day. He will not forgive that.':`On day ${day}. The halls fall silent. For now.`):'Five days. He has you now.';$('overS').textContent=`DAY ${day} · `+st;
 const b=$('overBtn');b.textContent=w?'Again':'Start over from day 1';b.onclick=()=>{saveRun(null);location.reload()}}
function loop(){requestAnimationFrame(loop);const dt=Math.min(clock.getDelta(),.05);
 if(!started){Menu3D.update(dt,mxn,myn);ren.render(Menu3D.scene,Menu3D.cam)}
 else{if(state==='play')update(dt);else if(state==='scare')updScare(dt);else if(state==='wake')updWake(dt);ren.render(scene,cam)}}
init();
})();
