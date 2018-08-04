/**
 * Internal dependencies
 */
import reducer, { actions } from '@@plugins/events/data/details';
import { details } from '@@plugins/events/data/details/reducers';
import { DEFAULT_STATE } from '@@plugins/events/data/details/reducers/details';

jest.mock( '@@plugins/events/data/details/reducers', () => {
	const original = require.requireActual( '@@plugins/events/data/details/reducers/details' );
	return {
		details: jest.fn( ( state = original.DEFAULT_STATE ) => state ),
	};
} );

describe( '[STORE] - Details reducer', () => {
	afterEach( () => {
		details.mockClear();
	} );

	it( 'Should return the default state', () => {
		expect( reducer( undefined, {} ) ).toEqual( {} );
	} );

	it( 'Should set the details', () => {
		expect( reducer( {}, actions.setDetails( 20, { title: 'Modern Tribe' } ) ) ).toMatchSnapshot();
	} );

	it( 'Should pass the actions to the child reducer when block not present', () => {
		const groupAction = [
			actions.enableLoading( 20 ),
			actions.setPostType( 20, 'tribe_events' ),
			actions.setDetails( 20, { title: 'Modern Tribe' } ),
		];

		groupAction.forEach( ( action ) => {
			reducer( {}, action );
			expect( details ).toHaveBeenCalledWith( undefined, action );
			expect( details ).toHaveBeenCalledTimes( 1 );
			details.mockClear();
		} );
	} );

	it( 'It should pass the block to the child reducer', () => {
		const groupAction = [
			actions.enableLoading( 20 ),
			actions.setPostType( 20, 'tribe_events' ),
			actions.setDetails( 20, { title: 'Modern Tribe' } ),
		];

		const state = {
			20: DEFAULT_STATE,
		};

		groupAction.forEach( ( action ) => {
			reducer( state, action );
			expect( details ).toHaveBeenCalledWith( DEFAULT_STATE, action );
			expect( details ).toHaveBeenCalledTimes( 1 );
			details.mockClear();
		} );
	} );
} );
