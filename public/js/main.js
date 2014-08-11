(function () {

   'use strict';

    $(document).ready( function () {

        $('table').DataTable();

        // custom lightbox script
        $('a[data-lightbox]').on('click', function(e){
            e.preventDefault();
            var lightboxLink =  $(this).attr('data-lightbox');
            $('#'+ lightboxLink +'.lightbox').addClass('open animate-fadein');
            $('#'+ lightboxLink +'.lightbox .modal').addClass('animate-fallup');

        });
        $('.modal').on('click', 'a.close', function(){
            var lightbox = $(this).closest('.lightbox');
            lightbox.addClass('animate-fadeout');
            setTimeout(function(){
                lightbox.removeClass('open animate-fadein animate-fadeout');
            }, 300);
        });

        // add text boxes with editable styles
        var editor = new MediumEditor('.editable');

        $(function () {
            $('#fileupload').fileupload({
                dataType: 'json',
                done: function (e, data) {
                    $.each(data.result.files, function (index, file) {
                        $('<p/>').text(file.name).appendTo(document.body);
                    });
                },
                progressall: function (e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    $('#progress .bar').css(
                        'width',
                        progress + '%'
                    );
                }
            });
        });

        //--- handle form submission on new project creation
        var pdVal = editor.serialize();
        $('.hidden-input-proj-desc').val(pdVal['element-0'].value);

        $('#podio-project-form').on('submit', function(event){
            event.preventDefault();

            var pdVal = editor.serialize();
            $('.hidden-input-proj-desc').val(pdVal['element-0'].value);

            $.ajax({
                url: '/api/addfile',
                type: 'POST',
                data: new FormData(this),
                success: function(data){
                    console.log('success');
                    console.log(data);
                },
                error: function(err){
                    console.log('nope');
                    console.log(err);
                },
                processData: false,
                contentType: false
            });
        });


    });

}());
