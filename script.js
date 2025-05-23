// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const removeFile = document.getElementById('removeFile');
const previewFile = document.getElementById('previewFile');
const password = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const passwordStrength = document.getElementById('passwordStrength');
const strengthText = document.getElementById('strengthText');
const encryptBtn = document.getElementById('encryptBtn');
const decryptBtn = document.getElementById('decryptBtn');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');
const themeToggle = document.querySelector('.theme-toggle');
const generatePassword = document.getElementById('generatePassword');
const savePassword = document.getElementById('savePassword');
const passwordModal = document.getElementById('passwordModal');
const closeModal = document.querySelector('.close-modal');
const generateNewPassword = document.getElementById('generateNewPassword');
const copyPassword = document.getElementById('copyPassword');
const generatedPassword = document.getElementById('generatedPassword');
const passwordLength = document.getElementById('passwordLength');
const lengthValue = document.getElementById('lengthValue');

// State
let currentFile = null;
let savedPasswords = JSON.parse(localStorage.getItem('savedPasswords') || '[]');

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    themeToggle.innerHTML = document.body.dataset.theme === 'dark' ? 
        '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', document.body.dataset.theme);
});

// Load saved theme
document.body.dataset.theme = localStorage.getItem('theme') || 'light';
themeToggle.innerHTML = document.body.dataset.theme === 'dark' ? 
    '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

// Password Visibility Toggle
togglePassword.addEventListener('click', () => {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    togglePassword.className = type === 'password' ? 'fas fa-eye-slash' : 'fas fa-eye';
});

// Password Strength Checker
password.addEventListener('input', () => {
    const value = password.value;
    let strength = 0;
    let feedback = '';
    
    if (value.length >= 8) strength++;
    if (value.match(/[a-z]/) && value.match(/[A-Z]/)) strength++;
    if (value.match(/\d/)) strength++;
    if (value.match(/[^a-zA-Z\d]/)) strength++;
    
    passwordStrength.className = 'password-strength';
    if (strength > 0) {
        if (strength <= 2) {
            passwordStrength.classList.add('weak');
            feedback = 'Weak - Add more complexity';
        } else if (strength === 3) {
            passwordStrength.classList.add('medium');
            feedback = 'Medium - Almost there';
        } else {
            passwordStrength.classList.add('strong');
            feedback = 'Strong - Good job!';
        }
    }
    strengthText.textContent = feedback;
});

// File Upload Handling
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--primary-color)';
    dropZone.style.background = 'rgba(74, 144, 226, 0.1)';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = '';
    dropZone.style.background = '';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '';
    dropZone.style.background = '';
    
    const file = e.dataTransfer.files[0];
    handleFile(file);
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    handleFile(file);
});

function handleFile(file) {
    if (!file) return;
    
    currentFile = file;
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    fileInfo.style.display = 'flex';
    dropZone.style.display = 'none';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

removeFile.addEventListener('click', () => {
    currentFile = null;
    fileInput.value = '';
    fileInfo.style.display = 'none';
    dropZone.style.display = 'block';
});

// File Preview
previewFile.addEventListener('click', () => {
    if (!currentFile) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const previewWindow = window.open('', '_blank');
        previewWindow.document.write(`
            <html>
                <head>
                    <title>File Preview - ${currentFile.name}</title>
                    <style>
                        body { margin: 0; padding: 20px; background: #f0f2f5; }
                        .preview-container { 
                            max-width: 800px; 
                            margin: 0 auto; 
                            background: white;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        }
                    </style>
                </head>
                <body>
                    <div class="preview-container">
                        <h2>${currentFile.name}</h2>
                        <p>Size: ${formatFileSize(currentFile.size)}</p>
                        <hr>
                        <pre>${e.target.result}</pre>
                    </div>
                </body>
            </html>
        `);
    };
    reader.readAsText(currentFile);
});

// Password Generator
generatePassword.addEventListener('click', () => {
    passwordModal.classList.add('show');
    generateNewPassword.click();
});

