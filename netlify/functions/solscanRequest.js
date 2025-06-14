const fetch = require("node-fetch");

exports.handler = async function(event, context) {
    const tokenAddress = event.queryStringParameters.address;
    const solscanUrl = `https://pro-api.solscan.io/v2.0/token/meta?address=${tokenAddress}`; // Solscan API URL
    const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3NDk4NjAwMjIwMDUsImVtYWlsIjoid2F4amluaG8wMkBnbWFpbC5jb20iLCJhY3Rpb24iOiJ0b2tlbi1hcGkiLCJhcGlWZXJzaW9uIjoidjIiLCJpYXQiOjE3NDk4NjAwMjJ9.I1laMt2a0wIiMeQ0JFEDDWWqvwLQvnSjcS0mdvy-vM0';  // 여기서 유료 API 키를 입력하세요

    try {
        const res = await fetch(solscanUrl, {
            method: 'GET',
            headers: {
                'x-api-key': apiKey,  // 유료 API 키를 헤더에 추가
            }
        });
        const data = await res.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
            headers: {
                "Access-Control-Allow-Origin": "*",  // CORS 설정
                "Content-Type": "application/json"
            }
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch Solscan data" })
        };
    }
};
