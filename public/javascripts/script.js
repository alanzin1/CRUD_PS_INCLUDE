$(document).ready(function() {
    $('.edit-button').click(function() {
        var postId = $(this).data('post-id');
        $('#modal_' + postId).fadeIn();
    });

    $('.close-button').click(function() {
        $(this).closest('.newPostmodal').fadeOut();
    });
});


function previewImage(event) {
    var input = event.target;
    var preview = document.getElementById('image-preview');

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block'; 
        }

        reader.readAsDataURL(input.files[0]);
    }
}