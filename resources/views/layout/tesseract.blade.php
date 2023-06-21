<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Tesseract Data Trainer</title>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <script src="https://unpkg.com/leaflet@1.0.2/dist/leaflet.js"></script>
    <script src="/tesseract/leaflet.draw.js"></script>
    <script src="/tesseract/jquery.hotkeys.js"></script>


    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.2/dist/leaflet.css" />
    <link rel="stylesheet" href="/tesseract/leaflet.draw.css">
    <link rel="stylesheet" href="/tesseract/styles.css">

    @vite('resources/css/app.less')
    @vite('resources/css/tesseract.less')

    @yield('head')
</head>

<body>
    @yield('content')
</body>


@yield('footer')

@vite('resources/js/tesseract.js')

</html>
