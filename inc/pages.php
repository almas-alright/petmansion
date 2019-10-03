<?php

add_action('after_setup_theme', 'mytheme_setup');
function mytheme_setup(){

    if(get_option('page_on_front')=='0' && get_option('show_on_front')=='posts'){
        // Create homepage
        $homepage = array(
            'post_type'    => 'page',
            'post_title'    => 'Contact',
            'post_content'  => '',
            'post_status'   => 'publish',
            'post_author'   => 1
        );
        // Insert the post into the database
        $homepage_id =  wp_insert_post( $homepage );
        //set the page template
        //assuming you have defined template on your-template-filename.php
        update_post_meta($homepage_id, '_wp_page_template', 'your-template-filename.php');
    }

}