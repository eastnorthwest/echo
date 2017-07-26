import findMemberUsers from 'src/server/actions/findMemberUsers'
import addMemberToPoolInCycle from 'src/server/actions/addMemberToPoolInCycle'
import {Phase, getLatestCycleForChapter} from 'src/server/services/dataService'
import {GOAL_SELECTION} from 'src/common/models/cycle'

export function start() {
  const jobService = require('src/server/services/jobService')
  jobService.processJobs('memberPhaseChanged', processMemberPhaseChangeCompleted)
}

export async function processMemberPhaseChangeCompleted({old_val: oldMember, new_val: newMember}) {
  const chatService = require('src/server/services/chatService')

  const memberUser = (await findMemberUsers([newMember.id]))[0]
  const newPhase = await Phase.get(newMember.phaseId)

  // invite the member to the new phase channel and send welcome message
  await chatService.inviteToChannel(newPhase.channelName, [memberUser.handle])
  await chatService.sendDirectMessage(memberUser.handle, _phaseWelcomeMessage(newPhase))

  // update voting pools if voting is still open for the cycle
  const currentCycle = await getLatestCycleForChapter(newMember.chapterId)
  if (currentCycle.state === GOAL_SELECTION) {
    if (oldMember.phaseId) {
      // TODO: remove from voting pool and delete submitted votes (if any)
    }
    if (newPhase.hasVoting === true) {
      const poolMember = await addMemberToPoolInCycle(currentCycle, newMember)
      console.log(`Member ${poolMember.memberId} added to pool ${poolMember.poolId}`)
    }
  }
}

function _phaseWelcomeMessage(phase) {
  return `Welcome to Phase ${phase.number}! :partyparrot:

To chat with your fellow phase members, check out the #${phase.channelName} channel.`
}
