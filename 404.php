<?php
/**
 * The template for displaying 404 pages (Not Found)
 *
 * @package WordPress
 * @subpackage petmention
 * @since petmention 1.0
 */
get_header();
?>

<div class="section-404 dark" style="background-image: url('<?php print IMG; ?>background/404.jpg');">
    <div class="container">
        <div class="row">
            <div class="col-sm-4 col-sm-offset-4">
                <div class="content-404">
                    <h1 class="title">404</h1>
                    <h2 class="sub-title">Page Not Found</h2>
                        <p>Sorry, the page you are looking for cannot be found. Try checking the URL or return back home.</p>
                        <a class="btn btn-404"><i class="fa fa-angle-left"></i>Return Home</a>
                </div>
            </div>
        </div>
    </div>
</div>

<?php
get_footer();