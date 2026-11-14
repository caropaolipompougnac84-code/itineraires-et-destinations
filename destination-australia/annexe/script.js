function stopAudio(){
  if('speechSynthesis' in window) window.speechSynthesis.cancel();
}
function speakText(id){
  var status=document.getElementById('voiceStatus');
  if(!('speechSynthesis' in window)){
    if(status) status.textContent='Audio is not supported on this device. Read the script instead.';
    return;
  }
  stopAudio();
  var el=document.getElementById(id);
  if(!el) return;
  var text=el.innerText.replace(/_+/g,' ').replace(/\(\d+\)/g,' ');
  // For the gapped Cairns text, prefer the teacher script in the following answer key if present
  var key=el.parentElement && el.parentElement.querySelector('.ans p');
  if(id==='cairns-text'){
    var ans=document.querySelector('#cairns-text + .ans p, .ans p');
    var block=document.querySelectorAll('.ans p');
    for(var i=0;i<block.length;i++){
      if(block[i].textContent.indexOf("G’day everyone")!==-1){ text=block[i].innerText; break; }
    }
  }
  var u=new SpeechSynthesisUtterance(text);
  var voices=speechSynthesis.getVoices();
  var v=voices.find(function(v){return v.lang.toLowerCase()==='en-au';})||voices.find(function(v){return v.lang.toLowerCase().indexOf('en')===0;});
  u.lang=v?v.lang:'en-AU';
  if(v) u.voice=v;
  u.rate=0.88;
  if(status) status.textContent=v?('Voice: '+v.name+' ('+v.lang+').'):'Your device will choose an English voice; an Australian accent is not guaranteed.';
  speechSynthesis.speak(u);
}
if('speechSynthesis' in window){
  speechSynthesis.addEventListener('voiceschanged', function(){});
}
