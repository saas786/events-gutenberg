/**
 * External dependencies
 */
import { createSelector } from 'reselect';

export const getUI = ( state ) => state.ui;

export const getDashboardOpen = createSelector(
	[ getUI ],
	( ui ) => ui.dashboardDateTimeOpen
);

export const getVisibleMonth = createSelector(
	[ getUI ],
	( ui ) => ui.visibleMonth
);