const Level={S:3,H:3.2,W:43,D:43,g:[],doors:[],dmap:{},col:[],rooms:[],items:[],keys:[],src:[],pool:[],lockers:[],fuses:[],lamps:[],_lt:0,
rnd(){return Math.random()},
paper(){const N=512,c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d'),wy=N*.66;
 x.fillStyle='#3f3a2c';x.fillRect(0,0,N,N);
 for(let i=0;i<N;i+=32){x.fillStyle=(i/32)%2?'rgba(10,8,4,.30)':'rgba(130,112,70,.10)';x.fillRect(i,0,16,wy)}
 for(let y=20;y<wy-10;y+=44)for(let X=16;X<N;X+=32){const o=((X-16)/32)%2?22:0;x.fillStyle='rgba(12,8,4,.38)';x.beginPath();x.arc(X,y+o,4,0,6.3);x.fill();x.fillRect(X-1,y+o-12,2,8)}
 /* water stains running down from the ceiling */
 for(let i=0;i<7;i++){const px=Math.random()*N,w=14+Math.random()*50,h=60+Math.random()*180,g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(12,8,2,.5)');g.addColorStop(1,'rgba(12,8,2,0)');x.fillStyle=g;x.fillRect(px,0,w,h)}
 /* dark wood wainscot */
 x.fillStyle='#24170e';x.fillRect(0,wy,N,N-wy);
 for(let i=0;i<8;i++){x.fillStyle='rgba(0,0,0,.55)';x.fillRect(i*64,wy,3,N-wy);x.fillStyle=`rgba(${Math.random()*40|0},${Math.random()*20|0},0,.25)`;x.fillRect(i*64+3,wy,61,N-wy)}
 for(let i=0;i<260;i++){x.strokeStyle=`rgba(0,0,0,${.1+Math.random()*.15})`;x.beginPath();const X=Math.random()*N,Y=wy+Math.random()*(N-wy);x.moveTo(X,Y);x.lineTo(X+(Math.random()-.5)*4,Y+8+Math.random()*30);x.stroke()}
 x.fillStyle='#120a05';x.fillRect(0,wy-8,N,12);x.fillStyle='rgba(170,125,70,.28)';x.fillRect(0,wy-8,N,2);x.fillStyle='#0f0804';x.fillRect(0,N-26,N,26);x.fillStyle='rgba(170,125,70,.12)';x.fillRect(0,N-26,N,2);
 for(let i=0;i<30000;i++){const v=Math.random()*70|0;x.fillStyle=`rgba(${v},${v},${v},.1)`;x.fillRect(Math.random()*N,Math.random()*N,1,1)}
 const blob=(px,py,r,col)=>{for(const ox of[-N,0,N]){const X=px+ox,gr=x.createRadialGradient(X,py,0,X,py,r);gr.addColorStop(0,col);gr.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gr;x.fillRect(X-r,py-r,r*2,r*2)}};
 for(let i=0;i<14;i++)blob(Math.random()*N,Math.random()*N,30+Math.random()*80,Math.random()<.6?'rgba(5,3,0,.35)':'rgba(30,45,25,.16)');
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;return t},
planks(base,rep){const N=512,c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d');x.fillStyle=base;x.fillRect(0,0,N,N);const nb=8,bh=N/nb;
 for(let i=0;i<nb;i++){const v=(Math.random()-.5)*40;x.fillStyle=v>0?`rgba(255,215,160,${v/300})`:`rgba(0,0,0,${-v/150})`;x.fillRect(0,i*bh,N,bh);
  for(let k=0;k<70;k++){x.strokeStyle=`rgba(0,0,0,${.05+Math.random()*.12})`;x.lineWidth=1;const y=i*bh+3+Math.random()*(bh-6);x.beginPath();x.moveTo(0,y);x.bezierCurveTo(N*.3,y+(Math.random()-.5)*5,N*.6,y+(Math.random()-.5)*5,N,y+(Math.random()-.5)*2);x.stroke()}
  x.fillStyle='rgba(0,0,0,.8)';x.fillRect(Math.random()*N,i*bh,3,bh);
  if(Math.random()<.45){const kx=Math.random()*N,ky=i*bh+bh/2;for(let r=9;r>2;r-=2){x.strokeStyle=`rgba(0,0,0,${.12+(9-r)*.05})`;x.beginPath();x.ellipse(kx,ky,r*1.6,r*.8,0,0,6.3);x.stroke()}}
  x.fillStyle='rgba(0,0,0,.8)';x.fillRect(0,i*bh,N,3)}
 for(let i=0;i<24000;i++){const v=Math.random()*60|0;x.fillStyle=`rgba(${v},${v},${v},.1)`;x.fillRect(Math.random()*N,Math.random()*N,1+(Math.random()<.2?1:0),1)}
 for(let i=0;i<9;i++){const px=Math.random()*N,py=Math.random()*N,r=40+Math.random()*90,gr=x.createRadialGradient(px,py,0,px,py,r);gr.addColorStop(0,'rgba(8,3,0,.45)');gr.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gr;x.fillRect(px-r,py-r,r*2,r*2)}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep,rep);t.anisotropy=8;return t},
tex(base,line,stain,rep){const N=512,c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d');x.fillStyle=base;x.fillRect(0,0,N,N);
 /* fine grain, 1px, so close-up surfaces do not show big square blotches */
 for(let i=0;i<26000;i++){const v=Math.random()*60|0;x.fillStyle=`rgba(${v},${v},${v},.12)`;x.fillRect(Math.random()*N,Math.random()*N,1+(Math.random()<.2?1:0),1)}
 /* soft low-frequency mottling, drawn wrapped so the tile has no seams */
 const blob=(px,py,r,col)=>{for(const ox of[-N,0,N])for(const oy of[-N,0,N]){const X=px+ox,Y=py+oy;if(X+r<0||X-r>N||Y+r<0||Y-r>N)continue;const gr=x.createRadialGradient(X,Y,0,X,Y,r);gr.addColorStop(0,col);gr.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gr;x.fillRect(X-r,Y-r,r*2,r*2)}};
 for(let i=0;i<10;i++)blob(Math.random()*N,Math.random()*N,50+Math.random()*90,Math.random()<.5?'rgba(0,0,0,.07)':'rgba(255,255,255,.03)');
 for(let i=0;i<stain;i++)blob(Math.random()*N,Math.random()*N,40+Math.random()*100,'rgba(20,10,5,.4)');
 if(line){x.strokeStyle='rgba(0,0,0,.6)';x.lineWidth=6;x.beginPath();x.moveTo(0,0);x.lineTo(N,0);x.moveTo(0,N);x.lineTo(N,N);x.moveTo(0,0);x.lineTo(0,N);x.moveTo(N,0);x.lineTo(N,N);x.moveTo(N/2,0);x.lineTo(N/2,N);x.moveTo(0,N/2);x.lineTo(N,N/2);x.stroke()}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep,rep);t.anisotropy=8;return t},
