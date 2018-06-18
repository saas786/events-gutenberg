/**
 * External dependencies
 */
import React from 'react';
import { isEmpty } from 'lodash';
import { mapLink } from 'utils/geo-data';
import { decode } from 'he';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';

import {
	Spinner,
	Placeholder,
} from '@wordpress/components';

/**
 * Internal dependencies
 */

/**
 * Module Code
 */
export default class VenueDetails extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			isLoading: false,
		};
	}

	render() {
		const { venue } = this.props;
		const { isLoading } = this.state;

		if ( isLoading ) {
			return (
				<Placeholder key="loading">
					<Spinner />
				</Placeholder>
			);
		}

		if ( venue ) {
			return this.renderVenue();
		}

		return null;
	}

	renderVenue = () => {
		const { venue } = this.props;

		return (
			<div
				className="tribe-editor__venue--current"
				key={ venue.id }
			>
				{ this.renderVenueName() }
				{ this.renderAddress() }
				{ this.renderPhone() }
				{ this.renderWebsite() }
			</div>
		);
	}

	renderVenueName() {
		return (
			<h3 className="tribe_editor__venue__name">
				{ decode( this.getVenueName() ) }
			</h3>
		);
	}

	getVenueName( venue = this.props.venue ) {
		// if we still don't have venue we don't have an address
		const { title = {} } = venue;
		const { rendered = __( '(Untitled Venue)', 'events-gutenberg' ) } = title;
		return rendered;
	}

	renderAddress() {
		const { address = {} } = this.props;
		if ( isEmpty( address ) ) {
			return null;
		}

		const {
			city,
			street,
			province,
			zip,
			country,
		} = address;

		return (
			<address className="tribe-editor__venue__address">
				<span className="tribe-venue__street-address">{ street }</span>
				<br />
				{ city && <span className="tribe-venue__locality">{ city }</span> }
				{ city && <span className="tribe-venue__delimiter">, </span> }
				{ province && <span className="tribe-venue__region">{ province }</span> }
				{ zip && <span className="tribe-venue__postal-code"> { zip }</span> }
				{ country && <span className="tribe-venue__country-name"> { country }</span> }
				{ this.renderGoogleMapLink() }
			</address>
		);
	}

	renderGoogleMapLink() {
		const { showMapLink, address } = this.props;

		if ( ! showMapLink ) {
			return null;
		}

		return (
			<a
				href={ mapLink( address ) }
				title={ __( 'Click to view a Google Map', 'events-gutenberg' ) }
				target="_blank"
			>
				{ __( '+ Google Map', 'events-gutenberg' ) }
			</a>
		);
	}

	renderPhone() {
		const { venue } = this.props;

		if ( isEmpty( venue.meta._VenuePhone ) ) {
			return null;
		}

		return (
			<React.Fragment>
				<span className="tribe-editor__venue__phone">{ venue.meta._VenuePhone }</span>
				<br />
			</React.Fragment>
		);
	}

	renderWebsite() {
		const { venue } = this.props;
		if ( isEmpty( venue.meta._VenueURL ) ) {
			return null;
		}

		return (
			<React.Fragment>
				<span className="tribe-editor__venue__website">{ venue.meta._VenueURL }</span>
				<br />
			</React.Fragment>
		);
	}
}
