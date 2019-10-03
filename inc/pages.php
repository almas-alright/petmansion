<?php

add_action('after_setup_theme', 'mytheme_setup');
function mytheme_setup(){
    $haspage = get_page_by_path('contact');
    if($haspage == null){
        if(get_option('page_on_front')=='0' && get_option('show_on_front')=='posts'){
            // Create contactpage
            $contactpage = array(
                'post_type'    => 'page',
                'post_title'    => 'Contact',
                'post_content'  => '',
                'post_status'   => 'publish',
                'post_author'   => 1
            );
            // Insert the post into the database
            $contactpage_id =  wp_insert_post( $contactpage );
            //set the page template
            update_post_meta($contactpage_id, '_wp_page_template', 'page-template-contact.php');
        }
    }

}



