window.onload = function() {
    const myregex = new RegExp('/Alarm/entry\.html$');
    var ref = document.referrer;
    var result = ref.match(myregex)
    if(!result) {
        location.href = 'entry.html'
    }
};

fetch('version.txt')
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
