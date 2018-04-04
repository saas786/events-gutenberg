/**
 * External dependencies
 */
import { stringify } from 'querystringify';
import { values } from 'lodash'
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom'

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
const IMAGE_FORMATS = {
	// png8 or png (default) specifies the 8-bit PNG format.
	PNG: 'png',

	// png32 specifies the 32-bit PNG format.
	PNG32: 'png32',

	// gif specifies the GIF format.
	GIF: 'gif',

	// jpg specifies the JPEG compression format.
	JPG: 'jpg',

	// jpg-baseline specifies a non-progressive JPEG compression format.
	JPG_BASELINE: 'jpg-baseline',
};

const MAP_TYPES = {
	// roadmap (default) specifies a standard roadmap image, as is normally shown on the Google Maps website.
	ROADMAP: 'roadmap',

	// satellite specifies a satellite image.
	SATELLITE: 'satellite',

	// terrain specifies a physical relief map image, showing terrain and vegetation.
	TERRAIN: 'terrain',

	// hybrid specifies a hybrid of the satellite and roadmap image,
	// showing a transparent layer of major streets and place names on the satellite image.
	HYBRID: 'hybrid',
};

const IMAGE_FORMATS_VALUES = values( IMAGE_FORMATS );
const MAP_TYPES_VALUES = values( MAP_TYPES );

/**
 * A wrapper for Google's Static Maps
 *
 * @see https://developers.google.com/maps/documentation/staticmaps/intro#Overview
 *
 * @example: http://staticmapmaker.com/google/
 */
class GoogleMap extends Component {

	/**
	 * https://developers.google.com/maps/documentation/staticmaps/intro#api_key
	 */
	static ApiKey = null

	static RootStaticUrl = 'https://maps.googleapis.com/maps/api/staticmap';
	static RootEmbedUrl = 'https://www.google.com/maps/embed/v1/place';

	static ImageFormats = IMAGE_FORMATS

	static MapTypes = MAP_TYPES

	static propTypes = {
		latitude: PropTypes.string.isRequired,

		longitude: PropTypes.string.isRequired,

		size: PropTypes.shape( {
			width: PropTypes.number.isRequired,
			height: PropTypes.number.isRequired,
		} ),

		style: PropTypes.object,

		/**
		 * zoom (required if markers not present) defines the zoom level of the map,
		 * which determines the magnification level of the map.
		 *
		 * @see https://developers.google.com/maps/documentation/staticmaps/intro#Zoomlevels
		 */
		zoom: PropTypes.number.isRequired,

		/**
		 * scale affects the number of pixels that are returned.
		 * scale=2 returns twice as many pixels as scale=1 while retaining the same coverage area and level of detail
		 * The default value is calculated from the screen PixelRatio.
		 */
		scale: PropTypes.number,

		/**
		 * @see https://developers.google.com/maps/documentation/staticmaps/intro#ImageFormats
		 */
		format: PropTypes.oneOf( IMAGE_FORMATS_VALUES ),

		/**
		 * @see https://developers.google.com/maps/documentation/staticmaps/intro#MapTypes
		 */
		mapType: PropTypes.oneOf( MAP_TYPES_VALUES ),

		/**
		 * Add a marker on the center
		 */
		hasCenterMarker: PropTypes.bool,
	}

	static defaultProps = {
		format: IMAGE_FORMATS.JPG,
		mapType: MAP_TYPES.ROADMAP,
		hasCenterMarker: true,
		style: {},
		scale: 2,
		interactive: false,
	}

	constructor() {
		super( ...arguments );

		this.state = {
			latitude: this.props.latitude,
			longitude: this.props.longitude,
		}
	}

	componentDidUpdate() {
		this.loadMap()
	}

	loadMap() {
		const {
			latitude,
			longitude,
			zoom,
			size,
		} = this.props;

		const google = window.google;
		const maps = google.maps;

		const mapRef = this.refs.map;
		const node = ReactDOM.findDOMNode( mapRef );
		const location = {
			lat: parseFloat( latitude ),
			lng: parseFloat( longitude ),
		}

		const mapConfig = {
			center: location,
			zoom: zoom,
			mapTypeId: 'roadmap'
		}

		this.map = new maps.Map( node, mapConfig );
		const marker = new google.maps.Marker( {
			position: location,
			map: this.map,
		} );
	}

	renderInteractive() {
		return (
			<div
				className='tribe-editor-map__element'
				ref="map"
			>
				<Placeholder key="placeholder">
					<Spinner />
				</Placeholder>
			</div>
		)
	}

	render() {
		let mapElement = (
			<Placeholder style={{ height: '100%' }}>
				<p>{ __( 'No map preview available', 'the-events-calendar' ) }</p>
			</Placeholder>
		)

		const {
			interactive,
			apiKey,
		} = this.props;

		if ( apiKey ) {
			if ( ! interactive ) {
				mapElement = (
					<img
						className='tribe-editor-map__element'
						src={ this.mapUrl }
					/>
				)
			} else {
				mapElement = this.renderInteractive();
			}
		}

		return (
			<div className='tribe-editor-map__container'>
				{ mapElement }
			</div>
		);
	}

	get mapUrl() {
		const {
			latitude,
			longitude,
			zoom,
			size,
			scale,
			format,
			mapType,
			apiKey,
			interactive,
		} = this.props;

		const { width, height } = size;

		let queryArgs = {
			zoom: zoom,
			maptype: mapType,
			key: apiKey,
		}
		let rootUrl = null;

		if ( interactive ) {
			rootUrl = this.constructor.RootEmbedUrl;

			queryArgs.q = `${latitude},${longitude}`;
		} else {
			rootUrl = this.constructor.RootStaticUrl;

			queryArgs.center = `${latitude},${longitude}`;
			queryArgs.scale = scale;
			queryArgs.size = `${width}x${height}`;
			queryArgs.format = format;
			queryArgs.markers = this.markerParams;
		}

		return `${rootUrl}?${ stringify( queryArgs ) }`;
	}

	get markerParams() {
		const {
			latitude,
			longitude,
			hasCenterMarker,
		} = this.props;

		const markerParams = `size:mid|color:0xff0000|label:|${latitude},${longitude}`;
		return hasCenterMarker ? markerParams : '';
	}
}

export default GoogleMap;