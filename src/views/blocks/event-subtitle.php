<?php $event_id = $this->get( 'post_id' ); ?>
<div class="tribe-events-schedule tribe-clearfix">
	<?php echo tribe_events_event_schedule_details( $event_id, '<h2>', '</h2>' ); ?>
	<?php if ( tribe_get_cost() ) : ?>
		<span class="tribe-events-cost"><?php echo tribe_get_cost( null, true ) ?></span>
	<?php endif; ?>
</div>
