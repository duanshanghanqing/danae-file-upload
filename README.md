# init

    npm install danae-file-upload

# use
### html
    <input type="file" id="file" />
    <button id="upload">upload</button>

### js
    import { fileUpload } from 'danae-file-upload';
    document.getElementById('upload').addEventListener('click', function() {
        fileUpload({
            url: '/xxx/xxx/xxx',
            formName: 'file',// default
            method: 'POST', // default
            files: document.getElementById('file').files,
            headers: () => ({ /*...*/ }),
            data: () => ({ /*...*/ }),
            uploadEnd: () => {

            },
            finish: () => {
            
            },
        });
    }, false);
  
