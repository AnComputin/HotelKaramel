const FOOTER_HTML = `
<footer class="footer-karamel py-5">
  <div class="container">
    <div class="row g-4">

      <div class="col-12 col-md-6 col-lg-4">
        <h5 class="fw-bold mb-2">Hotel Karamel</h5>
        <p class="small text-muted mb-2">Un refugio de confort y tranquilidad frente al mar. Disfruta de instalaciones impecables y una experiencia inolvidable.</p>
        <p class="small mb-0"><i class="bi bi-geo-alt-fill text-warning me-2"></i>Av. Marina 456, Viña del Mar, Chile</p>
      </div>

      <div class="col-6 col-md-3 col-lg-2">
        <h5 class="fw-bold mb-3">Navegación</h5>
        <ul class="list-unstyled small mb-0">
          <li class="mb-2"><a href="index.html" class="link-footer">Inicio</a></li>
          <li class="mb-2"><a href="habitaciones.html" class="link-footer">Habitaciones</a></li>
          <li class="mb-2"><a href="servicios.html" class="link-footer">Servicios & Spa</a></li>
          <li class="mb-2"><a href="index.html#opiniones" class="link-footer">Opiniones</a></li>
          <li class="mb-2"><a href="contacto.html" class="link-footer">Contacto</a></li>
        </ul>
      </div>

      <div class="col-6 col-md-3 col-lg-3">
        <h5 class="fw-bold mb-3">Contacto & Recepción</h5>
        <ul class="list-unstyled small mb-0">
          <li class="mb-2"><i class="bi bi-telephone-fill me-2"></i>+56 32 212 3456</li>
          <li class="mb-2"><i class="bi bi-whatsapp me-2"></i>+56 9 8765 4321</li>
          <li class="mb-3"><i class="bi bi-envelope-fill me-2"></i>reservas@hotelkaramel.cl</li>
          <li class="pt-2 border-top border-secondary-subtle">
            <span class="d-block text-muted"><strong>Check-in:</strong> 15:00 hrs</span>
            <span class="d-block text-muted"><strong>Check-out:</strong> 12:00 hrs</span>
          </li>
        </ul>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <h5 class="fw-bold mb-3">Conecta con Nosotros</h5>
        <p class="small text-muted mb-2">Síguenos para descubrir ofertas exclusivas y novedades.</p>
        <div class="d-flex gap-3 fs-5 mb-3">
          <a href="https://www.instagram.com/hotelkaramel" class="icono-red" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><i class="bi bi-instagram"></i></a>
          <a href="https://www.facebook.com/hotelkaramel" class="icono-red" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><i class="bi bi-facebook"></i></a>
          <a href="#" class="icono-red" aria-label="TripAdvisor"><i class="bi bi-tripadvisor"></i></a>
          <a href="https://wa.me/56987654321" class="icono-red" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer"><i class="bi bi-whatsapp"></i></a>
        </div>

        <div class="fb-plugin" style="width:280px; max-width:100%;">
          <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fhotelkaramel&tabs=timeline&width=280&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true" width="280" height="130" style="border:none;overflow:hidden" scrolling="no" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
        </div>

      </div>

    </div>

    <hr class="my-4 border-secondary-subtle">

    <div class="row align-items-center small text-muted">
      <div class="col-md-6 text-center text-md-start mb-2 mb-md-0">&copy; 2026 Hotel Karamel. Todos los derechos reservados.</div>
      <div class="col-md-6 text-center text-md-end">
        <a href="#" class="link-footer me-3">Política de Privacidad</a>
        <a href="#" class="link-footer">Términos y Condiciones</a>
      </div>
    </div>

  </div>
</footer>
`;

function injectFooter() {
  const target = document.getElementById('site-footer');
  if (!target) return;
  target.innerHTML = FOOTER_HTML;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectFooter);
} else {
  injectFooter();
}
