(function(){
  var grid=document.getElementById('grid');
  var tiles=[].slice.call(grid.querySelectorAll('.tile'));
  var chips=[].slice.call(document.querySelectorAll('.chip'));

  chips.forEach(function(chip){
    chip.addEventListener('click',function(){
      var f=chip.getAttribute('data-filter');
      chips.forEach(function(c){c.setAttribute('aria-pressed',c===chip?'true':'false')});
      var n=0;
      tiles.forEach(function(t){
        var show=f==='all'||t.getAttribute('data-cat')===f;
        t.hidden=!show;
        if(show)n++;
      });
      grid.setAttribute('data-n',String(Math.min(n,3)));
    });
  });

  var dlg=document.getElementById('viewer');
  var vImg=document.getElementById('v-img');
  var vTitle=document.getElementById('v-title');
  var vDesc=document.getElementById('v-desc');
  var vStage=document.getElementById('v-stage');
  var vCount=document.getElementById('v-count');
  var vNav=document.getElementById('v-nav');
  var list=[],idx=0,opener=null;

  function show(i){
    var t=list[i],img=t.querySelector('img');
    vImg.src=img.src;
    vImg.alt=img.alt;
    vTitle.textContent=t.querySelector('.name').textContent;
    vDesc.textContent=t.querySelector('.blurb').textContent;
    vStage.style.setProperty('--tint',t.style.getPropertyValue('--tint'));
    vCount.textContent=(i+1)+' of '+list.length;
    vNav.style.display=list.length>1?'':'none';
  }
  function step(d){
    if(list.length<2)return;
    idx=(idx+d+list.length)%list.length;
    show(idx);
  }
  tiles.forEach(function(t){
    t.addEventListener('click',function(){
      opener=t;
      list=tiles.filter(function(x){return !x.hidden});
      idx=list.indexOf(t);
      show(idx);
      if(typeof dlg.showModal==='function')dlg.showModal();else dlg.setAttribute('open','');
    });
  });
  document.getElementById('v-close').addEventListener('click',function(){dlg.close()});
  document.getElementById('v-prev').addEventListener('click',function(){step(-1)});
  document.getElementById('v-next').addEventListener('click',function(){step(1)});
  dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});
  dlg.addEventListener('keydown',function(e){
    if(e.key==='ArrowLeft')step(-1);
    if(e.key==='ArrowRight')step(1);
  });
  dlg.addEventListener('close',function(){if(opener)opener.focus()});

  var copyBtn=document.getElementById('copy');
  var status=document.getElementById('status');
  var timer;
  copyBtn.addEventListener('click',function(){
    var text=document.getElementById('dname').textContent.trim();
    function done(ok){
      status.textContent=ok?'Copied. Paste it into Discord to find me.':'Select the username above and copy it.';
      clearTimeout(timer);
      timer=setTimeout(function(){status.textContent=''},3500);
    }
    function fallback(){
      var ok=false;
      try{
        var ta=document.createElement('textarea');
        ta.value=text;ta.setAttribute('readonly','');
        ta.style.position='fixed';ta.style.opacity='0';
        document.body.appendChild(ta);ta.select();
        ok=document.execCommand('copy');
        document.body.removeChild(ta);
      }catch(err){}
      done(ok);
    }
    try{
      if(navigator.clipboard&&navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(function(){done(true)},fallback);
      }else{fallback()}
    }catch(err){fallback()}
  });
})();