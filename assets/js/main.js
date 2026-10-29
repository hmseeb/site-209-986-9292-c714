/* ==========================================================================
   Lance McHan — site scripts
   Progressive enhancement only. Every form works with JavaScript disabled:
   it performs a normal POST and returns to the page with ?submitted=1.
   ========================================================================== */
(function () {
  'use strict';

  var ENDPOINT = 'https://vision.leadrai.com/api/forms/c210a3fc5d063e01e79c357d8eb8c4f1';

  /* ----------------------------------------------------------------------
     Mobile navigation
     ---------------------------------------------------------------------- */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('primary-nav');
    if (!toggle || !nav) return;

    function setOpen(open) {
      nav.setAttribute('data-open', open ? 'true' : 'false');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    setOpen(false);

    toggle.addEventListener('click', function () {
      setOpen(nav.getAttribute('data-open') !== 'true');
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.getAttribute('data-open') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener('click', function (event) {
      if (nav.getAttribute('data-open') !== 'true') return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      setOpen(false);
    });

    // Reset state when switching to the desktop layout.
    var desktop = window.matchMedia('(min-width: 62rem)');
    var onChange = function (event) { if (event.matches) setOpen(false); };
    if (typeof desktop.addEventListener === 'function') {
      desktop.addEventListener('change', onChange);
    } else if (typeof desktop.addListener === 'function') {
      desktop.addListener(onChange);
    }
  }

  /* ----------------------------------------------------------------------
     Hidden _page field: where the visitor submitted from
     ---------------------------------------------------------------------- */
  function initPageFields() {
    var fields = document.querySelectorAll('input[name="_page"]');
    for (var i = 0; i < fields.length; i++) {
      fields[i].value = window.location.href;
    }
  }

  /* ----------------------------------------------------------------------
     Confirmation after a plain (no-JavaScript) submission: ?submitted=1
     ---------------------------------------------------------------------- */
  function initSubmittedBanner() {
    var submitted = false;
    try {
      submitted = new URLSearchParams(window.location.search).get('submitted') === '1';
    } catch (err) {
      submitted = window.location.search.indexOf('submitted=1') > -1;
    }
    if (!submitted) return;

    var banner = document.getElementById('submitted-banner');
    if (banner) {
      banner.hidden = false;
      banner.setAttribute('tabindex', '-1');
      banner.focus();
    }

    // Also confirm beside the form itself.
    var status = document.querySelector('.form-status');
    if (status) {
      showStatus(status, 'success',
        'Thanks, your message was sent.',
        'Lance has your details and will be in touch. Need an answer sooner? Call 209-986-9292.');
    }
  }

  /* ----------------------------------------------------------------------
     Status messaging
     ---------------------------------------------------------------------- */
  function showStatus(el, kind, heading, detail) {
    if (!el) return;
    el.className = 'form-status ' + (kind === 'success' ? 'is-success' : 'is-error');
    el.setAttribute('role', 'status');
    el.innerHTML = '';

    var strong = document.createElement('strong');
    strong.textContent = heading;
    el.appendChild(strong);

    if (detail) {
      var span = document.createElement('span');
      span.textContent = detail;
      el.appendChild(span);
    }
    el.hidden = false;
  }

  /* ----------------------------------------------------------------------
     Enhanced submission: POST to the same endpoint, stay on the page
     ---------------------------------------------------------------------- */
  function initForms() {
    if (typeof window.fetch !== 'function') return; // fall back to a plain POST

    var forms = document.querySelectorAll('form[data-leadr]');

    Array.prototype.forEach.call(forms, function (form) {
      form.addEventListener('submit', function (event) {
        if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
          return; // let the browser show its own validation messages
        }

        event.preventDefault();

        var status = form.querySelector('.form-status');
        var button = form.querySelector('button[type="submit"]');
        var buttonLabel = button ? button.textContent : '';

        var payload = {};
        var data = new FormData(form);
        data.forEach(function (value, key) {
          if (typeof value === 'string') payload[key] = value;
        });
        payload._page = window.location.href;

        if (button) {
          button.disabled = true;
          button.textContent = 'Sending…';
        }

        fetch(ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        })
          .then(function (response) {
            return response.json().catch(function () { return { ok: response.ok }; });
          })
          .then(function (result) {
            if (!result || result.ok !== true) throw new Error('Submission rejected');

            form.reset();
            initPageFields();
            showStatus(status, 'success',
              'Thanks, your message was sent.',
              'Lance has your details and will be in touch. Need an answer sooner? Call 209-986-9292.');

            if (status && typeof status.scrollIntoView === 'function') {
              status.scrollIntoView({ block: 'center', behavior: 'smooth' });
            }
          })
          .catch(function () {
            showStatus(status, 'error',
              'That didn’t go through.',
              'Please try again, or call 209-986-9292 or email lance@lancemchan.com.');
          })
          .then(function () {
            if (button) {
              button.disabled = false;
              button.textContent = buttonLabel;
            }
          });
      });
    });
  }

  /* ----------------------------------------------------------------------
     Footer year
     ---------------------------------------------------------------------- */
  function initYear() {
    var nodes = document.querySelectorAll('[data-year]');
    var year = String(new Date().getFullYear());
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = year;
  }

  function init() {
    initNav();
    initPageFields();
    initForms();
    initSubmittedBanner();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
