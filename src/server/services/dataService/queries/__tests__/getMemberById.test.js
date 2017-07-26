/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */

import factory from 'src/test/factories'
import {resetDB} from 'src/test/helpers'

import getMemberById from '../getMemberById'

describe(testContext(__filename), function () {
  beforeEach(resetDB)

  it('returns a member if present', async function () {
    const member = await factory.create('member')
    const matchedMember = await getMemberById(member.id)
    expect(matchedMember.id).to.eq(member.id)
  })

  it('returns a moderator if present', async function () {
    const moderator = await factory.create('moderator')
    const matchedMember = await getMemberById(moderator.id)
    expect(matchedMember.id).to.eq(moderator.id)
  })

  it('returns null when no user or moderator with the given id', async function () {
    const validUUID = 'e79fd771-6f19-4b35-bfa1-57a1174964f1'
    expect(await getMemberById(validUUID)).to.be.null
  })
})
