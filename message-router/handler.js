import { facade } from './facade';

export const entry = async (event, context, callback) => {
  try {
    const resultMessage = await facade(event.body.payload);
    callback(null, {
      statusCode : 200,
      body       : JSON.parse(resultMessage),
    });
  } catch (err) {
    callback(err);
  }
};
