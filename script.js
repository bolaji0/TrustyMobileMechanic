// Wait for the DOM to be fully loaded before executing JS
document.addEventListener('DOMContentLoaded', function() {

  // ============= Sticky Navigation =============
  const header = document.querySelector('.header');
  const headerHeight = header.offsetHeight;
  const scrollThreshold = 50;

  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll);
  
  // Trigger on initial load
  handleScroll();

  // ============= Mobile Menu Toggle =============
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('.nav-list');

  menuToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    navList.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });

  // Close mobile menu when clicking a link
  document.querySelectorAll('.nav-list a').forEach(function(link) {
    link.addEventListener('click', function() {
      menuToggle.classList.remove('active');
      navList.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });

  // ============= Animated Typing Effect =============
  const typingElement = document.querySelector('.typing-text');
  const typingTexts = ['wherever you are.', 'when you need it most.', 'at your doorstep.', '24/7 across Croydon.'];
  let currentTextIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100; // Base typing speed

  function type() {
    const currentText = typingTexts[currentTextIndex];
    
    if (isDeleting) {
      // Deleting phase
      typingElement.textContent = currentText.substring(0, currentCharIndex - 1);
      currentCharIndex--;
      typingSpeed = 50; // Faster when deleting
    } else {
      // Typing phase
      typingElement.textContent = currentText.substring(0, currentCharIndex + 1);
      currentCharIndex++;
      typingSpeed = 100; // Normal typing speed
    }
    
    // If completed typing the current text
    if (!isDeleting && currentCharIndex === currentText.length) {
      // Pause at the end of typing
      isDeleting = true;
      typingSpeed = 1500; // Wait before starting to delete
    } 
    // If completed deleting the current text
    else if (isDeleting && currentCharIndex === 0) {
      isDeleting = false;
      currentTextIndex = (currentTextIndex + 1) % typingTexts.length; // Move to next text
      typingSpeed = 500; // Pause before typing next word
    }
    
    setTimeout(type, typingSpeed);
  }
  
  // Start the typing animation
  if (typingElement) {
    setTimeout(type, 1000); // Delay before starting
  }

  // ============= Scroll Animations =============
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.15
  };

  const fadeElements = document.querySelectorAll('.fade-in');
  
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  fadeElements.forEach(element => {
    fadeObserver.observe(element);
  });

  // ============= Testimonial Slider =============
  const testimonialTrack = document.querySelector('.testimonial-track');
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const prevButton = document.querySelector('.testimonial-prev');
  const nextButton = document.querySelector('.testimonial-next');
  const dotsContainer = document.querySelector('.testimonial-dots');
  
  let currentSlide = 0;
  const slideWidth = 100; // percentage width
  
  // Create dot indicators
  if (testimonialCards.length > 0 && dotsContainer) {
    testimonialCards.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.classList.add('testimonial-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  }
  
  function updateSlidePosition() {
    if (testimonialTrack) {
      testimonialTrack.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
    }
    
    // Update dots
    const dots = document.querySelectorAll('.testimonial-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }
  
  function goToSlide(index) {
    if (index < 0) {
      currentSlide = testimonialCards.length - 1;
    } else if (index >= testimonialCards.length) {
      currentSlide = 0;
    } else {
      currentSlide = index;
    }
    updateSlidePosition();
  }
  
  function nextSlide() {
    goToSlide(currentSlide + 1);
  }
  
  function prevSlide() {
    goToSlide(currentSlide - 1);
  }
  
  // Add event listeners to controls
  if (prevButton) prevButton.addEventListener('click', prevSlide);
  if (nextButton) nextButton.addEventListener('click', nextSlide);
  
  // Auto-play testimonials
  let testimonialInterval;
  
  function startTestimonialInterval() {
    testimonialInterval = setInterval(nextSlide, 5000);
  }
  
  function resetTestimonialInterval() {
    clearInterval(testimonialInterval);
    startTestimonialInterval();
  }
  
  if (testimonialCards.length > 0) {
    startTestimonialInterval();
    
    // Reset interval on manual navigation
    if (prevButton) prevButton.addEventListener('click', resetTestimonialInterval);
    if (nextButton) nextButton.addEventListener('click', resetTestimonialInterval);
    document.querySelectorAll('.testimonial-dot').forEach(dot => {
      dot.addEventListener('click', resetTestimonialInterval);
    });
  }

  // ============= Accordion FAQ =============
  const accordionItems = document.querySelectorAll('.accordion-item');
  
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    
    header.addEventListener('click', () => {
      // Check if this accordion is already active
      const isActive = header.getAttribute('aria-expanded') === 'true';
      
      // Close all accordion items
      accordionItems.forEach(accItem => {
        const accHeader = accItem.querySelector('.accordion-header');
        const accContent = accItem.querySelector('.accordion-content');
        
        accHeader.setAttribute('aria-expanded', 'false');
        accContent.classList.remove('active');
      });
      
      // If it wasn't active, open this one
      if (!isActive) {
        header.setAttribute('aria-expanded', 'true');
        content.classList.add('active');
      }
    });
    
    // Set initial state
    header.setAttribute('aria-expanded', 'false');
  });

  // ============= Gallery Lightbox =============
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryModal = document.querySelector('.gallery-modal');
  const modalContent = document.querySelector('.gallery-modal-content');
  const modalCaption = document.querySelector('.gallery-caption');
  const closeButton = document.querySelector('.gallery-close');
  
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.querySelector('img').getAttribute('src');
      const imgAlt = item.querySelector('img').getAttribute('alt');
      
      modalContent.setAttribute('src', imgSrc);
      modalCaption.textContent = imgAlt;
      galleryModal.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Prevent scrolling while modal is open
    });
  });
  
  if (closeButton) {
    closeButton.addEventListener('click', closeGalleryModal);
  }
  
  if (galleryModal) {
    galleryModal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeGalleryModal();
      }
    });
  }
  
  function closeGalleryModal() {
    galleryModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  }
  
  // Close gallery modal with ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && galleryModal.style.display === 'flex') {
      closeGalleryModal();
    }
  });

  // ============= Form Validation =============
  const bookingForm = document.getElementById('booking-form');
  const formSuccess = document.querySelector('.form-success');
  const closeSuccess = document.querySelector('.close-success');
  
  if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      const formData = {};
      
      // Reset all error states
      bookingForm.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
        group.querySelector('.form-error').textContent = '';
      });
      
      // Validate name
      const nameField = bookingForm.querySelector('#name');
      if (!nameField.value.trim()) {
        showError(nameField, 'Please enter your name');
        isValid = false;
      } else {
        formData.name = nameField.value.trim();
      }
      
      // Validate phone
      const phoneField = bookingForm.querySelector('#phone');
      if (!phoneField.value.trim()) {
        showError(phoneField, 'Please enter your phone number');
        isValid = false;
      } else if (!isValidPhone(phoneField.value.trim())) {
        showError(phoneField, 'Please enter a valid phone number');
        isValid = false;
      } else {
        formData.phone = phoneField.value.trim();
      }
      
      // Validate email
      const emailField = bookingForm.querySelector('#email');
      if (!emailField.value.trim()) {
        showError(emailField, 'Please enter your email address');
        isValid = false;
      } else if (!isValidEmail(emailField.value.trim())) {
        showError(emailField, 'Please enter a valid email address');
        isValid = false;
      } else {
        formData.email = emailField.value.trim();
      }
      
      // Validate car details
      const carDetailsField = bookingForm.querySelector('#car-details');
      if (!carDetailsField.value.trim()) {
        showError(carDetailsField, 'Please enter your vehicle details');
        isValid = false;
      } else {
        formData.carDetails = carDetailsField.value.trim();
      }
      
      // Validate service type
      const serviceField = bookingForm.querySelector('#service-type');
      if (!serviceField.value) {
        showError(serviceField, 'Please select a service');
        isValid = false;
      } else {
        formData.serviceType = serviceField.value;
      }
      
      // Validate terms
      const termsField = bookingForm.querySelector('#terms');
      if (!termsField.checked) {
        showError(termsField, 'You must agree to the terms and conditions');
        isValid = false;
      } else {
        formData.terms = termsField.checked;
      }
      
      // Optional message field
      const messageField = bookingForm.querySelector('#message');
      formData.message = messageField.value.trim();
      
      // If form is valid, submit it
      if (isValid) {
        // In a real application, you would send this data to a server
        console.log('Form submitted:', formData);
        
        // Show success message
        formSuccess.style.display = 'block';
        bookingForm.reset();
      }
    });
  }
  
  if (closeSuccess) {
    closeSuccess.addEventListener('click', function() {
      formSuccess.style.display = 'none';
    });
  }
  
  function showError(field, message) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('error');
    formGroup.querySelector('.form-error').textContent = message;
  }
  
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  function isValidPhone(phone) {
    // Basic phone validation - adjust based on your needs
    const phoneRegex = /^[\d\s\+\-\(\)]{10,20}$/;
    return phoneRegex.test(phone);
  }

  // ============= Chat Widget =============
  const chatBtn = document.querySelector('.chat-btn');
  const chatWidget = document.querySelector('.chat-widget');
  const chatClose = document.querySelector('.chat-close');
  const chatForm = document.querySelector('.chat-form');
  const chatMessages = document.querySelector('.chat-messages');
  
  if (chatBtn) {
    chatBtn.addEventListener('click', () => {
      chatWidget.style.display = 'flex';
    });
  }
  
  if (chatClose) {
    chatClose.addEventListener('click', () => {
      chatWidget.style.display = 'none';
    });
  }
  
  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = chatForm.querySelector('input');
      const message = input.value.trim();
      
      if (message) {
        // Add user message
        addChatMessage(message, 'sent');
        input.value = '';
        
        // Simulate reply after a short delay
        setTimeout(() => {
          const autoReplies = [
            "Thanks for your message! We'll get back to you shortly.",
            "Our team will respond as soon as possible.",
            "We've received your inquiry and will respond soon."
          ];
          const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
          addChatMessage(randomReply, 'received');
        }, 1000);
      }
    });
  }
  
  function addChatMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', type);
    
    const messagePara = document.createElement('p');
    messagePara.textContent = text;
    
    messageDiv.appendChild(messagePara);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // ============= Back to Top Button =============
  const backToTopBtn = document.querySelector('.back-to-top');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // ============= Smooth Scroll for Anchor Links =============
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerOffset = header.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerOffset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
});
