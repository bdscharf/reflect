var express = require('express');
var router = express.Router();
var queries = require(path.join(__dirname + '/queries'));

calculateChange = (level, oldData, newData) =>
{
	const MULT_TEN = 0.25;
	const FIRST = 0.5;
	const REGULAR = 0.1;

	var newLevel = level;

	var dLogins = newData.logins - oldData.logins;
	var dPosts = newData.posts - oldData.posts;
	var dGoals = newData.goals - oldData.goals;

	var oldVals = [oldData.logins, oldData.posts, oldData.goals];
	var newVals = [newData.logins, newData.posts, newData.goals];
	var dVals = [dLogins, dPosts, dGoals];

	for (var item = 0; item < lVals.length; item ++)
	{
		// multiple of 10
		if (newVals[item] != 0 && newVals[item] % 10 == 0)
		{
			newLevel += MULT_TEN;
		}
		// first time
		if (newVals[item] == 0)
		{
			newLevel += FIRST;
		}

		newLevel += dVals[item] * REGULAR;
	}

	return newLevel;
}

var changeLevel = (uname, nlevel, nlogins, nposts, ngoals) =>
{
	var newData =
	{
		logins: nlogins,
		posts: nposts,
		goals: ngoals
	};
	queries.getUserData(uname, (response) =>
	{
		if (oldData)
		{
			var newLevel = calculateChange(nlevel, oldData, newData);

			queries.updateLevel(newLevel, uname, (success) =>
			{
				if (!success)
				{
					console.log("ERROR: Failed to update user level.");
				}
			});
		}
		else
		{
			console.log("ERROR: Failed to get user level information.");
		}
	});
}

exports.changeLevel = changeLevel;

