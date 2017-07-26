import {FEEDBACK_TYPE_DESCRIPTORS} from 'src/common/models/feedbackType'

export default function getProjectSummary(identifier) {
  return {
    variables: {identifier},
    query: `query ($identifier: String!) {
      getProjectSummary(identifier: $identifier) {
        project {
          id
          name
          artifactURL
          retrospectiveSurveyId
          createdAt
          updatedAt
          goal {
            number
            title
            phase
            url
          }
          chapter {
            id
            name
          }
          cycle {
            id
            cycleNumber
            state
            startTimestamp
            endTimestamp
          }
          phase {
            id
            number
          }
        }
        projectMemberSummaries {
          member {
            id
            name
            handle
            avatarUrl
          }
          memberProjectEvaluations {
            ${FEEDBACK_TYPE_DESCRIPTORS.GENERAL_FEEDBACK}
          }
          memberRetrospectiveComplete
          memberRetrospectiveUnlocked
        }
      }
    }`,
  }
}
