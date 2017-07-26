import {GraphQLID} from 'graphql'

import getCycleVotingResults from 'src/server/actions/getCycleVotingResults'
import {getMemberById} from 'src/server/services/dataService'
import {CycleVotingResults} from 'src/server/graphql/schemas'
import {LGNotAuthorizedError} from 'src/server/util/error'

export default {
  type: CycleVotingResults,
  args: {
    cycleId: {type: GraphQLID}
  },
  async resolve(source, {cycleId}, {rootValue: {currentUser}}) {
    // only signed-in users can view results
    if (!currentUser) {
      throw new LGNotAuthorizedError()
    }

    const member = await getMemberById(currentUser.id)
    if (!member) {
      throw new LGNotAuthorizedError()
    }

    return await getCycleVotingResults(member.chapterId, cycleId)
  }
}
