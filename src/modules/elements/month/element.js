/**
 * Import external dependencies
 */
import { omit, noop, pick, isEmpty } from 'lodash';
import DayPicker, { DateUtils } from 'react-day-picker';
import PropTypes from 'prop-types';
import 'react-day-picker/lib/style.css';
import classNames from 'classnames';
import moment from 'moment/moment';

/**
 * Wordpress dependencies
 */
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { YearMonthForm } from 'elements';
import { equalDates } from 'utils/date';
import './style.pcss';

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();
const fromMonth = new Date( currentYear, currentMonth );
const toMonth = new Date( currentYear + 10, 11 );

export default class Month extends Component {
	static propTypes = {
		withRange: PropTypes.bool,
		onSelectDay: PropTypes.func,
		initialRangeDays: PropTypes.number,
		from: PropTypes.instanceOf( Date ),
		to: PropTypes.instanceOf( Date ),
		month: PropTypes.instanceOf( Date ),
		toMonth: PropTypes.instanceOf( Date ),
	};

	static defaultProps = {
		withRange: false,
		onSelectDay: noop,
		initialRangeDays: 3,
		from: today,
		to: undefined,
		month: fromMonth,
		toMonth,
	};

	static getDerivedStateFromProps( nextProps ) {
		return {
			...nextProps,
		};
	}

	constructor( props ) {
		super( ...arguments );

		this.state = {
			...props,
		};
	}

	selectDay = ( day, { selected } ) => {
		const { withRange } = this.state;
		const { from, to } = this.state;

		if ( equalDates( day, to, from ) ) {
			return;
		}

		if ( withRange ) {
			const range = DateUtils.addDayToRange( day, this.state );

			// if the range was unselected we fallback to the first available day
			if ( range.from === null && range.to === null ) {
				range.from = today;
				range.to = undefined;
			}

			if ( range.to && moment( range.to ).isSame( range.from ) ) {
				range.to = undefined;
			}

			this.setState( range, () => {
				this.onSelectCallback();
			} );
		} else {
			this.setState( {
				from: selected ? today : day,
				to: undefined,
			}, () => {
				this.onSelectCallback();
			} );
		}
	};

	onSelectCallback = () => {
		const { onSelectDay } = this.props;
		onSelectDay( omit( this.state, [ 'withRange' ] ) );
	}

	getSelectedDays = () => {
		const { from, withRange, to } = this.state;
		if ( withRange ) {
			return [ from, { from, to }];
		}
		return from;
	}

	handleYearMonthChange = ( month ) => this.setState({ month });

	getCaptionElement = ({ date, localeUtils }) => {
		const { month } = this.state;

		if ( date.getMonth() !== month.getMonth()) {
			return this.renderCaption( date, localeUtils );
		}

		return (
			<YearMonthForm
				today={ today }
				date={ date }
				localeUtils={ localeUtils }
				onChange={ this.handleYearMonthChange }
			/>
		);
	}

	renderCaption = ( date, localeUtils ) => (
		<div className={'tribe-editor__daypicker-caption'} role="heading">
			<div>
				{ localeUtils.formatMonthTitle( date ) }
			</div>
		</div>
	);

	render() {
		const { withRange, from, to, month, toMonth } = this.state;
		const modifiers = withRange ? { start: from, end: to } : {};
		const containerClass = classNames( { 'tribe-editor__calendars--range': withRange } );

		return (
			<DayPicker
				className={ containerClass }
				fromMonth={ fromMonth }
				month={ month }
				toMonth={ toMonth }
				numberOfMonths={ 2 }
				modifiers={ modifiers }
				selectedDays={ this.getSelectedDays() }
				onDayClick={ this.selectDay }
				onMonthChange={ this.handleYearMonthChange }
				disabledDays={
					{
						before: today,
					}
				}
				captionElement={ this.getCaptionElement }
			/>
		);
	}
}
