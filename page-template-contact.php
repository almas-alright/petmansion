<?php
/**
 * Template Name: Contact
 *
 * @package PetMansion
 * @subpackage PetMansion
 * @since PetMansion 1.0
 */
get_header();
global $redux_demo;
?>
    <section class="section main-container">
        <div class="container pt-40">
            <div class="row">
                <div class="col-sm-4">
                    <p><strong>Office:</strong></p>
                    <address>
                        <?php echo $redux_demo['address-text']; ?>
                    </address>
                    <p><a href=""><i class="fa fa-facebook"></i> Facebook</a></p>
                    <p><a href=""><i class="fa fa-twitter"></i> Twitter</a></p>
                    <p><a href=""><i class="fa fa-youtube"></i> Youtube</a></p>
                    <p>Tel: 04 4512 0668</p>
                    <p>Email: info@petmanion.com</p>
                </div>
                <div class="col-sm-8">
                    <div class="pages-heading">
                        <h1 class="heading">Contact</h1>
                    </div>
                    <?php
                     if($redux_demo['cf-opt-select'] != ''):
                         echo do_shortcode('[contact-form-7 id="'.$redux_demo['cf-opt-select'].'"]');
                    ?>
                     <?php else : ?>
                         <?php if(is_user_logged_in()) : ?>
                             <h2>Check PM Option and select a contact form </h2>
                                <p>to create your contact form you can use codes as below</p>
                                    <textarea readonly rows="12" cols="70">
                                         <div class="form-horizontal">
                                             <div class="form-group">
                                                 <div class="col-sm-12">
                                                     <label for="">Your name </label>
                                                     [text* your-name class:form-control]

                                                 </div>
                                             </div>
                                             <div class="form-group">
                                                 <div class="col-sm-12">
                                                     <label for="">Your e-mail address </label>
                                                     [email* your-email class:form-control]
                                                 </div>
                                             </div>
                                             <div class="form-group">
                                                 <div class="col-sm-12">
                                                     <label for="">Subject</label>
                                                     [text* your-subject class:form-control]
                                                 </div>
                                             </div>
                                             <div class="form-group">
                                                 <div class="col-sm-12">
                                                     <label for="">Message</label>
                                                     [textarea your-message class:form-control]
                                                 </div>
                                             </div>
                                             [submit class:classform-control "Send Message"]
                                         </div>
                                    </textarea>
                         <?php else : ?>
                             <h2>Sorry You cant contact us at this moment, please come back later</h2>
                     <?php endif; ?>
                     <?php endif; ?>
                </div>
            </div>
        </div>
    </section>
<?php
get_footer();

