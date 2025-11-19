$(document).ready(function () {
  /**
   * Init Bootstrap Alert
   */
  const alertList = document.querySelectorAll('.alert');
  const alerts = [...alertList].map((element) => new bootstrap.Alert(element));

  /**
   * Init Bootstrap Carousel
   */
  const carouselList = document.querySelectorAll('.carousel');
  const carousels = [...carouselList].map((element) => new bootstrap.Carousel(element));
});
