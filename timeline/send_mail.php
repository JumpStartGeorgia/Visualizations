<?php
require_once './lib/swift_required.php';

$event = $_POST['event'];
$date = $_POST['date'];
$link = $_POST['link'];
$name = $_POST['name'];
$email = $_POST['email'];

$message=" Date: $date \n\n Event: \n $event \n\n Link: $link \n\n Name: $name \n\n Email: $email";

$subject ="Georgian Timeline Event Submission";
$to ="info@feradi.info";
$pwd ="IdareFIdareF";
$header="from: $to";

$email = Swift_Message::newInstance()
  ->setSubject($subject)
  ->setFrom($to)
  ->setTo($to)
  ->setBody($message)
;

$transport = Swift_SmtpTransport::newInstance('ssl://smtp.gmail.com', 465)
  ->setUsername($to)
  ->setPassword()
  ;

$mailer = Swift_Mailer::newInstance($transport);
$result = $mailer->send($email);

#$send_contact = mail($to,$subject,$message,$header);

if($result){
  echo json_encode(array(
      'status' => 'success'
  ));
}
else {
  echo json_encode(array(
      'status' => 'error'
  ));
}
exit();
?>
