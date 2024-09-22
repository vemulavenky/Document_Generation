import {openModal, closeModal} from './models_components.js';

import { fetchFileNumberInfo } from '../Services/existing_file_number_details_service.js';

let originalHeight = 0;


export function adjustTextareaHeight(textarea) {
    if (originalHeight === 0) {
        originalHeight = textarea.offsetHeight;
    }
    textarea.style.height = 'auto'; 
    textarea.style.height = textarea.scrollHeight + 'px'; 
}

function restoreTextareaHeight() {
    const responseText = document.getElementById('responseText');
    if (originalHeight > 0) {
        responseText.style.height = originalHeight + 'px'; 
    }
}

function resetModal() {
    const responseText = document.getElementById('responseText');
    const fileNumberInput = document.getElementById('fileNumberInput');
    responseText.value = '';
    fileNumberInput.value = '';

    if (originalHeight > 0) {
        responseText.style.height = originalHeight + 'px'; 
    }
}


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("searchIcon").onclick = function() {
        openModal("searchModal");
        restoreTextareaHeight();
    };

    document.getElementById("closeModal").onclick = function() {
        closeModal("searchModal"); 
        resetModal();
    };

    document.getElementById('generateButton').addEventListener('click', () => {
        const fileNumberInput = document.getElementById('fileNumberInput');
        const fileNumber = fileNumberInput.value;
        fetchFileNumberInfo(fileNumber);
    });
});