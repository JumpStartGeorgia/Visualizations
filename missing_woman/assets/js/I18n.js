var I18n = (function () {
     // locally scoped Object
   var obj = { };
   var default_locale = "en";
   var locale = default_locale;
   var languages = ["az","en","hy","ka","ru"];
   var locales = {};
   var data = null;
   var delve_threshold = 3;
      
   obj.locale = function()
   {
      return locale;
   }
   obj.init = function()
   {
      init_locale();
      init_locales();
      if(init_data())
      {
         allocate();
      }
   };
   var init_locale = function()
   {
      var tmp = window.location.search.substr(1).split('&');
      var params = {};
      var prop = 'locale';
      tmp.forEach(function(d,i){
         var eq = d.split('=');         
         params[eq[0]]=eq[1];
      });

      if(params.hasOwnProperty(prop) && languages.indexOf(params[prop]) != -1)
      {
         locale = params[prop];
      }
      else 
      {
         locale = default_locale;
         log("I18n: Default language was loaded!");
      }
      document.documentElement.lang=locale;
   };
   var init_data = function()
   {
      if(locales.hasOwnProperty(locale))
      {
         data = locales[locale];
      }
      else if(locales.hasOwnProperty(default_locale))
      {
         data = locales[default_locale];
      }
      else 
      {
         log("I18n: None of the translation exists! So I18n stopped!");
         return false;
      }
      return true;
   };
   var allocate = function()
   {
      if(typeof data == "object")
      {         
         delve(data);
      }
      else 
      {
         log("I18n: Data for " + locale + " is missing!");   
      }   
   };
   var delve = function(obj,parent,level)
   {
      parent = parent || "";
      level = level || 1;
      if(level > delve_threshold) // if nesting level is greater than threshold stop
      { 
         log("I18n: Nesting is limited to " + delve_threshold + " objects!");
         return; 
      }
       //console.log(parent,level);
      Object.keys(obj).forEach(function(key) {
         var type = typeof obj[key];
         if(type == "string")
         {
            assign_locale((parent != "" ? (parent + "-" + key) : key),obj[key]);
         }
         else if(type == "object")
         {
            delve(obj[key], (parent == "" ? key : parent + "-" + key),level+1);
         }
      });
   };
   var assign_locale = function(k,v)
   {       
      var kCamel = "i18n";
      k.split("-").forEach(function(a){
         kCamel += a.charAt(0).toUpperCase() + a.slice(1);
      });
      k = "i18n-"+k;      
      var i, d = null, all = document.querySelectorAll("[data-"+k+"]");      
      for (i = 0; i < all.length; ++i) {
         d = all[i];
         if(["text","t",""].indexOf(d.dataset[kCamel]) != -1)
         {
            d.innerHTML = v;
         }
         else if(["content"].indexOf(d.dataset[kCamel]) != -1)
         {
            d.content = v;
         }
         d.removeAttribute('data-' + k);
      }
   };
   var init_locales = function()
   {
      locales.en = 
      {
         title: "Missing Woman",
         description: "Missing Woman Description",
         url: "www.google.com",
         site_name: "Missing Woman",
         timeline: 
         {
            past: "1995",
            today: "Today",
            future: "2035"
         },
         about:
         {
            text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
         },
         question: "What's wrong?",
         charts:
         {
            header: "CHOOSING MALE IN THE SOUTH CAUCASUS",
            sub_header: "Male to Female Ratio at Birth",
            bar_chart: {
               china: "China",
               azerbaijan: "Azerbaijan",
               armenia: "Armenia",
               georgia: "Georgia",
               albania: "Albania",
               vietnam: "Vietnam",
               india: "India",
               pakistan: "Pakistan",
               montenegro: "Montenegro",
               singapore: "Singapore",
               south_korea: "South Korea",
               base_mark: "105*",
               asterisk: "* Population 0-19 years",
               source1_label: "Source:",
               source1: "Sex imbalances at birth in Armenia: Demographic evidence and analysis",
               source2_label: "Gender Gap Source:",
               source2: "Sex Imbalances at Birth: Current trends, consequences and policy implications"
            },
            line_chart:
            {
               header: "Decline of Female to Male Ratio in the South Caucasus"
            }
         }
      };
      locales.ka = 
      {
         title: "Ka Missing Woman",
         description: "Ka Description",
         url: "www.google.ge",
         site_name: "KA Missing Woman",
         timeline: 
         {
            past:"1995",
            today:"აქანე",
            future: "2035"
         },
         about:
         {
            text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
         },         
         question: "Ka What's wrong?",
         charts:
         {
            header: "მამრობითი სქესის არჩევა სამხრეთ კავკასიაში",
            sub_header: "Ka Male to Female Ratio at Birth",
            bar_chart: "Ka Bar Chart",
            line_chart: "Ka Line Chart"
         }
      };
   };
   var log = function(v)
   {
       console.log(v);
   };

   return obj;

})();