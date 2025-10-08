# Check-MuslimAppConnection.ps1
# Script to diagnose connection issues with the Muslim Lifestyle App

Write-Host "🔍 Muslim Lifestyle App Connection Diagnostic Tool" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor DarkCyan

# Function to test a connection
function Test-Connection {
    param (
        [string]$Url,
        [string]$Description
    )
    
    Write-Host "`n🔄 Testing connection to $Description ($Url)..." -ForegroundColor Yellow
    
    try {
        $startTime = Get-Date
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
        $endTime = Get-Date
        $timeMs = [math]::Round(($endTime - $startTime).TotalMilliseconds)
        
        Write-Host "✅ Connected successfully! ($timeMs ms)" -ForegroundColor Green
        Write-Host "   Status code: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "   Content type: $($response.Headers['Content-Type'])" -ForegroundColor Green
        Write-Host "   Content length: $($response.Content.Length) bytes" -ForegroundColor Green
        
        # Output the first part of the content
        if ($response.Content.Length -gt 0) {
            Write-Host "   Response preview:" -ForegroundColor Green
            if ($response.Headers['Content-Type'] -match "json") {
                $content = $response.Content | ConvertFrom-Json -ErrorAction SilentlyContinue | ConvertTo-Json -Depth 2
                Write-Host $content.Substring(0, [Math]::Min(500, $content.Length)) -ForegroundColor Gray
            } else {
                $content = $response.Content
                Write-Host $content.Substring(0, [Math]::Min(500, $content.Length)) -ForegroundColor Gray
            }
        }
        
        return $true
    }
    catch [System.Net.WebException] {
        if ($_.Exception.Response) {
            $statusCode = [int]$_.Exception.Response.StatusCode
            Write-Host "❌ Connection failed with status code: $statusCode" -ForegroundColor Red
            
            # Try to get response content for more details
            try {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $responseContent = $reader.ReadToEnd()
                $reader.Close()
                Write-Host "   Error details:" -ForegroundColor Red
                Write-Host $responseContent -ForegroundColor Gray
            }
            catch {
                Write-Host "   Could not retrieve error details" -ForegroundColor Red
            }
        }
        else {
            Write-Host "❌ Connection failed: $($_.Exception.Message)" -ForegroundColor Red
        }
        return $false
    }
    catch {
        Write-Host "❌ Connection failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Check if servers are running
Write-Host "`n📊 Checking if backend and frontend servers are running..." -ForegroundColor Blue

# Check backend health
$backendStatus = Test-Connection -Url "http://localhost:5000/api/health" -Description "Backend health endpoint"

# Check backend APIs
if ($backendStatus) {
    Test-Connection -Url "http://localhost:5000/api/auth/login" -Description "Backend auth endpoint"
}

# Check frontend
$frontendStatus = Test-Connection -Url "http://localhost:3000/" -Description "Frontend main page"

# Check test page
Test-Connection -Url "http://localhost:3000/test.html" -Description "Test page"

# Summary
Write-Host "`n📋 Connection Test Summary:" -ForegroundColor Blue
Write-Host "=================================================" -ForegroundColor DarkCyan
if ($backendStatus) {
    Write-Host "✅ Backend server is running and accessible" -ForegroundColor Green
} else {
    Write-Host "❌ Backend server is not accessible" -ForegroundColor Red
    Write-Host "   Try running: cd backend && python app.py" -ForegroundColor Yellow
}

if ($frontendStatus) {
    Write-Host "✅ Frontend server is running and accessible" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend server is not accessible" -ForegroundColor Red
    Write-Host "   Try running: cd frontend && npm run dev" -ForegroundColor Yellow
}

Write-Host "`n💡 Troubleshooting Tips:" -ForegroundColor Cyan
Write-Host "1. Make sure both servers are running" -ForegroundColor White
Write-Host "2. Check for any firewall or antivirus blocking localhost connections" -ForegroundColor White
Write-Host "3. Check for any CORS issues in the browser console (F12)" -ForegroundColor White
Write-Host "4. Try accessing the URLs directly in your browser" -ForegroundColor White
Write-Host "5. Check the terminal outputs for error messages" -ForegroundColor White

# Open connection_test.html in browser
$connectionTestPath = Join-Path $PSScriptRoot "connection_test.html"
if (Test-Path $connectionTestPath) {
    Write-Host "`n🔗 Opening interactive connection test page..." -ForegroundColor Yellow
    Start-Process $connectionTestPath
}
