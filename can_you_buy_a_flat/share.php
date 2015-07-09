<?php

function getFullUrl() {
  $url  = @( $_SERVER["HTTPS"] != 'on' ) ? 'http://'.$_SERVER["SERVER_NAME"] :  'https://'.$_SERVER["SERVER_NAME"];
  //$url .= ( $_SERVER["SERVER_PORT"] !== 80 ) ? ":".$_SERVER["SERVER_PORT"] : "";
  $url .= $_SERVER['REQUEST_URI'];
  return $url;
}
  function getUrl() {
    $url  = @( $_SERVER["HTTPS"] != 'on' ) ? 'http://'.$_SERVER["SERVER_NAME"] :  'https://'.$_SERVER["SERVER_NAME"];
//    $url .= ( $_SERVER["SERVER_PORT"] !== 80 ) ? ":".$_SERVER["SERVER_PORT"] : "";
    $current_url = explode("?", $_SERVER['REQUEST_URI']);
    $url .= $current_url[0];
    return str_replace("share.php", "", $url);
  }
  $i18n = array(
    "en" => array(
      "title" => "Can you buy a flat?",
      "description" => "It will take me X1 year(s) and X2 month(s) to buy X3 m² apartment in X4.",
      "areas" => array(
        "65" => "Tbilisi",
        "23" => "Batumi",
        "9" => "Zugdidi",
        "69" => "Mtskheta",
        "75" => "Gori",
        "29" => "Kutaisi",
        "55" => "Axaltsikhe",
        "52" => "Rustavi",
        "31" => "Telavi",
        "35" => "Ozurgeti",
        "14" => "Ambrolauri",
        "1" => "Sokhumi",
        "15" => "Tskhinvali",
        "202" => "Gldani-Nadzaladevi",
        "201" => "Isani-Samgori",
        "205" => "Didgori",
        "204" => "Didube-Chughureti",
        "203" => "Vake-Saburtalo",
        "206" => "Old Tbilisi"
      ),
    ),
    "ka" => array(
      "title" => "იყიდი ბინას?",
      "description" => "მე დამჭირდება X1 წელი და X2 თვე X3 მ2 ბინის შესაძენად X4",
      "areas" => array(
          "65" => "თბილისში",
          "23" => "ბათუმში",
          "9" => "ზუგდიდში",
          "69" => "მცხეთაში",
          "75" => "გორში",
          "29" => "ქუთაისში",
          "55" => "ახალციხეში",
          "52" => "რუსთავში",
          "31" => "თელავში",
          "35" => "ოზურგეთში",
          "14" => "ამბროლაურში",
          "1" => "სოხუმი",
          "15" => "ცხინვალი",
          "202" => "გლდანი-ნაძალადევში",
          "201" => "ისანი-სამგორში",
          "205" => "დიდგორში",
          "204" => "დიდუბე-ჩუღურეთში",
          "203" => "ვაკე-საბურთალოზე",
          "206" => "ძველ თბილისში"
      )
    ),
  );

  $user_agent = $_SERVER['HTTP_USER_AGENT'];


  $file = 'log.txt';
  $fh = fopen($file, 'a');
fwrite($fh, $user_agent);
fclose($fh);


  $locale = isset($_GET["locale"]) && ($_GET["locale"] == "en" || $_GET["locale"] == "ka") ? htmlspecialchars($_GET["locale"]) : "ka";

  if((strpos($user_agent, "facebook") && strpos($user_agent, "externalhit"))) {// if facebook robot
    if(isset($_GET["m"]) && isset($_GET["sqm"]) && isset($_GET["area"])) {
      $months = htmlspecialchars($_GET["m"]);
      $sqm = htmlspecialchars($_GET["sqm"]); // square meters
      $area = htmlspecialchars($_GET["area"]);

      $descr = $i18n[$locale]["description"];
      $descr = str_replace("X1", floor($months/12), $descr);
      $descr = str_replace("X2", $months%12, $descr);
      $descr = str_replace("X3", $sqm, $descr);
      $descr = str_replace("X4", $i18n[$locale]["areas"][$area], $descr);
?>
<!DOCTYPE html>
<html lang="<?php echo $locale ?>">
   <head>
     <meta charset="utf-8">
     <title><?php echo $i18n[$locale]["title"]; ?></title>
     <meta property="og:title"content="<?php echo $i18n[$locale]["title"]; ?>" />
     <meta property="og:site_name" content="<?php echo $i18n[$locale]["title"]; ?>" />
     <meta property="og:description" content="<?php echo $descr; ?>" />
     <meta property="og:image" content="<?php echo getUrl() . "assets/images/fb_" . $locale . ".png"; ?>" />
     <meta property="og:type" content="website">
     <meta property="og:url" content="<?php echo getUrl(); ?>" />
     <link rel="shortcut icon" href="favicon.ico" type="image/vnd.microsoft.icon">
   </head>
   <body>
      <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
        ga('create', 'UA-12801815-46', 'auto');
        ga('send', 'pageview');
      </script>
   </body>
</html>
<?php
    }
    else {
      header("Location: " . getUrl() . $locale . "/");
      die();
    }
  }
  else {
    header("Location: " . getUrl() . $locale . "/");
    die();
  }
?>
