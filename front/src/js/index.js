var item = document.getElementsByClassName('tabs-nav')[0];

window.addEventListener('wheel', function (e) {

  if (e.deltaY > 0) item.scrollLeft += 100;
  else item.scrollLeft -= 100;
});