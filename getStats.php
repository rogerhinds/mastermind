<?php
$pn=($_GET['p']);
$con = mysqli_connect('rogerhinds-mastermind2-1636810','rogerhinds','','mm',3306);
if (!$con) {
    die('Could not connect: '.mysqli_error($con));
}

$sql="SELECT * FROM result WHERE PName='$pn'";

$result = mysqli_query($con,$sql) or die("Error finding $pn");
while($row=mysqli_fetch_array($result)){
    $d=$row["Date"];
    $s=$row["Score"];
    echo "<tr><td>$d</td><td>$s</td></tr>";
}

mysqli_close($con);
?>