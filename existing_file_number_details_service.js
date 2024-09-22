import {FILE_NUMBER_INFO} from '../API/apiEndpoints.js'; 
import { adjustTextareaHeight } from '../ui/existing_file_number_details_model_component.js';

export async function fetchFileNumberInfo(fileNumber) {
    const responseText = document.getElementById('responseText');
    const fileNumberPattern = /^[\w-]+$/;


    if (fileNumber) {
        if (!fileNumberPattern.test(fileNumber)) {
            responseText.value = 'Error: You are not entering the correct format. Please use a format similar to XXX-XXX-XXX-XX-XX.';
            return;
        }

        try {
            const response = await fetch(`${FILE_NUMBER_INFO}/${fileNumber}`);
            const data = await response.json();

            if (data.status_message === "SUCCESS") {
                const { country, cost_center, document_type, project, file_version, created_at, created_by, remarks } = data.data;
                const resultText = `
                        Country: ${country}
                        Cost Center: ${cost_center}
                        Document Type: ${document_type}
                        Project: ${project}
                        File Version: ${file_version} Version of the Document Number
                        Created At: ${created_at}
                        Created By: ${created_by ?? 'NULL'}  
                        Comment: ${remarks ?? 'NULL'}
                    `;
                        responseText.value = resultText;
                        adjustTextareaHeight(responseText);
            } else {
                responseText.value = 'THERE IS NO INFORMATION';
            }
        } catch (error) {
            responseText.value = 'Error: ' + error.message;
        }
    } else {
        responseText.value = 'Please enter a file number.';
    }
}
