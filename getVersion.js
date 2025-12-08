const filePath = 'version.txt';
fetch(filePath)
    .then(response => {
        if (!response.ok) {
            throw new Error('HTTP error! status: ' + response.status);
        }
        return response.text();
    })
    .then(textString => {
        document.getElementById('version').textContent = textString;
    })
    .catch(error => {
        console.error('Fetch error:', error);
        document.getElementById('content').textContent = '';
    });
