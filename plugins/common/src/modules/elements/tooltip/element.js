/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * WordPress dependencies
 */
import { Tooltip as WpTooltip } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { Button } from '@moderntribe/common/elements';

const Tooltip = ( {
	label,
	labelClassName,
	position,
	text,
} ) => (
	<WpTooltip text={ text } position={ position }>
		<Button
			aria-label={ text }
			className={ classNames( 'tribe-editor__tooltip-label', labelClassName ) }
		>
			{ label }
		</Button>
	</WpTooltip>
);

Tooltip.defaultProps = {
	position: 'top right',
	text: '',
};

Tooltip.propTypes = {
	label: PropTypes.node,
	labelClassName: PropTypes.string,
	position: PropTypes.oneOf( [
		'top left',
		'top center',
		'top right',
		'bottom left',
		'bottom center',
		'bottom right',
	] ),
	text: PropTypes.string,
};

export default Tooltip;