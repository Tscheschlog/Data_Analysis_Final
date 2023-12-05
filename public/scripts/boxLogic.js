
$(document).ready(function(){
    $('#upper-tab').tab('show');

    $('.nav-tabs a').on('click', function (e) {
      e.preventDefault();
      $(this).tab('show');
    });
  });