pass(x,z){const r=this.g[z];if(!r)return false;const v=r[x];if(v===0)return true;if(v===2){const d=this.dmap[x+','+z];return !!d&&!d.locked}return false},
gen(nocut){const W=this.W,D=this.D,S=this.S,R=Math.random,g=this.g=Array.from({length:D},()=>Array(W).fill(1)),L=[1,11,21,31,41],dirs=[[1,0],[-1,0],[0,1],[0,-1]];
 const rs=this.roomOf=Array.from({length:D},()=>Array(W).fill(-1));this.rooms=[];this.doors=[];this.dmap={};this.items=[];this.col=[];
 for(const a of L)for(let i=1;i<=41;i++){g[i][a]=0;g[a][i]=0}
 if(!nocut)for(let k=1;k<4;k++){const a=L[k];for(let j=0;j<4;j++){if(R()<.2)for(let i=L[j]+1;i<L[j+1];i++)g[i][a]=1;if(R()<.2)for(let i=L[j]+1;i<L[j+1];i++)g[a][i]=1}}
 const room=(x0,z0,x1,z1)=>{const id=this.rooms.length;this.rooms.push({id,x0,z0,x1,z1,doors:[]});for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++){g[z][x]=0;rs[z][x]=id}};
 const split=(x0,z0,x1,z1,dp)=>{const w=x1-x0+1,h=z1-z0+1,cv=w>=7,ch=h>=7;
  if((cv||ch)&&R()<(dp?.4:.7)){if(cv&&(!ch||R()<.5)){const m=x0+((w-1)>>1);split(x0,z0,m-1,z1,dp+1);split(m+1,z0,x1,z1,dp+1)}else{const m=z0+((h-1)>>1);split(x0,z0,x1,m-1,dp+1);split(x0,m+1,x1,z1,dp+1)}}else room(x0,z0,x1,z1)};
 for(const a of[1,11,21,31])for(const b of[1,11,21,31])if(R()>.08)split(a+2,b+2,a+8,b+8,0);
 const setDoor=(x,z)=>{g[z][x]=2};
 for(const r of this.rooms){const o=[];
  for(let x=r.x0;x<=r.x1;x++){o.push([x,r.z0-1,0,-1,'z']);o.push([x,r.z1+1,0,1,'z'])}
  for(let z=r.z0;z<=r.z1;z++){o.push([r.x0-1,z,-1,0,'x']);o.push([r.x1+1,z,1,0,'x'])}
  const c=o.filter(([x,z,a,b,ax])=>{if(g[z][x]!==1)return false;const X=x+a,Z=z+b;if(X<1||Z<1||X>W-2||Z>D-2||g[Z][X]===1)return false;
   if(ax==='z')return g[z][x-1]===1&&g[z][x+1]===1;return g[z-1][x]===1&&g[z+1][x]===1}).sort(()=>R()-.5);
  const n=1+(R()<.4?1:0)+((r.x1-r.x0+1)*(r.z1-r.z0+1)>=40&&R()<.6?1:0);let k=0;
  for(const[x,z]of c){if(k>=n)break;if(dirs.some(([a,b])=>g[z+b][x+a]===2))continue;setDoor(x,z);k++}}
 const reach=()=>{const d=Array.from({length:D},()=>Array(W).fill(0)),q=[[1,1]];d[1][1]=1;while(q.length){const[x,z]=q.pop();for(const[a,b]of dirs){const X=x+a,Z=z+b;if(g[Z]&&g[Z][X]!==undefined&&g[Z][X]!==1&&!d[Z][X]){d[Z][X]=1;q.push([X,Z])}}}return d};
 for(let it=0;it<90;it++){const r=reach();let un=false;for(let z=0;z<D;z++)for(let x=0;x<W;x++)if(g[z][x]===0&&!r[z][x])un=true;if(!un)break;
  const c=[];for(let z=2;z<D-2;z++)for(let x=2;x<W-2;x++)if(g[z][x]===1){
   if(g[z][x-1]!==1&&g[z][x+1]!==1&&g[z-1][x]===1&&g[z+1][x]===1&&r[z][x-1]!==r[z][x+1])c.push([x,z]);
   else if(g[z-1][x]!==1&&g[z+1][x]!==1&&g[z][x-1]===1&&g[z][x+1]===1&&r[z-1][x]!==r[z+1][x])c.push([x,z])}
  if(!c.length)return false;const[x,z]=c[R()*c.length|0];setDoor(x,z)}
 {const r=reach();for(let z=0;z<D;z++)for(let x=0;x<W;x++)if(g[z][x]===0&&!r[z][x])return false}
 for(let z=0;z<D;z++)for(let x=0;x<W;x++)if(g[z][x]===2){const ax=(g[z][x-1]!==1&&g[z][x+1]!==1)?'x':'z',d={gx:x,gz:z,axis:ax,wx:x*S,wz:z*S,o:0,target:0,locked:false,sw:R()<.5?1:-1,id:this.doors.length};
  this.doors.push(d);this.dmap[x+','+z]=d;(ax==='x'?[[x-1,z],[x+1,z]]:[[x,z-1],[x,z+1]]).forEach(([a,b])=>{const q=rs[b][a];if(q>=0)this.rooms[q].doors.push(d)})}
 const d0=this.bfs(1,1);this.lockRoom=null;
 const lc=this.rooms.filter(r=>r.doors.length===1&&(r.x1-r.x0+1)*(r.z1-r.z0+1)>=9&&d0[(r.z0+r.z1)>>1][(r.x0+r.x1)>>1]>14);
 if(lc.length){const r=lc[R()*lc.length|0];r.doors[0].locked=true;this.lockRoom=r}
 const ndd=(x,z)=>dirs.some(([a,b])=>g[z+b][x+a]===2);
 /* wake-up bed: a random flat wall cell inside a random ordinary room */
 let sc=[];for(const r of this.rooms){if(r===this.lockRoom||(r.x1-r.x0+1)*(r.z1-r.z0+1)<6)continue;
  for(let z=r.z0;z<=r.z1;z++)for(let x=r.x0;x<=r.x1;x++){if(d0[z][x]<0||ndd(x,z))continue;const sd=dirs.filter(([a,b])=>g[z+b][x+a]===1);if(sd.length===1)sc.push([x,z,sd[0]])}}
 if(!sc.length)return false;
 const[sx,sz,ss]=sc[R()*sc.length|0];this.start={cell:[sx,sz],s:ss,x:sx*S-ss[0]*.4,z:sz*S-ss[1]*.4,bx:sx*S+ss[0]*(S/2-.48),bz:sz*S+ss[1]*(S/2-.48),yaw:Math.atan2(ss[0],ss[1])};
 const dist=this.dist=this.bfs(sx,sz),nd=ndd;
 const fl=[];for(let z=0;z<D;z++)for(let x=0;x<W;x++)if(g[z][x]===0&&dist[z][x]>=0)fl.push([x,z]);
 this.walk=[];for(let z=0;z<D;z++)for(let x=0;x<W;x++)if(dist[z][x]>=0)this.walk.push([x,z]);
 let far=null,fd=0;for(const[x,z]of fl)if(dist[z][x]>fd&&Props.side([x,z])&&rs[z][x]<0){fd=dist[z][x];far=[x,z]}
 if(!far)return false;this.exit=far;
 const keys=this.keys=[];if(this.lockRoom){const r=this.lockRoom;keys.push([(r.x0+r.x1)>>1,(r.z0+r.z1)>>1])}
 const pool=fl.filter(c=>dist[c[1]][c[0]]>12&&!(c[0]===sx&&c[1]===sz)&&Math.abs(far[0]-c[0])+Math.abs(far[1]-c[1])>6&&!nd(c[0],c[1])).sort(()=>R()-.5),rp=pool.filter(c=>rs[c[1]][c[0]]>=0);
 for(const c of rp.concat(pool)){if(keys.length>=4)break;if(keys.every(k=>Math.abs(k[0]-c[0])+Math.abs(k[1]-c[1])>9))keys.push(c)}
 if(keys.length<4)return false;
 const used=this.resv=new Set([...keys.map(k=>k.join()),far.join(),[sx,sz].join()]),free=fl.filter(c=>dist[c[1]][c[0]]>3&&!nd(c[0],c[1])).sort(()=>R()-.5);
 const take=(pref,minD)=>{const w=R()<pref;for(const m of[w,!w])for(let i=0;i<free.length;i++){const c=free[i];if((rs[c[1]][c[0]]>=0)===m&&dist[c[1]][c[0]]>=(minD||0)&&!used.has(c.join())){used.add(c.join());free.splice(i,1);return c}}return null};
 const place=(t,c)=>{if(!c)return;const s=Props.side(c);let x=c[0]*S+(R()-.5)*.8,z=c[1]*S+(R()-.5)*.8;if(s){x=c[0]*S+s[0]*1.05+(s[0]?0:(R()-.5)*1.2);z=c[1]*S+s[1]*1.05+(s[1]?0:(R()-.5)*1.2)}this.items.push({t,x,z,a:R()*6.28,taken:false,i:this.items.length})};
 if(this.lockRoom)place('key',take(1,8));
 for(let i=0;i<6;i++)place('note',take(.85,5));for(let i=0;i<9;i++)place('battery',take(.65));for(let i=0;i<7;i++)place('bottle',take(.5));
 this.enemyStart=fl.filter(([x,z])=>dist[z][x]>20).sort(()=>R()-.5)[0]||far;return true},
