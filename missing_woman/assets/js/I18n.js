var I18n = (function () {
     // locally scoped Object
   var obj = { };
   var default_locale = "en";
   var locale = default_locale;
   var languages = ["az","en","hy","ka","ru"];
   var locales = {};
   var data = null;
      

   obj.t = function(path)
   {
      var tmp = path.split('.');
      tmp.forEach(function(d,i){
          console.log(d,i);
      });
   };
   obj.locale = function()
   {
      return locale;
   }
   var init = function()
   {
      init_locale();
      init_locales();
      if(init_data())
      {
         allocate();
      }
      
       
      //obj.t('en.blah.one.tri');
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
         log("I18n: None of the translation exists! So I18n stopped.");
         return false;
      }
      return true;
   };
   var allocate = function()
   {
      if(typeof data == "object")
      {
         Object.keys(data).forEach(function(key) {
            var type = typeof data[key];
            if(type == "string")
            {
               var v = data[key];
               var k = "i18n-"+key;
               var kCamel = "i18n" + key.charAt(0).toUpperCase() + key.slice(1);
               var i,all = document.querySelectorAll("[data-"+k+"]");
               var d = null;
               for (i = 0; i < all.length; ++i) {
                  d = all[i];
                  if(["text","t",""].indexOf(d.dataset[kCamel]) != -1)
                  {
                     d.innerHTML = v;
                  }
               }
            }
            else if(type == "object")
            {
               console.log(key,"object");
            }
         });
      }
      else 
      {
         log("I18n: Data for " + locale + " is missing!");   
      }   
   };
   var delve = function(obj)
   {

   };
   var allocate_field = function()
   {

   };
   var init_locales = function()
   {
      locales.en = 
      {
         title: "En Title",
         description: "En Description"
      };
      locales.ka = 
      {
         title: "Ka Title",
         description: "Ka Description",
         timeline: 
         {
            start:"2015",
            today:"Today",
            end: "End"
         }

      };
   };
   var log = function(v)
   {
       console.log(v);
   };


   init();
   return obj;

})();