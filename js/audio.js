const Aud={ctx:null,vol:.8,cOn:false,n:0,
init(){const c=this.ctx=new(window.AudioContext||window.webkitAudioContext)(),mk=(t,f)=>{const o=c.createOscillator();o.type=t;o.frequency.value=f;return o};
 this.out=c.createGain();this.out.gain.value=this.vol;this.mf=c.createBiquadFilter();this.mf.type='lowpass';this.mf.frequency.value=22000;this.m=c.createGain();this.m.connect(this.mf);this.mf.connect(this.out);this.out.connect(c.destination);
 const b=c.createBuffer(1,c.sampleRate*2,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;this.nb=b;
 const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=140;const dg=c.createGain();dg.gain.value=.22;lp.connect(dg);dg.connect(this.m);
 [41,43.2,61.5].forEach(f=>{const o=mk('sawtooth',f);o.connect(lp);o.start()});
 const l=mk('sine',.07),lg=c.createGain();lg.gain.value=60;l.connect(lg);lg.connect(lp.frequency);l.start();
 this.hum=c.createGain();this.hum.gain.value=0;const ho=this.ho=mk('triangle',82),hf=c.createBiquadFilter();hf.type='bandpass';hf.frequency.value=300;ho.connect(hf);hf.connect(this.hum);this.hum.connect(this.m);ho.start();
 // chase layer
 this.cg=c.createGain();this.cg.gain.value=0;const cl=c.createBiquadFilter();cl.type='lowpass';cl.frequency.value=1500;cl.connect(this.cg);this.cg.connect(this.m);
 [['sawtooth',110,.5],['sawtooth',116.5,.5],['square',233,.1],['sawtooth',880,.05]].forEach(([t,f,v],i)=>{const o=mk(t,f),g=c.createGain();g.gain.value=v;o.connect(g);g.connect(cl);o.start();if(i===3){const lf=mk('sine',5.5),lg2=c.createGain();lg2.gain.value=40;lf.connect(lg2);lg2.connect(o.frequency);lf.start()}});
 setInterval(()=>this.tick(),330)},
tick(){if(!this.cOn||this.ctx.state!=='running')return;this.n++;this.tone(62,.2,'sine',.9,36);if(this.n%2)this.noise(.08,.25,3000,'highpass');if(this.n%4===3)this.tone(300+Math.random()*50,.25,'sawtooth',.06,160)},
chase(on){on=on&&this.cm!==false;this.cOn=on;const t=this.ctx.currentTime;this.cg.gain.setTargetAtTime(on?.38:0,t,on?.15:1.2);if(on){this.tone(95,.9,'sawtooth',.4,320);this.noise(.7,.8,2800,'bandpass')}},
muffle(on){this.mf.frequency.setTargetAtTime(on?600:22000,this.ctx.currentTime,.12)},
level(k){this.k=k;if(this.ctx)this.out.gain.setTargetAtTime(this.vol*k,this.ctx.currentTime,.15)},
fade(on){if(!this.ctx)return;const c=this.ctx;clearTimeout(this.sus);if(on){c.resume();this.out.gain.setTargetAtTime(this.vol*(this.k||1),c.currentTime,.4)}else{this.out.gain.setTargetAtTime(0,c.currentTime,.25);this.sus=setTimeout(()=>c.suspend(),900)}},
setVol(v){this.vol=v;if(this.out)this.out.gain.value=v*(this.k||1)},
tone(f,d,type='sine',v=.3,f2){const c=this.ctx,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,c.currentTime);if(f2)o.frequency.exponentialRampToValueAtTime(f2,c.currentTime+d);g.gain.setValueAtTime(v,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+d);o.connect(g);g.connect(this.m);o.start();o.stop(c.currentTime+d)},
noise(d,v,fr,type='lowpass'){const c=this.ctx,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=this.nb;f.type=type;f.frequency.value=fr;g.gain.setValueAtTime(v,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+d);s.connect(f);f.connect(g);g.connect(this.m);s.start(0,Math.random());s.stop(c.currentTime+d)},
step(r){this.noise(.12,r?.35:.2,r?420:260)},
thud(v){this.tone(48,.25,'sine',.9*v,28);this.noise(.15,.3*v,120)},
beat(v){this.tone(55,.18,'sine',.7*v,35);setTimeout(()=>this.tone(48,.2,'sine',.5*v,30),170)},
pickup(){this.tone(660,.5,'sine',.25);setTimeout(()=>this.tone(990,.7,'sine',.2),120);setTimeout(()=>this.tone(1320,.9,'sine',.12),260)},
bang(){this.noise(.6,1,300);this.tone(70,.6,'square',.4,30)},
creak(){this.tone(180+Math.random()*80,.9,'sawtooth',.05,90+Math.random()*60)},
locker(){this.noise(.25,.5,900);this.tone(140,.35,'sawtooth',.08,70)},
door(){this.tone(50,2.6,'sawtooth',.25,38);this.noise(2.4,.35,500)},
scream(){this.noise(1.6,.9,2500,'bandpass');this.tone(900,1.5,'sawtooth',.5,300);this.tone(1350,1.5,'square',.25,420)},
dopen(v=1){this.noise(.5,.28*v,700,'bandpass');this.tone(120+Math.random()*30,.6,'sawtooth',.06*v,80)},
dclose(v=1){this.noise(.18,.5*v,500);this.tone(70,.2,'sine',.4*v,40)},
glass(v=1){this.noise(.4,.7*v,6000,'highpass');[2400,3100,1900].forEach((f,i)=>setTimeout(()=>this.tone(f,.25,'triangle',.08*v,f*.6),i*40))},
battery(){this.tone(420,.12,'square',.12);setTimeout(()=>this.tone(630,.2,'square',.1),90)},
keyget(){[1200,1600,2100].forEach((f,i)=>setTimeout(()=>this.tone(f,.35,'triangle',.12),i*70))},
paper(){this.noise(.3,.25,3000,'highpass')},
dead(){this.tone(220,.18,'square',.1,80)},
locked(){this.tone(110,.12,'square',.14);setTimeout(()=>this.tone(90,.14,'square',.14),110)},
setHum(v,f){if(!this.ctx)return;this.hum.gain.value=v;this.ho.frequency.value=70+f*30}};
