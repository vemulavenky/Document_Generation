import { generateFileNumber } from "../Services/generate_file_number_service.js";
import { get_all_file_numbers } from "./dropdowns_filteration_pagination_component.js";



document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generateFileNumberButton');
    const tooltipText = generateButton.querySelector('.tooltip-text');

    const checkDropdowns = () => {
        const countryCode = document.getElementById('countryCode').value;
        const costCenter = document.getElementById('costCenter').value;
        const projectName = document.getElementById('projectName').value;
        const documentType = document.getElementById('documentType').value;

        return countryCode && costCenter && projectName && documentType;
    };

    const hideTooltip = () => {
        tooltipText.style.display = 'none';
    };

    document.getElementById('countryCode').addEventListener('change', hideTooltip);
    document.getElementById('costCenter').addEventListener('change', hideTooltip);
    document.getElementById('projectName').addEventListener('change', hideTooltip);
    document.getElementById('documentType').addEventListener('change', hideTooltip);

    generateButton.addEventListener('click', () => {
        if (checkDropdowns()) {
            const countryName = document.querySelector('#countryCode option:checked').textContent;
            const costCenterName = document.querySelector('#costCenter option:checked').textContent;
            const projectNameDisplay = document.querySelector('#projectName option:checked').textContent;
            const documentTypeDisplay = document.querySelector('#documentType option:checked').textContent;

            document.getElementById('modalCountry').textContent = ` ${countryName} (${document.getElementById('countryCode').value})`;
            document.getElementById('modalCostCenter').textContent = ` ${costCenterName} (${document.getElementById('costCenter').value})`;
            document.getElementById('modalProject').textContent = `${projectNameDisplay} (${document.getElementById('projectName').value})`;
            document.getElementById('modalType').textContent = `${documentTypeDisplay} (${document.getElementById('documentType').value})`;

            // Open the modal
            document.getElementById('detailsModal').style.display = 'block';
        } else {
            tooltipText.style.display = 'block'; 
        }
    });

    document.getElementById('closeDetailsModal').addEventListener('click', () => {
        document.getElementById('detailsModal').style.display = 'none';
        window.location.reload();
    });

    document.getElementById('detailsGenerateBtn').addEventListener('click', async () => {
        const remarks = document.getElementById('modalComment').value;

        const countryCode = document.getElementById('countryCode').value;
        const costCenter = document.getElementById('costCenter').value;
        const documentType = document.getElementById('documentType').value;
        const projectName = document.getElementById('projectName').value;

        await generateFileNumber(countryCode, costCenter, documentType, projectName, remarks);
        await get_all_file_numbers();
    });

    document.addEventListener('click', (event) => {
        if (!generateButton.contains(event.target) && !tooltipText.contains(event.target)) {
            hideTooltip();
        }
    });

});
