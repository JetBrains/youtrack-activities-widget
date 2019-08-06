const QUERY_ASSIST_FIELDS = 'query,caret,styleRanges(start,length,style),suggestions(options,prefix,option,suffix,description,matchingStart,matchingEnd,caret,completionStart,completionEnd,group,icon)';

export async function underlineAndSuggest(fetchYouTrack, query, caret, folder) {
  return await fetchYouTrack(`api/search/assist?fields=${QUERY_ASSIST_FIELDS}`, {
    method: 'POST',
    body: {query, caret, folder}
  });
}

export async function queryUsers(fetchHub, query) {
  return fetchHub('api/rest/users', {
    query: {
      query,
      fields: 'id,name,profile(avatar(url))',
      orderBy: 'login',
      $top: 10
    }
  });
}

const CHANGE = 'id,name,text';
const ADD = `added(${CHANGE})`;
const REM = `removed(${CHANGE})`;
const AUTHOR = 'author(id,login,email,fullName,avatarUrl,ringId,online)';
const ISSUE = 'id,idReadable,summary,resolved';
const TARGET = `target(${ISSUE},issue(${ISSUE}))`;
const AUTHOR_GROUP = 'authorGroup(name,icon)';
// eslint-disable-next-line max-len
const ACTIVITIES_FIELDS = `id,timestamp,category(id),${TARGET},${AUTHOR},${ADD},${REM},${AUTHOR_GROUP}`;
// eslint-disable-next-line max-len
const CATEGORIES = 'CommentsCategory,AttachmentsCategory,AttachmentRenameCategory,CustomFieldCategory,DescriptionCategory,IssueCreatedCategory,IssueResolvedCategory,LinksCategory,ProjectCategory,IssueVisibilityCategory,SprintCategory,SummaryCategory,TagsCategory,VcsChangeCategory';

export async function loadActivities(fetchYouTrack, author, query, start, end) {
  const packSize = 50;
  const skipSize = 0; //TODO implement paging
  const params = [
    `fields=${ACTIVITIES_FIELDS}`,
    `categories=${CATEGORIES}`,
    `$top=${packSize}`,
    `$skip=${skipSize}`,
    'reverse=true',
    author && `author=${author.id}`,
    query && `issueQuery=${encodeURIComponent(query)}`,
    start && `start=${start}`,
    end && `end=${end}`
  ];
  const paramsStr = params.filter(p => !!p).join('&');
  return await fetchYouTrack(`api/activities?${paramsStr}`);
}
