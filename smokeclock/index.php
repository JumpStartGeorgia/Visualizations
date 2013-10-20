<!DOCTYPE html>
<html lang="ka">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="style.css" />
    <script type="text/javascript" src="translations.js"></script>
    <title>რას უნდა ელოდოთ როცა წყვეტთ მოწევას</title>
  </head>
  <body>

    <div id="wrapper">
      <div class="container">

        <div style="display: table; margin: 0 auto;">
          <div id="clock">
            <div id="clock-bg"></div>
            <div id="clock-inner">
              <div class="imgc">
                <div class="inner">
                  <div class="img">
                    <img src="images/i/1.png" />
                  </div>
                </div>
              </div>
              <div class="controls">
                <div class="inner">
                  <div class="cc">
                    <div class="left"></div>
                    <div class="pause"></div>
                    <div class="right"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="h">
              <?php for ($i = 1; $i <= 12; $i ++): ?>
                <div>
                  <img src="images/h/ka/<?php echo $i; ?>.png" />
                  <img src="images/h/ka/<?php echo $i; ?>-active.png" />
                </div>
              <?php endfor; ?>
            </div>
          </div>

          <div id="content">
            <div class="header clear">
              <a href="javascript:location.reload();">
                <div></div>
                <div>ბოლო სიგარეტის მოწევიდან</div>
                <div></div>
              </a>
            </div>
            <div class="body">
              <div class="subheader">20 წუთის შემდეგ</div>
              <div class="">
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="footer">
        <div class="logo">
          <a target=_blank" href="http://jumpstart.ge/"><img src="images/logo.png" alt="jumpstart logo" /></a>
          <div class="wheel">
            <a target=_blank" href="http://jumpstart.ge/"><img src="images/logo-wheel.png" alt="jumpstart logo" /></a>
          </div>
        </div>
      </div>

    </div>



    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
		<script type="text/javascript" src="timer.js"></script>
		<script type="text/javascript" src="js.js"></script>

  </body>
</html>

