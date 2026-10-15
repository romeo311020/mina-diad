(() => {
 const host=document.getElementById("publicCourses");
 const cfg=window.SUPABASE_CONFIG;
 if(!host||!window.supabase||!cfg||!cfg.url||!cfg.anonKey||cfg.url.includes("YOUR_PROJECT_ID")) return;
 const client=window.supabase.createClient(cfg.url,cfg.anonKey);
 const esc=(v)=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 client.from("courses").select("id,title,description,grade,cover_url").eq("published",true).order("created_at",{ascending:false}).then(({data,error})=>{
   if(error||!data?.length)return;
   host.innerHTML=data.map(c=>`<article class="public-course-card">${c.cover_url?`<img class="course-cover" src="${esc(c.cover_url)}" alt="">`:"<span class='course-symbol'>∑</span>"}${c.grade?`<span class="course-grade">${esc(c.grade)}</span>`:""}<h3>${esc(c.title)}</h3><p>${esc(c.description||"كورس تعليمي مع مستر مينا دياب.")}</p><a class="course-action" href="contact.html">استفسر عن الكورس ↙</a></article>`).join("");
 });
})();