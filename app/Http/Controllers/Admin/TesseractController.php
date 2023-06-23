<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\TrainDataService;

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

        return response()->file($file);
    }
}
