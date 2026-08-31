$body = @{
    id = "123456"
    transferAmount = 100000
    content = "NAP CMTH260T"
    transferType = "in"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/sepay" -Method Post -Body $body -ContentType "application/json"
