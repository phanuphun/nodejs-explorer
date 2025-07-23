console.time('fetchRequests');

for (let i = 0; i < 200; i++) {
    try {
        fetchRequests(i);
    } catch (error) {
        console.error('Error:', error);
    }
    
}

async function fetchRequests(params) {
    const response = await fetch(`http://localhost:3000/api/v1/resource`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(`(${params+1}) ${data}`);
}

console.timeEnd('fetchRequests');