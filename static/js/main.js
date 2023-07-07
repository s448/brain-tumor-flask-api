$(document).ready(function () {
    // Init
    $('.image-section').hide();
    $('.loader').hide();
    $('#result').hide();
    $('.res').hide();
    $('#form').hide();
    // $('.close').hide();
    // Upload Preview

    let startbtn = document.querySelector(".landing button");
    startbtn.addEventListener("click",function () {
        $('.landing').hide();
        $('#form').show();
    })

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
                $('#imagePreview').hide();
                $('#imagePreview').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    let label = document.querySelector(".upload-label");
    $("#imageUpload").change(function () {
        $('.image-section').show();
        $('#btn-predict').show();
        $('#result').text('');
        $('#result').hide();
        readURL(this);
        // $('.upload-label').hide();
        $('.upload-label').text('Upload Another MRI Image');
        let label = document.querySelector(".upload-label");
        label.setAttribute("style","-webkit-transform: translate(0%, 0%);");

    });

    // Predict
    $('#btn-predict').click(function () {
        var form_data = new FormData($('#upload-file')[0]);

        // Show loading animation
        $(this).hide();
        $('.loader').show();
        $('.upload-label').hide();
        // Make prediction by calling api /predict
        $.ajax({
            type: 'POST',
            url: '/predict',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            async: true,
            success: function (data) {
                var res = JSON.parse(JSON.stringify(data));
                console.log(res.result);
                var message = res.result == 0 ? $('.result-no').show() : $('.result-yes').show();
                $('.loader').hide();
                $('#result').fadeIn(600);
                console.log(message);
                // $('#result').text(message);
                console.log('Success!');
            },
        });
    });

    $('.open').click( function () {
        $('.open').hide();
        $('.close').show();
        $('.names').show();
        label.setAttribute("style","-webkit-transform: translate(0%, 100%);");
    })

    $('.close').click( function () {
        $('.close').hide();
        $('.open').show();
        $('.names').hide();
        label.setAttribute("style","-webkit-transform: translate(0%, 300%);");
    })
});
