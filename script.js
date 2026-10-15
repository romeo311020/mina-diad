(() => {
  const root = document.documentElement;
  const langButton = document.getElementById('lang');
  const nav = document.getElementById('nav');
  const menu = document.getElementById('menu');
  let lang = 'ar';
  try { lang = localStorage.getItem('mina-site-lang') || 'ar'; } catch (_) {}
  function setLang(next) {
    lang = next;
    const ar = next === 'ar';
    root.lang = next; root.dir = ar ? 'rtl' : 'ltr';
    document.body.classList.toggle('en', !ar);
    if (langButton) langButton.textContent = ar ? 'EN' : 'عربي';
    document.querySelectorAll('[data-ar][data-en]').forEach(el => {
      const value = el.getAttribute(ar ? 'data-ar' : 'data-en');
      if (value != null) { if (value.includes('<')) el.innerHTML = value; else el.textContent = value; }
    });
    const name = document.getElementById('name');
    const message = document.getElementById('message');
    if (name) name.placeholder = ar ? 'مثال: أحمد محمد' : 'e.g. Alex Morgan';
    if (message) message.placeholder = ar ? 'قولنا محتاج تعرف إيه...' : 'Tell us what you would like to know...';
    document.title = ar ? (document.body.dataset.titleAr || document.title) : (document.body.dataset.titleEn || 'Mr. Mina Diab | Creativity in Mathematics');
    try { localStorage.setItem('mina-site-lang', next); } catch (_) {}
  }
  if (langButton) langButton.addEventListener('click', () => setLang(lang === 'ar' ? 'en' : 'ar'));
  if (menu && nav) menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); menu.textContent = open ? '×' : '☰'; });
  if (nav && menu) nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menu.textContent = '☰'; menu.setAttribute('aria-expanded', 'false'); }));
  if ('IntersectionObserver' in window) { const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), {threshold:.08}); document.querySelectorAll('.reveal').forEach(el => io.observe(el)); } else document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  document.querySelectorAll('img[src="images/mina-diab.jpg"]').forEach(img => { img.addEventListener('error', () => { const frame = img.parentElement; if (frame) frame.classList.add('image-missing'); img.style.display = 'none'; }, { once: true }); });
  const year = document.getElementById('year'); if (year) year.textContent = new Date().getFullYear();
  const form = document.getElementById('contactForm');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault(); if (!form.reportValidity()) return;
    const d = new FormData(form), ar = lang === 'ar';
    const msg = ar ? `استفسار جديد من موقع مستر مينا دياب\nالاسم: ${d.get('name')}\nالمرحلة: ${d.get('grade')}\nنوع الاستفسار: ${d.get('topic')}\nالرسالة: ${d.get('message')}` : `New inquiry from Mr. Mina Diab website\nName: ${d.get('name')}\nStudy level: ${d.get('grade')}\nInquiry type: ${d.get('topic')}\nMessage: ${d.get('message')}`;
    const status = document.getElementById('status'); if (status) status.textContent = ar ? 'هنفتح واتساب برسالتك — راجعها واضغط إرسال.' : 'WhatsApp will open with your message. Review it and press send.';
    window.open(`https://wa.me/201035148166?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  });
  const quizFeedback = document.getElementById('quizFeedback');
  document.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-answer]').forEach(b => b.classList.remove('selected-correct','selected-wrong'));
    const correct = button.dataset.answer === 'correct'; button.classList.add(correct ? 'selected-correct' : 'selected-wrong');
    if (quizFeedback) quizFeedback.textContent = lang === 'ar' ? (correct ? 'إجابة صحيحة! لأن 2x = 6، إذن x = 3.' : 'مش دي الإجابة. اطرح 4 من الطرفين، وبعدها اقسم على 2.') : (correct ? 'Correct! Since 2x = 6, x = 3.' : 'Not quite. Subtract 4 from both sides, then divide by 2.');
  }));
  const reset = document.getElementById('quizReset'); if (reset) reset.addEventListener('click', () => { document.querySelectorAll('[data-answer]').forEach(b => b.classList.remove('selected-correct','selected-wrong')); if (quizFeedback) quizFeedback.textContent = lang === 'ar' ? 'اختار إجابة واضغط عليها عشان تعرف النتيجة.' : 'Choose an answer to see the result.'; });
  // Best-effort zoom prevention. Some browsers intentionally override this for accessibility.
  document.addEventListener('gesturestart', e => e.preventDefault(), {passive:false});
  document.addEventListener('wheel', e => { if (e.ctrlKey) e.preventDefault(); }, {passive:false});
  let lastTouchEnd = 0; document.addEventListener('touchend', e => { const now = Date.now(); if (now - lastTouchEnd <= 300) e.preventDefault(); lastTouchEnd = now; }, {passive:false});
  setLang(lang);
})();
