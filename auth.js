const tabs = document.querySelectorAll('.tab');
const forms = {
  signup: document.getElementById('signup-form'),
  login: document.getElementById('login-form'),
};
const messageEl = document.getElementById('auth-message');

const signupSendOtpBtn = document.getElementById('signup-send-otp');
const signupVerifyBtn = document.getElementById('signup-verify');
const signupOtpInput = document.getElementById('signup-otp');

const loginSendOtpBtn = document.getElementById('login-send-otp');
const loginVerifyBtn = document.getElementById('login-verify');
const loginOtpInput = document.getElementById('login-otp');

const OTP_EXPIRY_MS = 5 * 60 * 1000;
const users = JSON.parse(localStorage.getItem('ec_users') || '{}');
const otpSessions = {};

function setMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.classList.toggle('error', isError);
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function saveUsers() {
  localStorage.setItem('ec_users', JSON.stringify(users));
}

function createOtpSession(flow, email) {
  const code = generateOtp();
  otpSessions[flow] = {
    code,
    email,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
  };

  setMessage(`OTP sent to ${email}. Demo OTP: ${code}`);
}

function validateOtp(flow, email, code) {
  const session = otpSessions[flow];

  if (!session || session.email !== email) {
    setMessage('Please request a new OTP first.', true);
    return false;
  }

  if (Date.now() > session.expiresAt) {
    setMessage('OTP expired. Please request a new one.', true);
    return false;
  }

  if (session.code !== code.trim()) {
    setMessage('Invalid OTP. Please try again.', true);
    return false;
  }

  return true;
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((btn) => {
      const active = btn === tab;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', String(active));
    });

    Object.entries(forms).forEach(([key, form]) => {
      form.classList.toggle('active', tab.dataset.target === key);
    });

    setMessage('');
  });
});

signupSendOtpBtn.addEventListener('click', () => {
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim().toLowerCase();
  const password = document.getElementById('signup-password').value;

  if (!name || !email || password.length < 6) {
    setMessage('Enter name, valid email, and password (min 6 chars).', true);
    return;
  }

  if (users[email]) {
    setMessage('An account already exists for this email. Please login.', true);
    return;
  }

  createOtpSession('signup', email);
  signupVerifyBtn.disabled = false;
});

forms.signup.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim().toLowerCase();
  const password = document.getElementById('signup-password').value;
  const otp = signupOtpInput.value;

  if (!validateOtp('signup', email, otp)) {
    return;
  }

  users[email] = { name, password };
  saveUsers();
  delete otpSessions.signup;
  signupVerifyBtn.disabled = true;
  forms.signup.reset();
  setMessage('Signup successful! You can now login with OTP verification.');
});

loginSendOtpBtn.addEventListener('click', () => {
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;

  if (!users[email] || users[email].password !== password) {
    setMessage('Invalid email or password.', true);
    return;
  }

  createOtpSession('login', email);
  loginVerifyBtn.disabled = false;
});

forms.login.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const otp = loginOtpInput.value;

  if (!validateOtp('login', email, otp)) {
    return;
  }

  const user = users[email];
  delete otpSessions.login;
  loginVerifyBtn.disabled = true;
  forms.login.reset();
  setMessage(`Welcome back, ${user.name}! Login successful.`);
});
