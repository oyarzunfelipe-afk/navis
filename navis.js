/* NAVIS MF-PM · lógica común de las páginas de entrada */
(function () {
  var C = window.NAVIS || {};
  var esIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var esAndroid = /Android/i.test(navigator.userAgent);
  var instalada = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  var lanzar = /[?&]abrir=1/.test(location.search) || instalada;
  var elegir = 'https://accounts.google.com/AccountChooser?continue=' + encodeURIComponent(C.APP);

  if ('serviceWorker' in navigator) { navigator.serviceWorker.register(document.body.dataset.sw || '../sw.js').catch(function () {}); }

  window.navisAbrir = function () { location.href = C.APP; };
  window.navisElegirCuenta = function () { location.href = elegir; };

  // Abierto desde el ícono: va directo al sistema, con la cuenta institucional.
  if (lanzar) {
    document.body.classList.add('lanzando');
    var a = document.getElementById('linkCuenta'); if (a) a.href = elegir;
    setTimeout(function () { location.replace(C.APP); }, 500);
    return;
  }

  // Instalar con un toque donde el navegador lo permite (Android y computador).
  var diferido = null, bInst = document.getElementById('btnInstalar');
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); diferido = e;
    if (bInst) bInst.classList.remove('oculto');
    var p = document.getElementById('pasosGenericos'); if (p) p.classList.add('oculto');
  });
  if (bInst) bInst.addEventListener('click', function () {
    if (!diferido) return;
    diferido.prompt();
    diferido.userChoice.then(function () { diferido = null; bInst.classList.add('oculto'); });
  });
  window.addEventListener('appinstalled', function () {
    var ok = document.getElementById('instalado'); if (ok) ok.classList.remove('oculto');
    if (bInst) bInst.classList.add('oculto');
  });

  // Instrucciones según el aparato.
  var ios = document.getElementById('pasosIOS'), gen = document.getElementById('pasosGenericos');
  if (esIOS) { if (ios) ios.classList.remove('oculto'); if (gen) gen.classList.add('oculto'); }
  else if (gen) {
    gen.innerHTML = esAndroid
      ? '<b>En Android (Chrome):</b><ol><li>Toque el menú <b>⋮</b> arriba a la derecha.</li><li>Elija <b>Agregar a la pantalla principal</b> o <b>Instalar aplicación</b>.</li></ol>'
      : '<b>En el computador (Chrome o Edge):</b><ol><li>En la barra de direcciones, presione el ícono de <b>instalar</b> (una pantalla con una flecha), o use el menú <b>⋮</b> › <b>Transmitir, guardar y compartir</b> › <b>Instalar página como aplicación</b>.</li><li>Confirme. NAVIS queda en el escritorio y en el menú de inicio.</li></ol>';
  }
})();
