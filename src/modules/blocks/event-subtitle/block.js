/**
 * External dependencies
 */
import moment from 'moment';
import React from 'react';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

import {
	Dropdown,
	ToggleControl,
	PanelBody,
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';

import {
	InspectorControls,
} from '@wordpress/blocks'

/**
 * Internal dependencies
 */
import {
	DatePicker,
	TimePicker,
	TimezonePicker,
} from 'elements'
import './style.pcss';

import { getSetting } from 'editor/settings'

/**
 * Module Code
 */
// Fetches all the Editor Settings
const WPDateSettings = window.tribe_date_settings || {};

class EventSubtitle extends Component {
	constructor() {
		super( ...arguments );

		this.state = this.props;
	}


	start() {
		return<React.Fragment>
			{this.startDate()}
			{this.startTime()}
		</React.Fragment>
	}

	startDate() {
		const { attributes, setAttributes } = this.props;
		return <DatePicker
			changeDatetime={ ( date ) => {
				setAttributes( { startDate: date } )
			} }
			datetime={ attributes.startDate }
		/>
	}

	startTime() {
		const { attributes, setAttributes } = this.props;

		if ( this.isAllDay() ) {
			return null;
		}

		return <React.Fragment>
			{this.separator('date-time')}
			<TimePicker
				onSelectItem={ ( date, startAllDay = false, endAllDay = false ) => {
					if ( 'all-day' === date ) {
						setAttributes( {
							allDay: true,
							startDate: startAllDay,
							endDate: endAllDay,
						} )
					} else {
						setAttributes( { startDate: date } )
					}
				} }
				current={ attributes.startDate }
				timeFormat={ WPDateSettings.formats.time }
			/>
		</React.Fragment>
	}

	end() {
		return <React.Fragment>
			{this.endDate()}
			{this.endTime()}
		</React.Fragment>
	}

	endDate() {
		const { attributes, setAttributes } = this.props;

		if ( this.isSameDay() ) {
			return null;
		}

		return <DatePicker
			changeDatetime={(date) => {
				setAttributes({
					endDate: date
				})
			}}
			datetime={attributes.endDate}
		/>
	}

	endTime() {
		const { attributes, setAttributes } = this.props;

		if ( this.isAllDay() ) {
			return null;
		}

		return <React.Fragment>
			{this.isSameDay() ? null : this.separator('date-time')}
			<TimePicker
				onSelectItem={ ( date, startAllDay = false, endAllDay = false, args = {}) => {
					if ( 'all-day' === date ) {
						setAttributes( {
							allDay: true,
							startDate: startAllDay,
							endDate: endAllDay,
						} )
					} else {
						setAttributes( { endDate: date } )
					}
				} }
				current={ attributes.endDate }
				timeFormat={ WPDateSettings.formats.time }
			/>
		</React.Fragment>
	}

	/**
	 * Test if the current start and end date are happening on the same day.
	 *
	 * @returns {boolean}
	 */
	isSameDay() {
		const { attributes } = this.props;
		const { startDate, endDate } = attributes;

		return moment(startDate).isSame(endDate, 'day');
	}

	/**
	 * Test if the current event is happening all day.
	 *
	 * @returns {boolean}
	 */
	isAllDay() {
		const { attributes } = this.props;
		const { allDay } = attributes;
		return allDay;
	}

	timezone() {
		const { attributes, setAttributes } = this.props;

		return <TimezonePicker
			onSelectItem={ ( value ) => {
				setAttributes( { timezone: value } )
			} }
			current={ attributes.timezone }
			siteTimezone={ WPDateSettings.timezone }
		/>
	}

	/**
	 * Renders a separator based on the type called
	 *
	 * @param type
	 *
	 * @returns {*}
	 */
	separator( type ) {
		switch ( type ) {
			case 'date-time':
				return <span className='tribe-editor-events-subtitle__separator'>{ getSetting( 'dateTimeSeparator', __( ' @ ', 'events-gutenberg' ) ) }</span>;
			case 'time-range':
				return <span className='tribe-editor-events-subtitle__separator'>{ getSetting( 'timeRangeSeparator', __( ' - ', 'events-gutenberg' ) ) }</span>;
			case 'dash':
				return <span className='tribe-editor-events-subtitle__separator'> &mdash; </span>;
			case 'all-day':
				return <span className='tribe-editor-events-subtitle__separator'> ALL DAY</span>
			case 'space':
				return <span className='tribe-editor-events-subtitle__separator'>&nbsp;</span>
			default:
				return null;
		}
	}

	/**
	 * Main label used to display the event
	 *
	 * @returns {*}
	 */
	label() {
		return <h2 key="event-datetime" className="tribe-editor-block tribe-editor-events-subtitle">
			{this.start()}
			{this.isSameDay() && this.isAllDay() ? null : this.separator('time-range')}
			{this.end()}
			{this.isAllDay() ? this.separator('all-day') : null}
			{this.separator('space')}
			{this.timezone()}
		</h2>
	}

	/**
	 * Controls being rendered on the sidebar.
	 *
	 * @returns {*}
	 */
	controls() {
		const { setAttributes, isSelected } = this.props;

		if ( ! isSelected ) {
			return null;
		}

		return <InspectorControls key="inspector">
			<PanelBody title={ __( 'Date Time Settings', 'events-gutenberg' ) }>
				<ToggleControl
					label={ __( 'Is All Day Event', 'events-gutenberg' ) }
					checked={ this.isAllDay() }
					onChange={ ( value ) => setAttributes( { allDay: value } ) }
				/>
			</PanelBody>
		</InspectorControls>
	}

	render() {
		return [ this.label(), this.controls() ]
	}
}

export default EventSubtitle;
