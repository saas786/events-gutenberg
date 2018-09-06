/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { TicketInactive } from '@moderntribe/tickets/icons';

import './style.pcss';

const DisabledTickets = ( { title, children, icon } ) => (
	<section className="tribe-editor__tickets__disabled">
		<aside className="tribe-editor__tickets__disabled__icon">
			{ icon }
		</aside>
		{ ( children || title ) &&
		(
			<aside className="tribe-editor__tickets__disabled__content">
				{ title && <h3 className="tribe-editor__tickets__disabled__title">{ title }</h3> }
				{ children && (
					<section className="tribe-editor__tickets__disabled__description">
						{ children }
					</section>
				) }
			</aside>
		) }
	</section>
);

DisabledTickets.defaultProps = {
	title: '',
	icon: <TicketInactive />,
	children: '',
}

DisabledTickets.propTypes = {
	title: PropTypes.string,
	icon: PropTypes.node,
	children: PropTypes.node,
}

export default DisabledTickets;
