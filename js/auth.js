// Enhanced Authentication System
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem("users")) || [];
        this.currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
        this.validationRules = {
            email: {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                minLength: 5,
                maxLength: 254
            },
            password: {
                minLength: 8,
                maxLength: 128,
                requireUppercase: true,
                requireLowercase: true,
                requireNumbers: true,
                requireSpecialChars: false
            }
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupRealTimeValidation();
    }

    // Real-time validation setup
    setupRealTimeValidation() {
        const emailInputs = document.querySelectorAll('input[type="email"]');
        const passwordInputs = document.querySelectorAll('input[type="password"]');

        emailInputs.forEach(input => {
            input.addEventListener('input', (e) => this.validateEmailRealTime(e.target));
            input.addEventListener('blur', (e) => this.validateEmailRealTime(e.target));
        });

        passwordInputs.forEach(input => {
            input.addEventListener('input', (e) => this.validatePasswordRealTime(e.target));
            input.addEventListener('blur', (e) => this.validatePasswordRealTime(e.target));
        });
    }

    // Email validation
    validateEmail(email) {
        const errors = [];
        
        if (!email) {
            errors.push(this.getTranslation('emailRequired'));
            return { isValid: false, errors };
        }

        if (email.length < this.validationRules.email.minLength) {
            errors.push(this.getTranslation('emailTooShort'));
        }

        if (email.length > this.validationRules.email.maxLength) {
            errors.push(this.getTranslation('emailTooLong'));
        }

        if (!this.validationRules.email.pattern.test(email)) {
            errors.push(this.getTranslation('emailInvalid'));
        }

        return { isValid: errors.length === 0, errors };
    }

    // Password validation
    validatePassword(password) {
        const errors = [];
        const rules = this.validationRules.password;

        if (!password) {
            errors.push(this.getTranslation('passwordRequired'));
            return { isValid: false, errors };
        }

        if (password.length < rules.minLength) {
            errors.push(this.getTranslation('passwordTooShort').replace('{min}', rules.minLength));
        }

        if (password.length > rules.maxLength) {
            errors.push(this.getTranslation('passwordTooLong').replace('{max}', rules.maxLength));
        }

        if (rules.requireUppercase && !/[A-Z]/.test(password)) {
            errors.push(this.getTranslation('passwordNeedsUppercase'));
        }

        if (rules.requireLowercase && !/[a-z]/.test(password)) {
            errors.push(this.getTranslation('passwordNeedsLowercase'));
        }

        if (rules.requireNumbers && !/\d/.test(password)) {
            errors.push(this.getTranslation('passwordNeedsNumbers'));
        }

        if (rules.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push(this.getTranslation('passwordNeedsSpecialChars'));
        }

        return { isValid: errors.length === 0, errors };
    }

    // Real-time email validation
    validateEmailRealTime(input) {
        const validation = this.validateEmail(input.value);
        this.updateFieldValidation(input, validation);
        return validation.isValid;
    }

    // Real-time password validation
    validatePasswordRealTime(input) {
        const validation = this.validatePassword(input.value);
        this.updateFieldValidation(input, validation);
        this.updatePasswordStrength(input, input.value);
        return validation.isValid;
    }

    // Update field validation UI
    updateFieldValidation(input, validation) {
        const formGroup = input.closest('.form-group');
        const errorContainer = formGroup.querySelector('.error') || this.createErrorContainer(formGroup);
        
        // Remove existing validation classes
        input.classList.remove('valid', 'invalid');
        formGroup.classList.remove('has-error', 'has-success');

        if (input.value) {
            if (validation.isValid) {
                input.classList.add('valid');
                formGroup.classList.add('has-success');
                errorContainer.style.display = 'none';
            } else {
                input.classList.add('invalid');
                formGroup.classList.add('has-error');
                errorContainer.innerHTML = validation.errors.join('<br>');
                errorContainer.style.display = 'block';
            }
        } else {
            errorContainer.style.display = 'none';
        }
    }

    // Create error container if it doesn't exist
    createErrorContainer(formGroup) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.style.display = 'none';
        formGroup.appendChild(errorDiv);
        return errorDiv;
    }

    // Password strength indicator
    updatePasswordStrength(input, password) {
        let strengthContainer = input.parentNode.querySelector('.password-strength');
        
        if (!strengthContainer) {
            strengthContainer = document.createElement('div');
            strengthContainer.className = 'password-strength';
            strengthContainer.innerHTML = `
                <div class="strength-label">${this.getTranslation('passwordStrength')}</div>
                <div class="strength-bar">
                    <div class="strength-fill"></div>
                </div>
                <div class="strength-text"></div>
            `;
            input.parentNode.appendChild(strengthContainer);
        }

        const strength = this.calculatePasswordStrength(password);
        const fill = strengthContainer.querySelector('.strength-fill');
        const text = strengthContainer.querySelector('.strength-text');

        fill.style.width = `${strength.percentage}%`;
        fill.className = `strength-fill strength-${strength.level}`;
        text.textContent = this.getTranslation(`passwordStrength${strength.level.charAt(0).toUpperCase() + strength.level.slice(1)}`);
    }

    // Calculate password strength
    calculatePasswordStrength(password) {
        let score = 0;
        let level = 'weak';

        if (password.length >= 8) score += 20;
        if (password.length >= 12) score += 10;
        if (/[a-z]/.test(password)) score += 15;
        if (/[A-Z]/.test(password)) score += 15;
        if (/\d/.test(password)) score += 15;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 25;

        if (score >= 80) level = 'strong';
        else if (score >= 60) level = 'medium';
        else if (score >= 40) level = 'fair';

        return { percentage: Math.min(score, 100), level };
    }

    // Enhanced login functionality
    async login(email, password) {
        this.showLoading(true);
        
        try {
            // Validate inputs
            const emailValidation = this.validateEmail(email);
            const passwordValidation = this.validatePassword(password);

            if (!emailValidation.isValid || !passwordValidation.isValid) {
                throw new Error(this.getTranslation('invalidCredentials'));
            }

            // Simulate API delay for better UX
            await this.delay(1000);

            // Find user
            const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (!user) {
                throw new Error(this.getTranslation('emailNotFound'));
            }

            if (user.password !== password) {
                throw new Error(this.getTranslation('wrongPassword'));
            }

            // Login successful
            this.currentUser = user;
            localStorage.setItem("currentUser", JSON.stringify(user));

            this.showSuccess(this.getTranslation('loginSuccess'));

            // Redirect after delay
            setTimeout(() => {
                if (user.hasCompletedInfo) {
                    window.location.href = "results.html";
                } else {
                    window.location.href = "basic-info.html";
                }
            }, 1500);

            return { success: true, user };

        } catch (error) {
            this.showError(error.message);
            return { success: false, error: error.message };
        } finally {
            this.showLoading(false);
        }
    }

    // Enhanced register functionality
    async register(email, password, confirmPassword) {
        this.showLoading(true);

        try {
            // Validate inputs
            const emailValidation = this.validateEmail(email);
            const passwordValidation = this.validatePassword(password);

            if (!emailValidation.isValid) {
                throw new Error(emailValidation.errors.join(' '));
            }

            if (!passwordValidation.isValid) {
                throw new Error(passwordValidation.errors.join(' '));
            }

            if (password !== confirmPassword) {
                throw new Error(this.getTranslation('passwordsDoNotMatch'));
            }

            // Simulate API delay
            await this.delay(1200);

            // Check if email already exists
            const existingUser = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (existingUser) {
                throw new Error(this.getTranslation('emailAlreadyExists'));
            }

            // Create new user
            const newUser = {
                id: Date.now().toString(),
                email: email.toLowerCase(),
                password: password,
                hasCompletedInfo: false,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };

            this.users.push(newUser);
            this.currentUser = newUser;

            // Save to localStorage
            localStorage.setItem("users", JSON.stringify(this.users));
            localStorage.setItem("currentUser", JSON.stringify(newUser));

            this.showSuccess(this.getTranslation('registrationSuccess'));

            // Redirect after delay
            setTimeout(() => {
                window.location.href = "basic-info.html";
            }, 1500);

            return { success: true, user: newUser };

        } catch (error) {
            this.showError(error.message);
            return { success: false, error: error.message };
        } finally {
            this.showLoading(false);
        }
    }

    // Enhanced logout functionality
    logout() {
        if (this.currentUser) {
            // Show confirmation dialog
            const confirmed = confirm(this.getTranslation('logoutConfirmation'));
            
            if (confirmed) {
                // Clear user data
                this.currentUser = null;
                localStorage.removeItem("currentUser");
                
                // Show logout message
                this.showSuccess(this.getTranslation('logoutSuccess'));
                
                // Redirect after delay
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1000);
            }
        }
    }

    // Utility functions
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showLoading(show) {
        const buttons = document.querySelectorAll('.btn[type="submit"], .btn.auth-btn');
        buttons.forEach(btn => {
            if (show) {
                btn.disabled = true;
                btn.innerHTML = `<span class="loading"></span> ${this.getTranslation('loading')}`;
                btn.classList.add('loading-state');
            } else {
                btn.disabled = false;
                btn.classList.remove('loading-state');
                // Restore original text based on context
                if (btn.id === 'loginButton') {
                    btn.textContent = this.getTranslation('loginButton');
                } else if (btn.id === 'registerButton') {
                    btn.textContent = this.getTranslation('registerButton');
                }
            }
        });
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.auth-message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message auth-message-${type}`;
        messageDiv.textContent = message;

        // Insert message
        const form = document.querySelector('form');
        if (form) {
            form.appendChild(messageDiv);
            
            // Auto-hide after delay
            setTimeout(() => {
                messageDiv.classList.add('fade-out');
                setTimeout(() => messageDiv.remove(), 300);
            }, 5000);
        }
    }

    getTranslation(key) {
        const currentLang = localStorage.getItem("selectedLanguage") || "en";
        return authTranslations[currentLang] && authTranslations[currentLang][key] 
            ? authTranslations[currentLang][key] 
            : key;
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                await this.login(email, password);
            });
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('regEmail').value;
                const password = document.getElementById('regPassword').value;
                const confirmPassword = document.getElementById('regConfirmPassword')?.value || password;
                await this.register(email, password, confirmPassword);
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }
}

// Authentication translations
const authTranslations = {
    en: {
        emailRequired: "Email is required",
        emailTooShort: "Email is too short",
        emailTooLong: "Email is too long",
        emailInvalid: "Please enter a valid email address",
        emailNotFound: "Email not found",
        emailAlreadyExists: "Email already exists",
        passwordRequired: "Password is required",
        passwordTooShort: "Password must be at least {min} characters long",
        passwordTooLong: "Password is too long",
        passwordNeedsUppercase: "Password must contain at least one uppercase letter",
        passwordNeedsLowercase: "Password must contain at least one lowercase letter",
        passwordNeedsNumbers: "Password must contain at least one number",
        passwordNeedsSpecialChars: "Password must contain at least one special character",
        passwordsDoNotMatch: "Passwords do not match",
        passwordStrength: "Password Strength:",
        passwordStrengthWeak: "Weak",
        passwordStrengthFair: "Fair",
        passwordStrengthMedium: "Medium",
        passwordStrengthStrong: "Strong",
        wrongPassword: "Incorrect password",
        invalidCredentials: "Please check your email and password",
        loginSuccess: "Login successful! Redirecting...",
        registrationSuccess: "Account created successfully! Redirecting...",
        logoutConfirmation: "Are you sure you want to logout?",
        logoutSuccess: "Logged out successfully",
        loading: "Loading..."
    },
    ar: {
        emailRequired: "البريد الإلكتروني مطلوب",
        emailTooShort: "البريد الإلكتروني قصير جداً",
        emailTooLong: "البريد الإلكتروني طويل جداً",
        emailInvalid: "الرجاء إدخال بريد إلكتروني صحيح",
        emailNotFound: "البريد الإلكتروني غير موجود",
        emailAlreadyExists: "البريد الإلكتروني موجود بالفعل",
        passwordRequired: "كلمة المرور مطلوبة",
        passwordTooShort: "كلمة المرور يجب أن تكون {min} أحرف على الأقل",
        passwordTooLong: "كلمة المرور طويلة جداً",
        passwordNeedsUppercase: "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل",
        passwordNeedsLowercase: "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل",
        passwordNeedsNumbers: "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل",
        passwordNeedsSpecialChars: "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل",
        passwordsDoNotMatch: "كلمات المرور غير متطابقة",
        passwordStrength: "قوة كلمة المرور:",
        passwordStrengthWeak: "ضعيفة",
        passwordStrengthFair: "عادلة",
        passwordStrengthMedium: "متوسطة",
        passwordStrengthStrong: "قوية",
        wrongPassword: "كلمة مرور خاطئة",
        invalidCredentials: "الرجاء التحقق من البريد الإلكتروني وكلمة المرور",
        loginSuccess: "تم تسجيل الدخول بنجاح! جاري التحويل...",
        registrationSuccess: "تم إنشاء الحساب بنجاح! جاري التحويل...",
        logoutConfirmation: "هل أنت متأكد من تسجيل الخروج؟",
        logoutSuccess: "تم تسجيل الخروج بنجاح",
        loading: "جاري التحميل..."
    }
};

// Initialize auth system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});
