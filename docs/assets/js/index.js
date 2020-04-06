var mirror = CodeMirror(document.querySelector('.code'), {
    lineNumbers: true,
    mode: 'javascript',
    readOnly: true,
    matchBrackets: true,
    styleActiveLine: true,
    theme: 'dracula',
    value: '',
});

var url = '/assets/js/sample.js';
if (window.location.href.includes('github.io')) {
    url = '/term-web/assets/js/sample.js';
}

fetch(url)
    .then(function (response) {
        return response.text();
    })
    .then(function (text) {
        mirror.setValue(text);
        eval(text);
    });
