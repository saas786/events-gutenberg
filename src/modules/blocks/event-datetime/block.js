/**
 * External dependencies
 */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';

import {
	InspectorControls,
	PlainText,
} from '@wordpress/editor';

/**
 * Internal dependencies
 */
import {
	TimePicker,
	Dashboard,
	Month,
} from 'elements';
import './style.pcss';

import {
	actions as dateTimeActions,
	selectors as dateTimeSelectors,
} from 'data/blocks/datetime';
import {
	actions as UIActions,
	selectors as UISelectors,
} from 'data/ui';
import {
	selectors as priceSelectors,
	actions as priceActions,
} from 'data/blocks/price';

import { getSetting } from 'editor/settings';
import classNames from 'classnames';
import {
	roundTime,
	toFormat,
	toMoment,
	totalSeconds,
	toDate,
	toDateNoYear
} from 'utils/moment';
import { FORMATS, timezonesAsSelectData, TODAY } from 'utils/date';
import { HALF_HOUR_IN_SECONDS } from 'utils/time';
import withSaveData from 'editor/hoc/with-save-data';
import { searchParent } from 'editor/utils/dom';
import { DAY_IN_SECONDS } from '../../editor/utils/time';

FORMATS.date = getSetting( 'dateWithYearFormat', __( 'F j', 'events-gutenberg' ) );

/**
 * Module Code
 */

class EventDateTime extends Component {
	static propTypes = {
		allDay: PropTypes.bool,
		multiDay: PropTypes.bool,
		dashboardOpen: PropTypes.bool,
		cost: PropTypes.string,
		start: PropTypes.string,
		end: PropTypes.string,
		separatorDate: PropTypes.string,
		separatorTime: PropTypes.string,
		timezone: PropTypes.string,
		currencySymbol: PropTypes.string,
		currencyPosition: PropTypes.string,
		setInitialState: PropTypes.func,
		setCost: PropTypes.func,
		setAllDay: PropTypes.func,
		openDashboardDateTime: PropTypes.func,
		setDate: PropTypes.func,
		setStartTime: PropTypes.func,
		setEndTime: PropTypes.func,
		toggleMultiDay: PropTypes.func,
		setTimeZone: PropTypes.func,
		setSeparatorTime: PropTypes.func,
		setSeparatorDate: PropTypes.func,
		closeDashboardDateTime: PropTypes.func,
		setVisibleMonth: PropTypes.func,
		visibleMonth: PropTypes.instanceOf( Date ),
	};

	componentDidMount() {
		document.addEventListener( 'keydown', this.onKeyDown );
		document.addEventListener( 'click', this.onClick );
	}

	componentWillUnmount() {
		document.removeEventListener( 'keydown', this.onKeyDown );
		document.removeEventListener( 'click', this.onClick );
	}

	renderStart() {
		return (
			<React.Fragment>
				{ this.renderStartDate() }
				{ this.renderStartTime() }
			</React.Fragment>
		);
	}

	renderPrice() {
		const { cost, currencyPosition, currencySymbol, setCost } = this.props;

		// Bail when not classic
		if ( ! tribe_blocks_editor ) {
			return null;
		}

		// Bail when not classic
		if ( ! tribe_blocks_editor.is_classic ) {
			return null;
		}

		return (
			<div className="tribe-editor__event-cost">
				{ 'prefix' === currencyPosition && <span>{ currencySymbol }</span> }
				<PlainText
					className={ classNames( 'tribe-editor__event-cost__value', `tribe-editor-cost-symbol-position-${ currencyPosition }` ) }
					value={ cost }
					placeholder={ __( 'Enter price', 'events-gutenberg' ) }
					onChange={ setCost }
				/>
				{ 'suffix' === currencyPosition && <span>{ currencySymbol }</span> }
			</div>
		);
	}

	renderStartDate() {
		const { start } = this.props;
		let startDate = toDate( toMoment( start ) );

		if ( this.isSameYear() && this.isSameYear( TODAY ) ) {
			startDate = toDateNoYear( toMoment( start ) );
		}

		return (
			<span className="tribe-editor__subtitle__headline-date">{ startDate }</span>
		);
	}

	renderStartTime() {
		const { start, allDay } = this.props;
		const { time } = FORMATS.WP;

		if ( allDay ) {
			return null;
		}

		const startMoment = toMoment( start );

		return (
			<React.Fragment>
				{ this.renderSeparator( 'date-time' ) }
				{ startMoment.format( toFormat( time ) ) }
			</React.Fragment>
		);
	}

	renderEnd() {
		return (
			<React.Fragment>
				{ this.renderEndDate() }
				{ this.renderEndTime() }
			</React.Fragment>
		);
	}

