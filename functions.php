<?php

//error_reporting(E_ERROR | E_PARSE);

//res paths//

define("TROOT", get_stylesheet_directory_uri());
define("ASS", TROOT . "/assets/");
define("IMG", TROOT . "/images/");
define("CSS", TROOT . "/css/");
define("JS", TROOT . "/js/");
define("PLUGINS", TROOT . "/plugins/");

//scripts and required styles//

function petman_scripts() {

    wp_enqueue_style('ionicons', PLUGINS . 'ionicons/css/ionicons.min.css');
    wp_enqueue_style('fa', PLUGINS . 'font-awesome/css/font-awesome.min.css');
    wp_enqueue_style('animate-css', CSS . 'animate.css');
    wp_enqueue_style('bootstrap', CSS . 'bootstrap.min.css');
    wp_enqueue_style('pm-style', CSS . 'pm-style.css');
    wp_enqueue_style('style', TROOT . '/style.css');

    wp_enqueue_script('jquery');
    wp_enqueue_script('bootstrap_js', JS . 'bootstrap.min.js', array('jquery'));
    wp_enqueue_script('bc', PLUGINS . 'browserclass.js');
}

add_action('wp_enqueue_scripts', 'petman_scripts');

//Register Required menus//

function petman_menu() {
    register_nav_menus(array('primary-nav' => "Primary Nav"));
}

add_action('init', 'petman_menu');

//supports
add_theme_support('post-thumbnails');
add_theme_support( 'title-tag' );
add_image_size('slider-image', 1000, 400, true);

function cut_limit($string, $words = 1) {
    $string = strip_tags($string);
    $string = strip_shortcodes($string);
    return implode(' ', array_slice(explode(' ', $string), 0, $words));
}

//optimizing image while upload
//https://wordpress.stackexchange.com/questions/224536/how-to-reduce-original-image-quality-on-upload



if ( !class_exists( 'ReduxFramework' ) && file_exists( dirname( __FILE__ ) . '/inc/ReduxFramework/ReduxCore/framework.php' ) ) {
    require_once( dirname( __FILE__ ) . '/inc/ReduxFramework/ReduxCore/framework.php' );
}

//if ( !isset( $redux_demo ) && file_exists( dirname( __FILE__ ) . '/inc/ReduxFramework/sample/sample-config.php' ) ) {
//    require_once( dirname( __FILE__ ) . '/inc/ReduxFramework/sample/sample-config.php' );
//}

if ( !isset( $redux_demo ) && file_exists( dirname( __FILE__ ) . '/inc/ReduxFramework/pm-config.php' ) ) {
    require_once( dirname( __FILE__ ) . '/inc/ReduxFramework/pm-config.php' );
}

require_once('inc/class-tgm-plugin-activation.php');
require_once('inc/wp_bootstrap_navwalker.php');
require_once('inc/install-plugins.php');
require_once('inc/pages.php');
require_once('inc/my-pet.php');


/* Add .png to allowed WP MIME types */
function custom_upload_mimes( $existing_mimes=array() ) {
    // add png to the list of mime types
    $existing_mimes['png'] = 'image/png';

    // return the array back to the function with our added mime type
    return $existing_mimes;
}
add_filter( 'upload_mimes', 'custom_upload_mimes' );


add_filter( 'wp_generate_attachment_metadata', function( $metadata, $attachment_id )
{
    Redux::init('redux_demo');
    global $redux_demo;
//    echo $redux_demo['opt-image-quality']; exit;
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
            $result = $editor->set_quality( $redux_demo['opt-image-quality']);

            // Re-save the original image file
            if( ! is_wp_error( $result ) )
                $editor->save( $file );
        }
    }
    return $metadata;
}, 10, 2 );

function compress($source, $destination, $quality) {

    $info = getimagesize($source);

    if ($info['mime'] == 'image/jpeg')
        $image = imagecreatefromjpeg($source);

    elseif ($info['mime'] == 'image/gif')
        $image = imagecreatefromgif($source);

    elseif ($info['mime'] == 'image/png')
        $image = imagecreatefrompng($source);

    imagejpeg($image, $destination, $quality);

    return $destination;
}