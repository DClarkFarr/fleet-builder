<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\TrainDataService;
use Illuminate\Http\Request;

class TesseractController extends Controller
{


    /**
     * @var TrainDataService
     */
    public $service;

    public function __construct()
    {
        $this->service = new TrainDataService();
    }

    public function getTrainingOptions()
    {
        return response()->json([
            'rows' => $this->service->getTrainingOptions(),
        ]);
    }

    public function getFile($file_name)
    {
        $file = $this->service->readSourceFile($file_name);

        return response()->file($file, [
            'Cache-Control' => 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0'
        ]);
    }

    public function saveFile(Request $request, $file_name)
    {
        $body = $request->getContent();

        $this->service->saveBoxFile($file_name, $body);

        return response()->json([
            'message' => 'File saved',
        ]);
    }
}
