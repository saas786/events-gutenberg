/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 *
 * Internal dependencies
 */
import Organizer from './block';
import { Icons } from 'elements';
import { withStore } from 'editor/hoc';
import { ORGANIZER } from 'editor/post-types';

export default {
	id: 'event-organizer',
	title: __( 'Event Organizer', 'events-gutenberg' ),
	description: __( 'List a host or coordinator for this event.', 'events-gutenberg' ),
	icon: Icons.TEC,
	category: 'common',
	keywords: [ 'event', 'events-gutenberg', 'tribe' ],

	supports: {
		html: false,
	},

	attributes: {
		organizer: {
			type: 'html',
			default: '',
		},
		organizers: {
			type: 'array',
			source: 'meta',
			meta: '_EventOrganizerID',
		},
	},

	edit: withStore( { isolated: true, postType: ORGANIZER } )( Organizer ),

	save() {
		return null;
	},
};
