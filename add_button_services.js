import { isFirstLetterCapitalized } from "../ui/models_components.js";
import { closeModal } from "../ui/models_components.js"; 
 


export async function saveData(endpoint, dataKey, inputId, modalId) {
    const value = document.getElementById(inputId).value.trim();
    if (value === "") {
        alert(`${dataKey} CANNOT BE EMPTY.`);
        return;
    }

    if (!isFirstLetterCapitalized(value)) {
        alert(`${dataKey} MUST_START_WITH_A_CAPITAL_LETTER.`);
        return;
    }

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ [dataKey]: value }), 
        });

        if (response.ok) {
            const result = await response.json();
            alert(`${dataKey} ADDED SUCCESSFULLY.`);
            document.getElementById(inputId).value = ""; 
            closeModal(modalId);
            window.onload();
        } else {
            const errorResult = await response.json();
            if (errorResult.detail === "COST_CENTER_NAME_ALREADY_EXIST" || errorResult.detail === "DOCUMENT_TYPE_ALREADY_EXIST" || errorResult.detail === "PROJECT_NAME_ALREADY_EXIST") {
                alert(`Error: ${errorResult.detail}`);
            } else {
                alert(`Error: ${errorResult.message}`);
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
} 


export async function saveUserData(endpoint, modalId) {
    const email = document.getElementById('textbox1').value.trim();
    const role = document.getElementById('textbox2').value;
    const fullName = document.getElementById('textbox3').value.trim();

    
    if (email === "" || role === "" || fullName === "") {
        alert("All fields must be filled out.");
        return;
    }

    if (!isFirstLetterCapitalized(fullName)) {
        alert("Full Name must start with a capital letter.");
        return;
    }

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email_id: email,
                role: role,
                name: fullName
            }), 
        });

        if (response.ok) {
            const result = await response.json();
            alert("Data added successfully.");
            document.getElementById('textbox1').value = "";
            document.getElementById('textbox2').value = "";
            document.getElementById('textbox3').value = "";
            closeModal(modalId); 
            window.onload(); 
        } else {
            const errorResult = await response.json();
            
            alert(`Error: ${errorResult.detail || errorResult.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}


export async function updateUserRole(endpoint, modalId) {
    const email = document.getElementById('textbox1').value.trim();
    const newRole = document.getElementById('textbox2').value.trim();
    const fullName = document.getElementById('textbox3').value.trim();

    
    if (email === "" || fullName === "" || newRole === "") {
        alert("All fields must be filled out.");
        return;
    }

    if (!isFirstLetterCapitalized(fullName)) {
        alert("Full Name must start with a capital letter.");
        return;
    }

    try {
        const response = await fetch(endpoint, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email_id: email,
                role: newRole,
                name: fullName,
                
            }),
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message || "Role updated successfully.");
            
            
            document.getElementById('textbox1').value = "";
            document.getElementById('textbox2').value = "";
            document.getElementById('textbox3').value = "";

            closeModal(modalId);  
            window.onload(); 
        } else {
            const result = await response.json();
            alert(`Error: ${result.detail || result.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}



function isDocumentTypeTextInDropdown(text, dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    for (let i = 0; i < dropdown.options.length; i++) {
        if (dropdown.options[i].text.trim() === text) {
            return true;
        }
    }
    return false;
}



export async function updateData( updateApiEndpoint, selectElementId, modalInputId,  itemType) { 
    debugger;
    const dropdown = document.getElementById(selectElementId);
    const selectedOption = dropdown.selectedOptions[0];
    const selectedItemText = selectedOption.text.trim();
    const newItemValue = document.getElementById(modalInputId).value.trim();
   
    
    if (!selectedItemText) {
        alert(`Please select a ${itemType} to update.`);
        return;
    }
 
    
    if (newItemValue === "") {
        alert(`New ${itemType} cannot be empty.`);
        return;
    }
 
   
    if (!isFirstLetterCapitalized(newItemValue)) {
        alert(`New ${itemType} must start with a capital letter.`);
        return;
    }
 
   
    if (isDocumentTypeTextInDropdown(newItemValue, selectElementId)) {
        alert(`This ${itemType} already exists in the dropdown.`);
        return;
    }
 
    
    if (newItemValue === selectedItemText) {
        alert(`New ${itemType} is the same as the selected Value.`);
        return;
    }
 
    try {
        const response = await fetch(`${updateApiEndpoint}/${selectedItemText}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ [`${itemType}`]: newItemValue }),

        });
 
        const result = await response.json();
 
        if (response.ok) {
            alert(`${itemType} updated successfully.`);
            window.location.reload();
        } else {
            alert(`Error: ${result.detail || result.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
} 

export async function deleteData(deleteApiEndpoint, selectElementId) {
    const dropdown = document.getElementById(selectElementId);
    const selectedOption = dropdown.selectedOptions[0];
    const itemCode = selectedOption.value.trim();
 
   
    if (!confirm(`Are you sure you want to delete the '${itemCode}'?`)) {
        return;
    }
 
    try {
        const response = await fetch(`${deleteApiEndpoint}/${itemCode}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
 
        const result = await response.json();
 
        if (response.ok) {
            alert(`${itemCode} Deleted Successfully.`);
            window.location.reload();
        } else {
            alert(`Error: ${result.detail || result.message}`);
            
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}
 
 