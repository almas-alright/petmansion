<div class="row blogs-bar">
    <div class="col-sm-12">
        <h4 class="text-center">From the blog</h4>
    </div>
    <?php
    $blog = new WP_Query(array('post_type' => 'post', 'posts_per_page' => 3, 'order' => 'desc'));

    if ($blog->have_posts()) :
    while ($blog->have_posts()) :
    $blog->the_post();
    ?>
    <div class="col-sm-4">
        <div class="blog-item">
            <a href="" class="blog-thumb">
                <?php if(has_post_thumbnail()): ?>
                    <div class="thumb-img" style="background-image: url('<?php echo get_the_post_thumbnail_url(get_the_ID(), 'medium') ?>');"></div>
                <?php else: ?>
                    <div class="thumb-img" style="background-image: url('<?php print IMG; ?>blog/1.jpg');"></div>
                <?php endif; ?>
                <div class="blog-meta">
                    <span>Pet Mansion</span>
                    <span><i class="ion-ios-calendar-outline"></i> <?php echo get_the_date('d/m/Y'); ?></span>
                </div>
            </a>
            <div class="blog-content">
                <h4><?php echo get_the_title(); ?></h4>
                <p><?php echo cut_limit(get_the_content(), 40); ?></p>
                <a href="<?php echo get_the_permalink(); ?>" class="go-more">Read more</a>
            </div>
        </div>
    </div>

    <?php
    endwhile;
    endif;
    ?>

</div>