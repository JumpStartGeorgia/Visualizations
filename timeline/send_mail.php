<?php
$event = $_POST['event'];
$date = $_POST['date'];
$link = $_POST['link'];
$name = $_POST['name'];
$email = $_POST['email'];

$message="Date: $date \n Event: \n $event \n Link: $link \n Name: $name \n Email: $email";

$subject ="Georgian Timeline Event Submission"; 
$to ='jason.addie@jumpstart.ge';
$header="from: $to";

$send_contact=mail($to,$subject,$message,$header);

if($send_contact){
echo true;
}
else {
echo false;
}
?>