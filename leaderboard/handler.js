import joi from 'joi';
import uuidV1 from 'uuid/v1';
import _ from 'lodash';
import {
  joiValidate, dynamoPut, dynamoScan, sanitize,
} from 'amatista-commons';

const leaderboardUpdateSchema = joi.object().keys({
  command            : joi.string().required(),
  size               : joi.number().required().min(4),
  time               : joi.number().required().min(30).max(300),
  name               : joi.string().required(),
  elapsedTime        : joi.number().required().min(0).max(300),
  percentageComplete : joi.number().required().min(0).max(100),
});

const clean = (validObject) => ({
  name : sanitize(validObject.name),
});

export const defaultMessage = (event, context, callback) => {
  callback(null, { message : 'Whoops, I can\'t understand your message!', event });
};

export const retrieveLeaderboard = async (event, context, callback) => {
  const leaderboardData = (await dynamoScan({
    TableName                : process.env.DYNAMODB_LEADERBOARD_TABLE,
  })).Items;
  const leaderboardByTime = _.groupBy(leaderboardData, 'size');
  const orderedLeaderBoard = [];
  _.each(leaderboardByTime, (scores, j) => {
    orderedLeaderBoard.push({
      size: j,
      scores: _.chain(scores).orderBy(['percentageComplete', 'elapsedTime'], ['desc', 'asc']).take(10).value(),
    })
  });
  callback(null, {leaderboardData: orderedLeaderBoard});
};

export const updateLeaderboard = async (event, context, callback) => {
  try {
    const validObject = await joiValidate(event, leaderboardUpdateSchema);
    const cleanObject = {...validObject, ...clean(validObject)};
    const scoreDate = (new Date()).getTime();
    const scoreId = uuidV1();
    const params = {
      TableName : process.env.DYNAMODB_LEADERBOARD_TABLE,
      Item      : {
        id : scoreId,
        scoreDate,
        ...cleanObject,
      },
    };
    await dynamoPut(params);
    callback(null, {scoreId});
  } catch (err) {
    callback(err);
  }
};
