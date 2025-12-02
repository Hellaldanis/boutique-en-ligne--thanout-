/**
 * Components Loader
 * Charge dynamiquement les composants HTML (header, footer, etc.)
 */

// Fonction pour charger un composant HTML
async function loadComponent(componentId, componentPath) {
  try {
    const response = await fetch(componentPath);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const html = await response.text();
    const element = document.getElementById(componentId);
    if (element) {
      element.innerHTML = html;
    }
  } catch (error) {
    console.error(`Erreur lors du chargement du composant ${componentPath}:`, error);
  }
}

// Charger les composants au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
  // Charger le header
  await loadComponent('header-component', '../components/header.html');
  
  // Charger le footer
  await loadComponent('footer-component', '../components/footer.html');
  
  // Initialiser les événements après le chargement des composants
  initializeHeaderEvents();
});

// Initialiser les événements du header (menu mobile, etc.)
function initializeHeaderEvents() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      const icon = mobileMenuToggle.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.textContent = mobileMenu.classList.contains('active') ? 'close' : 'menu';
      }
    });
  }
}
