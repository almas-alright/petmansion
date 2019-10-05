<?php
//optimizing image while upload
//https://wordpress.stackexchange.com/questions/224536/how-to-reduce-original-image-quality-on-upload
add_filter( 'wp_generate_attachment_metadata', function( $metadata, $attachment_id )
{

    $file = get_attached_file( $attachment_id );
    $type = get_post_mime_type( $attachment_id );

    // Target jpeg images
    if( in_array( $type, [ 'image/jpg', 'image/jpeg', 'image/png' ] ) )
    {
        // Check for a valid image editor
        $editor = wp_get_image_editor( $file );
        if( ! is_wp_error( $editor ) )
        {
            // Set the new image quality
            $result = $editor->set_quality( 20 );

            // Re-save the original image file
            if( ! is_wp_error( $result ) )
                $editor->save( $file );
        }
    }
    return $metadata;
}, 10, 2 );

global $redux;
var_dump($redux);
exit;