/**
 * Internal dependencies
 */
import {
	FORMATS,
	TODAY,
	equalDates,
	timezones,
	timezonesAsSelectData,
} from './../date';

jest.mock( './../../../elements/timezone-picker/element', () => ( {
	getItems: () => [
		{
			options: [
				{
					key: 'America/Argentina/Buenos_Aires',
					text: 'Argentina - Buenos Aires',
				},
			],
		},
		{
			options: [
				{
					key: 'America/Argentina/Catamarca',
					text: 'Argentina - Catamarca',
				},
			],
		},
	],
} ) );

afterAll( () => {
	jest.unmock( './../../../elements/timezone-picker/element' );
} );

describe( 'Tests for date.js', () => {
	test( 'formats', () => {
		const draft = {
			TIME: 'HH:mm:ss',
			DATE_TIME: 'YYYY-MM-DD HH:mm:ss',
			WP: {
				time: 'g:i a',
				date: 'F j, Y',
				datetime: 'F j, Y g:i a',
				dateNoYear: 'F j',
			},
			TIMEZONE: {
				string: 'UTC',
			},
		};
		expect( FORMATS ).toEqual( draft );
	} );

	test( 'today', () => {
		const now = new Date();
		expect( TODAY ).toBeInstanceOf( Date );
		expect( TODAY ).hasOwnProperty( 'getDay' );
		expect( TODAY.getDay() ).toEqual( now.getDay() );
	} );

	test( 'equalDates', () => {
		expect( equalDates( new Date(), new Date(), new Date(), new Date() ) ).toEqual( true );
		// Falsy tests
		const b = new Date();
		b.setDate( b.getDate() + 1 );
		expect( equalDates( new Date(), b ) ).toEqual( false );
		expect( equalDates( new Date(), new Date(), new Date(), null ) ).toEqual( false );
		expect( equalDates( null, new Date() ) ).toEqual( false );
		expect( equalDates() ).toEqual( false );
	} );

	test( 'timezones', () => {
		const expected = [
			{
				key: 'America/Argentina/Buenos_Aires',
				text: 'Argentina - Buenos Aires',
			},
			{
				key: 'America/Argentina/Catamarca',
				text: 'Argentina - Catamarca',
			},
		];
		expect( timezones() ).toEqual( expected );
	} );

	test( 'timezonesAsSelectData', () => {
		const expected = [
			{
				value: 'America/Argentina/Buenos_Aires',
				label: 'Argentina - Buenos Aires',
			},
			{
				value: 'America/Argentina/Catamarca',
				label: 'Argentina - Catamarca',
			},
		];
		expect( timezonesAsSelectData() ).toEqual( expected );
	} );
} );
