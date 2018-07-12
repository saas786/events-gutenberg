/**
 * External Dependencies
 */
import { noop, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import './style.pcss';

import { Component } from '@wordpress/element';
import { searchParent } from './../../editor/utils/dom';

/**
 * Enumeration with the available directions.
 *
 * @type {{up: string, down: string}}
 */
export const directions = {
	up: 'up',
	down: 'down',
};

/**
 * Usage of this component:
 *
 * <Dashboard open className="custom" direction={directions.up}>
 *   <AnyComponent></AnyComponent>
 * </Dashboard
 */
export default class Dashboard extends Component {
	static defaultProps = {
		open: false,
		className: '',
		direction: directions.down,
		overflow: false,
		onKeyDown: noop,
		onClick: noop,
	};

	static propTypes = {
		open: PropTypes.bool,
		className: PropTypes.string,
		direction: PropTypes.oneOf( Object.keys( directions ) ),
		overflow: PropTypes.bool,
		onKeyDown: PropTypes.func,
		onClick: PropTypes.func,
	};

	/**
	 * Once the component is mounted make sure to set the state based on the property, after
	 * that make sure to setup the listeners accordingly.
	 */
	componentDidMount() {
		this.addListeners();
	}

	componentWillUnmount() {
		this.removeListeners();
	}

	/**
	 * Attach event listeners when this component is opened.
	 */
	addListeners() {
		document.addEventListener( 'keydown', this.props.onKeyDown );
		document.addEventListener( 'click', this.props.onClick );
	}

	/**
	 * Remove all listeners associated with this component.
	 */
	removeListeners() {
		document.removeEventListener( 'keydown', this.props.onKeyDown );
		document.removeEventListener( 'click', this.props.onClick );
	}

	/**
	 * Construct a string with the appropriate class for the main container of the component
	 *
	 * @returns {string} The generated class name for the container
	 */
	getContainerClass() {
		const { className, direction, overflow, open } = this.props;

		return classNames(
			'tribe-editor__dashboard__container',
			`tribe-editor__dashboard__container--${ direction }`,
			{ 'tribe-editor__dashboard__container--overflow': overflow },
			{ 'tribe-editor__dashboard__container--open': open },
			...className,
		);
	}

	render() {
		return (
			<div className={ this.getContainerClass() }>
				<div className="tribe-editor__dashboard">
					{ this.props.children }
				</div>
			</div>
		);
	}
}
