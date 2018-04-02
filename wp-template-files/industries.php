<?php get_header(); ?>
<section class="page panel white">
  <div class="container">
    <section class="hero landing double">
      <div class="container">
        <h2>Managed Services <span>Industries</span></h2>
      </div>
    </section>
    <section class="industries panel white center">
      <div class="container">
        <div class="col3">
          <div class="industry managed-services">
            <a href="">
              <i class="fa fa-tag"></i>
              <h2>Retail</h2>
            </a>
          </div>
          <div class="industry managed-services">
            <a href="">
              <i class="fa fa-credit-card"></i>
              <h2>Financial</h2>
            </a>
          </div>
          <div class="industry managed-services">
            <a href="">
              <i class="fa fa-stethoscope"></i>
              <h2>Health Care</h2>
            </a>
          </div>
          <div class="industry managed-services">
            <a href="">
              <i class="fa fa-university"></i>
              <h2>Government</h2>
            </a>
          </div>
          <div class="industry managed-services">
            <a href="">
              <i class="fa fa-heart-o"></i>
              <h2>Non Profit</h2>
            </a>
          </div>
          <div class="industry managed-services">
            <a href="">
              <i class="fa fa-plug"></i>
              <h2>Utilites</h2>
            </a>
          </div>
          <div class="industry managed-services">
            <a href="">
              <i class="fa fa-ticket"></i>
              <h2>Entertainment</h2>
            </a>
          </div>
          <div class="industry managed-services">
            <a href="">
              <i class="fa fa-cube"></i>
              <h2>SAAS</h2>
            </a>
          </div>
          <div class="industry managed-services">
            <a href="">
              <i class="fa fa-balance-scale"></i>
              <h2>Legal</h2>
            </a>
          </div>
          <div class="industry managed-services">
            <a href="">
              <i class="fa fa-cogs"></i>
              <h2>Manufacturing</h2>
            </a>
          </div>
          <div class="industry managed-services">
            <a href="">
              <i class="fa fa-building"></i>
              <h2>Construction</h2>
            </a>
          </div>
        </div>
      </div>
    </section>
    <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
      <h2><?php the_title(); ?></h2>
      <?php the_content(); ?>
    <?php endwhile; else : ?>
    	<p><?php _e( 'Sorry, no posts matched your criteria.' ); ?></p>
    <?php endif; ?>
  </div>
</section>
<?php get_footer(); ?>
