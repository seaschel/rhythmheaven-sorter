// 2008/7/3 Scripted by K-Factory@migiwa
// 2009/1/27 Modified by K-Factory@migiwa
// 2014/6/29 Modified by nkeronkow
// 2018/11/26 Added to relick's github, changes tracked there
// github.com/relick/RhythmGames-song-sorter

// *****************************************************************************
"use strict";
const str_CenterT = 'Tie!';
const str_CenterB = 'Undo last choice';

const str_ImgPath = 'images/';
const str_YouPath = 'https://www.youtube.com/embed/';
const str_YouLink = 'https://www.youtube.com/watch?v=';

// Up to which position should images be shown for?
var int_ResultRank = 3;

// Maximum number of result rows before being broken off into another table.
var maxRows = 42;

// Letty waz here
const deepFreeze = obj => {
	Object.keys(obj).forEach(prop => {
		if (typeof obj[prop] === 'object') deepFreeze(obj[prop]);
	}); return Object.freeze(obj);
};

// * Game and album titles
// name: used during the sort and in the final result table
// abbrev: abbreviated form (also used during the sort and in the final result table)
// selectionName: used in the initial option table for selecting which titles to sort over
const TITLE = deepFreeze({
	GBA: { name: "Rhythm Tengoku (GBA)", image: "fZ2BDUV.jpg", shortName: "Rhythm Tengoku", abbrev: "GBA", },
	GBAREMIX: { name: "Rhythm Heaven (GBA)", image: "XHi6YmD.jpg", shortName: "Rhythm Tengoku", abbrev: "GBAREMIX", },
	GBAXTRA: { name: "Rhythm Heaven (GBA)", image: "XHi6YmD.jpg", shortName: "Rhythm Tengoku", abbrev: "GBAXTRA", },
	DS: { name: "Rhythm Heaven (DS)", image: "XHi6YmD.jpg", shortName: "Rhythm Heaven", abbrev: "DS", },
	DSREMIX: { name: "Rhythm Heaven (DS)", image: "XHi6YmD.jpg", shortName: "Rhythm Heaven", abbrev: "DSREMIX", },
	DSXTRA: { name: "Rhythm Heaven (DS)", image: "XHi6YmD.jpg", shortName: "Rhythm Heaven", abbrev: "DSXTRA", },
	FEVER: { name: "Rhythm Heaven Fever (Wii)", image: "Imp5ltX.jpg", shortName: "Rhythm Heaven Fever", abbrev: "FEVER", },
	FEVEREMIX: { name: "Rhythm Heaven Fever (Wii)", image: "Imp5ltX.jpg", shortName: "Rhythm Heaven Fever", abbrev: "FEVEREMIX", },
	FEVERXTRA: { name: "Rhythm Heaven Fever (Wii)", image: "Imp5ltX.jpg", shortName: "Rhythm Heaven Fever", abbrev: "FEVERXTRA", },
	MEGAMIX: { name: "Rhythm Heaven Megamix (3DS)", image: "9Bgvih5.jpg", shortName: "Rhythm Heaven Megamix", abbrev: "MEGAMIX", },
	MEGAREMIX: { name: "Rhythm Heaven Megamix (3DS)", image: "9Bgvih5.jpg", shortName: "Rhythm Heaven Megamix", abbrev: "MEGAREMIX", },
	MEGAXTRA: { name: "Rhythm Heaven Megamix (3DS)", image: "9Bgvih5.jpg", shortName: "Rhythm Heaven Megamix", abbrev: "MEGAXTRA", },
});

const getTitleData = function (songTitleDataObj) {
	// We'll have to handle individual song overrides either way (mostly going to be coming from old saved data)

	const titleData = TITLE[songTitleDataObj.title];

	if (!songTitleDataObj.ExtraGames) {
		return {
			name: titleData.name,
			image: songTitleDataObj.image || titleData.image,
			shortName: songTitleDataObj.shortName || titleData.shortName,
			abbrev: songTitleDataObj.abbrev || titleData.abbrev,
		};
	}

	// Also handle ExtraGames overrides
	const extraTitleData = EXTRA_TITLES[songTitleDataObj.ExtraGames];
	return {
		name: titleData.name,
		image: songTitleDataObj.image || extraTitleData.image || titleData.image,
		shortName: songTitleDataObj.shortName || extraTitleData.shortName || titleData.shortName,
		abbrev: songTitleDataObj.abbrev || extraTitleData.abbrev || titleData.abbrev,
	};
}

const CATEGORY = deepFreeze({
	RhythmGames: { name: "Rhythm Games", titles: ["GBA", "DS", "FEVER", "MEGAMIX"], },
	Remixes: { name: "Remixes", titles: ["GBAREMIX", "DSREMIX", "FEVEREMIX", "MEGAREMIX"], },
	ExtraGames: { name: "Extra Games", titles: ["GBAXTRA", "DSXTRA", "FEVERXTRA", "MEGAXTRA"], }
});

// Number of columns in the selection list.
var int_Colspan = 3;

// * Music information
// [Index: Meaning]
// 0: Track name
const TRACK_NAME = 0;
// 1: Set of titles that this track appears in
const TRACK_TITLES = 1;
// 2: Object specifying the title to draw data from, and any overrides
const TRACK_TITLE_DATA = 2;
// 3: Youtube video ID
const TRACK_YOUTUBE_ID = 3;
// 4: Description of track
const TRACK_DESCRIPTION = 4;
// 5: If the *exact* same track appears in a later game then it should use [1] to specify rather than setting as arrangement.
const TRACK_IS_ARRANGED = 5;
	const ORIGINAL_GAME = 0;
	const REUSED_GAME = 1;
// 6: Track type, Album tracks should all be marked as OTHER_THEME.
const TRACK_TYPE = 6;
	const RhythmGames = 0;
	const Remixes = 1;
	const ExtraGames = 2;
	const ReusedGame = 3;

// Old song data format, for transitioning old save data
// 2: Image filename
const LEGACY_TRACK_IMAGE = 2;
// 4: Title (game/album) name
const LEGACY_TRACK_TITLE_NAME = 4;
// 5: Title (game/album) abbreviation
const LEGACY_TRACK_TITLE_ABBREV = 5;

var ary_SongData = [
	["NAME",	new Set([TITLE.GBA, TITLE.DS]), { title: "GBA", }, "IWcJtankEr4", "Title Screen", ORIGINAL_TRACK, OTHER_THEME],
	["NAME2",	new Set([TITLE.GBA, TITLE.DS]), { title: "GBA", }, "IWcJtankEr4", "Title Screen2", ORIGINAL_TRACK, OTHER_THEME],
];