bfs(sx,sz){const d=Array.from({length:this.D},()=>Array(this.W).fill(-1)),q=[[sx,sz]];d[sz][sx]=0;
 while(q.length){const[x,z]=q.shift();for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const X=x+a,Z=z+b;if(this.pass(X,Z)&&d[Z][X]<0){d[Z][X]=d[z][x]+1;q.push([X,Z])}}}return d},
next(f,t){if(f[0]===t[0]&&f[1]===t[1])return t;const par={},k=c=>c[0]+','+c[1],q=[f];par[k(f)]=null;
 while(q.length){const c=q.shift();if(c[0]===t[0]&&c[1]===t[1])break;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const n=[c[0]+a,c[1]+b];if(this.pass(n[0],n[1])&&!(k(n) in par)){par[k(n)]=c;q.push(n)}}}
 let c=t;if(!(k(c) in par))return f;while(par[k(c)]&&k(par[k(c)])!==k(f))c=par[k(c)];return c},
unlock(d){d.locked=false;const r=this.lockRoom;if(r)for(let z=r.z0;z<=r.z1;z++)for(let x=r.x0;x<=r.x1;x++)this.walk.push([x,z])},
cell(x,z){return[Math.round(x/this.S),Math.round(z/this.S)]},
wp(c){return{x:c[0]*this.S,z:c[1]*this.S}},
wall(x,z){const c=this.cell(x,z),v=this.g[c[1]]&&this.g[c[1]][c[0]];return v===undefined||v===1},
hitCol(x,z){for(const c of this.col)if(!c.off&&x>c.x0&&x<c.x1&&z>c.z0&&z<c.z1)return true;return false},
blocked(x,z,r){if((this.lockers||[]).some(l=>Math.hypot(x-l.cx,z-l.cz)<.55+r*.3))return true;const q=r*.75;for(const c of this.col)if(!c.off&&x>c.x0-q&&x<c.x1+q&&z>c.z0-q&&z<c.z1+q)return true;
 return this.wall(x+r,z+r)||this.wall(x-r,z+r)||this.wall(x+r,z-r)||this.wall(x-r,z-r)},
