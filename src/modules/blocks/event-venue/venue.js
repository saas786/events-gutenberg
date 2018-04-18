/**
 * External dependencies
 */
import { unescape, union, uniqueId, trim, isEmpty, mapValues } from 'lodash';
import { stringify } from 'querystringify';
import classNames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, compose } from '@wordpress/element';
import { store, STORE_NAME } from 'data/venues';

import {
	Dropdown,
	IconButton,
	Dashicon,
	Spinner,
	Placeholder,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import {
	VenueForm,
	SearchPosts,
} from 'elements'

function CreateDropdown( { ...props } ) {
	const { focus, addVenue } = props;

	if ( ! focus  ) {
		return null;
	}

	const icon = (
		<Dashicon icon='plus' />
	)

	const dropdownToggle = ( { onToggle, isOpen } ) => (
		<IconButton
			className='tribe-editor-button'
			label={ __( 'Create Venue' ) }
			onClick={ onToggle }
			icon={ icon }
			aria-expanded={ isOpen }
		/>
	)

	const dropdownContent = ( { onToggle, isOpen, onClose } ) => (
		<VenueForm
			addVenue={ addVenue }
			onClose={ onClose }
		/>
	)

	const content = (
		<Dropdown
			className="tribe-editor-venue-dropdown"
			position="bottom center"
			contentClassName="tribe-editor-dropdown__dialog"
			renderToggle={ dropdownToggle }
			renderContent={ dropdownContent }
		/>
	)

	return content
}

function VenueActions( { ...props } ) {
	const { focus, venue, onClick } = props;

	if ( ! focus  ) {
		return null;
	}

	const icon = (
		<Dashicon icon='no' />
	)

	return (
		<IconButton
			className='tribe-editor-button'
			label={ __( 'Remove Venue' ) }
			onClick={ onClick }
			icon={ icon }
			aria-expanded={ focus }
		/>
	)
}

/**
 * Module Code
 */
class VenueDetails extends Component {
	constructor( props ) {
		super( ...arguments );

		this.state = {
			isLoading: false,
		}
		this.renderVenueName = this.renderVenueName.bind( this )
		this.renderVenue = this.renderVenue.bind( this )
		this.renderActions = this.renderActions.bind( this )
	}

	renderVenueName( venue = null ) {
		// If we don't have a venue we fetch the one in the state
		if ( ! venue ) {
			venue = this.props.venue
		}

		// if we still don't have venue we don't have an address
		if ( ! venue ) {
			return false
		}

		// If we don't have a title we say it's untitled
		if ( ! venue.title ) {
			return __( '(Untitled Venue)', 'events-gutenberg' );
		}

		return unescape( venue.title.rendered ).trim();
	}

	renderVenue() {
		const venue = this.props.venue
		const {
			focus,
			removeVenue,
			showMap,
			showMapLink,
		} = this.props
		const classes = {
			'tribe-current': true
		}

		const address = this.props.getAddress()
		const mapsUrlArgs = {
			f: 'q',
			source: 's_q',
			geocode: '',
			q: address,
		}
		const mapsUrl = `https://maps.google.com/maps?${ stringify( mapsUrlArgs ) }`

		return (
			<div
				className={ classNames( classes ) }
				key={ venue.id }
			>
				<h4>{ this.renderVenueName() }</h4>
				{ ! isEmpty( address ) &&
					<address className="tribe-events-address">
						<span className="tribe-street-address">{ venue.meta._VenueAddress }</span>
						<br />
						<span className="tribe-locality">{ venue.meta._VenueCity }</span><span className="tribe-delimiter">,</span>&nbsp;
						<abbr className="tribe-region tribe-events-abbr" title={ venue.meta._VenueProvince }>{ venue.meta._VenueProvince }</abbr>&nbsp;
						<span className="tribe-postal-code">{ venue.meta._VenueZip }</span>&nbsp;
						<span className="tribe-country-name">{ venue.meta._VenueCountry }</span>&nbsp;
						{ ! isEmpty( address ) && showMapLink &&
							<a
								className="tribe-events-gmap"
								href={ mapsUrl }
								title={ __( 'Click to view a Google Map', 'events-gutenberg' ) }
								target="_blank"
							>
								{ __( '+ Google Map', 'events-gutenberg' ) }
							</a>
						}
					</address>
				}

				{ ! isEmpty( venue.meta._VenuePhone ) &&
					<p className='tribe-editor__meta-field'>
						<strong>{ __( 'Phone: ', 'events-gutenberg' ) }</strong><br />
						<span>{ venue.meta._VenuePhone }</span>
					</p>
				}

				{ ! isEmpty( venue.meta._VenueURL ) &&
					<p className='tribe-editor__meta-field'>
						<strong>{ __( 'Website: ', 'events-gutenberg' ) }</strong><br />
						<span>{ venue.meta._VenueURL }</span>
					</p>
				}
			</div>
		);
	}

	renderActions() {
		const { focus, addVenue, removeVenue, venue } = this.props;

		return (
			<div key='venue-actions' className='tribe-editor-venue-actions'>
				<SearchPosts
					key='venue-search-dropdown'
					postType='tribe_venue'
					metaKey='_EventVenueID'
					searchLabel={ __( 'Search for an venue', 'events-gutenberg' ) }
					iconLabel={ __( 'Add existing venue', 'events-gutenberg' ) }
					focus={ focus }
					onSelectItem={ addVenue }
					store={store}
					storeName={STORE_NAME}
					searchable
				/>
				<CreateDropdown
					key='venue-create-dropdown'
					focus={ focus }
					addVenue={ addVenue }
				/>
				{ venue &&
					<VenueActions
						key='venue-actions'
						focus={ focus }
						venue={ venue }
						onClick={ () => removeVenue( venue ) }
					/>
				}
			</div>
		)
	}

	render() {
		const { venue } = this.props;
		const { isLoading } = this.state;

		if ( isLoading ) {
			return (
				<Placeholder key='loading'>
					<Spinner />
				</Placeholder>
			)
		}

		if ( venue ) {
			return [ this.renderVenue(), this.renderActions() ]
		}

		return (
			<Placeholder key='actions'>
				{ this.renderActions() }
			</Placeholder>
		)
	}
}

export default VenueDetails;