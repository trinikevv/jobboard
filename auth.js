// js/auth.js

if (!localStorage.getItem('usersDB')) {
    localStorage.setItem('usersDB', JSON.stringify([]));
}

let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let pendingUrl = '';
let tempSignupData = null;
let currentVerificationCode = null;

// Mobile Menu Toggle Function
function toggleMobileMenu() {
    const nav = document.getElementById('mainNavLinks');
    if(nav) nav.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', () => {
    const modalHTML = `
    <!-- Fake Email Toast -->
    <div id="fakeEmailToast" class="fake-email-toast">
        <div class="toast-icon"><i class="fas fa-envelope"></i></div>
        <div class="toast-content">
            <h4>EdoState Jobs (Simulated Email)</h4>
            <p>Your email verification code is:</p>
            <span class="toast-code" id="displayToastCode">000000</span>
        </div>
    </div>

    <!-- Auth Modal -->
    <div id="authModal" class="modal-overlay">
        <div class="modal-content">
            <span class="close-modal" onclick="closeAuthModal()">&times;</span>
            
            <div id="loginFormContainer">
                <div class="modal-header">
                    <h2>Welcome Back</h2>
                    <p>Login to view and apply for jobs.</p>
                </div>
                <form id="loginForm" onsubmit="handleLogin(event)" class="application-form">
                    <div class="form-group full-width">
                        <label>Email Address</label>
                        <input type="email" id="loginEmail" required>
                    </div>
                    <div class="form-group full-width">
                        <label>Password</label>
                        <input type="password" id="loginPassword" required>
                    </div>
                    <button type="submit" class="btn-submit" style="margin-top: 10px;">Login</button>
                    <p class="auth-toggle">New student? <a onclick="toggleAuth('signup')">Create an account</a></p>
                </form>
            </div>

            <div id="signupFormContainer" style="display: none;">
                <div class="modal-header">
                    <h2>Create Account</h2>
                    <p>Join the Edo State ICT Internship portal.</p>
                </div>
                <form id="signupForm" onsubmit="initiateSignup(event)" class="application-form">
                    <div class="form-group full-width">
                        <label>Full Name</label>
                        <input type="text" id="signupName" required>
                    </div>
                    <div class="form-group full-width">
                        <label>Email Address</label>
                        <input type="email" id="signupEmail" required>
                    </div>
                    <div class="form-group full-width">
                        <label>Password</label>
                        <input type="password" id="signupPassword" required minlength="6">
                    </div>
                    <button type="submit" class="btn-submit" style="margin-top: 10px;">Sign Up</button>
                    <p class="auth-toggle">Already have an account? <a onclick="toggleAuth('login')">Login here</a></p>
                </form>
            </div>

            <div id="verifyFormContainer" style="display: none;">
                <div class="modal-header">
                    <h2>Verify Email</h2>
                    <p>Enter the 6-digit code sent to <br><strong id="verifyEmailDisplay" style="color:#004d25;"></strong></p>
                </div>
                <form id="verifyForm" onsubmit="handleVerification(event)" class="application-form">
                    <div class="form-group full-width">
                        <input type="text" id="verifyCode" placeholder="000000" required maxlength="6" pattern="\\d{6}" title="Must be 6 digits">
                    </div>
                    <button type="submit" class="btn-submit" style="margin-top: 10px;">Verify & Login</button>
                    <p class="auth-toggle">Didn't get it? <a onclick="sendVerificationCode()">Resend Code</a></p>
                    <p class="auth-toggle" style="margin-top: 5px;"><a onclick="toggleAuth('signup')">← Back to Sign Up</a></p>
                </form>
            </div>
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    updateNavbarUI();
});

function openAuthModal(destination = '') {
    pendingUrl = destination;
    document.getElementById('authModal').style.display = 'flex';
    toggleAuth('login');
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
    pendingUrl = '';
    const toast = document.getElementById('fakeEmailToast');
    if (toast) toast.classList.remove('show');
}

function toggleAuth(type) {
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('signupFormContainer').style.display = 'none';
    document.getElementById('verifyFormContainer').style.display = 'none';

    if (type === 'signup') document.getElementById('signupFormContainer').style.display = 'block';
    else if (type === 'verify') document.getElementById('verifyFormContainer').style.display = 'block';
    else document.getElementById('loginFormContainer').style.display = 'block';
}

function requireAuth(event, url) {
    if (!currentUser) {
        event.preventDefault();
        openAuthModal(url);
    } else {
        window.location.href = url;
    }
}

function initiateSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    const users = JSON.parse(localStorage.getItem('usersDB'));
    
    if (users.find(u => u.email === email)) {
        alert("This email is already registered. Please login.");
        toggleAuth('login');
        return;
    }

    tempSignupData = { 
        name, 
        email, 
        password,
        joinDate: new Date().toISOString() // Added for admin activity feed
    };
    
    document.getElementById('verifyEmailDisplay').textContent = email;
    document.getElementById('verifyCode').value = '';
    toggleAuth('verify');

    sendVerificationCode();
}

function sendVerificationCode() {
    currentVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const toast = document.getElementById('fakeEmailToast');
    const codeEl = document.getElementById('displayToastCode');
    if (!toast || !codeEl) return;

    codeEl.textContent = currentVerificationCode;
    
    toast.classList.remove('show');
    void toast.offsetWidth;
    toast.classList.add('show');

    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 8000);
}

function handleVerification(e) {
    e.preventDefault();
    const enteredCode = document.getElementById('verifyCode').value;

    if (enteredCode === currentVerificationCode) {
        const users = JSON.parse(localStorage.getItem('usersDB'));
        users.push(tempSignupData);
        localStorage.setItem('usersDB', JSON.stringify(users));

        const toast = document.getElementById('fakeEmailToast');
        if (toast) toast.classList.remove('show');

        alert("Email verified successfully! Welcome to EdoState Jobs.");
        loginUser(tempSignupData);
        
        tempSignupData = null;
        currentVerificationCode = null;
    } else {
        alert("Incorrect verification code. Please try again.");
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('usersDB'));
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        loginUser(user);
    } else {
        alert("Invalid email or password.");
    }
}

function loginUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    currentUser = user;
    closeAuthModal();
    updateNavbarUI();

    if (pendingUrl) {
        window.location.href = pendingUrl;
    }
}

function logoutUser() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    updateNavbarUI();
    if (window.location.pathname.includes('apply.html') || 
        window.location.pathname.includes('job-details.html') ||
        window.location.pathname.includes('student-dashboard.html')) {
        window.location.href = 'index.html';
    }
}

function updateNavbarUI() {
    const existingAuth = document.getElementById('navAuthSection');
    if (existingAuth) existingAuth.remove();

    let authHTML = '';
    if (currentUser) {
        authHTML = `
            <div id="navAuthSection" style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <a href="student-dashboard.html" class="user-badge" style="text-decoration: none;" title="Go to My Dashboard">
                    <i class="fas fa-user-graduate"></i> ${currentUser.name.split(' ')[0]}'s Dashboard
                </a>
                <button onclick="logoutUser()" class="logout-btn">Logout</button>
            </div>
        `;
    } else {
        authHTML = `
            <div id="navAuthSection" style="width: 100%;">
                <a href="#" onclick="openAuthModal(); return false;" class="btn-primary" style="background: #00e676; color: #003319; width: 100%; display: block; text-align: center;">Student Login</a>
            </div>
        `;
    }

    const adminIcon = document.querySelector('.admin-icon-link');
    if (adminIcon) {
        adminIcon.insertAdjacentHTML('beforebegin', authHTML);
    }
}