los(ax,az,bx,bz){const d=Math.hypot(bx-ax,bz-az),n=Math.ceil(d/.5);for(let i=1;i<n;i++){const t=i/n;if(this.wall(ax+(bx-ax)*t,az+(bz-az)*t))return false}
 for(const dr of this.doors){if(dr.o>.4)continue;const X=dr.axis==='x',a=X?ax:az,b=X?bx:bz,p=X?dr.wx:dr.wz;if((a-p)*(b-p)<0){const t=(p-a)/(b-a),lat=X?az+(bz-az)*t:ax+(bx-ax)*t;if(Math.abs(lat-(X?dr.wz:dr.wx))<1.5)return false}}return true},
build(scene){let ok=false;for(let i=0;i<60&&!ok;i++)ok=this.gen(i>35);if(!ok)throw new Error('Level generation failed');
 const S=this.S,H=this.H,W=this.W,D=this.D,g=this.g;this.src=[];this.lockers=[];this.fuses=[];this.lamps=[];
 const wt=this.paper(),ft=this.planks('#33241a',W*S/3),ct=this.planks('#1a130e',W*S/3);
 this.wallMat=new THREE.MeshStandardMaterial({map:wt,roughness:.95});
 const ws=[];for(let z=0;z<D;z++)for(let x=0;x<W;x++)if(g[z][x]===1){let nb=false;for(let a=-1;a<=1&&!nb;a++)for(let b=-1;b<=1;b++){const r=g[z+b];if(r&&r[x+a]!==undefined&&r[x+a]!==1){nb=true;break}}if(nb)ws.push([x,z])}
 const im=new THREE.InstancedMesh(new THREE.BoxGeometry(S,H,S),this.wallMat,ws.length),m=new THREE.Matrix4();ws.forEach(([x,z],i)=>{m.setPosition(x*S,H/2,z*S);im.setMatrixAt(i,m)});scene.add(im);
 const mk=(t,y,rot)=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(W*S,D*S),new THREE.MeshStandardMaterial({map:t,roughness:.9}));p.rotation.x=rot;p.position.set((W-1)*S/2,y,(D-1)*S/2);scene.add(p)};
 mk(ft,0,-Math.PI/2);mk(ct,H,Math.PI/2);
 for(let i=0;i<7;i++){const l=new THREE.PointLight(0xffb070,0,12);scene.add(l);this.pool.push(l)}
 Props.build(scene)},
