/**
 * Master Portfolio JavaScript
 * Ahmed Abdalrahman - Digital Solutions & Creative Media Specialist
 * High-Performance Smooth Interactions, Touch-Enabled Antigravity Particles & Motion Graphics
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. Antigravity Touch & Mouse Particles Canvas & Cursor Spotlight
  // =========================================================================
  const canvas = document.getElementById('antigravity-canvas');
  const spotlight = document.getElementById('cursor-spotlight');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = {
      x: null,
      y: null,
      radius: window.innerWidth < 768 ? 120 : 180,
      active: false
    };

    let spotlightPos = {
      currentX: width / 2,
      currentY: height / 2,
      targetX: width / 2,
      targetY: height / 2
    };

    // Responsive particle count (fewer on mobile for 60fps performance)
    const particleCount = window.innerWidth < 768 ? 25 : 65;
    const particles = [];

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 2.2 + 1.2;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.density = Math.random() * 20 + 5;
        
        // Color palette for 60% Dark Navy Theme: Luminous Soft Beige & Warm Off-White
        const rand = Math.random();
        if (rand > 0.6) {
          this.color = 'rgba(220, 205, 184, '; // Soft Beige
        } else if (rand > 0.25) {
          this.color = 'rgba(245, 241, 232, '; // Warm Off-White
        } else {
          this.color = 'rgba(180, 215, 240, '; // Luminous Sky Tint
        }
        this.alpha = Math.random() * 0.5 + 0.35;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(220, 205, 184, 0.5)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce at boundaries
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Antigravity Mouse & Touch Interaction
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            this.x -= directionX * 0.8;
            this.y -= directionY * 0.8;
            this.alpha = Math.min(0.9, this.alpha + 0.05);
          } else {
            if (this.alpha > 0.4) this.alpha -= 0.01;
          }
        }
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Connect particles with subtle lines
    function connectParticles() {
      const maxDist = window.innerWidth < 768 ? 95 : 120;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            let opacity = (1 - dist / maxDist) * 0.22;
            
            if (mouse.x !== null) {
              let mDistA = Math.hypot(mouse.x - particles[a].x, mouse.y - particles[a].y);
              if (mDistA < mouse.radius) {
                opacity = Math.min(0.5, opacity * 2);
              }
            }

            ctx.strokeStyle = `rgba(220, 205, 184, ${opacity * 1.2})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    // Animation Loop
    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Smooth lerp for spotlight
      if (spotlight && mouse.active) {
        spotlightPos.currentX += (spotlightPos.targetX - spotlightPos.currentX) * 0.08;
        spotlightPos.currentY += (spotlightPos.targetY - spotlightPos.currentY) * 0.08;
        spotlight.style.transform = `translate(${spotlightPos.currentX - 300}px, ${spotlightPos.currentY - 300}px)`;
      }

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connectParticles();

      requestAnimationFrame(animate);
    }
    animate();

    // Mouse Listeners
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;

      spotlightPos.targetX = e.clientX;
      spotlightPos.targetY = e.clientY;

      if (spotlight) {
        spotlight.style.opacity = '1';
      }
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
      mouse.active = false;
      if (spotlight) spotlight.style.opacity = '0';
    });

    // Touch Listeners for Mobile Devices (Ensures Animation on Phones!)
    window.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.active = true;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.active = true;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      setTimeout(() => {
        mouse.x = null;
        mouse.y = null;
        mouse.active = false;
      }, 500);
    });

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
  }


  // =========================================================================
  // 2. Scroll Progress Bar & Sticky Header
  // =========================================================================
  const scrollProgress = document.getElementById('scroll-progress');
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }

    if (navbar) {
      if (window.scrollY > 30) {
        navbar.classList.add('bg-[#0B1F3A]/95', 'backdrop-blur-md', 'border-[#DCCDB8]/30', 'shadow-lg');
        navbar.classList.remove('bg-transparent', 'border-transparent');
      } else {
        navbar.classList.remove('bg-[#0B1F3A]/95', 'backdrop-blur-md', 'border-[#DCCDB8]/30', 'shadow-lg');
        navbar.classList.add('bg-transparent', 'border-transparent');
      }
    }

    if (scrollTopBtn) {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
        scrollTopBtn.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
      } else {
        scrollTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
        scrollTopBtn.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
      }
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // =========================================================================
  // 3. Motion Graphics: Scroll Reveal (Safe on Mobile & Desktop)
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  // Reveal immediately on mobile or if already in view
  if (window.innerWidth <= 768) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  } else if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '100px 0px 100px 0px',
      threshold: 0
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // Failsafe: Ensure everything is revealed after 800ms
  setTimeout(() => {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }, 800);


  // =========================================================================
  // 4. Subtle 3D Tilt Micro-interactions on Desktop
  // =========================================================================
  if (window.innerWidth >= 1024) {
    const tiltCards = document.querySelectorAll('.light-card');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }


  // =========================================================================
  // 5. Mobile Drawer Menu
  // =========================================================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');

  function openMobileMenu() {
    if (mobileMenu && mobileMenuOverlay) {
      mobileMenu.classList.remove('translate-x-full');
      mobileMenuOverlay.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileMenu() {
    if (mobileMenu && mobileMenuOverlay) {
      mobileMenu.classList.add('translate-x-full');
      mobileMenuOverlay.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
  if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));


  // =========================================================================
  // 6. Portfolio Showcase Filter Tabs
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('tab-active'));
      btn.classList.add('tab-active');

      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filter === 'all' || itemCategory === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.96)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });


  // =========================================================================
  // 7. Lightbox Modal
  // =========================================================================
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxTools = document.getElementById('lightbox-tools');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxOrderBtn = document.getElementById('lightbox-order-btn');

  function openLightbox(item) {
    const img = item.getAttribute('data-img');
    const title = item.getAttribute('data-title');
    const category = item.getAttribute('data-cat-label');
    const desc = item.getAttribute('data-desc');
    const tools = item.getAttribute('data-tools') ? item.getAttribute('data-tools').split(',') : [];

    if (lightboxImg) lightboxImg.src = img;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxCategory) lightboxCategory.textContent = category;
    if (lightboxDesc) lightboxDesc.textContent = desc;

    if (lightboxTools) {
      lightboxTools.innerHTML = '';
      tools.forEach(t => {
        const span = document.createElement('span');
        span.className = 'px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-[#0284C7] border border-slate-200';
        span.textContent = t.trim();
        lightboxTools.appendChild(span);
      });
    }

    if (lightboxOrderBtn) {
      lightboxOrderBtn.onclick = () => {
        closeLightbox();
        selectServiceAndScroll('branding', `طلب تصميم مشابه لمشروع: ${title}`);
      };
    }

    if (lightboxModal) {
      lightboxModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('.open-lightbox-btn, .portfolio-card-img').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const parentItem = trigger.closest('.portfolio-item');
      if (parentItem) openLightbox(parentItem);
    });
  });

  // Enable lightbox preview for cover banner and avatar
  const fbCover = document.querySelector('.fb-cover-img');
  if (fbCover) {
    fbCover.addEventListener('click', () => {
      if (lightboxImg) lightboxImg.src = 'assets/banner_source.png';
      if (lightboxTitle) lightboxTitle.textContent = 'غلاف الصفحة الشخصية (Facebook Banner)';
      if (lightboxCategory) lightboxCategory.textContent = 'الهوية البصرية والميديا';
      if (lightboxDesc) lightboxDesc.textContent = 'تصميم غلاف احترافي فائق الدقة 3280x1848 يبرز الهوية الشخصية ومجالات التخصص.';
      if (lightboxTools) {
        lightboxTools.innerHTML = '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-[#0D223F] text-[#DCCDB8] border border-[#DCCDB8]/40">Photoshop</span><span class="px-3 py-1 text-xs font-semibold rounded-full bg-[#0D223F] text-[#DCCDB8] border border-[#DCCDB8]/40">Ultra HD</span>';
      }
      if (lightboxModal) {
        lightboxModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  const fbAvatar = document.querySelector('.fb-avatar-frame');
  if (fbAvatar) {
    fbAvatar.addEventListener('click', () => {
      if (lightboxImg) lightboxImg.src = 'assets/calligraphy_source.png';
      if (lightboxTitle) lightboxTitle.textContent = 'شعار الهوية الشخصية (Personal Brand Logo)';
      if (lightboxCategory) lightboxCategory.textContent = 'مخطوطة وهوية';
      if (lightboxDesc) lightboxDesc.textContent = 'شعار ومخطوطة اسم أحمد عبدالرحمن باللون الأبيض النقي مع خلفية كلاسيكية.';
      if (lightboxTools) {
        lightboxTools.innerHTML = '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-[#0D223F] text-[#DCCDB8] border border-[#DCCDB8]/40">Calligraphy</span><span class="px-3 py-1 text-xs font-semibold rounded-full bg-[#0D223F] text-[#DCCDB8] border border-[#DCCDB8]/40">Brand Identity</span>';
      }
      if (lightboxModal) {
        lightboxModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-backdrop')) {
        closeLightbox();
      }
    });
  }


  // =========================================================================
  // 8. FAQ Accordion
  // =========================================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    header.addEventListener('click', () => {
      const isOpen = !content.classList.contains('hidden');

      faqItems.forEach(other => {
        if (other !== item) {
          other.querySelector('.faq-content').classList.add('hidden');
          other.querySelector('.faq-icon').classList.remove('rotate-180', 'text-[#DCCDB8]');
          other.classList.remove('border-[#DCCDB8]');
        }
      });

      if (isOpen) {
        content.classList.add('hidden');
        icon.classList.remove('rotate-180', 'text-[#DCCDB8]');
        item.classList.remove('border-[#DCCDB8]');
      } else {
        content.classList.remove('hidden');
        icon.classList.add('rotate-180', 'text-[#DCCDB8]');
        item.classList.add('border-[#DCCDB8]');
      }
    });
  });


  // =========================================================================
  // 9. Interactive Contact Form & WhatsApp Link Generator
  // =========================================================================
  const contactForm = document.getElementById('contact-form');
  const serviceSelect = document.getElementById('service-select');
  const clientNameInput = document.getElementById('client-name');
  const clientPhoneInput = document.getElementById('client-phone');
  const clientMessageInput = document.getElementById('client-message');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = clientNameInput.value.trim();
      const phone = clientPhoneInput.value.trim();
      const service = serviceSelect.options[serviceSelect.selectedIndex].text;
      const message = clientMessageInput.value.trim();

      if (!name) {
        showToast('يرجى كتابة اسم الكريم', 'error');
        clientNameInput.focus();
        return;
      }

      if (!phone) {
        showToast('يرجى إدخال رقم الهاتف أو الواتساب للتواصل', 'error');
        clientPhoneInput.focus();
        return;
      }

      const text = 
`السلام عليكم ورحمة الله وبركاته، أ/ أحمد عبدالرحمن 👋
مع حضرتك: ${name}
رقم التواصل: ${phone}
نوع الخدمة المطلوبة: ${service}

تفاصيل الطلب:
${message || 'أرغب في الاستفسار والاتفاق على تفاصيل العمل والتكلفة ومدة التنفيذ.'}`;

      const whatsappUrl = `https://wa.me/201061292803?text=${encodeURIComponent(text)}`;
      
      showToast('جاري فتح محادثة الواتساب المباشرة مع أحمد عبدالرحمن...', 'success');
      
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 500);
    });
  }

  window.selectServiceAndScroll = function(serviceVal, customDetails = '') {
    if (serviceSelect) serviceSelect.value = serviceVal;
    if (customDetails && clientMessageInput) clientMessageInput.value = customDetails;

    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        if (clientNameInput) clientNameInput.focus();
      }, 500);
    }
  };


  // =========================================================================
  // 10. Clipboard Copy Utility with Toast
  // =========================================================================
  window.copyToClipboard = function(text, label = 'النص') {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`تم نسخ ${label} بنجاح: ${text}`, 'success');
      }).catch(() => fallbackCopy(text, label));
    } else {
      fallbackCopy(text, label);
    }
  };

  function fallbackCopy(text, label) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(`تم نسخ ${label} بنجاح: ${text}`, 'success');
    } catch (err) {
      showToast(`تعذر النسخ التلقائي: ${text}`, 'info');
    }
    document.body.removeChild(tempInput);
  }

  function showToast(message, type = 'info') {
    const existingToast = document.getElementById('portfolio-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.id = 'portfolio-toast';
    toast.className = `fixed top-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all duration-300 transform -translate-y-4 opacity-0 pointer-events-none ${
      type === 'success' 
        ? 'bg-[#0284C7] text-white shadow-sky-500/30' 
        : type === 'error'
        ? 'bg-red-600 text-white shadow-red-500/30'
        : 'bg-slate-900 text-white shadow-slate-900/30'
    }`;
    
    toast.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('-translate-y-4', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('-translate-y-4', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }


  // =========================================================================
  // 11. CV Modal Logic
  // =========================================================================
  const cvModal = document.getElementById('cv-modal');
  const cvOpenBtns = document.querySelectorAll('.cv-open-btn');
  const cvCloseBtn = document.getElementById('cv-close-btn');

  function openCvModal() {
    if (cvModal) {
      cvModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCvModal() {
    if (cvModal) {
      cvModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  cvOpenBtns.forEach(b => b.addEventListener('click', (e) => {
    e.preventDefault();
    openCvModal();
  }));

  if (cvCloseBtn) cvCloseBtn.addEventListener('click', closeCvModal);
  if (cvModal) {
    cvModal.addEventListener('click', (e) => {
      if (e.target === cvModal || e.target.classList.contains('cv-backdrop')) {
        closeCvModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeCvModal();
    }
  });

});
