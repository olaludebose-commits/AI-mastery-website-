/* AI MASTERY starter platform
   Set SUPABASE_URL and SUPABASE_ANON_KEY below after creating your project.
   The anon key is intended for browser use only when database RLS is correctly configured.
   Never place a service_role key in this file. */
const SUPABASE_URL = "";
const SUPABASE_ANON_KEY = "";
const sb = (SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase)
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const courses = [
 {title:"AI Fundamentals",symbol:"✳",number:"01",desc:"Understand what AI is, where it is used, and how to work with it thoughtfully.",outcomes:["AI concepts and everyday applications","Strengths, limits, and responsible use","Explore beginner-friendly AI tools"]},
 {title:"Prompt Engineering",symbol:"✧",number:"02",desc:"Learn to communicate clearly with AI tools and guide them towards useful results.",outcomes:["Write clear, structured prompts","Iterate and improve AI outputs","Use prompts to solve real problems"]},
 {title:"AI Graphic Design",symbol:"▧",number:"03",desc:"Explore AI-assisted workflows for posters, flyers, logos, and social media graphics.",outcomes:["Plan a visual design brief","Create and refine visual concepts","Understand basic design principles"]},
 {title:"Digital Creativity",symbol:"◈",number:"04",desc:"Develop your voice through digital storytelling, presentations, and content creation.",outcomes:["Build a simple content plan","Design clear presentations","Practise digital storytelling"]},
 {title:"Website Development",symbol:"⌘",number:"05",desc:"Learn how web pages are planned and built with HTML, CSS, JavaScript, and AI support.",outcomes:["Understand HTML and CSS foundations","Create responsive layouts","Explore JavaScript fundamentals"]},
 {title:"App Creation",symbol:"▣",number:"06",desc:"Discover app planning, interface design, no-code platforms, and AI-assisted development.",outcomes:["Plan an app around a real need","Sketch an interface and user flow","Explore no-code and coding options"]}
];
const $ = (sel, parent=document) => parent.querySelector(sel);
const $$ = (sel, parent=document) => [...parent.querySelectorAll(sel)];
let currentUser = null, isAdmin = false, cachedApplications = [];

function renderCourses(target="#courseGrid", studentMode=false){
 const el=$(target); if(!el)return;
 el.innerHTML=courses.map(c=>`<article class="course-card"><div class="course-art"><span class="course-symbol">${c.symbol}</span></div><div class="course-body"><div class="course-topline"><span class="difficulty">Beginner friendly</span><span class="course-number">PATH ${c.number}</span></div><h3>${c.title}</h3><p>${c.desc}</p><ul class="outcome-list">${c.outcomes.map(x=>`<li>${x}</li>`).join("")}</ul><div class="course-footer"><button data-course="${c.title}" class="view-course">View course ↗</button><span>${studentMode?"Explore path":"Self-paced + guided"}</span></div></div></article>`).join("");
 $$(".view-course",el).forEach(btn=>btn.addEventListener("click",()=>openCourse(btn.dataset.course)));
}
function openCourse(title){
 const c=courses.find(x=>x.title===title); if(!c)return;
 const modal=document.createElement("div");modal.className="course-modal";modal.innerHTML=`<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><button class="modal-close" aria-label="Close">×</button><div class="section-kicker">LEARNING PATH ${c.number}</div><h2 id="modalTitle">${c.title}</h2><p>${c.desc}</p><h3>What you'll explore</h3><ul>${c.outcomes.map(x=>`<li>${x}</li>`).join("")}</ul><p><b>Level:</b> Beginner friendly<br><b>Format:</b> Online learning<br><b>Current programme fee:</b> Free</p><a class="button" href="#apply">Apply for training ↗</a></div>`;
 document.body.append(modal);const close=()=>modal.remove();$(".modal-close",modal).onclick=close;modal.addEventListener("click",e=>{if(e.target===modal)close()});document.addEventListener("keydown",function esc(e){if(e.key==="Escape"){close();document.removeEventListener("keydown",esc)}});modal.querySelector("a").addEventListener("click",close);
}
function showMessage(el,text,type="success"){if(!el)return;el.textContent=text;el.className=`form-message ${type}`;}
function toast(text){const el=$("#toast");el.textContent=text;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),3400);}
function setBusy(form,busy){form.classList.toggle("loading",busy);const b=$("button[type=submit]",form);if(b){b.disabled=busy;if(busy){b.dataset.old=b.textContent;b.textContent="Please wait…"}else if(b.dataset.old){b.textContent=b.dataset.old}}}
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function showPage(){
 const hash=(location.hash||"#home").slice(1).split("?")[0];
 const routes=["home","about","courses","learning","register","login","dashboard","admin","privacy","terms","notfound"];
 const id=routes.includes(hash)?hash:({
 "apply":"home","instructor":"home","certificates":"home","faq":"home","contact":"home"
 }[hash]||"notfound");
 $$(".auth-section,.dashboard-section,.policy-section").forEach(x=>x.classList.add("hidden"));
 // Keep the main public sections visible for homepage anchor routes; auth/policy routes hide them.
 const special=["register","login","dashboard","admin","privacy","terms","notfound"];
 const mainSections=$$("#app > section:not(.auth-section):not(.dashboard-section):not(.policy-section)");
 if(special.includes(id)){mainSections.forEach(x=>x.classList.add("hidden"));const p=$("#"+id);if(p)p.classList.remove("hidden");}
 else {mainSections.forEach(x=>x.classList.remove("hidden"));}
 if(id==="dashboard") loadDashboard();
 if(id==="admin") loadAdmin();
 $("#mainNav").classList.remove("open");$("#menuToggle").setAttribute("aria-expanded","false");
}
window.addEventListener("hashchange",showPage);
$("#menuToggle").addEventListener("click",()=>{const nav=$("#mainNav");nav.classList.toggle("open");$("#menuToggle").setAttribute("aria-expanded",nav.classList.contains("open")?"true":"false")});
$("#year").textContent=new Date().getFullYear();
renderCourses();showPage();

