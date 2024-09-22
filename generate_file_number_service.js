import { FILE_NUMBER_CREATE } from '../API/apiEndpoints.js';
import { get_all_file_numbers } from '../ui/dropdowns_filteration_pagination_component.js'; 
import { GENERATED_FILE_NUMBER_SUCCESSFULLY_COPIED } from '../utils/constants.js'; 
import {closeModal} from '../ui/models_components.js'

export async function generateFileNumber(countryCode, costCenter, documentType, projectName, remarks) {
    if (!countryCode || !costCenter || !documentType || !projectName) {
        alert("Please select all required fields.");
        return;
    }
    try { 
        const createdBy = window.localStorage.getItem('userFullName');
        const requestBody = {
            cost_center_code: costCenter,
            country_code: countryCode,
            document_type_code: documentType,
            project_code: projectName,
            remarks: remarks,
            created_by: createdBy 
        };

        const response = await fetch(FILE_NUMBER_CREATE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {
            const result = await response.json();
            const generatedFileNumber = result.data.generated_file_number;

            document.getElementById('generatedNumber').textContent = generatedFileNumber;

            const copyIcon = document.getElementById('copyIcon');
            copyIcon.style.cursor = 'pointer';
            copyIcon.style.opacity = '1';
            copyIcon.classList.add('enabled');

            copyIcon.title = 'Copy to clipboard';
            
            copyIcon.addEventListener('click', () => {
                const generatedNumberText = document.getElementById('generatedNumber').textContent;
                
                navigator.clipboard.writeText(generatedNumberText).then(() => {
                    alert(GENERATED_FILE_NUMBER_SUCCESSFULLY_COPIED);
                    closeModal("detailsModal");
                    window.onload();
                }).catch(err => {
                    console.error('Failed to copy file number: ', err);
                });
            });

            await get_all_file_numbers(); 
        } else {
            const errorResult = await response.json();
            alert(`Error: ${errorResult.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
} 


