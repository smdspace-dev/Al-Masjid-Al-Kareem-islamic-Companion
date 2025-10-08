# Check if the frontend server is accessible
Write-Host "Checking frontend server at http://localhost:3000 ..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/" -UseBasicParsing
    Write-Host "✅ Frontend server is accessible! Status code: $($response.StatusCode)"
    Write-Host "Content type: $($response.Headers["Content-Type"])"
    Write-Host "Content length: $($response.Content.Length) bytes"
} catch {
    Write-Host "❌ Failed to access frontend server: $_"
}

# Check if the backend server is accessible
Write-Host "`nChecking backend server at http://localhost:5000/api/health ..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing
    Write-Host "✅ Backend server is accessible! Status code: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "❌ Failed to access backend server: $_"
}
