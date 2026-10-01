/* ============================================================
   Ronie Suárez — landing page
   Interações: nav, reveal on scroll, contadores, acordeão,
   slider de depoimentos, lightbox, modal de vídeo e formulário.
   Sem dependências. Animações respeitam prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------- ano no rodapé */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------- imagens que falharam antes do JS */
  Array.prototype.forEach.call(document.images, function (img) {
    if (img.complete && img.naturalWidth === 0) {
      var frame = img.closest('.media');
      if (frame) {
        frame.classList.add('media--missing');
        frame.setAttribute('data-missing', img.getAttribute('src') || 'imagem');
      }
      img.classList.add('is-broken');
    }
  });

  /* ---------------------------------------- header fixo */
  var header = document.getElementById('header');

  function onScroll() {
    if (header) header.classList.toggle('is-stuck', window.scrollY > 40);
    setActiveLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------------------------------- menu mobile */
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('is-locked');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      document.body.classList.toggle('is-locked', open);
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
  }

  /* ---------------------------------------- reveal on scroll */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = Array.prototype.slice.call(
          el.parentNode ? el.parentNode.children : []
        ).filter(function (n) { return n.classList && n.classList.contains('reveal'); });
        var i = siblings.indexOf(el);
        el.style.transitionDelay = Math.min(i < 0 ? 0 : i, 5) * 90 + 'ms';
        el.classList.add('is-visible');
        revealObserver.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------------------------------------- contadores */
  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count-to'));
    if (isNaN(target)) return;

    var prefix = el.getAttribute('data-count-prefix') || '';
    var suffix = el.getAttribute('data-count-suffix') || '';
    var duration = 1500;
    var start = null;

    function step(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
  }

  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count-to]'));

  if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* ---------------------------------------- link ativo na nav */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute('href');
      return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  function setActiveLink() {
    if (!sections.length) return;
    var pos = window.scrollY + window.innerHeight * 0.33;
    var current = sections[0];

    sections.forEach(function (sec) {
      if (sec.offsetTop <= pos) current = sec;
    });

    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + current.id);
    });
  }

  onScroll();

  /* ---------------------------------------- acordeão (FAQ) */
  var accordions = Array.prototype.slice.call(document.querySelectorAll('[data-accordion]'));

  accordions.forEach(function (acc) {
    var triggers = Array.prototype.slice.call(acc.querySelectorAll('.accordion__trigger'));

    triggers.forEach(function (trigger, index) {
      var panel = document.getElementById(trigger.getAttribute('aria-controls'));

      trigger.addEventListener('click', function () {
        var isOpen = trigger.getAttribute('aria-expanded') === 'true';

        // fecha os irmãos (um aberto por vez)
        triggers.forEach(function (other) {
          if (other === trigger) return;
          var otherPanel = document.getElementById(other.getAttribute('aria-controls'));
          other.setAttribute('aria-expanded', 'false');
          if (otherPanel) otherPanel.hidden = true;
        });

        trigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        if (panel) panel.hidden = isOpen;
      });

      trigger.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowDown') next = triggers[(index + 1) % triggers.length];
        else if (e.key === 'ArrowUp') next = triggers[(index - 1 + triggers.length) % triggers.length];
        else if (e.key === 'Home') next = triggers[0];
        else if (e.key === 'End') next = triggers[triggers.length - 1];
        if (next) {
          e.preventDefault();
          next.focus();
        }
      });
    });
  });

  /* ---------------------------------------- slider de depoimentos */
  var sliderRoot = document.querySelector('[data-slider]');

  if (sliderRoot) {
    var track = sliderRoot.querySelector('[data-slider-track]');
    var slides = Array.prototype.slice.call(sliderRoot.querySelectorAll('.slider__slide'));
    var dotsWrap = sliderRoot.querySelector('[data-slider-dots]');
    var prevBtn = sliderRoot.querySelector('[data-slider-prev]');
    var nextBtn = sliderRoot.querySelector('[data-slider-next]');
    var viewport = sliderRoot.querySelector('[data-slider-viewport]');
    var index = 0;

    function perView() {
      if (window.innerWidth >= 1080) return 3;
      if (window.innerWidth >= 760) return 2;
      return 1;
    }

    function maxIndex() {
      return Math.max(0, slides.length - perView());
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      for (var i = 0; i <= maxIndex(); i++) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'slider__dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', 'Depoimento ' + (i + 1));
        dot.setAttribute('data-index', String(i));
        dotsWrap.appendChild(dot);
      }

      dotsWrap.addEventListener('click', function (e) {
        var dot = e.target.closest('.slider__dot');
        if (!dot) return;
        index = parseInt(dot.getAttribute('data-index'), 10) || 0;
        render();
      });
    }

    function render() {
      index = Math.min(Math.max(index, 0), maxIndex());
      if (track) track.style.transform = 'translateX(-' + index * (100 / perView()) + '%)';

      if (dotsWrap) {
        Array.prototype.forEach.call(dotsWrap.children, function (dot, i) {
          var active = i === index;
          dot.classList.toggle('is-active', active);
          dot.setAttribute('aria-selected', active ? 'true' : 'false');
        });
      }

      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index >= maxIndex();
    }

    buildDots();
    render();

    if (prevBtn) prevBtn.addEventListener('click', function () { index--; render(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { index++; render(); });

    if (viewport) {
      viewport.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); index--; render(); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); index++; render(); }
      });

      var touchX = null;
      viewport.addEventListener('touchstart', function (e) {
        touchX = e.touches[0].clientX;
      }, { passive: true });

      viewport.addEventListener('touchend', function (e) {
        if (touchX === null) return;
        var delta = e.changedTouches[0].clientX - touchX;
        if (Math.abs(delta) > 50) {
          index += delta < 0 ? 1 : -1;
          render();
        }
        touchX = null;
      });
    }

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        buildDots();
        render();
      }, 150);
    });
  }

  /* ---------------------------------------- lightbox da galeria */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var galleryBtns = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
  var lbIndex = 0;
  var lastFocused = null;

  function lbShow(i) {
    if (!galleryBtns.length) return;
    lbIndex = (i + galleryBtns.length) % galleryBtns.length;
    var img = galleryBtns[lbIndex].querySelector('img');
    if (!img || !lightboxImg) return;
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || '';
    if (lightboxCaption) {
      lightboxCaption.textContent =
        (img.alt || '') + ' — ' + (lbIndex + 1) + ' de ' + galleryBtns.length;
    }
  }

  function lbOpen(i) {
    if (!lightbox) return;
    lastFocused = document.activeElement;
    lbShow(i);
    lightbox.hidden = false;
    document.body.classList.add('is-locked');
    var close = lightbox.querySelector('[data-lightbox-close]');
    if (close) close.focus();
  }

  function lbClose() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.classList.remove('is-locked');
    if (lightboxImg) lightboxImg.src = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  galleryBtns.forEach(function (btn, i) {
    btn.addEventListener('click', function () { lbOpen(i); });
  });

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target.closest('[data-lightbox-close]')) { lbClose(); return; }
      if (e.target.closest('[data-lightbox-prev]')) { lbShow(lbIndex - 1); return; }
      if (e.target.closest('[data-lightbox-next]')) { lbShow(lbIndex + 1); return; }
      if (e.target === lightbox) lbClose();
    });
  }

  /* ---------------------------------------- modal de vídeo */
  var videoModal = document.getElementById('videoModal');
  var videoFrame = document.getElementById('videoFrame');
  var videoOpeners = Array.prototype.slice.call(document.querySelectorAll('[data-video-open]'));
  var lastFocusedVideo = null;

  function videoOpen() {
    if (!videoModal || !videoFrame) return;
    var videoId = videoModal.getAttribute('data-video-id');

    // Sem ID real configurado: abre o YouTube em nova aba.
    if (!videoId || videoId === 'VIDEO_ID') {
      window.open('https://youtube.com/', '_blank', 'noopener');
      return;
    }

    lastFocusedVideo = document.activeElement;
    videoFrame.innerHTML =
      '<iframe src="https://www.youtube-nocookie.com/embed/' + videoId +
      '?autoplay=1&rel=0" title="Vídeo do show de Ronie Suárez" ' +
      'allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" ' +
      'allowfullscreen></iframe>';
    videoModal.hidden = false;
    document.body.classList.add('is-locked');
    var close = videoModal.querySelector('[data-video-close]');
    if (close) close.focus();
  }

  function videoClose() {
    if (!videoModal || !videoFrame) return;
    videoModal.hidden = true;
    videoFrame.innerHTML = '';
    document.body.classList.remove('is-locked');
    if (lastFocusedVideo && lastFocusedVideo.focus) lastFocusedVideo.focus();
  }

  videoOpeners.forEach(function (btn) {
    btn.addEventListener('click', videoOpen);
  });

  if (videoModal) {
    videoModal.addEventListener('click', function (e) {
      if (e.target.closest('[data-video-close]') || e.target === videoModal) videoClose();
    });
  }

  /* ---------------------------------------- teclado global */
  document.addEventListener('keydown', function (e) {
    if (lightbox && !lightbox.hidden) {
      if (e.key === 'Escape') lbClose();
      else if (e.key === 'ArrowLeft') lbShow(lbIndex - 1);
      else if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
      return;
    }

    if (videoModal && !videoModal.hidden && e.key === 'Escape') {
      videoClose();
      return;
    }

    if (e.key === 'Escape' && nav && nav.classList.contains('is-open')) {
      closeNav();
      if (navToggle) navToggle.focus();
    }
  });

  /* ---------------------------------------- formulário de orçamento */
  var form = document.getElementById('quoteForm');

  if (form) {
    var formStatus = document.getElementById('formStatus');

    var messages = {
      nome: 'Informe seu nome.',
      telefone: 'Informe um WhatsApp válido com DDD.',
      email: 'Informe um e-mail válido.',
      tipo: 'Selecione o tipo de evento.'
    };

    function setFieldError(field, message) {
      var box = form.querySelector('[data-error-for="' + field.name + '"]');
      var invalid = Boolean(message);
      field.classList.toggle('is-invalid', invalid);
      field.setAttribute('aria-invalid', invalid ? 'true' : 'false');
      if (box) {
        box.textContent = message || '';
        box.hidden = !invalid;
      }
    }

    function validateField(field) {
      var value = (field.value || '').trim();
      var message = '';

      if (field.required && !value) {
        message = messages[field.name] || 'Campo obrigatório.';
      } else if (field.name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        message = messages.email;
      } else if (field.name === 'telefone' && value && value.replace(/\D/g, '').length < 10) {
        message = messages.telefone;
      }

      setFieldError(field, message);
      return !message;
    }

    var fields = Array.prototype.slice.call(
      form.querySelectorAll('input[name], select[name], textarea[name]')
    );

    fields.forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
      field.addEventListener('input', function () {
        if (field.classList.contains('is-invalid')) validateField(field);
      });
    });

    /* máscara de telefone brasileiro */
    var phone = form.querySelector('#telefone');
    if (phone) {
      phone.addEventListener('input', function () {
        var digits = phone.value.replace(/\D/g, '').slice(0, 11);
        var out = '';

        if (digits.length) out = '(' + digits.slice(0, 2);
        if (digits.length >= 3) {
          var split = digits.length === 11 ? 7 : 6;
          out += ') ' + digits.slice(2, split);
          if (digits.length > split) out += '-' + digits.slice(split);
        }

        phone.value = out;
      });
    }

    /* ------------------------------------ envio via WhatsApp (wa.me) */

    /* Data do <input type="date"> vem como AAAA-MM-DD. */
    function formatDate(value) {
      var parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
      return parts ? parts[3] + '/' + parts[2] + '/' + parts[1] : value;
    }

    function fieldValue(name) {
      var el = form.querySelector('[name="' + name + '"]');
      return el ? (el.value || '').trim() : '';
    }

    /* Monta a mensagem só com o que foi preenchido. */
    function buildMessage() {
      var lines = ['Olá! Gostaria de solicitar um orçamento de show.', ''];

      var rows = [
        ['Nome', fieldValue('nome')],
        ['WhatsApp', fieldValue('telefone')],
        ['E-mail', fieldValue('email')],
        ['Tipo de evento', fieldValue('tipo')],
        ['Data', formatDate(fieldValue('data'))],
        ['Cidade', fieldValue('cidade')],
        ['Formato desejado', fieldValue('formato')]
      ];

      rows.forEach(function (row) {
        if (row[1]) lines.push(row[0] + ': ' + row[1]);
      });

      var note = fieldValue('mensagem');
      if (note) lines.push('', 'Sobre o evento:', note);

      lines.push('', 'Enviado pelo site.');
      return lines.join('\n');
    }

    function whatsappLink() {
      var number = (form.getAttribute('data-whatsapp') || '').replace(/\D/g, '');
      var base = number ? 'https://wa.me/' + number : 'https://wa.me/';
      return base + '?text=' + encodeURIComponent(buildMessage());
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var firstInvalid = null;
      fields.forEach(function (field) {
        if (!validateField(field) && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        if (formStatus) {
          formStatus.textContent = 'Revise os campos destacados.';
          formStatus.className = 'form__status is-error';
        }
        firstInvalid.focus();
        return;
      }

      var url = whatsappLink();
      var win = window.open(url, '_blank', 'noopener');

      if (formStatus) {
        formStatus.className = 'form__status is-ok';

        if (win) {
          formStatus.textContent = 'Abrimos o WhatsApp com a sua mensagem pronta. Só falta enviar.';
        } else {
          /* Pop-up bloqueado: oferece o link em vez de perder os dados. */
          formStatus.textContent = '';
          formStatus.appendChild(
            document.createTextNode('O navegador bloqueou a abertura automática. ')
          );
          var link = document.createElement('a');
          link.href = url;
          link.target = '_blank';
          link.rel = 'noopener';
          link.className = 'form__status-link';
          link.textContent = 'Abrir o WhatsApp com a mensagem pronta';
          formStatus.appendChild(link);
        }
      }
      /* Os dados ficam no formulário de propósito, para reenvio ou ajuste. */
    });
  }
})();
