function stopAudio(){ if('speechSynthesis' in window) window.speechSynthesis.cancel(); }
function speakText(id,status){
  status=status||document.getElementById('voiceStatus');
  if(!('speechSynthesis' in window)){ if(status) status.textContent='Audio is not available on this device. Read the script instead.'; return; }
  stopAudio();
  var el=document.getElementById(id); if(!el) return;
  var u=new SpeechSynthesisUtterance(el.innerText);
  var voices=speechSynthesis.getVoices();
  var v=voices.find(function(v){return v.lang.toLowerCase()==='en-us';})||voices.find(function(v){return v.lang.toLowerCase().indexOf('en')===0;});
  u.lang=v?v.lang:'en-US'; if(v) u.voice=v; u.rate=0.9;
  if(status) status.textContent=v?('Voice: '+v.name+' ('+v.lang+').'):'Your device will choose an English voice.';
  speechSynthesis.speak(u);
}
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-speak]'); if(b){ speakText(b.getAttribute('data-speak'), b.parentElement.querySelector('.voice-status,#voiceStatus')); return; }
  if(e.target.closest('[data-stop]')) stopAudio();
});
