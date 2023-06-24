<?php

namespace App\Services;

class TrainDataService
{
    public function getRootDirectory()
    {
        return dirname(dirname(__DIR__));
    }
    public function getSourcePath()
    {
        return realpath($this->getRootDirectory() . '/../tesseract/data');
    }

    public function getTrainingOptions()
    {
        $dir = collect(scandir($this->getSourcePath()))
            ->filter(function ($filename) {
                return !in_array($filename, ['.', '..']) && pathinfo($filename, PATHINFO_EXTENSION) === 'box';
            })
            ->values()
            ->map(function ($filename) {
                $segs = explode('.', $filename);
                // eng.fleet.exp0.jpg
                $matches = [];
                preg_match('/\d+/', $segs[2], $matches);

                list($number) = $matches;


                return [
                    'number' => $number,
                    'jpg' => "$segs[0].$segs[1].$segs[2].jpg",
                    'box' => "$segs[0].$segs[1].$segs[2].box",
                ];
            });

        return $dir;
    }

    public function readSourceFile($filename)
    {
        $fullPath = $this->getSourcePath() . "/$filename";

        if (!file_exists($fullPath)) {
            throw new \Exception("File $filename not found");
        }

        // $type = pathinfo($fullPath, PATHINFO_EXTENSION);

        // if ($type === 'jpg') {
        //     // $data = file_get_contents($fullPath);
        //     // // $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
        //     // $base64 = base64_encode($data);

        //     // return $base64;

        //     return file($fullPath);
        // 

        return $fullPath;
    }

    public function saveBoxFile($fileName, $contents)
    {
        $fullPath = $this->getSourcePath() . "/$fileName";

        file_put_contents($fullPath, $contents);
    }
}
