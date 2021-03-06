/**
 * External dependencies
 */
import { createSelector } from 'reselect';

export const datetimeSelector = ( state ) => state.events.blocks.datetime;

export const getStart = createSelector(
	[ datetimeSelector ],
	( datetime ) => datetime.start
);

export const getEnd = createSelector(
	[ datetimeSelector ],
	( datetime ) => datetime.end
);

export const getAllDay = createSelector(
	[ datetimeSelector ],
	( datetime ) => datetime.allDay
);

export const getMultiDay = createSelector(
	[ datetimeSelector ],
	( datetime ) => datetime.multiDay
);

export const getDateSeparator = createSelector(
	[ datetimeSelector ],
	( datetime ) => datetime.dateTimeSeparator
);

export const getTimeSeparator = createSelector(
	[ datetimeSelector ],
	( datetime ) => datetime.timeRangeSeparator,
);

export const getTimeZone = createSelector(
	[ datetimeSelector ],
	( datetime ) => datetime.timeZone,
);

export const getTimeZoneVisibility = createSelector(
	[ datetimeSelector ],
	( datetime ) => datetime.showTimeZone,
);

export const getTimeZoneLabel = createSelector(
	[ datetimeSelector ],
	( datetime ) => datetime.timeZoneLabel,
);

export const getNaturalLanguageLabel = createSelector(
	[ datetimeSelector ],
	( datetime ) => datetime.naturalLanguage,
);

export const getDateInputVisibility = createSelector(
	[ datetimeSelector ],
	( datetime ) => datetime.showDateInput,
)
