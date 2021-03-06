/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import EventPrice from './container';
import { Icons } from '@moderntribe/events/elements';

/**
 * Module Code
 */
export default {
	id: 'event-price',
	title: __( 'Event Price', 'events-gutenberg' ),
	description: __(
		'Let visitors know the cost of this event or if it’s free to attend.',
		'events-gutenberg'
	),
	icon: Icons.TEC,
	category: 'tribe-events',
	keywords: [ 'event', 'events-gutenberg', 'tribe' ],

	supports: {
		html: false,
	},

	attributes: {
		cost: {
			type: 'string',
			source: 'meta',
			meta: '_EventCost',
		},
		costDescription: {
			type: 'html',
			default: '',
		},
		currencySymbol: {
			type: 'string',
			source: 'meta',
			meta: '_EventCurrencySymbol',
		},
		currencyPosition: {
			type: 'string',
			source: 'meta',
			meta: '_EventCurrencyPosition',
		},
	},
	edit: EventPrice,
	save( props ) {
		return null;
	},
};
