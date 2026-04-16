/**
 * Satvat Platform
 * Clean, high-performance logic optimized for UX.
 */

document.addEventListener('DOMContentLoaded', () => {

   // --- 1. Clean Mobile Menu Logic ---
   const mobileToggle = document.getElementById('mobile-toggle');
   const navLinks = document.getElementById('nav-links');
   
   if (mobileToggle && navLinks) {
     mobileToggle.addEventListener('click', (e) => {
       e.stopPropagation();
       mobileToggle.classList.toggle('active');
       navLinks.classList.toggle('active');
       document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
     });
 
     document.addEventListener('click', (e) => {
       if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && e.target !== mobileToggle) {
         mobileToggle.classList.remove('active');
         navLinks.classList.remove('active');
         document.body.style.overflow = '';
       }
     });
 
     navLinks.querySelectorAll('.nav-link, .btn').forEach(link => {
       link.addEventListener('click', () => {
         mobileToggle.classList.remove('active');
         navLinks.classList.remove('active');
         document.body.style.overflow = '';
       });
     });
   }
 
   // --- 2. Navbar Scroll Shadow ---
   const navbar = document.getElementById('navbar');
   window.addEventListener('scroll', () => {
     if (window.scrollY > 10) {
       navbar.classList.add('scrolled');
     } else {
       navbar.classList.remove('scrolled');
     }
   }, { passive: true });
 
   // --- 3. Flawless Floating Tab System ---
   const tabButtons = document.querySelectorAll('.tab-button-rich');
   const tabPanels = document.querySelectorAll('.tab-panel');
   const tabIndicator = document.querySelector('.tab-indicator');
 
   if (tabButtons.length > 0) {
     const updateIndicator = (activeBtn) => {
       if (window.innerWidth <= 768 || !tabIndicator) return;
       // We calculate the left offset and width of the button relative to the parent container
       const parentRect = activeBtn.parentElement.getBoundingClientRect();
       const btnRect = activeBtn.getBoundingClientRect();
       
       const left = btnRect.left - parentRect.left;
       const width = btnRect.width;
       
       tabIndicator.style.transform = `translateX(${left}px)`;
       tabIndicator.style.width = `${width}px`;
     };
     
     // Initialize indicator on load
     const initialBtn = document.querySelector('.tab-button-rich.active');
     if(initialBtn) updateIndicator(initialBtn);

     window.addEventListener('resize', () => {
        const activeBtn = document.querySelector('.tab-button-rich.active');
        if(activeBtn) updateIndicator(activeBtn);
     });
 
     tabButtons.forEach(button => {
       button.addEventListener('click', () => {
         tabButtons.forEach(btn => btn.classList.remove('active'));
         tabPanels.forEach(panel => panel.classList.remove('active'));
 
         button.classList.add('active');
         const targetId = button.getAttribute('data-target');
         const targetPanel = document.getElementById(targetId);
         
         if (targetPanel) {
           targetPanel.classList.add('active');
         }
         
         updateIndicator(button);
       });
     });
   }
 
   // --- 4. High-Performance Intersection Observer ---
   const animateUpElements = document.querySelectorAll('.animate-up');
   
   if ("IntersectionObserver" in window) {
     const observer = new IntersectionObserver((entries, obs) => {
       entries.forEach(entry => {
         if (entry.isIntersecting) {
           entry.target.classList.add('in-view');
           
           if (entry.target.classList.contains('metric-rich-box')) {
             startCounters(entry.target);
           }
           
           obs.unobserve(entry.target); 
         }
       });
     }, { root: null, threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
 
     animateUpElements.forEach(el => observer.observe(el));
   } else {
     animateUpElements.forEach(el => el.classList.add('in-view'));
   }
 
   // --- 5. Number Counters ---
   const startCounters = (container) => {
     const counters = container.querySelectorAll('.counter');
     
     counters.forEach(counter => {
       if (counter.dataset.animated === 'true') return;
       counter.dataset.animated = 'true';
       
       const target = parseFloat(counter.getAttribute('data-target'));
       const duration = 2000;
       let startTime = null;
 
       function updateNumber(timestamp) {
         if (!startTime) startTime = timestamp;
         const progress = Math.min((timestamp - startTime) / duration, 1);
         
         const ease = 1 - Math.pow(1 - progress, 4);
         const currentCount = target * ease;
         
         if (target % 1 !== 0) {
           counter.textContent = currentCount.toFixed(1);
         } else {
           counter.textContent = Math.floor(currentCount);
         }
 
         if (progress < 1) {
           requestAnimationFrame(updateNumber);
         } else {
           counter.textContent = target; 
         }
       }
       
       requestAnimationFrame(updateNumber);
     });
   };
 
   // --- 6. Smooth Anchor Scrolling ---
   document.querySelectorAll('a[href^="#"]').forEach(anchor => {
     anchor.addEventListener('click', function(e) {
       const targetId = this.getAttribute('href');
       if (targetId === '#') return;
       
       const targetElement = document.querySelector(targetId);
       if (targetElement) {
         e.preventDefault();
         const headerOffset = 72; 
         const elementPosition = targetElement.getBoundingClientRect().top;
         const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
 
         window.scrollTo({
           top: offsetPosition,
           behavior: 'smooth'
         });
       }
     });
   });
 
 });
 
