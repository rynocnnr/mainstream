<?php get_header(); ?>
<section class="hero landing">
  <div class="container">
    <h2>Latest <strong>News</strong></h2>
  </div>
</section>
<section class="study panel light-gray">
  <div class="container">
    <div class="story">
      <div class="content">
        <h2>d'Escoto, Inc</h2>
        <p class="date">January 30, 2017</p>
        <?php the_content(); ?>
        <div class="author">
          <img src="http://placehold.it/100x100">
          <p>Jackie d'Escoto<br />
            <a href="">d'Escoto, Inc.</a><br />
            <span class="title">Founder</span></p>
        </div>
      </div>
    </div>
    <div class="sidebar">
      <div class="content">
        <h2>Related Reading</h2>
        <ul>
          <li><a href="">Title of Related Article #1</a></li>
          <li><a href="">Title of Related Article #2</a></li>
          <li><a href="">Title of Related Article #3</a></li>
        </ul>
        <a href="" class="button solid">Knowledge Base</a>
        <a href="" class="button solid">Case Studies</a>
        <a href="" class="button solid">Videos</a>
      </div>
    </div>
  </div>
</section>
<?php get_footer(); ?>
