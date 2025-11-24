// Language Switcher
function switchLanguage(lang) {
    const currentPath = window.location.pathname;
    const currentFile = currentPath.split('/').pop();
    
    if (lang === 'ar') {
        // Switch to Arabic version
        if (currentFile === 'index.html' || currentFile === '') {
            window.location.href = 'index-ar.html';
        } else {
            const arabicFile = currentFile.replace('.html', '-ar.html');
            window.location.href = arabicFile;
        }
    } else {
        // Switch to English version
        if (currentFile.includes('-ar.html')) {
            const englishFile = currentFile.replace('-ar.html', '.html');
            window.location.href = englishFile;
        } else {
            window.location.href = 'index.html';
        }
    }
}

// Initialize language based on current page
document.addEventListener('DOMContentLoaded', function() {
    const currentFile = window.location.pathname.split('/').pop();
    const langToggle = document.getElementById('lang-toggle');
    
    if (currentFile.includes('-ar.html')) {
        document.body.classList.add('rtl');
        if (langToggle) langToggle.textContent = 'EN';
    } else {
        document.body.classList.remove('rtl');
        if (langToggle) langToggle.textContent = 'AR';
    }
    
    // Add event listener to language toggle button
    if (langToggle) {
        langToggle.addEventListener('click', function() {
            const currentFile = window.location.pathname.split('/').pop();
            if (currentFile.includes('-ar.html')) {
                switchLanguage('en');
            } else {
                switchLanguage('ar');
            }
        });
    }
});