$(document).ready(function() {
  create_main_chart();

  $('#chart_nav a').click(function(){
    chart_type = $(this).data('type');
    $('#main_chart').highcharts().destroy();
    create_main_chart();
    return false;
  });

});
