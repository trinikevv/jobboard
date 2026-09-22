if (sessionStorage.getItem('adminLoggedIn') === 'true') {
    window.location.href = 'admin.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const securityQuestion = localStorage.getItem('adminSecurityQuestion');
    if (securityQuestion) {
        document.getElementById('securityQuestionLabel').textContent = securityQuestion;
    }
});

function showForgotPassword() {
    const securityQuestion = localStorage.getItem('adminSecurityQuestion');
    
    if (!securityQuestion) {
        alert("No security question set yet. Please login first with the default password: edo2026");
        return;
    }
    
    document.getElementById('securityQuestionLabel').textContent = securityQuestion;
    document.getElementById('adminLoginForm').style.display = 'none';
    document.getElementById('forgotPasswordForm').style.display = 'flex';
    document.getElementById('setupSecurityForm').style.display = 'none';
}

function showLoginForm() {
    document.getElementById('adminLoginForm').style.display = 'flex';
    document.getElementById('forgotPasswordForm').style.display = 'none';
    document.getElementById('setupSecurityForm').style.display = 'none';
}

function showSetupSecurity() {
    document.getElementById('adminLoginForm').style.display = 'none';
    document.getElementById('forgotPasswordForm').style.display = 'none';
    document.getElementById('setupSecurityForm').style.display = 'flex';
}

function handleAdminLogin(e) {
    e.preventDefault();
    const enteredPassword = document.getElementById('adminPasswordInput').value;
    const correctPassword = localStorage.getItem('adminPassword');
    
    if (enteredPassword === correctPassword) {
        const securityQuestion = localStorage.getItem('adminSecurityQuestion');
        
        if (!securityQuestion) {
            showSetupSecurity();
        } else {
            sessionStorage.setItem('adminLoggedIn', 'true');
            window.location.href = 'admin.html';
        }
    } else {
        alert("Incorrect password. Please try again.");
        document.getElementById('adminPasswordInput').value = '';
    }
}

function handleSetupSecurity(e) {
    e.preventDefault();
    const question = document.getElementById('securityQuestionSelect').value;
    const answer = document.getElementById('securityAnswerSetup').value.toLowerCase().trim();
    
    localStorage.setItem('adminSecurityQuestion', question);
    localStorage.setItem('adminSecurityAnswer', answer);
    
    sessionStorage.setItem('adminLoggedIn', 'true');
    alert("Security question saved! Redirecting to dashboard...");
    window.location.href = 'admin.html';
}

function handleForgotPassword(e) {
    e.preventDefault();
    const enteredAnswer = document.getElementById('securityAnswerInput').value.toLowerCase().trim();
    const correctAnswer = localStorage.getItem('adminSecurityAnswer');
    const newPassword = document.getElementById('newPasswordInput').value;
    
    if (enteredAnswer === correctAnswer) {
        localStorage.setItem('adminPassword', newPassword);
        alert("Password reset successful! Please login with your new password.");
        showLoginForm();
        document.getElementById('adminPasswordInput').value = newPassword;
    } else {
        alert("Incorrect security answer. Please try again.");
    }
}