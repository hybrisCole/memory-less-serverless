export const patternMatch = require('patrun')()
  .add({}, 'memory-less-leaderboard-dev-defaultMessage')
  .add({command : 'leaderboard:udpdate'}, 'memory-less-leaderboard-dev-updateLeaderboard')
  .add({command : 'leaderboard:retrieve'}, 'memory-less-leaderboard-dev-retrieveLeaderboard');