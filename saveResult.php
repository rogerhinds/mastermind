<?php
$pid=($_GET['p']);
$level=intval($_GET['l']);
$skill=intval($_GET['ps']);
$gType=intval($_GET['gt']);
$score=intval($_GET['sc']);

if($pid>""){
    // only save result for logged in players
    $con = mysqli_connect('rogerhinds-mastermind2-1636810','rogerhinds','','mm',3306);
    if (!$con) {
        die('Could not connect: '.mysqli_error($con));
    }
    
    $sql="INSERT INTO result(PName,Level,PSkill,GameType,Score) VALUES('$pid','$level','$skill','$gType','$score')";
    $result = mysqli_query($con,$sql) or die('Error adding score');
    
    if ($score > "0") {
        echo "Winner";
    }
    else{
        echo"Out of goes";
    }
    
    mysqli_close($con);
}
?>