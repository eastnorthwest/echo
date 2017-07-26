import r from '../r'

export default function getMemberById(id, options = {}) {
  return r.or(
    _getUser(r.table('members'), id, options),
    _getUser(r.table('moderators'), id, options)
  )
}

function _getUser(table, id, queryOptions) {
  const options = Object.assign({
    mergeChapter: false,
  }, queryOptions || {})
  const member = table.get(id)
  return r.branch(
    member.eq(null),
    member,
    options.mergeChapter ?
      member
        .merge({chapter: r.table('chapters').get(r.row('chapterId'))})
        .without('chapterId') :
      member
  )
}
