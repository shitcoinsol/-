
const moralisApiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjkyMzBkNGU3LWUyNjEtNGNiYi1hYzgzLTY4MDZmNDg5YzRhOSIsIm9yZ0lkIjoiNDUzNzM2IiwidXNlcklkIjoiNDY2ODMzIiwidHlwZUlkIjoiODVkOTcxZDMtODgzOS00NmYxLWJiMGEtM2IyY2Y5ZmE4NTU2IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDk4MDU3MTcsImV4cCI6NDkwNTU2NTcxN30.nbLVfn0ocROspwVeWXIOtw-d6Gm42Bnshujhlp3JrMI';  // Replace with your Moralis API Key
const heliusApiKey = '8da5b443-0a93-4d21-ab6f-7ea24776b68f';    // Replace with your Helius API Key
const apiUrl = 'https://lydqq31qfl.execute-api.eu-west-2.amazonaws.com/dev/solscan';

async function fetchSolscanTokenMeta(tokenAddress) {
    const response = await fetch(`${apiUrl}?address=${tokenAddress}`, {
        method: 'GET',
        headers: {
            'x-api-key': 'R7pX7nuePC8bf8yCrkagg5laKLmUMqvs3VzFQIs2',  // API Key included in the request
        }
    });
    const data = await response.json();
    return data;
}

async function fetchMoralisData(tokenAddress) {
    const response = await fetch(`https://api.moralis.io/v1/solana/${tokenAddress}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${moralisApiKey}`,
        }
    });
    const data = await response.json();
    return data;
}

async function fetchHeliusData(tokenAddress) {
    const response = await fetch(`https://api.helius.xyz/solana/${tokenAddress}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${heliusApiKey}`,
        }
    });
    const data = await response.json();
    return data;
}

async function fetchDexScreenerData(tokenAddress) {
    const response = await fetch(`https://api.dexscreener.com/solana/${tokenAddress}`);
    const data = await response.json();
    return data;
}

async function scanToken() {
    const tokenAddress = document.getElementById('tokenAddress').value.trim();
    if (!tokenAddress) {
        alert("Please enter a token address.");
        return;
    }

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "Loading...";

    try {
        const solscanData = await fetchSolscanTokenMeta(tokenAddress);
        resultsDiv.innerHTML = `
            <div class="card">
                <div class="card-header">Token Info</div>
                <div class="card-body">
                    <p><strong>Mint Address:</strong> ${solscanData.mintAddress}</p>
                    <p><strong>Token Name:</strong> ${solscanData.tokenName}</p>
                </div>
            </div>
        `;

        const moralisData = await fetchMoralisData(tokenAddress);
        displayBuySellVolume(moralisData.buySellVolume);
        displayNewHolders(moralisData.newHolders);

        const heliusData = await fetchHeliusData(tokenAddress);
        displayFreshWallets(heliusData.freshWallets);

        const dexScreenerData = await fetchDexScreenerData(tokenAddress);
        displayDexScreenerPrice(dexScreenerData.price);
    } catch (error) {
        console.error("Error fetching data:", error);
        resultsDiv.innerHTML = "Failed to load data.";
    }
}

function displayBuySellVolume(data) {
    const volumeDiv = document.getElementById("buy-sell-volume");
    const table = document.getElementById("buy-sell-table").getElementsByTagName('tbody')[0];
    volumeDiv.style.display = 'block';

    data.forEach(item => {
        let row = table.insertRow();
        row.insertCell(0).textContent = item.time;
        row.insertCell(1).textContent = item.buyVolume;
        row.insertCell(2).textContent = item.sellVolume;
        row.insertCell(3).textContent = item.ratio;
    });
}

function displayNewHolders(data) {
    const holdersDiv = document.getElementById("new-holders");
    const holdersList = document.getElementById("holders-list");
    holdersDiv.style.display = 'block';
    holdersList.innerHTML = ''; 

    data.forEach(item => {
        let holder = document.createElement("p");
        holder.textContent = `New Holder: ${item}`;
        holdersList.appendChild(holder);
    });
}

function displayFreshWallets(data) {
    const walletsDiv = document.getElementById("fresh-wallets");
    const walletsList = document.getElementById("wallets-list");
    walletsDiv.style.display = 'block';
    walletsList.innerHTML = ''; 

    data.forEach(item => {
        let wallet = document.createElement("p");
        wallet.textContent = `Fresh Wallet: ${item}`;
        walletsList.appendChild(wallet);
    });
}

function displayDexScreenerPrice(data) {
    const priceDiv = document.getElementById("price");
    const priceInfo = document.getElementById("price-info");
    priceDiv.style.display = 'block';
    priceInfo.innerHTML = ''; 

    priceInfo.innerHTML = `
        <p><strong>Current Price:</strong> ${data.price}</p>
        <p><strong>Volume:</strong> ${data.volume}</p>
    `;
}
