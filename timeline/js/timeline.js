  var lang = 'ka';

  function GetQueryStringParams(sParam)
  {
      var sPageURL = window.location.search.substring(1);
      var sURLVariables = sPageURL.split('&');
      for (var i = 0; i < sURLVariables.length; i++)
      {
          var sParameterName = sURLVariables[i].split('=');
          if (sParameterName[0] == sParam)
          {
              return sParameterName[1];
          }
      }
  }


  function init_timeline(){
    var source = 'https://docs.google.com/spreadsheet/pub?key=0AtUyMZoeaZt8dFpyUXpIQXczc2N1WUZWV01UUlN3VFE&output=html';

    if (lang !== undefined && lang == 'en'){
      source = 'https://docs.google.com/spreadsheet/pub?key=0AtUyMZoeaZt8dFRCYzRyaGJZb1gxWXk2QnF6ZFFmZnc&output=html';
    }

	  createStoryJS({
		  type:		'timeline',
		  width:		'100%',
      lang:     lang,
		  height:		String($(window).height()-$('.navbar').height()),
		  source:		source,
		  embed_id:	'timeline-embed',
      hash_bookmark: true,
		  debug:		false
	  });
  }

function set_language_switcher(){
  var link = $('a#language_switcher');
  if (lang !== undefined && lang == 'en'){
      $(link).text('ქართული');
      $(link).attr('href', '?lang=ka');
      $('.brand').attr('href', '?lang=en');
      $('#logo').attr('src', 'img/timeline-of-georgia_logo.png');
      $('#logo').attr('alt', 'Timeline of Georgia');
      $('#form_header').html('Add an Event');
      $('#form_text').html('Did we miss something?  Let us know and we will add it to the timeline.');
      $('#lbl_event').html('Event Description');
      $('#abbr_required').attr('title', 'Required');
      $('#lbl_date').html('Event Date');
      $('#lbl_link').html('Media Link');
      $('#lbl_name').html('Your Name');
      $('#lbl_email').html('Your E-mail');
      $('#btn_submit').attr('src', 'img/submit.png')
      $('#btn_submit').attr('alt', 'Submit')
      $('#success_submit').html('Thank you for your submission!');
      $('#error_submit').html('Sorry, an error occurred.');
      $('#required_submit').html('Event Description is required.');
      $('.vco-slider .slider-item .content .content-container .text .container p').css('font-family', 'bpg_nino');
  } else {
      $(link).text('English');
      $(link).attr('href', '?lang=en');
      $('.brand').attr('href', '?lang=ka');
  }

}

$(document).ready(function() {
  lang = GetQueryStringParams('lang');
  if (lang === undefined){
    lang = 'ka';
  }
  set_language_switcher();
  init_timeline();

  $('a#language_switcher').click(function() {
    window.location.href = $(this).attr('href') + location.hash;
    return false;
  });

  $('img#btn_submit').click(function() {
    $('form#event_form').submit();
  });

  $('form#event_form').submit(function() {
    $('#loading').fadeIn();

    // get the values
    var event, date, link, name, email;
    event = $('textarea[name="event"]').val();
    date = $('input[name="date"]').val();
    link = $('input[name="link"]').val();
    name = $('input[name="name"]').val();
    email = $('input[name="email"]').val();

    if (event === ''){
      // show required msg
      $('#loading').hide();
      $('#required_submit').fadeIn().delay(5000).fadeOut();
      $('textarea[name="event"]').focus();
    }else {
      // send email
      var dataString = "event="+event+"&date="+date+"&link="+link+"&name="+name+"&email="+email;
      $.ajax({
          type: "POST",
          url: "send_mail.php",
          data: dataString,
          dataType:"json",
          timeout: 5000,
          error: function(response) {
            $('#loading').hide();
            if(response.status === "success") {
              // reset form fields
              $('form#event_form input').val('');
              $('form#event_form textarea').val('');

              // show success message
              $('#success_submit').fadeIn().delay(5000).fadeOut();
            } else{
              // show error message
              $('#error_submit').fadeIn().delay(5000).fadeOut();
            }
          },
          success: function(response) {
            $('#loading').hide();
            if(response.status === "success") {
              // reset form fields
              $('form#event_form input').val('');
              $('form#event_form textarea').val('');

              // show success message
              $('#success_submit').fadeIn().delay(5000).fadeOut();
            } else{
              // show error message
              $('#error_submit').fadeIn().delay(5000).fadeOut();
            }
          }
         });
    }
    return false;
  });

  $('img#img_slide_up').click(function() {
    $('div#hidden_form').toggle('slow', function(){
      var deg = 180;
      if ($('div#hidden_form').is(':visible')){
        deg = 0;
      }
      var rotate = {
        'transform':'rotate(0' + deg + 'deg)',
        '-ms-transform':'rotate(0' + deg + 'deg)',
        '-moz-transform':'rotate(0' + deg + 'deg)',
        '-webkit-transform':'rotate(0' + deg + 'deg)',
        '-o-transform':'rotate(0' + deg + 'deg)'
      };
      $('img#img_slide_up').css(rotate);
    });
  });
});