	renderEndDate() {
		const { multiDay } = this.props;

		if ( ! multiDay ) {
			return null;
		}

		const { end } = this.props;
		let endDate = toDate( toMoment( end ) );

		if ( this.isSameYear() && this.isSameYear( TODAY ) ) {
			endDate = toDateNoYear( toMoment( end ) );
		}

		return (
			<span className="tribe-editor__subtitle__headline-date">{ endDate }</span>
		);
	}

	renderEndTime() {
		const { end, multiDay, allDay } = this.props;
		const { time } = FORMATS.WP;

		if ( allDay ) {
			return null;
		}

		return (
			<React.Fragment>
				{ multiDay && this.renderSeparator( 'date-time' ) }
				{ toMoment( end ).format( toFormat( time ) ) }
			</React.Fragment>
		);
	}

	isSameYear( start = this.props.start, end = this.props.end ) {
		return toMoment( start ).isSame( toMoment( end ), 'year' );
	}

	renderTimezone() {
		return this.renderSeparator( 'timezone' );
	}

	/**
	 * Renders a separator based on the type called
	 *
	 * @param {string} type - The type of separator
	 *
	 * @returns {ReactDOM} A React Dom Element null if none.
	 */
	renderSeparator( type, className ) {
		const { timezone, separatorDate, separatorTime } = this.props;
		switch ( type ) {
			case 'date-time':
				return (
					<span className={ classNames( 'tribe-editor__separator', className ) }>
						{ ' '.concat( separatorDate, ' ') }
					</span>
				);
			case 'time-range':
				return (
					<span className={ classNames( 'tribe-editor__separator', className ) }>
						{ ' '.concat( separatorTime, ' ') }
					</span>
				);
			case 'dash':
				return (
					<span className={ classNames( 'tribe-editor__separator', className ) }> &mdash; </span>
				);
			case 'all-day':
				return (
					<span className={ classNames( 'tribe-editor__separator', className ) }> ALL DAY</span>
				);
			case 'space':
				return (
					<span className={ classNames( 'tribe-editor__separator', className ) }>&nbsp;</span>
				);
			case 'timezone':
				return (
					<span className={ classNames( 'tribe-editor__separator', className ) }>
						{ timezone }
					</span>
				);
			default:
				return null;
		}
	}

	/**
	 * Main label used to display the event
	 *
	 * @returns {ReactDOM} A React Dom Element null if none.
	 */
	renderLabel() {
		const { multiDay, allDay } = this.props;

		return (
			<section key="event-datetime" className="tribe-editor__subtitle tribe-editor__date-time">
				<h2 className="tribe-editor__subtitle__headline" onClick={ this.props.openDashboardDateTime }>
					{ this.renderStart() }
					{ ( multiDay || ! allDay ) && this.renderSeparator( 'time-range' ) }
					{ this.renderEnd() }
					{ allDay && this.renderSeparator( 'all-day' ) }
					{ this.renderSeparator( 'space' ) }
					{ this.renderTimezone() }
					{ this.renderPrice() }
				</h2>
				{ this.renderDashboard() }
			</section>
		);
	}

	renderDashboard() {
		const { dashboardOpen, multiDay, allDay } = this.props;
		return (
			<Dashboard open={ dashboardOpen }>
				<Fragment>
					<section className="tribe-editor__calendars">
						{ this.renderCalendars() }
					</section>
					<footer className="tribe-editor__subtitle__footer">
						<section className="tribe-editor__subtitle__footer-date">
							{ this.renderStartTimePicker() }
							{
								( multiDay || ! allDay ) &&
								this.renderSeparator( 'time-range', 'tribe-editor__time-picker__separator' )
							}
							{ this.renderEndTimePicker() }
						</section>
						<section className="tribe-editor__subtitle__footer-multiday">
							{ this.renderMultidayToggle() }
						</section>
					</footer>
				</Fragment>
			</Dashboard>
		);
	}

	/* TODO: This needs to move to logic component wrapper */
	onKeyDown = ( e ) => {
		const ESCAPE_KEY = 27;
		if ( e.keyCode === ESCAPE_KEY ) {
			this.props.closeDashboardDateTime();
		}
	}

	/* TODO: This needs to move to logic component wrapper */
	onClick = ( e ) => {
		const { target } = e;
		if (
			! this.isTargetInBlock( target ) &&
			! this.isTargetInSidebar( target ) &&
			! this.isTargetInDropdown( target )
		) {
			this.props.closeDashboardDateTime();
		}
	}

