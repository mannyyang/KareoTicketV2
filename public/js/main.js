(function() {

   'use strict';

    // Expand for more detail event
    $('table tbody tr').on('click', function(){
       var desc = decodeHtml($(this).find('td.expand .more-info p').html());
       var milestones = $(this).find('td.expand .more-info ul').html();
       var currRow = $(this);

       if(currRow.hasClass('no-info')){

            currRow.removeClass('no-info');

            currRow.after('<tr><td colspan="6" class="info"></td></tr>');

            currRow.next().find('.info').append(
                '<div class="grid-6 info-container"><h4>Project Description</h4>' + desc + '</div>' +
                '<div class="grid-6 info-container well"><h4>Milestones</h4><ul>' + milestones + '</ul></div>');

       }
       else {
           currRow.addClass('no-info').next().html('');
       }

    });

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

    // click event for adding more files
    var fileNumber = 1;

    $('a.add-another-file').on('click', function(event){
       event.preventDefault();
       $('input[name="attachment_'+ fileNumber +'"]').removeClass('hide');
       fileNumber++;
    });

    // refresh page
    $('button.refresh').on('click', function(){
        window.location.reload();
    });

    // helper functions
    function decodeHtml(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    // After DOM ready calls.
    $(document).ready( function () {

        // initialize data tables.
        $('table').DataTable({

        });

        // add text boxes with editable styles
        var editor = new MediumEditor('.editable', {
            buttons:['bold', 'italic', 'underline', 'unorderedlist', 'orderedlist', 'indent', 'outdent']
        });

        // add before submit events
        $('#podio-project-form').on('submit', function(event){
            var pdVal = editor.serialize();
            $('.hidden-input-proj-desc').val(pdVal['element-0'].value);

            $('#podio-project-form button').html('').removeClass('primary')
                .addClass('disabled has-spinner').prepend('<div class="spinner"></div> Saving...');

            $('#project_podio_comm_frame').load(function(){
                $.ajax({
                    url: '/update',
                    data: '',
                    success: function(data){
                        $('#projects-form form#podio-project-form').hide();
                        $('#projects-form .thankyou').removeClass('hide');
                    },
                    error: function(error){
                        console.log(error);
                    }
                });
            });
        });

    });

}());
