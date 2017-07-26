import {ADMIN, MEMBER} from 'src/common/models/user'

const GENERAL_USE = [
  ADMIN,
  MEMBER,
]

const CAPABILITY_ROLES = {
  listChapters: [ADMIN],
  findChapters: [ADMIN],
  createChapter: [ADMIN],
  updateChapter: [ADMIN],
  createInviteCode: [ADMIN],
  reassignMembersToChapter: [ADMIN],

  createCycle: [ADMIN],
  launchCycle: [ADMIN],
  updateCycle: [ADMIN],
  deleteProject: [ADMIN],
  viewCycleVotingResults: GENERAL_USE,

  importProject: [ADMIN],
  updateProject: [ADMIN],
  listProjects: GENERAL_USE,
  findProjects: GENERAL_USE,
  viewProject: GENERAL_USE,
  viewProjectSummary: GENERAL_USE,
  viewProjectMemberSummary: [ADMIN],
  setProjectArtifact: GENERAL_USE,

  viewMember: GENERAL_USE,
  viewMemberFeedback: [ADMIN],
  viewMemberSummary: GENERAL_USE,
  listMembers: GENERAL_USE,
  findMembers: GENERAL_USE,
  updateMember: [ADMIN],
  deactivateMember: [ADMIN],

  saveResponse: GENERAL_USE,
  getRetrospectiveSurvey: GENERAL_USE,
  findRetrospectiveSurveys: GENERAL_USE,
  lockAndUnlockSurveys: [ADMIN],

  viewSensitiveReports: [ADMIN],
  monitorJobQueues: [ADMIN],
}

export const VALID_ROLES = Object.keys(CAPABILITY_ROLES).map(capability => {
  return CAPABILITY_ROLES[capability]
}).reduce((prev, curr) => {
  return [...new Set(prev.concat(curr))]
}, [])

export default function userCan(currentUser, capability) {
  if (!currentUser) {
    return false
  }
  const {roles} = currentUser
  if (!roles) {
    return false
  }
  if (!CAPABILITY_ROLES[capability]) {
    throw new Error(`No such capability '${capability}'`)
  }
  const permitted = roles.filter(role => (
    CAPABILITY_ROLES[capability].indexOf(role) >= 0
  )).length > 0

  return permitted
}
