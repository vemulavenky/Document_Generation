
document.addEventListener('DOMContentLoaded', () => {
    const copyIcon = document.getElementById('copyIcon');
    const generatedNumberElement = document.getElementById('generatedNumber');

    function copyToClipboard(text) {
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
    }

    function enableCopyIcon() {
        if (generatedNumberElement.textContent.trim() !== 'Your Generated file number will appear here') {
            copyIcon.style.cursor = 'pointer';
            copyIcon.style.opacity = '1';
            copyIcon.classList.add('enabled');
        } else {
            copyIcon.style.cursor = 'not-allowed';
            copyIcon.style.opacity = '0.5';
            copyIcon.classList.remove('enabled');
        }
    }

   
    copyIcon.addEventListener('click', () => {
        if (copyIcon.classList.contains('enabled')) {
            copyToClipboard(generatedNumberElement.textContent.trim());
           
            copyIcon.title = 'Copied!';
            setTimeout(() => {
                copyIcon.title = 'Copy'; 
            }, 2000);
        }
    });
    enableCopyIcon();
});
