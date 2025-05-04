export const db = async function (url, method, data=null) {
    const response = await fetch(url, {
        method: method,
        body: data == null? null: JSON.stringify(data)
    }).catch((error) => {
        console.error('Error:', error);
    });
    return response.json();
}