async function submitApplication(e){
 e.preventDefault();const form=e.currentTarget,msg=$("#applicationMessage");if(!form.reportValidity())return;
 const data=Object.fromEntries(new FormData(form).entries());delete data.consent;
 setBusy(form,true);showMessage(msg,"");
 try{
  if(!sb)throw new Error("Website setup is incomplete: connect Supabase first. Your application has not been saved. Please contact us by WhatsApp or email meanwhile.");
  const {error}=await sb.from("applications").insert({...data,status:"pending"});
  if(error)throw error;
  form.reset();showMessage(msg,"Application submitted successfully! We’ll contact you with the next steps.");toast("Your application has been received.");
 }catch(err){showMessage(msg,err.message||"We couldn't submit your application. Please try again or contact us.", "error");}
 finally{setBusy(form,false)}
}
$("#applicationForm").addEventListener("submit",submitApplication);

$("#contactForm").addEventListener("submit",async e=>{
 e.preventDefault();const f=e.currentTarget,msg=$("#contactMessage");if(!f.reportValidity())return;setBusy(f,true);
 const d=Object.fromEntries(new FormData(f).entries());
 try{
  if(!sb)throw new Error("Contact form storage is not configured yet. Please email olaludeisaackehinde@gmail.com or use WhatsApp.");
  const {error}=await sb.from("contact_messages").insert(d);if(error)throw error;f.reset();showMessage(msg,"Message sent. Thank you for contacting AI MASTERY!");
 }catch(err){showMessage(msg,err.message||"Message could not be sent. Please use the contact details above.","error")}finally{setBusy(f,false)}
});

