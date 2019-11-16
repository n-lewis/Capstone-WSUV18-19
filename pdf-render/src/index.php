<?php
include 'vendor/autoload.php';

function sendError($err)
{
    header('Content-Type: application/json');
    die(json_encode([
        'status' => 'error',
        'error' => $err,
    ]));
}

$ImagesDirectory = "/images";

if (!empty($_POST)) {
    try {
        // TODO(): Sanitize ALL inputs.
        $dpi = $_POST['dpi'] ?? 72;
        $dpi = filter_var((integer) $dpi, FILTER_SANITIZE_NUMBER_INT);
        $hpid = $_POST['hpid'] ?? sendError('No hpid provided.');
        $pdfName = $_POST['pdfName'] ?? sendError('No pdfName provided.');
        $pdfBuffer = $_POST['pdfBuffer'] ?? sendError('No pdfBuffer provided');

        $file = tmpfile();
        $pdfPath = stream_get_meta_data($file)['uri']; // guaranteed safe!
        file_put_contents($pdfPath, $pdfBuffer);

        $pageName = $pdfName;
        $ImagesDirectory = $ImagesDirectory . '/' . $hpid;

        if (!is_dir($ImagesDirectory)) {
            mkdir($ImagesDirectory, 0700, true);
        }

        system('mutool draw -o ' .escapeshellarg($ImagesDirectory) . '/' . escapeshellarg($pageName) . '%d.png ' . $pdfPath);

        //TODO figure out how to get a trimbox, currently mutool doesnt get trimbox but does get media box?
        $parser = new \Smalot\PdfParser\Parser();
        $pdf = $parser->parseFile($pdfPath);
        $metaData = $pdf->getDetails();
        header('Content-Type: application/json');
        die(json_encode([
            'status' => 'ok',
            'metaData' => $metaData,
        ]));
    } catch (Exception $e) {
        sendError('Caught exception rendering pdf: ' . $e->getMessage() . "\n");
    }
} else {
    sendError('Empty post');
}
