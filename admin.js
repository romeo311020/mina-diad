(() => {
  const cfg = window.SUPABASE_CONFIG;
  const $ = (id) => document.getElementById(id);
  const show = (id, message, type = "") => {
    const el = $(id); if (!el) return;
    el.textContent = message; el.classList.remove("hidden", "error", "ok");
    if (type) el.classList.add(type);
  };
  const hide = (id) => $(id)?.classList.add("hidden");
  if (!window.supabase || !cfg || !cfg.url || !cfg.anonKey ||
      cfg.url.includes("YOUR_PROJECT_ID") || cfg.anonKey.includes("YOUR_SUPABASE")) {
    show("loginStatus", "لازم إعداد supabase-config.js أولًا باستخدام Project URL و anon/public key.", "error");
    return;
  }
  const client = window.supabase.createClient(cfg.url, cfg.anonKey);
  let courses = [];
  let students = [];
  const isAdmin = async (userId) => {
    const { data, error } = await client.from("profiles").select("role").eq("id", userId).single();
    if (error) throw new Error("تعذر التحقق من صلاحية الإدارة. تأكد من وجود profile وسياسة RLS.");
    if (data?.role !== "admin") throw new Error("الحساب صحيح لكنه لا يملك صلاحية admin.");
    return true;
  };
  const enterDashboard = async (user) => {
    try {
      await isAdmin(user.id);
      $("loginPanel").classList.add("hidden");
      $("dashboard").classList.remove("hidden");
      $("logoutBtn").classList.remove("hidden");
      hide("loginStatus");
      await Promise.all([loadCourses(), loadStudents(), loadHomepage()]);
    } catch (e) {
      await client.auth.signOut();
      show("loginStatus", e.message, "error");
      $("loginPanel").classList.remove("hidden");
      $("dashboard").classList.add("hidden");
      $("logoutBtn").classList.add("hidden");
    }
  };
  $("loginForm").addEventListener("submit", async (ev) => {
    ev.preventDefault();
    show("loginStatus", "جارٍ التحقق من الحساب...");
    const { data, error } = await client.auth.signInWithPassword({
      email: $("email").value.trim(), password: $("password").value
    });
    if (error) return show("loginStatus", "تعذّر تسجيل الدخول: " + error.message, "error");
    await enterDashboard(data.user);
  });
  $("logoutBtn").addEventListener("click", async () => {
    await client.auth.signOut(); location.reload();
  });
  client.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" && session?.user) setTimeout(() => enterDashboard(session.user), 0);
  });
  document.querySelectorAll("[data-tab]").forEach(btn => btn.addEventListener("click", () => {
    document.querySelectorAll("[data-tab]").forEach(b => { b.classList.toggle("active", b === btn); b.classList.toggle("secondary", b !== btn); });
    ["courses","students","homepage"].forEach(name => $(name + "Tab").classList.toggle("hidden", name !== btn.dataset.tab));
  }));
  async function loadCourses() {
    const { data, error } = await client.from("courses").select("*").order("created_at", { ascending: false });
    if (error) { show("coursesStatus", "تعذّر تحميل الكورسات: " + error.message, "error"); return; }
    courses = data || []; $("courseCount").textContent = courses.length;
    $("publishedCount").textContent = courses.filter(c => c.published).length;
    $("coursesRows").innerHTML = "";
    if (!courses.length) $("coursesRows").innerHTML = '<tr><td colspan="4">لا توجد كورسات حتى الآن.</td></tr>';
    courses.forEach(c => {
      const tr = document.createElement("tr");
      const title = document.createElement("td"); title.textContent = c.title || "بدون عنوان";
      const grade = document.createElement("td"); grade.textContent = c.grade || "—";
      const state = document.createElement("td"); state.textContent = c.published ? "منشور" : "مسودة";
      const actions = document.createElement("td"); actions.className = "actions";
      const edit = document.createElement("button"); edit.className = "secondary"; edit.textContent = "تعديل"; edit.onclick = () => editCourse(c);
      const del = document.createElement("button"); del.className = "danger"; del.textContent = "حذف"; del.onclick = () => deleteCourse(c);
      actions.append(edit, del); tr.append(title, grade, state, actions); $("coursesRows").append(tr);
    });
    hide("coursesStatus");
  }
  function editCourse(c) {
    $("courseId").value = c?.id || ""; $("courseTitle").value = c?.title || "";
    $("courseGrade").value = c?.grade || ""; $("courseDescription").value = c?.description || "";
    $("courseCover").value = c?.cover_url || ""; $("coursePublished").checked = !!c?.published;
    $("courseForm").classList.remove("hidden"); $("courseTitle").focus();
  }
  $("newCourseBtn").addEventListener("click", () => editCourse(null));
  $("cancelCourseBtn").addEventListener("click", () => $("courseForm").classList.add("hidden"));
  $("courseForm").addEventListener("submit", async ev => {
    ev.preventDefault();
    const id = $("courseId").value;
    const row = { title: $("courseTitle").value.trim(), grade: $("courseGrade").value.trim() || null,
      description: $("courseDescription").value.trim() || null, cover_url: $("courseCover").value.trim() || null,
      published: $("coursePublished").checked };
    const result = id ? await client.from("courses").update(row).eq("id", id) : await client.from("courses").insert(row);
    if (result.error) return show("coursesStatus", "فشل الحفظ: " + result.error.message, "error");
    $("courseForm").classList.add("hidden"); show("coursesStatus", "تم حفظ الكورس.", "ok"); await loadCourses();
  });
  async function deleteCourse(c) {
    if (!confirm(`حذف الكورس «${c.title}»؟ قد تمنع العلاقات حذف كورس له دروس أو تسجيلات.`)) return;
    const { error } = await client.from("courses").delete().eq("id", c.id);
    if (error) return show("coursesStatus", "فشل الحذف: " + error.message, "error");
    show("coursesStatus", "تم حذف الكورس.", "ok"); await loadCourses();
  }
  async function loadStudents() {
    const { data, error } = await client.from("profiles").select("id,full_name,phone,grade,created_at").order("created_at", { ascending: false });
    if (error) { show("studentsStatus", "تعذّر تحميل الطلاب: " + error.message, "error"); return; }
    students = data || []; $("studentCount").textContent = students.length; $("studentsRows").innerHTML = "";
    if (!students.length) $("studentsRows").innerHTML = '<tr><td colspan="4">لا توجد حسابات مسجلة بعد.</td></tr>';
    students.forEach(s => {
      const tr = document.createElement("tr");
      [s.full_name || "—", s.phone || "—", s.grade || "—", s.created_at ? new Date(s.created_at).toLocaleDateString("ar-EG") : "—"].forEach(value => {
        const td = document.createElement("td"); td.textContent = value; tr.append(td);
      });
      $("studentsRows").append(tr);
    });
    hide("studentsStatus");
  }
  $("refreshStudents").addEventListener("click", loadStudents);
  async function loadHomepage() {
    const { data, error } = await client.from("site_settings").select("key,value").in("key", ["hero_title_ar","hero_subtitle_ar"]);
    if (error) { show("homepageStatus", "إعدادات الرئيسية لم تُجهّز بعد. شغّل ملف setup.sql من SQL Editor. " + error.message, "error"); return; }
    const map = Object.fromEntries((data || []).map(x => [x.key, x.value]));
    $("heroTitle").value = map.hero_title_ar || "الرياضيات مش صعبة… لما تفهمها صح.";
    $("heroSubtitle").value = map.hero_subtitle_ar || "مع مستر مينا دياب، هنفهم الفكرة خطوة بخطوة.";
    hide("homepageStatus");
  }
  $("reloadSettings").addEventListener("click", loadHomepage);
  $("homepageForm").addEventListener("submit", async ev => {
    ev.preventDefault();
    const rows = [
      { key: "hero_title_ar", value: $("heroTitle").value.trim() },
      { key: "hero_subtitle_ar", value: $("heroSubtitle").value.trim() }
    ];
    const { error } = await client.from("site_settings").upsert(rows, { onConflict: "key" });
    if (error) return show("homepageStatus", "فشل حفظ الإعدادات: " + error.message, "error");
    show("homepageStatus", "تم حفظ الإعدادات في قاعدة البيانات. يلزم ربط index.html بها حتى يظهر التغيير للزوار.", "ok");
  });
  client.auth.getSession().then(({ data, error }) => {
    if (error) return show("loginStatus", error.message, "error");
    if (data.session?.user) enterDashboard(data.session.user);
  });
})();