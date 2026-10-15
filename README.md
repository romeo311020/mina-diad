# Mr. Mina Diab — Website Starter

Responsive bilingual (Egyptian Arabic / English) teacher website with a white and gold identity, animated math-themed background, responsive navigation, stage cards, features, and contact form.

## Files
- `index.html` — website content and sections
- `styles.css` — visual design, responsive layout, and animations
- `script.js` — language toggle, mobile menu, reveal animations, WhatsApp form

## Run
Open `index.html` in a browser, or use VS Code + Live Server.

## Contact form behavior
The form validates required fields and opens WhatsApp with a prefilled message to `+20 10 35148166`. The user reviews and sends the message. This static version does not save form submissions in a database.

## Important
This is the polished front-end starting point, not yet the complete authenticated learning platform. Student accounts, protected lessons/files, quizzes with saved results, and a teacher admin dashboard require a backend such as Supabase plus correctly configured database access policies (RLS). Never place a Supabase service-role key in front-end JavaScript.
