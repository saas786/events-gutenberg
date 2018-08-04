/**
 * External dependencies
 */
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

/**
 * Internal dependencies
 */
import withSaveData from '@@plugins/events/editor/hoc/with-save-data';
import withStore from '@@plugins/events/editor/hoc/with-store';
import * as actions from '@@plugins/events/data/blocks/website/actions';
import * as selectors from '@@plugins/events/data/blocks/website/selectors';
import EventWebsite from './template';

const isEmpty = ( label ) => label.trim() === '';

const mapStateToProps = ( state ) => ( {
	url: selectors.getUrl( state ),
	urlLabel: selectors.getLabel( state ),
	isEmpty: isEmpty( state.blocks.website.label ),
} );

const mapDispatchToProps = ( dispatch ) => bindActionCreators( actions, dispatch );

export default compose(
	withStore(),
	connect(
		mapStateToProps,
		mapDispatchToProps,
	),
	withSaveData(),
)( EventWebsite );
