(function () {
  'use strict';

  var root = document.documentElement;
  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  var preference = null;

  try {
    preference = localStorage.getItem('melowrite-theme');
  } catch (error) {
    // Theme switching still works when browser storage is unavailable.
  }

  if (preference !== 'dark' && preference !== 'light') preference = null;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    document.querySelectorAll('img[data-light-src][data-dark-src]').forEach(function (image) {
      var source = image.getAttribute('data-' + theme + '-src');
      if (image.getAttribute('src') !== source) image.setAttribute('src', source);
    });
    var toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      var label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
      toggle.setAttribute('aria-label', label);
      toggle.setAttribute('title', label);
      toggle.setAttribute('aria-pressed', String(theme === 'dark'));
    }

    var widget = document.querySelector('.buy-widget iframe');
    if (widget) {
      var url = new URL(widget.getAttribute('src'), window.location.href);
      if (theme === 'dark') {
        url.searchParams.set('bg_color', '22273f');
        url.searchParams.set('fg_color', 'ffffff');
        url.searchParams.set('link_color', 'f8f4f4');
        url.searchParams.set('border_color', 'f8f4f4');
      } else {
        url.searchParams.delete('bg_color');
        url.searchParams.delete('fg_color');
        url.searchParams.set('link_color', '854ec8');
        url.searchParams.set('border_color', 'e3edf7');
      }
      if (widget.src !== url.href) widget.src = url.href;
    }
  }

  // Set the theme before the page renders to avoid a flash of the wrong colors.
  applyTheme(preference || (systemTheme.matches ? 'dark' : 'light'));

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(root.getAttribute('data-theme'));
    var toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      preference = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('melowrite-theme', preference);
      } catch (error) {
        // Keep the selection for this visit even if storage is blocked.
      }
      applyTheme(preference);
    });
  });

  systemTheme.addEventListener('change', function (event) {
    if (!preference) applyTheme(event.matches ? 'dark' : 'light');
  });

  window.addEventListener('storage', function (event) {
    if (event.key !== 'melowrite-theme' && event.key !== null) return;
    preference = event.newValue === 'dark' || event.newValue === 'light' ? event.newValue : null;
    applyTheme(preference || (systemTheme.matches ? 'dark' : 'light'));
  });
})();
