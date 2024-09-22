import {
    COUNTRY_CODES,
    COST_CENTER_CODES,
    DOCUMENT_TYPES,
    PROJECT_NAMES,
    FILE_NUMBERS_API
} from '../API/apiEndpoints.js'; 

import {
    COUNTRY_CODE,
    COST_CENTER, 
    DOCUMENT_TYPE,
    PROJECT_NAME
} from '../utils/constants.js'; 

import { selectOptionsFromResponse } from '../Services/drop_down_services.js';


let fileNumbers = [];
let totalItems = 0;
let currentPage = 1;
const itemsPerPage = 5; 
 
const FILTER_INDEX = {
    COUNTRY_CODE: 0,
    COST_CENTER: 1,
    PROJECT_NAME: 2,
    DOCUMENT_TYPE: 3
};

export function setupDropdownListeners() {
    const dropdownIds = ['countryCode', 'costCenter', 'projectName', 'documentType'];

    dropdownIds.forEach(id => {
        document.getElementById(id).addEventListener('change', () => {
            currentPage = 1;
            get_all_file_numbers();
        });
    });
} 



function getFileNumberComponents(fileNumber) {
    return fileNumber.split('-');

}

export async function get_all_file_numbers() {
    try {
        const response = await fetch(FILE_NUMBERS_API);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const result = await response.json();
        if (result.status_message === 'SUCCESS') {
            
            if (Array.isArray(result.data.file_numbers)) {
                fileNumbers = result.data.file_numbers.map(item => ({
                    fileNumber: item.file_number,
                    createdDate: item.created_at,
                    countryCode: item.country_name,
                    costCenter: item.cost_center_name,
                    projectCode: item.project_name,
                    documentType: item.document_type_name,
                    remarks: item.remarks || '',
                    createdBy: item.created_by || ''
                })); 

                totalItems = fileNumbers.length;
                displayPage(currentPage);
                setupPagination();
            } else {
                console.error('Expected result.data.file_numbers to be an array.');
            }
        } else {
            console.error('API response error:', result.status_message);
        }
    } catch (error) {
        console.error('Error fetching file numbers:', error);
    }
}

function buildFilterPrefix() {
    return {
        countryCode: document.getElementById("countryCode").value || '',
        costCenter: document.getElementById("costCenter").value || '',
        projectName: document.getElementById("projectName").value || '',
        documentType: document.getElementById("documentType").value || ''
    };
}


