$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Output "Server running at http://localhost:$port/"
$htmlPath = "C:\Users\Lenovo\.gemini\antigravity\scratch\kointakdir\index.html"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $bytes = [System.IO.File]::ReadAllBytes($htmlPath)
        $response.ContentType = "text/html; charset=utf-8"
        $response.ContentLength64 = $bytes.Length

        if ($request.HttpMethod -ne "HEAD") {
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        $response.OutputStream.Close()
    } catch {
        # Continue listening on minor connection drops or HEAD mismatches
    }
}
