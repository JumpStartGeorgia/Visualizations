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
    var source = 'https://docs.google.com/spreadsheet/pub?key=0AmtLAgh5j8CydENFUVc4SmVmNHg3Z1NaY3lnamdXZ1E&output=html';
    if (lang !== undefined && lang == 'en'){
//      source = 'https://docs.google.com/spreadsheet/pub?key=0AtUyMZoeaZt8dFRCYzRyaGJZb1gxWXk2QnF6ZFFmZnc&output=html';
    }

	  createStoryJS({
		  type:		'timeline',
		  width:		'100%',
      lang:     lang,
		  height:		'100%',
		  source:		source,
		  embed_id:	'timeline-embed',
      hash_bookmark: true,
      start_zoom_adjust: -1,
		  debug:		false
	  });
  }

function set_language_switcher(){
  var link = $('a#language_switcher');
  if (lang !== undefined && lang == 'en'){
      $(link).text('ქართული');
      $(link).attr('href', '?lang=ka');
      $('title').html('Timeline of Georgia');
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
      $('#img_slide_up').attr('alt', 'Submit Event')
      $('#img_slide_up').attr('src', 'img/submit_event.png')
  
      $('#social_links a').each(function(){
        $(this).attr('href', $(this).attr('href') + '?lang=en');
      });

      $('#og_title').attr('content', 'Timeline of Georgia');
      $('#og_description').attr('content', 'Jumpstart Georgia created a visual timeline of events from 2012 in Georgia. Viewers can submit events that they feel should be included in the timeline using the submission form at the top of the website. After careful consideration, Jumpstart Georgia will add qualified events to the timeline.');
      $('#og_image').attr('content', $('#og_url').attr('content') + 'img/timeline-of-georgia_logo.png');
      $('#og_url').attr('content', $('#og_url').attr('content') + '?lang=en');

      // apply en css
      var headtg = document.getElementsByTagName('head')[0];
      var linktg = document.createElement('link');
      linktg.type = 'text/css';
      linktg.rel = 'stylesheet';
      linktg.href = 'css/timeline_en.css';
      headtg.appendChild(linktg);

  } else {
      $(link).text('English');
      $(link).attr('href', '?lang=en');
      $('.brand').attr('href', '?lang=ka');

      $('#social_links a').each(function(){
        $(this).attr('href', $(this).attr('href') + '?lang=ka');
      });

      $('#og_url').attr('content', $('#og_url').attr('content') + '?lang=ka');

      // apply ka css
      var headtg = document.getElementsByTagName('head')[0];
      var linktg = document.createElement('link');
      linktg.type = 'text/css';
      linktg.rel = 'stylesheet';
      linktg.href = 'css/timeline_ka.css';
      headtg.appendChild(linktg);
  }

}

$(document).ready(function() {
  lang = GetQueryStringParams('lang');
  if (lang === undefined){
    lang = 'ka';
  }
//  set_language_switcher();
  init_timeline();

/*
  $('a#language_switcher').click(function() {
    window.location.href = $(this).attr('href') + location.hash;
    return false;
  });
*/
});

