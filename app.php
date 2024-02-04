<?php
$filename = 'booked_days.json';

$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

if (!$data || !isset($data['selectedDays']) || !is_array($data['selectedDays'])) {
    http_response_code(400);
    echo json_encode(array('error' => 'Invalid data format'));
    exit();
}

$bookedDays = array();
if (file_exists($filename)) {
    $bookedDays = json_decode(file_get_contents($filename), true);
}

foreach ($data['selectedDays'] as $day) {
    if (!in_array($day, $bookedDays)) {
        $bookedDays[] = $day;
    }
}

file_put_contents($filename, json_encode($bookedDays));

http_response_code(200);
?>
