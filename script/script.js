window.addEventListener("scroll", function() {
    const nav = document.querySelector("nav");
    const firstAside = document.querySelector("aside");
    const contactSection = document.querySelector(".contact-section"); // Assuming you have a class for the contact section

    // Get the position of the first <aside> element relative to the top of the page
    const asidePosition = firstAside ? firstAside.offsetTop : 0;
    const contactSectionPosition = contactSection ? contactSection.offsetTop : 0;
    
    // Check if we are on the index page by checking the body id
    if (document.body.id === 'index-page'){
        // Get the position of the first <aside> element relative to the top of the page
        const asidePosition = firstAside ? firstAside.offsetTop : 0;

        // Add or remove the sticky class based on scroll position
        if (window.pageYOffset >= asidePosition) {
            nav.classList.add("sticky");
        } else {
            nav.classList.remove("sticky"); // Remove sticky class if scrolled back up
        }
    }
});

// DIV BOX MOVEMENTS
document.addEventListener("DOMContentLoaded", function () {
    const divs = document.querySelectorAll('.one, .two, .three');
  
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('slide-up');
        } else {
          entry.target.classList.remove('slide-up');
        }
      });
    }, {
      threshold: 0
    });
  
    divs.forEach(div => {
      observer.observe(div);
    });
  });
