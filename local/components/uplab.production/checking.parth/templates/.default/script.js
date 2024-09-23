window.addEventListener('DOMContentLoaded', () => {

    var video = document.createElement("video");
    var canvasElement = document.getElementById("canvas");
    var canvas = canvasElement.getContext("2d");
    var loadingMessage = document.getElementById("loadingMessage");
    var outputContainer = document.getElementById("output");
    var outputMessage = document.getElementById("outputMessage");
    var outputData = document.getElementById("outputData");
    var qrCodeStatus = false;

    function drawLine(begin, end, color) {
        canvas.beginPath();
        canvas.moveTo(begin.x, begin.y);
        canvas.lineTo(end.x, end.y);
        canvas.lineWidth = 4;
        canvas.strokeStyle = color;
        canvas.stroke();
    }

    function tick() {
        loadingMessage.innerText = "Включаем камеру...";
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            loadingMessage.hidden = true;
            canvasElement.hidden = false;

            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            var code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
            if (code) {
                drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
                drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
                drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
                drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");

                //console.log(code.data);

                let codeStr = code.data.slice(0, 32);

                // $('#detail_id').val(codeStr);
                // $('#js_check_code_form').submit();
                document.getElementById("detail_id").value = codeStr;
                document.getElementById("js_check_code_form").submit();

                qrCodeStatus = false;
                loadingMessage.innerText = '';
                $(canvasElement).hide();
            }
        }
        if (qrCodeStatus === true) {
            requestAnimationFrame(tick);
        }
    }

    function scanQRCode() {
        loadingMessage.innerText = "Включаем камеру...";
        // Use facingMode: environment to attempt to get the front camera on phones
        navigator.mediaDevices.getUserMedia({video: {facingMode: "environment"}}).then(function (stream) {
            video.srcObject = stream;
            video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
            video.play();
            requestAnimationFrame(tick);
        }).catch(function (error) {
            loadingMessage.innerText = 'Невозможно получить доступ к видео потоку. Пожалуйста, убедитесь, что у вас включена веб-камера и браузеру дано разрешение на ее использование.';
        });
    }

    function checkUserHasCamera(callback) {
        let md = navigator.mediaDevices;
        if (!md || !md.enumerateDevices) return callback(false);
        md.enumerateDevices().then(devices => {
            callback(devices.some(device => 'videoinput' === device.kind));
        })
    }

    $(document).on('click', '.js_qr_code', function (e) {
        e.preventDefault();

        if (qrCodeStatus === false) {
            qrCodeStatus = true;
            $(canvasElement).show();
            scanQRCode();
        } else {
            qrCodeStatus = false;
            loadingMessage.innerText = '';
            $(canvasElement).hide();
        }


    });


    checkUserHasCamera(function (hasWebcam) {
        if (hasWebcam) {
            $('.js_qr_code').show();
        }
        //console.log('Webcam: ' + (hasWebcam ? 'yes' : 'no'));
    });

});