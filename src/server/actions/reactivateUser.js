import config from 'src/config'
import getUser from 'src/server/actions/getUser'
import {addCollaboratorToApps} from 'src/server/services/herokuService'
import {reactivateUser as reactivateChatUser} from 'src/server/services/chatService'
import {reactivateUser as reactivateGitHubUser} from 'src/server/services/gitHubService'
import {logRejection} from 'src/server/util'
import graphQLFetcher from 'src/server/util/graphql'

const losPermissions = (config.losPermissions || {})

export default async function reactivateUser(userId) {
  const user = await getUser(userId)
  const memberHerokuApps = (losPermissions.heroku || {}).apps || []
  await logRejection(reactivateGitHubUser(userId), 'Error while adding user to GitHub.')
  await logRejection(addCollaboratorToApps(user, memberHerokuApps), 'Error while adding user to Heroku apps.')
  await logRejection(reactivateChatUser(userId), 'Error while reactivating user in the chat system.')

  const {data: {reactivateUser: updatedUser}} = await _reactivateUserInIDM(userId)

  return updatedUser
}

function _reactivateUserInIDM(userId) {
  const mutation = {
    query: 'mutation ($memberId: ID!) { reactivateUser(id: $memberId) { id active handle } }',
    variables: {memberId: userId},
  }
  return graphQLFetcher(config.server.idm.baseURL)(mutation)
}
