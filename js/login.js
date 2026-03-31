/* ===========================
   TAB SWITCHING
=========================== */
function switchTab(tab) {
  const loginTab   = document.getElementById('tab-login');
  const signupTab  = document.getElementById('tab-signup');
  const loginForm  = document.getElementById('form-login');
  const signupForm = document.getElementById('form-signup');
  clearErrors();
  if (tab === 'login') {
    loginTab.classList.add('active'); signupTab.classList.remove('active');
    loginForm.classList.remove('hidden'); signupForm.classList.add('hidden');
    reAnimate(loginForm);
  } else {
    signupTab.classList.add('active'); loginTab.classList.remove('active');
    signupForm.classList.remove('hidden'); loginForm.classList.add('hidden');
    reAnimate(signupForm);
  }
}
function reAnimate(el) { el.style.animation='none'; void el.offsetHeight; el.style.animation=''; }

/* ===========================
   PASSWORD TOGGLE
=========================== */
function togglePw(inputId, btn) {
  const input = document.getElementById(inputId);
  const show  = input.type === 'password';
  input.type  = show ? 'text' : 'password';
  btn.innerHTML = show
    ? `<svg class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
    : `<svg class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
}

/* ===========================
   VALIDATION
=========================== */
function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isValidMobile(v) { return /^[6-9]\d{9}$/.test(v); }
function setErr(id, msg) {
  const el = document.getElementById(id); if (!el) return;
  el.textContent = msg;
  if (msg) {
    const inp = el.previousElementSibling?.tagName==='INPUT' ? el.previousElementSibling : el.previousElementSibling?.querySelector('input');
    if (inp) inp.classList.add('invalid');
  }
}
function clearErrors() {
  document.querySelectorAll('.err').forEach(e => e.textContent='');
  document.querySelectorAll('input.invalid').forEach(i => i.classList.remove('invalid'));
}

/* ===========================
   LOGIN HANDLER
=========================== */
function handleLogin(e) {
  e.preventDefault(); clearErrors();
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-password').value;
  let valid = true;
  if (!isValidEmail(email)) { setErr('err-login-email','Enter a valid email address.'); valid=false; }
  if (pass.length < 6)      { setErr('err-login-password','Password must be at least 6 characters.'); valid=false; }
  if (!valid) return;
  const name = email.split('@')[0].replace(/[._]/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
  localStorage.setItem('qm_session', JSON.stringify({ name, email, loggedIn:true }));
  showToast('Login successful! Welcome back 👋','success');
  e.target.reset();
  // setTimeout(() => { window.location.href='dashboard.html'; }, 1200);
  setTimeout(() => { window.location.href='index.html'; }, 1200);
}

/* ===========================
   SIGNUP HANDLER
=========================== */
function handleSignup(e) {
  e.preventDefault(); clearErrors();
  const name   = document.getElementById('su-name').value.trim();
  const email  = document.getElementById('su-email').value.trim();
  const pass   = document.getElementById('su-password').value;
  const mobile = document.getElementById('su-mobile').value.trim();
  let valid = true;
  if (name.length < 2)   { setErr('err-su-name','Please enter your full name.'); valid=false; }
  if (!isValidEmail(email)) { setErr('err-su-email','Enter a valid email address.'); valid=false; }
  if (pass.length < 6)   { setErr('err-su-password','Password must be at least 6 characters.'); valid=false; }
  if (!isValidMobile(mobile)) { setErr('err-su-mobile','Enter a valid 10-digit mobile number.'); valid=false; }
  if (!valid) return;
  localStorage.setItem('qm_session', JSON.stringify({ name, email, mobile, loggedIn:true }));
  showToast('Account created! Redirecting to dashboard 🎉','success');
  e.target.reset();
  setTimeout(() => { window.location.href='dashboard.html'; }, 1500);
}

/* ===========================
   TOAST
=========================== */
function showToast(msg, type='success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ===========================
   MOBILE DIGITS ONLY
=========================== */
document.addEventListener('DOMContentLoaded', () => {
  const mob = document.getElementById('su-mobile');
  if (mob) mob.addEventListener('input', () => { mob.value = mob.value.replace(/\D/g,''); });
});
