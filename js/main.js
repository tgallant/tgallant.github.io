window.onload = function () {
  var url = window.location;
    // sets active class based on url location
    $('ul.nav a').filter(function() {
      return this.href == url;
    }).parent().addClass('pure-menu-selected');
};
