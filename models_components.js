import {COST_CENTER_CREATE, 
    DOCUMENT_TYPE_CREATE, 
   PROJECT_NAME_CREATE, 
   COST_CENTER_UPDATE, 
   UPDATE_PROJECT_NAME, 
   DOCUMENT_TYPE_UPDATE,
   DELETE_PROJECT_NAME,
   COST_CENTER_DELETE,
   DOCUMENT_TYPE_DELETE,
   USER_INFO_CREATE,
   USER_INFO_UPDATE}
from '../API/apiEndpoints.js';
import { saveData,saveUserData, updateData , deleteData, updateUserRole} from '../Services/add_button_services.js';


function openEditModal(dropdownId, inputId, modalId) {
 debugger;
 const dropdown = document.getElementById(dropdownId);
 const selectedIndex = dropdown.selectedIndex;
 const selectedText = dropdown.options[selectedIndex].text;

 console.log('Selected Index:', selectedIndex);
 console.log('Selected Value:', selectedText);


 if (selectedIndex === 0 || !selectedText) {
     alert(`Please select a ${dropdownId} to edit.`);
     return;
 }

 const inputField = document.getElementById(inputId);
 inputField.value = selectedText; 
 console.log('Input Field Value After Assignment:', inputField.value);

 openModal(modalId);
}



export function openModal(modalId) {
 document.getElementById(modalId).style.display = "block";
}

export function closeModal(modalId) {
 document.getElementById(modalId).style.display = "none";
} 


document.addEventListener('keydown', function(event) {
    
    if (event.key === "Escape") { 
        closeModal(); 
    }
});

export function isFirstLetterCapitalized(str) {
 return str.length > 0 && str.charAt(0) === str.charAt(0).toUpperCase();
}


function saveUser() {
    saveUserData(USER_INFO_CREATE, 'myModal');
} 

function updateRole() {
    updateUserRole(USER_INFO_UPDATE, 'myModal');
}

function saveCostCenter() {
 saveData(COST_CENTER_CREATE, 'cost_center', 'newCostCenter', 'costCenterModal');
 
} 

function updateCostCenter() {
 updateData(COST_CENTER_UPDATE, 'costCenter', 'newCostCenterEditModal', 'cost_center')
} 

function deleteCostCenter() {
 deleteData(COST_CENTER_DELETE, 'costCenter')
} 


function saveProjectName() {
 saveData(PROJECT_NAME_CREATE, 'project_name', 'newProjectName', 'projectNameModal');
}


function updateProjectName() {
 updateData(UPDATE_PROJECT_NAME, 'projectName', 'newProjectEditModal', 'project_name')
} 

function deleteProjectName() {
 deleteData(DELETE_PROJECT_NAME, 'projectName', 'newProjectEditModal', 'project_name')
}

function saveDocumentType() {
 saveData(DOCUMENT_TYPE_CREATE, 'document_type', 'newDocumentType', 'documentTypeModal');
} 

function updateDocumentType() {
 updateData(DOCUMENT_TYPE_UPDATE, 'documentType', 'newDocumentTypeEditModal', 'document_type')
}

function deleteDocumentType() {
 deleteData(DOCUMENT_TYPE_DELETE, 'documentType')
}



document.addEventListener('DOMContentLoaded', () => { 
 document.getElementById('addUsers').addEventListener('click', () => openModal('myModal'));
 document.getElementById('openCostCenterModal').addEventListener('click', () => openModal('costCenterModal'));
 document.getElementById('openProjectNameModal').addEventListener('click', () => openModal('projectNameModal'));
 document.getElementById('openDocumentTypeModal').addEventListener('click', () => openModal('documentTypeModal')); 
 document.getElementById('editDocumentType').addEventListener('click', () => openEditModal('documentType', 'newDocumentTypeEditModal', 'editDocumentTypeModal'));
 document.getElementById('editCostCenter').addEventListener('click', () => openEditModal('costCenter', 'newCostCenterEditModal', 'editcostCenterModal'));
 document.getElementById('editProjectName').addEventListener('click', () => openEditModal('projectName', 'newProjectEditModal', 'editProjectTypeModal'));

 document.getElementById('closeUserModal').addEventListener('click', () => closeModal('myModal'));
 document.getElementById('closeCostCenterModal').addEventListener('click', () => closeModal('costCenterModal'));
 document.getElementById('closeProjectNameModal').addEventListener('click', () => closeModal('projectNameModal'));
 document.getElementById('closeDocumentTypeModal').addEventListener('click', () => closeModal('documentTypeModal')); 
 document.getElementById('closeEditDocumentTypeModal').addEventListener('click', () => closeModal('editDocumentTypeModal'));
 document.getElementById('closeEditCostCenterModal').addEventListener('click', () => closeModal('editcostCenterModal')); 
 document.getElementById('closeEditProjectTypeModal').addEventListener('click', () => closeModal('editProjectTypeModal'));



 document.getElementById('saveCostCenterButton').addEventListener('click', saveCostCenter);
 document.getElementById('saveProjectNameButton').addEventListener('click', saveProjectName);
 document.getElementById('saveDocumentTypeButton').addEventListener('click', saveDocumentType); 
 document.getElementById('addButton').addEventListener('click', saveUser); 
 document.getElementById('updateButton').addEventListener('click', updateRole); 

 document.getElementById('updateCostCenterButton').addEventListener('click', updateCostCenter);
 document.getElementById('updateProjectNameButton').addEventListener('click', updateProjectName); 
 document.getElementById('updateDocumentTypeButton').addEventListener('click', updateDocumentType); 
 document.getElementById('deleteCostCenterButton').addEventListener('click', deleteCostCenter); 
 document.getElementById('deleteDocumentTypeButton').addEventListener('click', deleteDocumentType); 
 document.getElementById('deleteProjectNameButton').addEventListener('click', deleteProjectName); 

 
});

