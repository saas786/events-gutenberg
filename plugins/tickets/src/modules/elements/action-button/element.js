/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import { Button } from '@moderntribe/common/src/modules/elements';
import './style.pcss';

export const positions = {
	right: 'right',
	left: 'left',
};

const ActionButton = ( {
	children,
	className,
	icon,
	onClick,
	position,
	...props
} ) => {
	const containerClass = classNames(
		'tribe-editor__action-button',
		`tribe-editor__action-button--icon-${ position }`,
		className,
	);

	return (
		<Button
			className={ containerClass }
			onClick={ onClick }
			{ ...props }
		>
			{ icon }
			<span className="tribe-editor__action-button__label">{ children }</span>
		</Button>
	);
}

ActionButton.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	icon: PropTypes.node.isRequired,
	onClick: PropTypes.func,
	position: PropTypes.oneOf( Object.keys( positions ) ),
};

ActionButton.defaultProps = {
	position: positions.left,
}

export default ActionButton;