	/* TODO: This needs to move to logic component wrapper */
	isTargetInBlock = ( target ) => (
		searchParent( target, ( testNode ) => {
			if ( testNode.classList.contains( 'editor-block-list__block' ) ) {
				return Boolean( testNode.querySelector( '.tribe-editor__date-time' ) );
			}
			return false;
		} )
	);

	/* TODO: This needs to move to logic component wrapper */
	isTargetInSidebar = ( target ) => (
		searchParent( target, ( testNode ) => (
			testNode.classList.contains( 'edit-post-sidebar' )
		) )
	);

	/* TODO: This needs to move to logic component wrapper */
	isTargetInDropdown = ( target ) => (
		searchParent( target, ( testNode ) => (
			testNode.classList.contains( 'tribe-editor__timepicker__dialog' )
		) )
	);

	renderCalendars() {
		const { multiDay, start, end, visibleMonth, setVisibleMonth } = this.props;
		const monthProps = {
			onSelectDay: this.setDays,
			withRange: multiDay,
			from: toMoment( start ).toDate(),
			month: visibleMonth,
			setVisibleMonth,
		};

		if ( multiDay ) {
			monthProps.to = toMoment( end ).toDate();
		}

		return (
			<Month { ...monthProps } />
		);
	}

	setDays = ( data ) => {
		const { from, to } = data;
		const { setDate } = this.props;
		setDate( from, to );
	};

	startTimePickerOnChange = ( e ) => {
		const { start, end, setStartTime } = this.props;
		const [ hour, minute ] = e.target.value.split( ':' );

		const startMoment = toMoment( start );
		const max = toMoment( end ).clone().subtract( 1, 'minutes' );

		const copy = startMoment.clone();
		copy.set( 'hour', parseInt( hour, 10 ) );
		copy.set( 'minute', parseInt( minute, 10 ) );
		copy.set( 'second', 0 );

		if ( copy.isAfter( max ) ) {
			return;
		}

		setStartTime( copy.diff( startMoment.clone().startOf( 'day' ), 'seconds' ) );
	}

	startTimePickerOnClick = ( value, onClose ) => {
		const { setAllDay, setStartTime } = this.props;

		const data = {
			allDay: value === 'all-day',
			seconds: 0,
		};

		if ( ! data.allDay ) {
			data.seconds = value;
		}

		setAllDay( data.allDay );
		setStartTime( data.seconds );
		onClose();
	}

	endTimePickerOnChange = ( e ) => {
		const { start, end, setEndTime } = this.props;
		const [ hour, minute ] = e.target.value.split( ':' );

		const endMoment = toMoment( end );
		const min = toMoment( start ).clone().add( 1, 'minutes' );

		const copy = endMoment.clone();
		copy.set( 'hour', parseInt( hour, 10 ) );
		copy.set( 'minute', parseInt( minute, 10 ) );
		copy.set( 'second', 0 );

		if ( copy.isBefore( min ) ) {
			return;
		}

		setEndTime( copy.diff( endMoment.clone().startOf( 'day' ), 'seconds' ) );
	}

	endTimePickerOnClick = ( value, onClose ) => {
		const { setAllDay, setEndTime } = this.props;

		const data = {
			allDay: value === 'all-day',
			seconds: 0,
		};

		if ( ! data.allDay ) {
			data.seconds = value;
		}

		setAllDay( data.allDay );
		setEndTime( data.seconds );
		onClose();
	}

	renderStartTimePicker() {
		const { start, allDay, multiDay, end } = this.props;
		const { time } = FORMATS.WP;
		const startMoment = toMoment( start );
		const endMoment = toMoment( end );

		const pickerProps = {
			current: startMoment,
			max: endMoment.clone().subtract( 1, 'minutes' ),
			start: startMoment.clone().startOf( 'day' ),
			end: roundTime( endMoment ),
			onChange: this.startTimePickerOnChange,
			onClick: this.startTimePickerOnClick,
			onSelectItem: this.setStartTime,
			timeFormat: time,
		};

		if ( ! multiDay ) {
			pickerProps.min = startMoment.clone().startOf( 'day' );
		}

		if ( allDay ) {
			pickerProps.allDay = true;
		}

		let startDate = toDate( toMoment( start ) );

		if ( this.isSameYear() && this.isSameYear( TODAY ) ) {
			startDate = toDateNoYear( toMoment( start ) );
		}

		return (
			<React.Fragment>
				<span className="tribe-editor__time-picker__label">{ startDate }</span>
				<TimePicker { ...pickerProps } />
			</React.Fragment>
		);
	}

	setStartTime = ( data ) => {
		const { seconds, allDay } = data;
		const { setAllDay, setStartTime } = this.props;

		if ( allDay ) {
			setAllDay( allDay );
		} else {
			setStartTime( seconds );
		}
	};

