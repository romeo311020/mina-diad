(() => {
  const root = document.documentElement, langButton = document.getElementById('lang'), nav = document.getElementById('nav'), menu = document.getElementById('menu');
  let lang = 'ar';
  function setLang(next) {
    lang = next; const ar = next === 'ar'; root.lang = next; root.dir = ar ? 'rtl' : 'ltr'; document.body.classList.toggle('en', !ar); langButton.textContent = ar ? 'EN' : 'عربي';
    document.querySelectorAll('[data-ar][data-en]').forEach(el => { const value = el.getAttribute(ar ? 'data-ar' : 'data-en'); if (value != null) { if (value.includes('<')) el.innerHTML = value; else el.textContent = value; } });
    document.getElementById('name').placeholder = ar ? 'مثال: أحمد محمد' : 'e.g. Alex Morgan';
    document.getElementById('message').placeholder = ar ? 'قولنا محتاج تعرف إيه...' : 'Tell us what you would like to know...';
    document.title = ar ? 'Mr. Mina Diab | الإبداع في الرياضيات' : 'Mr. Mina Diab | Creativity in Mathematics';
  }
  langButton.addEventListener('click', () => setLang(lang === 'ar' ? 'en' : 'ar'));
  menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); menu.textContent = open ? '×' : '☰'; });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menu.textContent = '☰'; menu.setAttribute('aria-expanded', 'false'); }));
  if ('IntersectionObserver' in window) { const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), {threshold:.12}); document.querySelectorAll('.reveal').forEach(el => io.observe(el)); } else document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('contactForm').addEventListener('submit', e => { e.preventDefault(); const form = e.currentTarget; if (!form.reportValidity()) return; const d = new FormData(form), ar = lang === 'ar'; const msg = ar ? `استفسار جديد من موقع مستر مينا دياب\nالاسم: ${d.get('name')}\nالمرحلة: ${d.get('grade')}\nنوع الاستفسار: ${d.get('topic')}\nالرسالة: ${d.get('message')}` : `New inquiry from Mr. Mina Diab website\nName: ${d.get('name')}\nStudy level: ${d.get('grade')}\nInquiry type: ${d.get('topic')}\nMessage: ${d.get('message')}`; document.getElementById('status').textContent = ar ? 'هنفتح واتساب برسالتك — راجعها واضغط إرسال.' : 'WhatsApp will open with your message. Review it and press send.'; window.open(`https://wa.me/201035148166?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer'); });
  setLang('ar');
})();
