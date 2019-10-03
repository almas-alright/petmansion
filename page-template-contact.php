<?php
/**
 * Template Name: Contact
 *
 * @package PetMansion
 * @subpackage PetMansion
 * @since PetMansion 1.0
 */
get_header();
?>
    <section class="section main-container">
        <div class="container pt-40">
            <div class="row">
                <div class="col-sm-4">
                    <p><strong>Office:</strong></p>
                    <address>
                        Petmansion <br>120B Underwood Street<br>Paddington NSW 2021<br>Singapore
                    </address>
                    <p><a href=""><i class="fa fa-facebook"></i> Facebook</a></p>
                    <p><a href=""><i class="fa fa-twitter"></i> Twitter</a></p>
                    <p>Tel: 04 4512 0668</p>
                    <p>Email: info@petmanion.com</p>
                </div>
                <div class="col-sm-8">
                    <div class="pages-heading">
                        <h1 class="heading">Contact</h1>
                    </div>
                    <form action="" class="form-horizontal">
                        <div class="form-group">
                            <div class="col-sm-12">
                                <label for="">Your name </label>
                                <input type="text" class="form-control" placeholder="">
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-12">
                                <label for="">Your e-mail address  </label>
                                <input type="email" class="form-control">
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-12"><label for="">Subject</label>
                                <input type="text" class="form-control">
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-12"><label for="">Message</label>
                                <textarea name="" id="" rows="4" class="form-control"></textarea>
                            </div>
                        </div>
                        <button class="btn btn-primary">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    </section>
<?php
get_footer();