	renderEndTimePicker() {
		const { start, end, multiDay, allDay } = this.props;
		const { time } = FORMATS.WP;
		const startMoment = toMoment( start );
		const endMoment = toMoment( end );

		const pickerProps = {
			current: endMoment,
			min: startMoment.clone().add( 1, 'minutes' ),
			start: roundTime( startMoment ).add( 30, 'minutes' ),
			end: endMoment.clone().endOf( 'day' ),
			onChange: this.endTimePickerOnChange,
			onClick: this.endTimePickerOnClick,
			onSelectItem: this.setEndTime,
			timeFormat: time,
		};

		// if ( endMoment.diff( endMoment.clone().add( 1, 'days' ).startOf( 'day' ), 'seconds' ) < HALF_HOUR_IN_SECONDS ) {
		// 	pickerProps.start = endMoment.clone().endOf( 'day' );
		// }

		if ( ! multiDay && allDay ) {
			return null;
		}

		if ( ! multiDay ) {
			pickerProps.max = startMoment.clone().endOf( 'day' );
		}

		let endDate = toDate( toMoment( end ) );

		if ( this.isSameYear() && this.isSameYear( TODAY ) ) {
			endDate = toDateNoYear( toMoment( end ) );
		}

		return (
			<React.Fragment>
				{ multiDay && <span className="tribe-editor__time-picker__label">{ endDate }</span> }
				<TimePicker { ...pickerProps } />
			</React.Fragment>
		);
	}

	setEndTime = ( data ) => {
		const { seconds, allDay } = data;
		const { setAllDay, setEndTime } = this.props;
		if ( allDay ) {
			setAllDay( allDay );
		} else {
			setEndTime( seconds );
		}
	};

	renderMultidayToggle() {
		const { multiDay, toggleMultiDay } = this.props;
		return (
			<ToggleControl
				label={ __( 'Multi-Day', 'events-gutenberg' ) }
				checked={ multiDay }
				onChange={ toggleMultiDay }
			/>
		);
	}

	/**
	 * Controls being rendered on the sidebar.
	 *
	 * @returns {ReactDOM} A React Dom Element null if none.
	 */
	renderControls() {
		const {
			separatorTime,
			separatorDate,
			timezone,
			setTimeZone,
			setSeparatorTime,
			setSeparatorDate,
		} = this.props;

		return ( <InspectorControls key="inspector">
			<PanelBody title={ __( 'Date Time Settings', 'events-gutenberg' ) }>
				<TextControl
					label={ __( 'Date Time Separator', 'events-gutenberg' ) }
					value={ separatorDate }
					onChange={ setSeparatorDate }
					className="tribe-editor__date-time__date-time-separator-setting"
					maxLength="2"
				/>
				<TextControl
					label={ __( 'Time Range Separator', 'events-gutenberg' ) }
					value={ separatorTime }
					onChange={ setSeparatorTime }
					className="tribe-editor__date-time__time-range-separator-setting"
					maxLength="2"
				/>
				<SelectControl
					label={ __( 'Time Zone', 'events-gutenberg' ) }
					value={ timezone }
					onChange={ setTimeZone }
					options={ timezonesAsSelectData() }
					className="tribe-editor__date-time__time-zone-setting"
				/>
			</PanelBody>
		</InspectorControls> );
	}

	render() {
		return [ this.renderLabel(), this.renderControls() ];
	}
}

const mapStateToProps = ( state ) => {
	return {
		dashboardOpen: UISelectors.getDashboardDateTimeOpen( state ),
		visibleMonth: UISelectors.getVisibleMonth( state ),
		start: dateTimeSelectors.getStart( state ),
		end: dateTimeSelectors.getEnd( state ),
		multiDay: dateTimeSelectors.getMultiDay( state ),
		allDay: dateTimeSelectors.getAllDay( state ),
		separatorDate: dateTimeSelectors.getDateSeparator( state ),
		separatorTime: dateTimeSelectors.getTimeSeparator( state ),
		timezone: dateTimeSelectors.getTimeZone( state ),
		cost: priceSelectors.getPrice( state ),
	};
};

const mapDispatchToProps = ( dispatch ) => ( {
	...bindActionCreators( dateTimeActions, dispatch ),
	...bindActionCreators( UIActions, dispatch ),
	...bindActionCreators( priceActions, dispatch ),
	setInitialState( props ) {
		dispatch( priceActions.setInitialState( props ) );
		dispatch( dateTimeActions.setInitialState( props ) );
		dispatch( UIActions.setInitialState( props ) );
	},
} );

export default compose(
	connect(
		mapStateToProps,
		mapDispatchToProps,
	),
	withSaveData(),
)( EventDateTime );
