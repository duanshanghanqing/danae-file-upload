export const fileUpload = function (obj: any) {
    if (typeof obj !== 'object') {
        return;
    }

    if (!obj.url) {
        console.warn("url cannot be empty");
        return;
    }

    if (!obj.files || obj.files.length === 0) {
        return;
    }
    // 转数组
    obj.files = Array.prototype.slice.call(obj.files);

    obj = Object.assign({
        formName: 'file',
        method: 'POST',
        timeout: 1000,
        async: false,
    }, obj);

    let index: number = 0;
    let xhr: XMLHttpRequest;
    function upload() {
        xhr = new XMLHttpRequest();
        // 1.准备FormData
        let fd = new FormData();
        fd.append(obj.formName, obj.files[index]);
        // 添加数据
        let data: any = {};
        if (typeof obj.data === "object") {
            data = obj.data;
        } else if (typeof obj.data === "function") {
            data = obj.data();
        }
        Object.keys(data).forEach(function (name) {
            fd.append(name, data[name]);
        });


        // 监听状态，实时响应
        // xhr 和 xhr.upload 都有progress事件，xhr.progress是下载进度，xhr.upload.progress是上传进度
        //这里监听上传进度事件，文件在上次的过程中，会多次触发该事件，返回一个event事件对象
        xhr.upload.onprogress = function (event) {
            obj.uploadedBeing && obj.uploadedBeing(event);
        };

        // 传输开始事件
        xhr.onloadstart = function (event) {
            obj.uploaduStart && obj.uploaduStart(event);
        };
        // xhr.abort();//调用该方法停止ajax上传，停止当前的网络请求

        // 当 readyState 的值改变的时候，callback 函数会被调用。
        xhr.onreadystatechange = function () {
            // 响应完成 && 成功处理请求
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                obj.uploadSuccess && obj.uploadSuccess(xhr.responseText, index);
                setTimeout(function () {
                    index++
                    if (index < obj.files.length) {
                        upload();
                    }
                    if (index === obj.files.length) {
                        // 上传完成触发
                        obj.finish && obj.finish(index);
                    }
                }, obj.timeout);
            }
        }

        xhr.onload = function (event) {
            // 上传成功失败都触发
            obj.serviceCallback && obj.serviceCallback(xhr.responseText, event);
        };

        // ajax过程发生错误事件
        xhr.onerror = function (event) {
            obj.uploadError && obj.uploadError(event);
        };

        // ajax被取消，文件上传被取消，说明调用了 xhr.abort();  方法，所触发的事件
        xhr.onabort = function (event) {
            obj.uploadCancelled && obj.uploadCancelled(event);
        };

        // loadend传输结束，不管成功失败都会被触发
        xhr.onloadend = function (event) {
            obj.uploadEnd && obj.uploadEnd(event);
        };

        // 发起ajax请求传送数据
        xhr.open(obj.method, obj.url, obj.async);

        // 设置头
        let headers: any = {};
        if (typeof obj.headers === 'function') {
            headers = obj.headers();
        } else if (typeof obj.headers === 'object') {
            headers = obj.headers;
        }
        Object.keys(headers).forEach(function (name) {
            xhr.setRequestHeader(name, headers[name]);
        });

        xhr.send(fd);//发送文件
    }
    upload();

    return {
        abort: function () {// ajax被取消，文件上传被取消
            xhr.abort(); // 调用该方法停止ajax上传，停止当前的网络请求
            obj.abort && obj.abort();
        }
    };
};
