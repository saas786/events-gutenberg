/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AutosizeInput from 'react-input-autosize';

/**
 * WordPress dependencies
 */
import { Dashicon } from '@wordpress/components';
import { UrlInput } from '@wordpress/editor';
import { sendValue } from '@@plugins/events/editor/utils/input';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.pcss';

const placeholder = __( 'Add Button Text', 'events-gutenberg' );

const renderUrlInput = ({ isSelected, url, setWebsite }) => (
	isSelected && (
		<div key="tribe-events-website-url" className="tribe-editor__event-website__url">
			<Dashicon icon="admin-links" />
			<UrlInput
				autoFocus={ false }
				value={ url }
				onChange={ setWebsite }
			/>
		</div>
	)
);

const renderLabelInput = ({ isSelected, isEmpty, urlLabel, setLabel }) => {
	const containerClassNames = classNames( {
		'tribe-editor__event-website__label': true,
		'tribe-editor__event-website__label--selected': isSelected,
	} );

	const inputClassNames = classNames( {
		'tribe-editor__event-website__label-text': true,
		'tribe-editor__event-website__label-text--empty': isEmpty && isSelected,
	} );

	return (
		<div
			key="tribe-events-website-label"
			className={ containerClassNames }
		>
			<AutosizeInput
				id="tribe-events-website-link"
				className={ inputClassNames }
				value={ urlLabel }
				placeholder={ placeholder }
				onChange={ sendValue( setLabel ) }
			/>
		</div>
	);
}

const renderPlaceholder = () => {
	const classes = [
		'tribe-editor__event-website__label',
		'tribe-editor__event-website__label--placeholder',
	];

	return (
		<button className={ classNames( classes ) }>
			{ placeholder }
		</button>
	);
}

const EventWebsite = ( props ) => {

	const { isSelected, urlLabel } = props;
	const eventWebsite = ( ! isSelected && ! urlLabel ) ?
		renderPlaceholder() :
		[
			renderLabelInput( props ),
			renderUrlInput( props ),
		];

	return (
		<div className="tribe-editor__block tribe-editor__event-website">
			{ eventWebsite }
		</div>
	);

}

EventWebsite.propTypes = {
	isSelected: PropTypes.bool,
	isEmpty: PropTypes.bool,
	url: PropTypes.string,
	urlLabel: PropTypes.string,
	setWebsite: PropTypes.func,
	setLabel: PropTypes.func,
}

export default EventWebsite;