export function displayPage(page) {
    const tbody = document.getElementById('existingNumbers');
    tbody.innerHTML = '';

    const filters = buildFilterPrefix();

    const filteredNumbers = fileNumbers.filter(({ fileNumber }) => {
        const components = getFileNumberComponents(fileNumber);

        const matchesCountryCode = !filters.countryCode || (components[FILTER_INDEX.COUNTRY_CODE] === filters.countryCode);
        const matchesCostCenter = !filters.costCenter || (components[FILTER_INDEX.COST_CENTER] === filters.costCenter);
        const matchesProjectName = !filters.projectName || (components[FILTER_INDEX.PROJECT_NAME] === filters.projectName);
        const matchesDocumentType = !filters.documentType || (components[FILTER_INDEX.DOCUMENT_TYPE] === filters.documentType);

        return matchesCountryCode && matchesCostCenter && matchesProjectName && matchesDocumentType;
    });

    totalItems = filteredNumbers.length; 
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems); 

    for (let i = startIndex; i < endIndex; i++) {
        const { fileNumber, createdDate, remarks, countryCode, costCenter, projectCode, documentType, createdBy } = filteredNumbers[i];
        const components = getFileNumberComponents(fileNumber); 
        const row = document.createElement('tr');

       
        const cellFileNumber = document.createElement('td');
        cellFileNumber.textContent = fileNumber;
        cellFileNumber.title = fileNumber;
        row.appendChild(cellFileNumber);

        
        const cellCreatedDate = document.createElement('td');
        cellCreatedDate.textContent = createdDate; 
        cellCreatedDate.title = createdDate;
        row.appendChild(cellCreatedDate);

        const cellCountryCode = document.createElement('td');
        cellCountryCode.textContent = `${countryCode} (${components[FILTER_INDEX.COUNTRY_CODE]})`;
        cellCountryCode.title = `${countryCode} (${components[FILTER_INDEX.COUNTRY_CODE]})`;  
        row.appendChild(cellCountryCode);

        
        const cellCostCenter = document.createElement('td');
        cellCostCenter.textContent = `${costCenter} (${components[FILTER_INDEX.COST_CENTER]})`; 
        cellCostCenter.title = `${costCenter} (${components[FILTER_INDEX.COST_CENTER]})`; 
        row.appendChild(cellCostCenter);

        const cellProjectCode = document.createElement('td');
        cellProjectCode.textContent = `${projectCode} (${components[FILTER_INDEX.PROJECT_NAME]})`;
        cellProjectCode.title = `${projectCode} (${components[FILTER_INDEX.PROJECT_NAME]})`; 
        row.appendChild(cellProjectCode);

        
        const cellDocumentType = document.createElement('td');
        cellDocumentType.textContent = `${documentType} (${components[FILTER_INDEX.DOCUMENT_TYPE]})`;
        cellDocumentType.title = `${documentType} (${components[FILTER_INDEX.DOCUMENT_TYPE]})`;
        row.appendChild(cellDocumentType);

        const cellRemarks = document.createElement('td');
        cellRemarks.textContent = remarks || '';
        row.appendChild(cellRemarks);

        const cellView = document.createElement('td');
        cellView.textContent = '👁️'; 
        cellView.style.cursor = 'pointer'; 
        cellView.title = 'View Details'; 

        cellView.addEventListener('click', () => {
            
            document.getElementById('modalFileNumber').textContent = `${fileNumber}`;
            document.getElementById('modalCountrycode').textContent = `${countryCode} (${components[FILTER_INDEX.COUNTRY_CODE]})`;
            document.getElementById('modalCostCentercode').textContent = `${costCenter} (${components[FILTER_INDEX.COST_CENTER]})`;
            document.getElementById('modalProjectcode').textContent = `${projectCode} (${components[FILTER_INDEX.PROJECT_NAME]})`;
            document.getElementById('modalTypecode').textContent = `${documentType} (${components[FILTER_INDEX.DOCUMENT_TYPE]})`;
            document.getElementById('modalDate').textContent = `${createdDate}`;
            document.getElementById('modalComments').textContent = `${remarks || ''}`;
            document.getElementById('modalCreatedBy').textContent = `${createdBy || 'User'}`;
            document.getElementById('eyedetailsModal').style.display = 'block';
        });

        row.appendChild(cellView); 

        const cellCreatedBy = document.createElement('td');
        cellCreatedBy.textContent = createdBy || "User" ; 
        cellCreatedBy.title = createdBy;
        row.appendChild(cellCreatedBy);

        tbody.appendChild(row);
    }

    document.getElementById('closeDetails').addEventListener('click', () => {
        document.getElementById('eyedetailsModal').style.display = 'none';
    });

    window.onclick = function(event) {
        const modal = document.getElementById('eyedetailsModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

async function filterCountryCode() {
    displayPage(currentPage);
}

async function filterCostCenter() {
    displayPage(currentPage);
}

async function filterProjectName() {
    displayPage(currentPage);
}

async function filterDocumentType() {
    displayPage(currentPage);
}


export function setupPagination() {
    const paginationControls = document.getElementById('paginationControls');
    paginationControls.innerHTML = ''; 

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const maxVisibleButtons = 5; 

    const prevButton = document.createElement('button');
    prevButton.textContent = '<';
    prevButton.disabled = currentPage === 1; 
    prevButton.className = currentPage === 1 ? 'button-blue' : 'button-black';

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayPage(currentPage);
            setupPagination(); 
        }
    });

    paginationControls.appendChild(prevButton);

    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = startPage + maxVisibleButtons - 1;

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = currentPage === i ? 'button-active' : 'button-inactive';

        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayPage(currentPage);
            setupPagination(); 
        });

        paginationControls.appendChild(pageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.textContent = '>';
    nextButton.disabled = currentPage === totalPages; 
    nextButton.className = currentPage === totalPages ? 'button-black' : 'button-blue';

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayPage(currentPage);
            setupPagination(); 
        }
    });

    paginationControls.appendChild(nextButton);

    const pageInfo = document.createElement('span');
    pageInfo.textContent = ` Page ${currentPage} of ${totalPages}`;
    paginationControls.appendChild(pageInfo);
}


export async function dropDownsSelections() {
    await selectOptionsFromResponse(COUNTRY_CODES, 'countryCode', 'isd_code', 'country_name', COUNTRY_CODE);
    await selectOptionsFromResponse(COST_CENTER_CODES, 'costCenter', 'cost_center_code', 'cost_center', COST_CENTER);
    await selectOptionsFromResponse(DOCUMENT_TYPES, 'documentType', 'document_type_code', 'document_type', DOCUMENT_TYPE);
    await selectOptionsFromResponse(PROJECT_NAMES, 'projectName', 'project_code', 'project_name', PROJECT_NAME);
}



document.getElementById('countryCode').addEventListener('change', filterCountryCode);
document.getElementById('costCenter').addEventListener('change', filterCostCenter);
document.getElementById('projectName').addEventListener('change', filterProjectName);
document.getElementById('documentType').addEventListener('change', filterDocumentType);
