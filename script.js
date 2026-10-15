document.addEventListener('DOMContentLoaded',()=>{
 const menu=document.getElementById('menu'),nav=document.getElementById('nav');if(menu&&nav)menu.addEventListener('click',()=>{nav.classList.toggle('open');menu.setAttribute('aria-expanded',nav.classList.contains('open')?'true':'false')});
 const lang=document.getElementById('lang');if(lang)lang.addEventListener('click',()=>{const en=document.documentElement.lang!=='en';document.documentElement.lang=en?'en':'ar';document.documentElement.dir=en?'ltr':'rtl';document.querySelectorAll('[data-ar][data-en]').forEach(el=>{const v=el.getAttribute(en?'data-en':'data-ar');if(v!==null)el.innerHTML=v});lang.textContent=en?'AR':'EN';});
 const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
 if('IntersectionObserver'in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>io.observe(el))}
 const form=document.getElementById('contactForm');
 if(form) form.addEventListener('submit',e=>{
  e.preventDefault();
  const status=document.getElementById('status');
  const name=(document.getElementById('name')?.value||'').trim();
  const grade=document.getElementById('grade')?.selectedOptions?.[0]?.textContent||'';
  const topic=document.getElementById('topic')?.selectedOptions?.[0]?.textContent||'';
  const message=(document.getElementById('message')?.value||'').trim();
  if(!name||!grade||!topic||!message){if(status){status.textContent='راجع البيانات المطلوبة قبل الإرسال.';status.className='form-status error'}return}
  const text='مرحبًا مستر مينا، أنا '+name+'\nالمرحلة الدراسية: '+grade+'\nنوع الاستفسار: '+topic+'\nرسالتي: '+message;
  const url='https://wa.me/201035148166?text='+encodeURIComponent(text);
  if(status){status.textContent='هنفتح واتساب برسالتك للمراجعة قبل الإرسال.';status.className='form-status success'}
  const win=window.open(url,'_blank','noopener,noreferrer');
  if(!win) window.location.href=url;
 });
});