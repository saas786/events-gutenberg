/**
 * External dependencies
 */
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { noop } from 'lodash';
import moment from 'moment';

/**
 * Internal dependencies
 */
import { actions } from 'data/ui';

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

describe( '[STORE] - UI actions', () => {
	it( 'Should toggle the dashboard', () => {
		expect( actions.toggleDashboard() ).toMatchSnapshot();
	} );

	it( 'Should open the dashboard', () => {
		expect( actions.openDashboard() ).toMatchSnapshot();
	} );

	it( 'Should close the dashboard', () => {
		expect( actions.closeDashboard() ).toMatchSnapshot();
	} );

	it( 'Should set the visible month', () => {
		Date.now = jest.fn( () => '2018-07-01T05:00:00.000Z' );
		expect( actions.setVisibleMonth( Date.now() ) ).toMatchSnapshot();
	} );

	it( 'Should not set the initial state', () => {
		const store = mockStore( {} );
		store.dispatch( actions.setInitialState( { get: noop } ) );
		expect( store.getActions() ).toEqual( [] );
	} );
} );

describe( '[STORE] - UI thunk actions', () => {
	it( 'Should set the initial state', () => {
		const store = mockStore( {} );

		store.dispatch(
			actions.setInitialState( {
				get: () => moment(),
			} ),
		);

		expect( store.getActions() ).toMatchSnapshot();
	} );
} );
