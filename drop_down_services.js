export async function selectOptionsFromResponse(apiEndpoint, selectElementId, idKey, nameKey, placeholder) {
    try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const itemsArray = data.data;
 
        let selectElement = document.getElementById(selectElementId);
        selectElement.innerHTML = `<option value="">${placeholder}</option>`;
 
        for (let i = 0; i < itemsArray.length; i++) {
            const item = itemsArray[i];
 
            const option = document.createElement('option');
            option.value = item[idKey];
            option.textContent = item[nameKey];
            selectElement.appendChild(option);
        }
 
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
 




