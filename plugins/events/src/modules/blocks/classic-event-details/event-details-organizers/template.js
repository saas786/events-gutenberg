/**
 * External dependencies
 */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Dropdown, IconButton, Dashicon } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { OrganizerForm, SearchPosts } from '@moderntribe/events/elements';
import EventDetailsOrganizer from './event-details-organizer/container';
import { ORGANIZER } from '@moderntribe/events/editor/post-types';

const EventDetailsOrganizers = ( props ) => {
	const renderDropdownToggle = ( { onToggle } ) => (
		<IconButton
			className="tribe-editor__btn"
			label={ __( 'Create Organizer' ) }
			onClick={ onToggle }
			icon={ <Dashicon icon="plus" /> }
		/>
	);

	const renderDropdownContent = ( { onClose, isOpen } ) => (
		<OrganizerForm
			addOrganizer={ props.addOrganizer }
			onClose={ onClose }
			aria-expanded={ isOpen }
		/>
	);

	const { addOrganizer, removeOrganizer, organizers } = props;

	return (
		<Fragment>
			<div key="organizer-list">
				<ul className={ classNames( 'tribe-editor__organizer__list' ) }>
					{ organizers.map( ( { id, block } ) => (
						<EventDetailsOrganizer
							organizerId={ id }
							block={ block }
							key={ id }
							postType={ ORGANIZER }
							onRemoveClick={ removeOrganizer }
						/>
					) ) }
				</ul>
			</div>
			<div key="organizer-actions">
				<SearchPosts
					key="organizer-search-dropdown"
					name="search-organizers-classic"
					postType={ ORGANIZER }
					searchLabel={ __( 'Search for an organizer', 'events-gutenberg' ) }
					iconLabel={ __( 'Add existing Organizer', 'events-gutenberg' ) }
					onItemSelect={ addOrganizer }
					exclude={ organizers.map( ( { id } ) => id ) }
				/>
				<Dropdown
					key="organizer-create-dropdown"
					className="tribe-editor__organizer__dropdown"
					position="bottom center"
					contentClassName="tribe-editor-dropdown__dialog"
					renderToggle={ renderDropdownToggle }
					renderContent={ renderDropdownContent }
				/>
			</div>
		</Fragment>
	);
};

EventDetailsOrganizers.propTypes = {
	organizers: PropTypes.array.isRequired,
	addOrganizer: PropTypes.func.isRequired,
	removeOrganizer: PropTypes.func.isRequired,
};

export default EventDetailsOrganizers;
