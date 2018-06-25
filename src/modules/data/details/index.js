/**
 * External Dependencies
 */
import moment from 'moment/moment';
import { __ } from '@wordpress/i18n';

/**
 * Wordpress dependencies
 */
import { registerStore } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { roundTime, toDateTime } from 'utils/moment';
import { HALF_HOUR_IN_SECONDS } from 'utils/time';

import * as reducers from './reducers';
import * as actions from './actions';
import * as selectors from './selectors';

import { getSetting } from 'editor/settings';
import { isTruthy } from 'utils/string';

export const DEFAULT_STATE = {
	multiDay: false,
	allDay: false,
	start: toDateTime( roundTime( moment() ) ),
	end: toDateTime( roundTime( moment() ).add( HALF_HOUR_IN_SECONDS, 'seconds' ) ),
	timezone: 'UTC',
	separatorDate: getSetting( 'dateTimeSeparator', __( ' @ ', 'events-gutenberg' ) ),
	separatorTime: getSetting( 'timeRangeSeparator', __( ' - ', 'events-gutenberg' ) ),
	currencyPosition: getSetting( 'currencyPosition', 'prefix' ),
	currencySymbol: getSetting( 'defaultCurrencySymbol', __( '$', 'events-gutenberg' ) ),
	dashboardOpen: false,
	organizers: [],
	url: undefined,
	cost: '',
};

export const STORE_NAME = 'tec.details';

export const store = registerStore( STORE_NAME, {
	reducer( state = DEFAULT_STATE, action ) {
		switch ( action.type ) {
			case 'SET_INITIAL_STATE': {
				return reducers.setInitialState( state, action.values );
			}

			case 'SET_MULTI_DAY': {
				return reducers.setMultiDay( state, action.multiDay );
			}

			case 'SET_ALL_DAY': {
				return reducers.setAllDay( state, action.allDay );
			}

			case 'SET_TIME_ZONE': {
				return {
					...state,
					timezone: action.timezone,
				};
			}

			case 'SET_START_DATE': {
				return reducers.setOnlyDateForStart( state, action.date );
			}

			case 'SET_END_DATE': {
				return reducers.setOnlyDateForEnd( state, action.date );
			}

			case 'SET_START_TIME': {
				return reducers.setStartTime( state, action.seconds );
			}

			case 'SET_END_TIME': {
				return reducers.setEndTime( state, action.seconds );
			}

			case 'SET_ORGANIZERS': {
				return reducers.setOrganizers( state, action.organizers );
			}

			case 'ADD_ORGANIZER': {
				return reducers.addOrganizers( state, action.organizer );
			}

			case 'REMOVE_ORGANIZER': {
				return reducers.removeOrganizer( state, action.organizer );
			}

			case 'MAYBE_REMOVE_ORGANIZER': {
				return reducers.maybeRemoveOrganizer( state, action.organizer );
			}

			case 'REPLACE_ORGANIZERS': {
				return reducers.replaceOrganizers( state, action.organizers );
			}

			case 'SET_CURRENCY_SYMBOL': {
				return reducers.setCurrencySymbol( state, action.symbol );
			}

			case 'SET_CURRENCY_POSITION': {
				return reducers.setCurrencyPosition( state, action.position );
			}

			case 'SET_COST': {
				return {
					...state,
					cost: action.cost,
				};
			}

			case 'SET_WEBSITE_URL': {
				return reducers.setWebsiteUrl( state, action.url );
			}

			case 'SET_DATE_TIME_SEPARATOR': {
				return {
					...state,
					separatorDate: action.separator,
				};
			}

			case 'SET_TIME_RANGE_SEPARATOR': {
				return {
					...state,
					separatorTime: action.separator,
				};
			}

			case 'TOGGLE_DASHBOARD': {
				return {
					...state,
					dashboardOpen: ! state.dashboardOpen,
				};
			}

			case 'CLOSE_DASHBOARD': {
				return {
					...state,
					dashboardOpen: false,
				};
			}

			default: {
				return state;
			}
		}
	},
	actions,
	selectors,
} );
