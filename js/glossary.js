// Glossary Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('glossary-modal');
    const openBtn = document.getElementById('open-glossary');
    const menuLink = document.getElementById('glossary-menu-link');
    const closeBtn = modal.querySelector('.modal-close');
  
    function openModal() {
      modal.style.display = 'block';
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const firstFocusableElement = modal.querySelector('.modal-close, .glossary-az-nav a');
      if (firstFocusableElement) {
          firstFocusableElement.focus();
      }
    }
  
    function closeModal() {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = 'auto';
      if (document.activeElement === closeBtn || modal.contains(document.activeElement)) {
          if (openBtn && openBtn === document.lastActiveElement) openBtn.focus();
          else if (menuLink && menuLink === document.lastActiveElement) menuLink.focus();
      }
      document.lastActiveElement = null;
    }
    
    document.lastActiveElement = null;
  
    if (openBtn) {
      openBtn.addEventListener('click', function() {
          document.lastActiveElement = this;
          openModal();
      });
    }
    
    if (menuLink) {
      menuLink.addEventListener('click', function(e) {
        e.preventDefault();
        document.lastActiveElement = this;
        openModal();
        const mainNav = document.getElementById('main-nav');
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        if (mainNav && mainNav.classList.contains('active')) {
          mainNav.classList.remove('active');
          mobileMenuToggle.classList.remove('active');
          mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }
  
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
      }
    });
  
    // Glossary filtering functionality
    const filterLinks = document.querySelectorAll('.glossary-az-nav a');
    const glossarySections = document.querySelectorAll('.glossary-section');
    const modalBody = document.querySelector('.modal-body');
  
    function filterGlossary(letter) {
      // Remove active class from all filter links
      filterLinks.forEach(link => link.classList.remove('active'));
      
      // Add active class to clicked link
      const activeLink = document.querySelector(`[data-filter="${letter}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
  
      if (letter === 'all') {
        // Show all sections
        glossarySections.forEach(section => {
          section.classList.remove('hidden');
        });
      } else {
        // Hide all sections first
        glossarySections.forEach(section => {
          section.classList.add('hidden');
        });
        
        // Show only the selected letter section
        const targetSection = document.querySelector(`[data-letter="${letter}"]`);
        if (targetSection) {
          targetSection.classList.remove('hidden');
        }
      }
  
      // Scroll to top of modal body
      modalBody.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  
    // Add click event listeners to filter links
    filterLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const filter = this.getAttribute('data-filter');
        filterGlossary(filter);
      });
    });
  
    // Initialize with "ALL" selected
    filterGlossary('all');
  });
