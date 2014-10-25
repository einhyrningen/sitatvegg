<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Sitatvegg - Enhjørningen!</title>

    <!-- Bootstrap core CSS -->
    <link href="css/bootstrap.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="css/style.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="js/html5shiv.js"></script>
      <script src="js/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>
    <br /><br />
    <div class="container">
      <center>
        <a href="http://goo.gl/gQEq7U" class="btn btn-primary">Send inn sitat!</a><br /><br />
        <h3>Vi tar nå imot sitater på flere steder</h3>
        <p>Sitater tas imot skrevet på tynne, hvite, døde trær ved det tekniske bordet, eller via IRC til cobraz (EFNet).<br />Det er itillegg anledning til å sende dette via Facebook til
        Simen A. W. Olsen (hint: Sjekk «Vi som er på landstinget»).</p>
      </center><br /><br />
      <? foreach(DB::table('vegg')->orderBy('id', 'desc')->get() as $sitat): ?>
      <div class="jumbotron row">
        <div class="col-md-2">
          <div style="border-radius: 80px; width: 150px; height: 150px; background: url('<?=!empty($sitat['imgurl']) ? $sitat['imgurl'] : "img/bg.jpg"?>') top center; -webkit-background-size:\
 cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover;">
          </div>
        </div>
        <div class="col-md-10">
          <blockquote>
            <b>&laquo;</b><?=$sitat['quote']?><b>&raquo;</b><br />
            <small class="pull-right"><?=$sitat['owner']?>, <?=$sitat['location'] ? $sitat['location'] : "Landstinget 2013" ?></small>
          </blockquote>
        </div>
      </div>
      <? endforeach; ?>
      <center><b>Logger fra Landstinget 2013</b><br />
          <a href="http://diskett.no/landstinget-20131019.txt">IRC-logg fra Lørdag</a><br />
         <a href="http://diskett.no/landstinget-20131020.txt">IRC-logg fra Søndag</a></center>
<br /><br />

    </div> <!-- /container -->


    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="../../assets/js/jquery.js"></script>
    <script src="../../dist/js/bootstrap.min.js"></script>
  </body>
</html>

