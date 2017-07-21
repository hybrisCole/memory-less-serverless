import AWS from 'aws-sdk';
const lambda = new AWS.Lambda();

export const invoker = (functionName, payload) => new Promise((resolve, reject) => {
  const params = {
    FunctionName : functionName,
    Payload      : JSON.stringify(payload),
  };
  lambda.invoke(params, (err, data) => {
    if (err) {
      reject(err);
    }
    resolve(JSON.stringify(JSON.parse(data.Payload)));
  });
});
