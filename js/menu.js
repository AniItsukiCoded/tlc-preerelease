const Menu3D={t:0,blink:0,next:7,
init(){const s=this.scene=new THREE.Scene();s.background=new THREE.Color(0x020202);s.fog=new THREE.FogExp2(0x050303,.07);
 const c=this.cam=new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.05,60);c.rotation.order='YXZ';
 const tw=Level.paper(),tf=Level.planks('#33241a',1),tc=Level.planks('#1a130e',1);tw.repeat.set(9,1);tf.repeat.set(1.5,9);tc.repeat.set(1.5,9);
 const M=THREE.MeshStandardMaterial,pl=(w,h,t,x,y,z,rx,ry)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new M({map:t,roughness:.9}));m.position.set(x,y,z);m.rotation.set(rx,ry,0);s.add(m)};
 pl(44,3.2,tw,-1.6,1.6,-16,0,Math.PI/2);pl(44,3.2,tw,1.6,1.6,-16,0,-Math.PI/2);pl(3.2,44,tf,0,0,-16,-Math.PI/2,0);pl(3.2,44,tc,0,3.2,-16,Math.PI/2,0);
 const dm=new M({color:0x16130f,roughness:.8});[[-1.56,-4],[-1.56,-9.5],[1.56,-6.5],[1.56,-13]].forEach(([x,z])=>{const d=new THREE.Mesh(new THREE.BoxGeometry(.08,2.3,1.1),dm);d.position.set(x,1.15,z);s.add(d)});
 this.mon=buildBoiled();this.mon.position.set(0,0,-12);s.add(this.mon);
 s.add(new THREE.AmbientLight(0x1a1a22,.5));this.l1=new THREE.PointLight(0xffb070,1.3,15);this.l1.position.set(0,3,-1);s.add(this.l1);
 this.l2=new THREE.PointLight(0xffa060,1,10);this.l2.position.set(0,2.9,-8);s.add(this.l2);this.l3=new THREE.PointLight(0xff1a1a,.6,8);this.l3.position.set(0,2.6,-9.6);s.add(this.l3);
 const n=160,pg=new THREE.BufferGeometry(),a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=(Math.random()-.5)*2.8;a[i*3+1]=Math.random()*3;a[i*3+2]=-Math.random()*22+3}
 pg.setAttribute('position',new THREE.BufferAttribute(a,3));this.dust=new THREE.Points(pg,new THREE.PointsMaterial({map:Props.dot(),color:0xccbbaa,size:.04,transparent:true,opacity:.6,depthWrite:false}));s.add(this.dust);
 addEventListener('resize',()=>{c.aspect=innerWidth/innerHeight;c.updateProjectionMatrix()})},
update(dt,mx,my){this.t+=dt;const t=this.t,a=this.dust.geometry.attributes.position;for(let i=0;i<a.count;i++){let y=a.getY(i)+dt*.04;if(y>3)y=0;a.setY(i,y)}a.needsUpdate=true;
 this.next-=dt;if(this.next<=0&&!this.blink){this.blink=.5;this.next=7+Math.random()*6}
 if(this.blink>0){this.blink-=dt;this.l1.intensity=this.l2.intensity=this.l3.intensity=0;if(this.blink<=0){this.mon.position.z=this.mon.position.z<-6.5?this.mon.position.z+1.7:-12}}
 else if(Level.safe){this.l1.intensity=1.2;this.l2.intensity=.9;this.l3.intensity=.55}else{this.l1.intensity=Math.random()<.03?.2:1.3;this.l2.intensity=Math.random()<.05?.1:1;this.l3.intensity=.5+Math.random()*.3}
 this.mon.rotation.z=Math.sin(t*1.3)*.04;this.mon.rotation.x=Math.sin(t*.9)*.03;
 const c=this.cam;c.position.set(mx*.3,1.6+Math.sin(t*.8)*.02,3);c.rotation.set(-my*.03,-mx*.07+Math.sin(t*.3)*.01,0)}};
