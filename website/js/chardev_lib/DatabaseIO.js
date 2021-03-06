var DatabaseIO = new Object();

DatabaseIO._errorPrefix = "DatabaseIO: Error - ";

/**
 * @param {number} classId
 * @param {Character} character
 * @param {Handler} handler
 */
DatabaseIO.getCharacterClass = function(classId, character, handler) 
{
	Ajax.request(
		'php/interface/get_character_class.php' + TextIO.queryString({ 'class': classId, 'lang': g_settings.language}), 
		new Handler( DatabaseIO.getCharacterClass_callback, DatabaseIO) , 
		[character, handler]
	);
};

/**
 * @param {XMLHttpRequest} request
 * @param {Character} character
 * @param {Handler} handler
 */
DatabaseIO.getCharacterClass_callback = function(request, character, handler )
{
	var error = null;
	if (request.status == 200) 
	{
		error = parseInt(request.getResponseHeader("error"), 10);
		if ( !error ) 
		{
			character.setClass(new CharacterClass( eval('(' + request.responseText + ')') ));
		}
		else
		{
			TextIO.printErrorCode(error);
		}
	}
	if( handler ) {
		handler.notify([error]);
	}
};

/**
 * @param {number} raceId
 * @param {Character} character
 * @param {Handler} handler
 */
DatabaseIO.getCharacterRace = function( raceId, character, handler )
{
	Ajax.request( 
		'php/interface/get_character_race.php' + TextIO.queryString({'race': raceId, 'lang': g_settings.language}) , 
		new Handler( DatabaseIO.getCharacterRace_callback , DatabaseIO ), 
		[character,handler] 
	);
};

/**
 * @param {XMLHttpRequest} request
 * @param {Character} character
 * @param {Handler} handler
 */
DatabaseIO.getCharacterRace_callback = function(request, character, handler )
{
	var error = null;
	if (request.status == 200) 
	{
		error = parseInt(request.getResponseHeader("error"), 10);
		if ( !error ) 
		{
			character.setRace(new CharacterRace( character, eval('(' + request.responseText + ')') ));
		}
		else
		{
			TextIO.printErrorCode(error);
		}
	}
	if( handler ) {
		handler.notify([error]);
	}
};

DatabaseIO.saveWeightStats = function( weights, name, description, isPublic, overwrite, chrClassId, handler ) {
	Ajax.request( 
		'php/interface/user/save_stat_weights.php' + TextIO.queryString({
			'name': name, 
			'description': description,
			'chr_class_mask': chrClassId,
			'public': isPublic ? 1 : 0,
			'serialized': JSON.stringify(weights),
			'overwrite': overwrite ? 1 : 0
		}) , 
		new Handler( DatabaseIO.saveWeightStats_callback , DatabaseIO ), 
		[handler] 
	);
};

DatabaseIO.saveWeightStats_callback = function( request, handler ) {
	var error = "";
	var duplicate = false;
	if (request.status == 200) 
	{
		var arr = eval('(' + request.responseText + ')');
		error = arr[0];
		duplicate = arr[1];
	}
	else {
		error = "Wrong HTTP Response code: "+request.status;
	}
	if( handler ) {
		handler.notify([error,duplicate]);
	}
};

DatabaseIO.removeStatWeights = function( userId, name, handler ) {
	Ajax.request( 
			'php/interface/user/remove_stat_weights.php' + TextIO.queryString({
				'name': name, 
				'user_id': userId
			}) , 
			new Handler( DatabaseIO.removeWeightStats_callback , DatabaseIO ), 
			[handler] 
		);
};
DatabaseIO.removeWeightStats_callback = function( request, handler ) {
	var error = "";
	if (request.status == 200) 
	{
		error = eval('(' + request.responseText + ')');
	}
	else {
		error = "Wrong HTTP Response code: "+request.status;
	}
	if( handler ) {
		handler.notify([error]);
	}
};