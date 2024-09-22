document.addEventListener('DOMContentLoaded', () => {
    const fullName = window.localStorage.getItem('userFullName');
    const userRole = window.localStorage.getItem('userRole');

    const openCostCenterModal = document.getElementById('openCostCenterModal');
    const editCostCenter = document.getElementById('editCostCenter');
    const openProjectNameModal = document.getElementById('openProjectNameModal');
    const editProjectName = document.getElementById('editProjectName');
    const openDocumentTypeModal = document.getElementById('openDocumentTypeModal');
    const editDocumentType = document.getElementById('editDocumentType');
    const generateFileNumberButton = document.getElementById('generateFileNumberButton');
    const addUserIcon = document.getElementById('addUsers');

    if (userRole) {
        if (userRole === 'SuperAdmin') {
            if (openCostCenterModal) openCostCenterModal.style.display = 'block';
            if (editCostCenter) editCostCenter.style.display = 'block';
            if (openProjectNameModal) openProjectNameModal.style.display = 'block';
            if (editProjectName) editProjectName.style.display = 'block';
            if (openDocumentTypeModal) openDocumentTypeModal.style.display = 'block';
            if (editDocumentType) editDocumentType.style.display = 'block';
            if (generateFileNumberButton) generateFileNumberButton.style.display = 'block';
            if (addUserIcon) addUserIcon.style.display = 'block';
        } else if (userRole === 'Admin') {
            if (openCostCenterModal) openCostCenterModal.style.display = 'none';
            if (editCostCenter) editCostCenter.style.display = 'none';
            if (openProjectNameModal) openProjectNameModal.style.display = 'none';
            if (editProjectName) editProjectName.style.display = 'none';
            if (openDocumentTypeModal) openDocumentTypeModal.style.display = 'none';
            if (editDocumentType) editDocumentType.style.display = 'none';
            if (addUserIcon) addUserIcon.style.display = 'none';
            if (generateFileNumberButton) generateFileNumberButton.style.display = 'block';
        } else {
           
            if (openCostCenterModal) openCostCenterModal.style.display = 'none';
            if (editCostCenter) editCostCenter.style.display = 'none';
            if (openProjectNameModal) openProjectNameModal.style.display = 'none';
            if (editProjectName) editProjectName.style.display = 'none';
            if (openDocumentTypeModal) openDocumentTypeModal.style.display = 'none';
            if (editDocumentType) editDocumentType.style.display = 'none';
            if (generateFileNumberButton) generateFileNumberButton.style.display = 'none';
            if (addUserIcon) addUserIcon.style.display = 'none';
        }
    }

   
    if (fullName) {
        const tooltip = document.getElementById('tooltip');
        const userIcon = document.getElementById('userIcon');
        const userInfo = document.getElementById('userInfo');
        const userFullNameElement = document.getElementById('userFullName');
        const signOutText = document.getElementById('signOutText');

        if (tooltip && userFullNameElement) {
            tooltip.textContent = `Account Manage for ${fullName}`;
            userFullNameElement.textContent = `Username: ${fullName}`;
        }

        
        if (userIcon && userInfo && signOutText) {
            userIcon.addEventListener('click', () => {
                userInfo.style.display = (userInfo.style.display === 'none' || userInfo.style.display === '') ? 'block' : 'none';
            });

            signOutText.addEventListener('click', () => {
                const confirmation = confirm('Are you sure you want to log out?');
                if (confirmation) {
                    window.localStorage.clear();
                    window.location.href = "index.html";
                }
            });

            document.addEventListener('click', (event) => {
                if (userInfo && !userInfo.contains(event.target) && !userIcon.contains(event.target)) {
                    userInfo.style.display = 'none';
                }
            });
        }
    } else {
        alert('You must log in first.');
        window.location.href = "index.html";
    }
});

