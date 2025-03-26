window.addEventListener('load', function () {
    let theme = localStorage.getItem('theme');
  
    if (!theme) {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme = 'dark';
      } else {
        theme = 'light';
      }
      localStorage.setItem('theme', theme);
    }
  
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
    }
  });

document.getElementById('theme-toggle').addEventListener('click', function () {
    document.documentElement.classList.toggle('dark-theme');
  
    if (document.documentElement.classList.contains('dark-theme')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });

  document.querySelectorAll('blockquote.good').forEach(quote => {
    quote.addEventListener('click', () => {
      quote.classList.toggle('collapsed');
    });
  });
