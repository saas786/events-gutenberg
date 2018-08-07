/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import {
	Spinner,
	PanelBody,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
} from '@wordpress/editor';

/**
 * Internal dependencies
 */
import {
	SearchOrCreate,
	EditLink,
} from 'elements';
import OrganizerDetails from './details';
import OrganizerForm from './details/form';
import OrganizerIcon from 'icons/organizer.svg';
import { toFields, toOrganizer } from 'elements/organizer-form/utils';

class Organizer extends Component {

	static propTypes = {
		details: PropTypes.object,
		create: PropTypes.bool,
		edit: PropTypes.bool,
		submit: PropTypes.bool,
		loading: PropTypes.bool,
		isSelected: PropTypes.bool,
		organizer: PropTypes.number,
		id: PropTypes.string,
		current: PropTypes.string,
		setPost: PropTypes.func,
		clear: PropTypes.func,
		createDraft: PropTypes.func,
		editPost: PropTypes.func,
	};

	componentDidUpdate( prevProps ) {
		const {
			isSelected,
			edit,
			create,
			setSubmit,
		} = this.props;
		const unSelected = prevProps.isSelected && ! isSelected;
		if ( unSelected && ( edit || create ) ) {
			setSubmit();
		}
	}

	formCompleted = ( body = {} ) => {
		const {
			setDetails,
			addOrganizerInClassic,
			addOrganizerInBlock,
			id,
		} = this.props;

		setDetails( body.id, body );
		addOrganizerInClassic( body.id );
		addOrganizerInBlock( id, body.id );
	};

	onSubmit = ( fields ) => (
		this.props.sendForm( toOrganizer( fields ), this.formCompleted )
	);

	renderLoading = () => (
		<div className="tribe-editor__spinner-container">
			<Spinner />
		</div>
	);

	renderForm() {
		const { fields, submit } = this.props;

		if ( submit ) {
			return this.renderLoading();
		}

		return (
			<OrganizerForm
				{ ...toFields( fields ) }
				submit={ this.onSubmit }
			/>
		);
	}

	selectItem = ( organizerID, details ) => {
		const {
			id,
			addOrganizerInBlock,
			addOrganizerInClassic,
			setDetails,
		} = this.props;

		setDetails( organizerID, details );
		addOrganizerInClassic( organizerID );
		addOrganizerInBlock( id, organizerID );
	};

	setDraftTitle = ( title ) => (
		this.props.createDraft( {
			title: {
				rendered: title,
			},
		} )
	);

	renderSearch() {
		const { id, isSelected, organizers, store, postType } = this.props;

		return (
			<SearchOrCreate
				name={ id }
				store={ store }
				postType={ postType }
				selected={ isSelected }
				icon={ <OrganizerIcon /> }
				placeholder={ __( 'Add or find an organizer', 'events-gutenberg' ) }
				onSelection={ this.selectItem }
				onSetCreation={ this.setDraftTitle }
				exclude={ organizers }
			/>
		);
	}

	edit = () => {
		const { details, editEntry } = this.props;
		editEntry( details );
	};

	remove = () => {
		const {
			id,
			organizer,
			removeOrganizerInBlock,
			volatile,
			maybeRemoveEntry,
			removeOrganizerInClassic,
			details,
		} = this.props;

		removeOrganizerInBlock( id, organizer );

		if ( volatile ) {
			maybeRemoveEntry( details );
			removeOrganizerInClassic( organizer );
		}
	};

	renderDetails() {
		const { details, volatile, isSelected } = this.props;
		return (
			<OrganizerDetails
				organizer={ details }
				volatile={ volatile }
				selected={ isSelected }
				edit={ this.edit }
				remove={ this.remove }
			/>
		);
	}

	renderContent() {
		const { details, edit, create, loading } = this.props;

		if ( loading ) {
			return this.renderLoading();
		}

		if ( edit || create ) {
			return this.renderForm();
		}

		if ( isEmpty( details ) ) {
			return this.renderSearch();
		}

		return this.renderDetails();
	}

	renderBlock() {
		return (
			<section key={ this.props.id }>
				{ this.renderContent() }
			</section>
		);
	}

	renderSettings() {
		const { isSelected, organizer } = this.props;

		return (
			isSelected &&
			organizer &&
			<InspectorControls key="inspector">
				<PanelBody title={ __( 'Venue Map Settings' ) }>
					<EditLink
						id={ organizer }
						label={ __( 'Edit Organizer', 'events-gutenberg' ) }
					/>
				</PanelBody>
			</InspectorControls>
		);
	}

	render() {
		return [
			this.renderBlock(),
			this.renderSettings(),
		];
	}

}

export default Organizer;
