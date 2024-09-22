import {setupDropdownListeners, dropDownsSelections, get_all_file_numbers, displayPage} from '../js/ui/dropdowns_filteration_pagination_component.js';

import {getDefaultCountryCode} from '../js/Services/current_location_service.js'

let currentPage = 1;

window.onload = async function() {
    setupDropdownListeners();
    await dropDownsSelections();

    const defaultCountryName = await getDefaultCountryCode();
    const countrySelect = document.getElementById('countryCode');

    if (defaultCountryName) {
        let optionExists = false;
        for (const option of countrySelect.options) {
            if (option.text === defaultCountryName) {
                optionExists = true;
                countrySelect.value = option.value;
                break;
            }
        }

        if (!optionExists) {
            const newOption = document.createElement('option');
            newOption.value = defaultCountryName;
            newOption.text = defaultCountryName;
            countrySelect.add(newOption, countrySelect.options[0]);
            countrySelect.value = defaultCountryName;
        }

        await get_all_file_numbers();  
    } else {

        await get_all_file_numbers(); 
    }

    displayPage(currentPage); 
};
