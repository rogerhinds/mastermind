<?php
$pn=($_GET['p']);
$passwdhash=intval($_GET['ph']);
$con = mysqli_connect ('rogerhinds-mastermind2-1636810','rogerhinds','','mm',3306);
if (!$con) {
    die('Could not connect: '.mysqli_error($con));
}

$sql="SELECT * FROM player WHERE PName='$pn'";

$result = mysqli_query($con,$sql) or die("Error finding $pn");
if ( mysqli_num_rows($result)>0) {
    $r=mysqli_fetch_array($result,MYSQLI_ASSOC);
    if($r["PpwdHash"]==$passwdhash){
        echo $r["PName"]; // return the player ID
    }
    else{
        echo ""; // return "", i.e. no valid login
    }
}
else{
    //echo"not existing, adding now";
    // add new player details
    $sql="INSERT INTO player(PName,PGameCount,PLevel,PpwdHash) VALUES('$pn',0,0,'$passwdhash')";
    $result = mysqli_query($con,$sql) or die('Error adding player');
    //
    $sql="SELECT * FROM player WHERE PName='$pn'";
    $result = mysqli_query($con,$sql) or die("Error finding $pn");
    $r=mysqli_fetch_array($result,MYSQLI_ASSOC);
    echo $r["PName"];
}

mysqli_close($con);
?>