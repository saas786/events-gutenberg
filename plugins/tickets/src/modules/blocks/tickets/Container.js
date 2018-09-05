/**
 * External dependencies
 */
import { connect } from 'react-redux';
import { compose } from 'redux';
import React from 'react';

/**
 * Internal dependencies
 */
import Template from './Template';

import { withSaveData, withStore } from '@moderntribe/common/src/modules/hoc';
import { ActionButton } from '@moderntribe/tickets/elements';
import {
	Cog as CogIcon,
	Tag as TagIcon,
	User as UserIcon,
} from '@moderntribe/common/src/modules/icons';

const mapStateToProps = ( state, props ) => ( {
	selected: props.isSelected,
	available: 48,
	total: 166,
	footerActions: [
		<ActionButton><CogIcon /> Settings</ActionButton>,
		<ActionButton><UserIcon /> Attendees </ActionButton>,
		<ActionButton><TagIcon /> Orders</ActionButton>,
	],
} );

export default compose(
	withStore(),
	connect(
		mapStateToProps,
	),
	withSaveData(),
)( Template );
