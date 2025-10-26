// src/js/configPerfiles.js

document.addEventListener("DOMContentLoaded", () => {

    // --- Lógica de Interacción con los Perfiles (Ejemplo) ---

    // Botón para agregar un nuevo perfil
    const addProfileButton = document.getElementById("add-profile-btn");
    if (addProfileButton) {
        addProfileButton.addEventListener("click", () => {
            // Aquí abrirías un modal o navegarías a una página para crear un nuevo perfil
            alert("Acción: Agregar nuevo perfil.");
            console.log("Intentando agregar un nuevo perfil...");
        });
    }

    // Botones de Editar
    const editButtons = document.querySelectorAll(".action-link:first-child");
    editButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            // Obtener información del perfil padre para saber cuál editar
            const profileName = event.target.closest('.profile-card__body').querySelector('.profile-name strong').textContent;
            alert(`Acción: Editar el perfil "${profileName}".`);
            console.log(`Editando perfil: ${profileName}`);
        });
    });

    // Botones de Eliminar
    const deleteButtons = document.querySelectorAll(".action-link:last-child");
    deleteButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            const profileName = event.target.closest('.profile-card__body').querySelector('.profile-name strong').textContent;
            if (confirm(`¿Estás seguro de que quieres eliminar el perfil "${profileName}"?`)) {
                // Lógica para eliminar el elemento del DOM y de la base de datos
                alert(`Perfil "${profileName}" eliminado.`);
                console.log(`Eliminando perfil: ${profileName}`);
                event.target.closest('.profile-card').remove();
            }
        });
    });
});