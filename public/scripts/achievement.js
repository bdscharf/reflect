function showAchievement(message) {
  $('#achievement .copy h4').html(message);
  $('#achievement .circle').removeClass('rotate');
  // Run the animations
  setTimeout(function () {
    $('#achievement').addClass('expand');
    setTimeout(function () {
      $('#achievement').addClass('widen');
      setTimeout(function () {
        $('#achievement .copy').addClass('show');
      }, 250);
    }, 750);
  }, 750);
  // Hide the achievement
  setTimeout(function () {
    hideAchievement();
  }, 2000);
}

function hideAchievement() {
  setTimeout(function () {
    $('#achievement .copy').removeClass('show');
     setTimeout(function () {
      $('#achievement').removeClass('widen');
       $('#achievement .circle').addClass('rotate');
        setTimeout(function () {
          $('#achievement').removeClass('expand');
        }, 750);
     }, 250);
  }, 2000);
}