$("#registerForm").addEventListener("submit",async e=>{
 e.preventDefault();const f=e.currentTarget,msg=$("#registerMessage");if(!f.reportValidity())return;setBusy(f,true);
 try{
  if(!sb)throw new Error("Student account setup is not connected yet. Please try again after the administrator configures the learning platform.");
  const d=Object.fromEntries(new FormData(f).entries());const {data,error}=await sb.auth.signUp({email:d.email,password:d.password,options:{data:{full_name:d.full_name}}});if(error)throw error;
  showMessage(msg,data.session?"Account created. You can now log in.":"Account created. Check your email to confirm your address, then log in.");f.reset();
 }catch(err){showMessage(msg,err.message||"Registration failed.","error")}finally{setBusy(f,false)}
});
$("#loginForm").addEventListener("submit",async e=>{
 e.preventDefault();const f=e.currentTarget,msg=$("#loginMessage");if(!f.reportValidity())return;setBusy(f,true);
 try{if(!sb)throw new Error("Student login is not configured yet. Please try again later.");const d=Object.fromEntries(new FormData(f).entries());const {data,error}=await sb.auth.signInWithPassword({email:d.email,password:d.password});if(error)throw error;currentUser=data.user;await checkRole();location.hash=isAdmin?"admin":"dashboard";toast("You're signed in.");}
 catch(err){showMessage(msg,err.message||"Login failed.","error")}finally{setBusy(f,false)}
});
async function checkRole(){
 isAdmin=false;if(!sb||!currentUser)return;
 const {data,error}=await sb.from("user_roles").select("role").eq("user_id",currentUser.id).maybeSingle();
 if(!error&&data?.role==="admin")isAdmin=true;
}
async function loadDashboard(){
 if(!sb){$("#studentName").textContent="learner.";$("#dashboardMetrics").innerHTML=`<div class="metric-card"><strong>—</strong><span>Enrolled courses</span></div><div class="metric-card"><strong>—</strong><span>Lessons completed</span></div><div class="metric-card"><strong>—</strong><span>Certificates</span></div>`;$("#studentCourses").innerHTML='<div class="empty-state">Connect Supabase to activate student learning records.</div>';return;}
 const {data:{user}}=await sb.auth.getUser();currentUser=user;if(!user){location.hash="#login";return;}await checkRole();
 const name=user.user_metadata?.full_name||user.email?.split("@")[0]||"learner";$("#studentName").textContent=name+".";
 const [{data:enrollments,error:e1},{data:certs,error:e2},{data:ann,error:e3}]=await Promise.all([
  sb.from("enrollments").select("id,course_title,progress,status").eq("student_id",user.id),
  sb.from("certificates").select("certificate_id,course_name,issued_at,student_name").eq("student_id",user.id),
  sb.from("announcements").select("title,body,created_at").order("created_at",{ascending:false}).limit(5)
 ]);
 $("#dashboardMetrics").innerHTML=`<div class="metric-card"><strong>${e1?"—":(enrollments||[]).length}</strong><span>Enrolled courses</span></div><div class="metric-card"><strong>${e1?"—":(enrollments||[]).filter(x=>x.progress>=100).length}</strong><span>Courses completed</span></div><div class="metric-card"><strong>${e2?"—":(certs||[]).length}</strong><span>Certificates issued</span></div>`;
 $("#studentCourses").innerHTML=e1?'<div class="empty-state">Could not load courses. Please refresh.</div>':(enrollments||[]).length?enrollments.map(x=>`<article class="course-card"><div class="course-body"><span class="difficulty">${escapeHtml(x.status||"Enrolled")}</span><h3>${escapeHtml(x.course_title)}</h3><div class="progress-label"><span>Progress</span><b>${Number(x.progress)||0}%</b></div><div class="progress-track"><i style="width:${Math.max(0,Math.min(100,Number(x.progress)||0))}%"></i></div></div></article>`).join(""):'<div class="empty-state">No courses are assigned to your account yet. Contact the instructor for enrolment.</div>';
 $("#studentAnnouncements").innerHTML=e3?"Could not load announcements.":(ann||[]).length?ann.map(a=>`<p><b>${escapeHtml(a.title)}</b><br>${escapeHtml(a.body)}<br><small>${new Date(a.created_at).toLocaleDateString()}</small></p>`).join(""):"No announcements at the moment.";
 $("#studentCertificates").innerHTML=e2?"Could not load certificates.":(certs||[]).length?certs.map(c=>`<p><b>${escapeHtml(c.course_name)}</b> · ${escapeHtml(c.certificate_id)} <button class="table-action" data-cert="${escapeHtml(c.certificate_id)}">View certificate</button></p>`).join(""):"Certificates will appear here when issued.";
}
$("#logoutBtn").addEventListener("click",async()=>{if(sb)await sb.auth.signOut();currentUser=null;isAdmin=false;location.hash="#home";toast("You have logged out.");});
async function loadAdmin(){
 if(!sb){$("#adminStats").innerHTML='<div class="metric-card"><strong>Setup required</strong><span>Connect Supabase to enable administration.</span></div>';$("#adminApplications").innerHTML="";return;}
 const {data:{user}}=await sb.auth.getUser();currentUser=user;if(!user){location.hash="#login";return;}await checkRole();if(!isAdmin){$("#adminApplications").innerHTML='<div class="empty-state">Access denied. This account is not authorised as an administrator.</div>';return;}
 await refreshApplications();
}
async function refreshApplications(){
 const {data,error}=await sb.from("applications").select("*").order("created_at",{ascending:false});
 if(error){$("#adminApplications").innerHTML=`<div class="empty-state">${escapeHtml(error.message)}</div>`;return;}
 cachedApplications=data||[];$("#adminStats").innerHTML=`<div class="metric-card"><strong>${cachedApplications.length}</strong><span>Total applications</span></div><div class="metric-card"><strong>${cachedApplications.filter(a=>a.status==="pending").length}</strong><span>Pending review</span></div><div class="metric-card"><strong>${cachedApplications.filter(a=>a.status==="approved").length}</strong><span>Approved</span></div>`;renderApplicationTable();
}
function renderApplicationTable(){
 const q=($("#applicationSearch").value||"").toLowerCase(),filter=$("#applicationFilter").value;
 const rows=cachedApplications.filter(a=>(filter==="all"||a.status===filter)&&(`${a.full_name} ${a.email} ${a.phone}`.toLowerCase().includes(q)));
 $("#adminApplications").innerHTML=rows.length?`<table class="admin-table"><thead><tr><th>Applicant</th><th>Course</th><th>Phone</th><th>Submitted</th><th>Status</th><th>Actions</th></tr></thead><tbody>${rows.map(a=>`<tr><td><b>${escapeHtml(a.full_name)}</b><br>${escapeHtml(a.email)}</td><td>${escapeHtml(a.course_interest)}</td><td>${escapeHtml(a.phone)}</td><td>${a.created_at?new Date(a.created_at).toLocaleDateString():"—"}</td><td><span class="status-pill ${a.status==="approved"?"status-approved":a.status==="rejected"?"status-rejected":""}">${escapeHtml(a.status||"pending")}</span></td><td><button class="table-action" data-status="approved" data-id="${a.id}">Approve</button><button class="table-action" data-status="rejected" data-id="${a.id}">Reject</button></td></tr>`).join("")}</tbody></table>`:'<div class="empty-state">No applications match your search.</div>';
 $$(".table-action[data-id]",$("#adminApplications")).forEach(b=>b.addEventListener("click",async()=>{const {error}=await sb.from("applications").update({status:b.dataset.status,reviewed_by:currentUser.id}).eq("id",b.dataset.id);if(error)toast("Update failed: "+error.message);else{toast("Application updated.");refreshApplications()}}));
}
$("#applicationSearch").addEventListener("input",renderApplicationTable);$("#applicationFilter").addEventListener("change",renderApplicationTable);$("#refreshAdmin").addEventListener("click",refreshApplications);
$("#certificateForm").addEventListener("submit",async e=>{
 e.preventDefault();const f=e.currentTarget,msg=$("#adminMessage");if(!f.reportValidity())return;setBusy(f,true);
 try{
  if(!sb||!isAdmin)throw new Error("Only an authorised administrator can issue certificates.");
  const d=Object.fromEntries(new FormData(f).entries());const id="AIM-"+new Date().getFullYear()+"-"+crypto.randomUUID().slice(0,8).toUpperCase();
  // Match the student by email. Certificate records are issued only to an existing authenticated student.
  const {data:users,error:lookupErr}=await sb.rpc("find_student_id_by_email",{student_email:d.student_email});
  if(lookupErr)throw new Error("Could not verify student account. Ensure the student registered and the find_student_id_by_email RPC is installed.");
  const studentId=users?.[0]?.user_id||users?.user_id;if(!studentId)throw new Error("No student account found for that email. Ask the student to register first.");
  const {error}=await sb.from("certificates").insert({student_id:studentId,student_name:d.student_name,student_email:d.student_email,course_name:d.course_name,completion_date:d.completion_date,instructor_name:d.instructor_name,certificate_id:id,issued_by:currentUser.id});
  if(error)throw error;showMessage(msg,`Certificate issued with ID ${id}. Certificate verification is now available.`);f.reset();f.elements.instructor_name.value="Olalude Isaac";
 }catch(err){showMessage(msg,err.message||"Certificate could not be issued.","error")}finally{setBusy(f,false)}
});
$("#verifyForm").addEventListener("submit",async e=>{
 e.preventDefault();const id=$("#certificateId").value.trim(),msg=$("#verifyResult");showMessage(msg,"Checking certificate…");
 try{if(!sb)throw new Error("Certificate verification is not connected yet. Please contact the academy.");const {data,error}=await sb.from("certificates_public").select("certificate_id,student_name,course_name,completion_date,issued_at,instructor_name").eq("certificate_id",id).maybeSingle();if(error)throw error;if(!data){showMessage(msg,"No matching certificate was found. Check the ID and try again.","error");return;}showMessage(msg,`Verified: ${data.student_name} completed ${data.course_name} on ${data.completion_date}. Certificate ID: ${data.certificate_id}. Issued by AI MASTERY.`, "success");}
 catch(err){showMessage(msg,err.message||"Verification failed.","error")}
});
document.addEventListener("click",e=>{const b=e.target.closest("[data-cert]");if(b){const id=b.dataset.cert;$("#certificateId").value=id;location.hash="#certificates";$("#verifyForm").requestSubmit();}});
