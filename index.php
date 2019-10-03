<?php
get_header();


global $redux_demo;

?>

    <section class="section section-teaser" style="background-image: url('<?php echo $redux_demo['media-full-image']['url']; ?>')" >
        <div class="container">
            <div class="row">
                <div class="col-md-8 col-md-offset-2">
                    <h1 class="lighter teaser-heading text-center">Find a trusted pet sitter in your community. </h1>
                    <div class="teaser-form">
                        <h3 class="text-center"><?php echo $redux_demo['bg-overlay-text']; ?></h3>
                        <form>
                            <div class="row">
                                <div class="col-sm-4">
                                    <input type="text" class="form-control" placeholder="Postal code or Streetname">
                                </div>
                                <div class="col-sm-2">
                                    <input type="text" class="form-control" placeholder="Form">
                                </div>
                                <div class="col-sm-2">
                                    <input type="text" class="form-control" placeholder="To">
                                </div>
                                <div class="col-sm-4">
                                    <button type="submit" class="btn btn-primary unstroke btn-block">Find a Sitter</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>

<?php echo $redux_demo['bg-overlay-text'];

get_template_part('template-part/home');

$cfposts = get_posts(array(
    'post_type'     => 'wpcf7_contact_form',
    'numberposts'   => -1
));

echo '<pre>';
var_dump($cfposts);
echo '</pre>';
//echo do_shortcode('[register_form]');

//pippin_registration_form_fields();

get_footer();