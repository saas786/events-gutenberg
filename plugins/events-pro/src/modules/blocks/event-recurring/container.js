/**
 * External dependencies
 */
import { connect } from 'react-redux';
import { compose } from 'redux';

/**
 * Internal dependencies
 */
import { withStore } from '@moderntribe/common/hoc';
import * as ui from '@moderntribe/events-pro/data/ui';
import * as recurring from '@moderntribe/events-pro/data/blocks/recurring';
import EventRecurringBlock from './template';

/**
 * Module Code
 */

const mapStateToProps = state => ( {
	isRulePanelVisible: ui.selectors.isRulePanelVisible( state ),
	isRulePanelExpanded: ui.selectors.isRulePanelExpanded( state ),
	rules: recurring.selectors.getRecurring( state ),
} );

const mapDispatchToProps = dispatch => ( {
	toggleRulePanelVisibility: () => dispatch( ui.actions.toggleRulePanelVisibility() ),
	toggleRulePanelExpand: () => dispatch( ui.actions.toggleRulePanelExpand() ),
	addField: ( payload ) => dispatch( recurring.actions.addField( payload ) ),
	removeField: ( id ) => dispatch( recurring.actions.removeField( id ) ),
} );

const mergeProps = ( stateProps, dispatchProps, ownProps ) => ( {
	...stateProps,
	...dispatchProps,
	...ownProps,
	initialRulePanelClick: compose(
		dispatchProps.toggleRulePanelVisibility,
		dispatchProps.toggleRulePanelExpand,
		() => dispatchProps.addField( { id: 1 } )
	),
	addField: () => dispatchProps.addField( { id: 2 } ),
} );

export default compose(
	withStore(),
	connect( mapStateToProps, mapDispatchToProps, mergeProps )
)( EventRecurringBlock );
