<?php
add_action('init', 'petman_slider');

function petman_slider() {
    $labels = array(
        'name' => _x('My Pet', 'post type general name', 'petman'),
        'singular_name' => _x('My Pet', 'post type singular name', 'petman'),
        'menu_name' => _x('My Pet', 'admin menu', 'petman'),
        'name_admin_bar' => _x('My Pet', 'add new on admin bar', 'petman'),
        'add_new' => _x('Add New', 'My Pet', 'petman'),
        'add_new_item' => __('Add New Pet', 'petman'),
        'new_item' => __('New Pet', 'petman'),
        'edit_item' => __('Edit Pet', 'petman'),
        'view_item' => __('View My Pet', 'petman'),
        'all_items' => __('All My Pet', 'petman'),
        'search_items' => __('Search My Pet', 'petman'),
        'parent_item_colon' => __('Parent My Pet:', 'petman'),
        'not_found' => __('No Pet found.', 'petman'),
        'not_found_in_trash' => __('No Pet found in Trash.', 'petman')
    );

    $args = array(
        'labels' => $labels,
        'public' => true,
        'publicly_queryable' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'query_var' => true,
        'rewrite' => array('slug' => 'my-pet'),
        'capability_type' => 'post',
        'has_archive' => true,
        'hierarchical' => false,
        'menu_position' => null,
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'revisions'),
        'menu_icon' => 'dashicons-welcome-widgets-menus'
    );

    register_post_type('my-pet', $args);

    $t_labels = array(
        'name' => _x('My Pet Types', 'taxonomy general name'),
        'singular_name' => _x('My Pet Type', 'taxonomy singular name'),
        'search_items' => __('Search Pet Types'),
        'popular_items' => __('Popular Pet Types'),
        'all_items' => __('All Pet Types'),
        'parent_item' => null,
        'parent_item_colon' => null,
        'edit_item' => __('Edit Pet Type'),
        'update_item' => __('Update Pet Type'),
        'add_new_item' => __('Add New Pet Type'),
        'new_item_name' => __('New Pet Type Name'),
        'separate_items_with_commas' => __('Separate writers with commas'),
        'add_or_remove_items' => __('Add or remove writers'),
        'choose_from_most_used' => __('Choose from the most used writers'),
        'not_found' => __('No writers found.'),
        'menu_name' => __('My Pet Category'),
    );

    $t_args = array(
        'hierarchical' => true,
        'labels' => $t_labels,
        'show_ui' => true,
        'show_admin_column' => true,
        'update_count_callback' => '_update_post_term_count',
        'query_var' => true,
        'rewrite' => array('slug' => 'my-pet-type'),
    );

    register_taxonomy('my-pet-type', 'my-pet', $t_args);

    // Add new taxonomy, NOT hierarchical (like tags)
    $st_labels = array(
        'name' => _x('My Pet Tags', 'taxonomy general name'),
        'singular_name' => _x('My Pet Tag', 'taxonomy singular name'),
        'search_items' => __('Search My Pet Tags'),
        'popular_items' => __('Popular My Pet Tags'),
        'all_items' => __('All My Pet Tags'),
        'parent_item' => null,
        'parent_item_colon' => null,
        'edit_item' => __('Edit My Pet Tag'),
        'update_item' => __('Update My Pet Tag'),
        'add_new_item' => __('Add New My Pet Tag'),
        'new_item_name' => __('New My Pet Tag Name'),
        'separate_items_with_commas' => __('Separate writers with commas'),
        'add_or_remove_items' => __('Add or remove writers'),
        'choose_from_most_used' => __('Choose from the most used writers'),
        'not_found' => __('No writers found.'),
        'menu_name' => __('My Pet Tag'),
    );

    $st_args = array(
        'hierarchical' => false,
        'labels' => $st_labels,
        'show_ui' => true,
        'show_admin_column' => true,
        'update_count_callback' => '_update_post_term_count',
        'query_var' => true,
        'rewrite' => array('slug' => 'my-pet-tag'),
    );

    register_taxonomy('my-pet-tag', 'my-pet', $st_args);
}


