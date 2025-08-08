document.addEventListener('DOMContentLoaded', function() {
    
    // --- Gestion du header qui change de style au défilement ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

});