updLights(px,pz,dt,black,t){const src=this.src,pool=this.pool;this._lt-=dt;const re=this._lt<=0;if(re)this._lt=.25;const cand=this._c||(this._c=[]);cand.length=0;
 for(const s of src){
  if(s.mat){let k=0;if(s.mode!=='d'&&!(black>0)){k=1;if(s.mode==='f'){const w=Math.sin(t*(7+s.ph)+s.ph*5)+Math.sin(t*19+s.ph);if(w>1.35)k=.08;if(this.safe)k=.7+.15*Math.sin(t*1.3+s.ph)}else if(Math.random()<.004&&!this.safe)k=.4}
   s.k=k;if(k!==s.lk){s.lk=k;s.mat.color.copy(s.col).multiplyScalar(s.mode==='d'?.12:.25+.75*k);s.sp.material.opacity=s.mode==='d'?0:.32*k}}
  const dx=s.x-px,dz=s.z-pz,d2=dx*dx+dz*dz;if(d2>324)continue;
  const I=s.I();if(I<=.01)continue;if(re||s.vis===undefined)s.vis=d2<9?true:this.los(px,pz,s.x,s.z);
  s.sc=Math.sqrt(d2)+(s.vis?0:9);cand.push(s)}
 cand.sort((a,b)=>a.sc-b.sc);
 for(let i=0;i<pool.length;i++){const l=pool[i],s=cand[i];if(!s||(black>0&&!s.mat&&s.keep!==true&&false)){l.intensity=0;continue}l.position.set(s.x,s.y,s.z);l.color.copy(s.col);l.distance=s.d;l.intensity=s.I()}}};
