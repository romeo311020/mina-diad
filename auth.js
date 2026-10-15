(() => {
 const $=id=>document.getElementById(id), cfg=window.SUPABASE_CONFIG;
 let mode="login";
 const msg=(text,type="")=>{const el=$("authMessage");el.textContent=text;el.className="auth-message"+(type?" "+type);};
 if(!window.supabase||!cfg||!cfg.url||!cfg.anonKey||cfg.url.includes("YOUR_PROJECT_ID")||cfg.anonKey.includes("YOUR_SUPABASE")){
   msg("قبل الاستخدام، ضع Project URL و anon/public key في ملف supabase-config.js.","error");return;
 }
 const sb=window.supabase.createClient(cfg.url,cfg.anonKey);
 function setMode(next){
  mode=next;const signup=next==="signup";
  $("loginMode").classList.toggle("active",!signup);$("signupMode").classList.toggle("active",signup);
  $("nameGroup").classList.toggle("hidden",!signup);$("gradeGroup").classList.toggle("hidden",!signup);
  $("fullName").required=signup;$("formTitle").textContent=signup?"إنشاء حساب طالب":"تسجيل الدخول";
  $("submitBtn").textContent=signup?"إنشاء الحساب":"دخول";$("password").autocomplete=signup?"new-password":"current-password";
  $("authMessage").classList.add("hidden");
 }
 $("loginMode").addEventListener("click",()=>setMode("login"));
 $("signupMode").addEventListener("click",()=>setMode("signup"));
 $("authForm").addEventListener("submit",async ev=>{
  ev.preventDefault();$("submitBtn").disabled=true;$("submitBtn").textContent="جارٍ التنفيذ...";
  try{
   const email=$("email").value.trim().toLowerCase(),password=$("password").value;
   if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("اكتب بريدًا إلكترونيًا صحيحًا.");
   if(password.length<8) throw new Error("كلمة المرور لازم تكون 8 أحرف أو أرقام على الأقل.");
   if(mode==="signup"){
    const full_name=$("fullName").value.trim(),grade=$("grade").value||null;
    if(full_name.length<3) throw new Error("اكتب اسم الطالب بالكامل.");
    const {data,error}=await sb.auth.signUp({email,password,options:{data:{full_name,grade}}});
    if(error) throw error;
    if(!data.user) throw new Error("لم يتم إنشاء الحساب. حاول مرة أخرى.");
    if(!data.session){
      msg("تم إنشاء طلب الحساب. افتح بريدك الإلكتروني واضغط رابط التأكيد إذا كان تأكيد البريد مفعّلًا في Supabase، ثم سجّل الدخول.","success");
      return;
    }
    const {error:profileError}=await sb.from("profiles").upsert({id:data.user.id,full_name,phone:null,grade,role:"student"},{onConflict:"id"});
    if(profileError) throw new Error("الحساب اتعمل، لكن حفظ بيانات الملف الشخصي فشل: "+profileError.message+". راجع سياسة profiles.");
    msg("تم إنشاء حسابك بنجاح.","success");$("password").value="";
   }else{
    const {data,error}=await sb.auth.signInWithPassword({email,password});
    if(error) throw error;
    msg("تم تسجيل الدخول بنجاح. أهلاً بك!","success");
    setTimeout(()=>{location.href="index.html";},900);
   }
  }catch(e){msg("حصلت مشكلة: "+(e.message||"خطأ غير معروف"),"error");}
  finally{$("submitBtn").disabled=false;$("submitBtn").textContent=mode==="signup"?"إنشاء الحساب":"دخول";}
 });
 sb.auth.getSession().then(({data})=>{if(data.session)msg("أنت مسجّل الدخول بالفعل. يمكنك العودة للموقع.","success");});
})();