closeModal.addEventListener('click', () => {
    passwordModal.classList.remove('show');
});

passwordLength.addEventListener('input', () => {
    lengthValue.textContent = passwordLength.value;
    generateNewPassword.click();
});

function generateStrongPassword() {
    const length = parseInt(passwordLength.value);
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeLowercase = document.getElementById('includeLowercase').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;
    
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let chars = '';
    if (includeUppercase) chars += uppercase;
    if (includeLowercase) chars += lowercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;
    
    if (chars === '') {
        showNotification('Please select at least one character type', 'error');
        return;
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    generatedPassword.value = password;
}

generateNewPassword.addEventListener('click', generateStrongPassword);

copyPassword.addEventListener('click', () => {
    generatedPassword.select();
    document.execCommand('copy');
    showNotification('Password copied to clipboard!', 'success');
});

// Save Password
savePassword.addEventListener('click', () => {
    if (!password.value) {
        showNotification('Please enter a password first', 'error');
        return;
    }
    
    const name = prompt('Enter a name for this password:');
    if (!name) return;
    
    savedPasswords.push({ name, password: password.value });
    localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
    showNotification('Password saved successfully!', 'success');
});

// Notification System
function showNotification(message, type = 'info') {
    notification.className = 'notification';
    notification.classList.add(type);
    notificationText.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Encryption/Decryption Functions
async function getKey(password) {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', passwordBuffer);
    return crypto.subtle.importKey(
        'raw',
        hashBuffer,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
    );
}

async function encryptFile(file, password) {
    try {
        const key = await getKey(password);
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const fileBuffer = await file.arrayBuffer();
        
        const encryptedData = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            fileBuffer
        );
        
        // Combine IV and encrypted data
        const result = new Uint8Array(iv.length + encryptedData.byteLength);
        result.set(iv);
        result.set(new Uint8Array(encryptedData), iv.length);
        
        return new Blob([result], { type: 'application/encrypted' });
    } catch (error) {
        throw new Error('Encryption failed: ' + error.message);
    }
}

async function decryptFile(file, password) {
    try {
        const key = await getKey(password);
        const fileBuffer = await file.arrayBuffer();
        
        // Extract IV and encrypted data
        const iv = new Uint8Array(fileBuffer.slice(0, 12));
        const encryptedData = fileBuffer.slice(12);
        
        const decryptedData = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            key,
            encryptedData
        );
        
        return new Blob([decryptedData]);
    } catch (error) {
        throw new Error('Decryption failed: Invalid password or corrupted file');
    }
}

// Download Helper
function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Button Event Listeners
encryptBtn.addEventListener('click', async () => {
    if (!currentFile) {
        showNotification('Please select a file first', 'error');
        return;
    }
    
    if (!password.value) {
        showNotification('Please enter a password', 'error');
        return;
    }
    
    try {
        encryptBtn.disabled = true;
        encryptBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Encrypting...';
        
        const encryptedBlob = await encryptFile(currentFile, password.value);
        downloadFile(encryptedBlob, currentFile.name + '.encrypted');
        showNotification('File encrypted successfully!', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    } finally {
        encryptBtn.disabled = false;
        encryptBtn.innerHTML = '<i class="fas fa-lock"></i> Encrypt';
    }
});

decryptBtn.addEventListener('click', async () => {
    if (!currentFile) {
        showNotification('Please select a file first', 'error');
        return;
    }
    
    if (!password.value) {
        showNotification('Please enter a password', 'error');
        return;
    }
    
    try {
        decryptBtn.disabled = true;
        decryptBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Decrypting...';
        
        const decryptedBlob = await decryptFile(currentFile, password.value);
        const filename = currentFile.name.replace('.encrypted', '');
        downloadFile(decryptedBlob, filename);
        showNotification('File decrypted successfully!', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    } finally {
        decryptBtn.disabled = false;
        decryptBtn.innerHTML = '<i class="fas fa-unlock"></i> Decrypt';
    }
}); 