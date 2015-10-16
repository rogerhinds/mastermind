<?php
$pn=($_GET['p']);
$con = mysqli_connect('rogerhinds-mastermind2-1636810','rogerhinds','','mm',3306);
if (!$con) {
    die('Could not connect: '.mysqli_error($con));
}

$sql="SELECT * FROM result WHERE PName='$pn'";

$result = mysqli_query($con,$sql) or die("Error finding $pn");
$t=date_create();

while($row=mysqli_fetch_array($result)){
    $d=date_create($row["Date"]);
    $s=$row["Score"];
    
    switch(date_diff($d,$t)){
        case 0:
            $date = "Today at " . date_format($d, 'H:i');
    }
    
    $date = date_format($d, 'Y-m-d H:i:s');
    
    
    echo "<tr><td>$date</td><td>$s</td></tr>";
}

mysqli_close($con);
?>