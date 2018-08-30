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
import * as exception from '@moderntribe/events-pro/data/blocks/exception';
import EventRecurringBlock from './template';

/**
 * Module Code
 */

const mapStateToProps = state => ( {
	isExceptionPanelVisible: ui.selectors.isExceptionPanelVisible( state ),
	isExceptionPanelExpanded: ui.selectors.isExceptionPanelExpanded( state ),
	exceptions: exception.selectors.getExceptions( state ),
} );

const mapDispatchToProps = dispatch => ( {
	toggleExceptionPanelVisibility: () => dispatch( ui.actions.toggleExceptionPanelVisibility() ),
	toggleExceptionPanelExpand: () => dispatch( ui.actions.toggleExceptionPanelExpand() ),
	addField: ( payload ) => dispatch( exception.actions.addField( payload ) ),
	removeField: ( id ) => dispatch( exception.actions.removeField( id ) ),
} );

const mergeProps = ( stateProps, dispatchProps, ownProps ) => ( {
	...stateProps,
	...dispatchProps,
	...ownProps,
	initialExceptionPanelClick: compose(
		dispatchProps.toggleExceptionPanelVisibility,
		dispatchProps.toggleExceptionPanelExpand,
		() => dispatchProps.addField( { id: 1 } )
	),
	addField: () => dispatchProps.addField( { id: 2 } ),
} );

export default compose(
	withStore(),
	connect( mapStateToProps, mapDispatchToProps, mergeProps )
)( EventRecurringBlock );
