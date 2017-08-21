import {addUserToTeam} from './addUserToTeam'

export default function reactivateUser(userObject) {
  // return promise!!!!
  // get Members by userObject.userId
  // get Chapter id from members table by userId
  // get gitHub teamId from chapters table by chapter id
  addUserToTeam(userObject.username, teamId)
}

// async function _addUserToChapterGitHubTeam(userHandle, githubTeamId) {
//   console.log(`Adding ${userHandle} to GitHub team ${githubTeamId}`)
//   return logRejection(addUserToTeam(userHandle, githubTeamId), 'Error while adding user to chapter GitHub team.')
// }

// try {
//   await _addUserToChapterGitHubTeam(idmUser.handle, chapter.githubTeamId)
// } catch (err) {
//   console.error(`Unable to add member ${idmUser.id} to github team ${chapter.githubTeamId}: ${err}`)
// }
