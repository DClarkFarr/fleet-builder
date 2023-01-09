<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Fleet Builder - Nova Iron Galaxy</title>

    @vite('resources/css/app.less')
    @vite('resources/css/builder.less')

    @yield('head')
</head>

<body>
    @yield('content')
</body>


@yield('footer')

@vite('resources/js/builder.js')

</html>
