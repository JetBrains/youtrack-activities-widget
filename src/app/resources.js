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

const CHANGE = 'id,name,text,fullName';
const ADD = `added(${CHANGE})`;
const REM = `removed(${CHANGE})`;
const AUTHOR = 'author(id,login,email,fullName,avatarUrl,ringId,online)';
const ISSUE = 'id,idReadable,summary,resolved';
const TARGET = `target(${ISSUE},issue(${ISSUE}))`;
const AUTHOR_GROUP = 'authorGroup(name,icon)';
const FIELD = 'field(customField(name,fieldType(valueType,isMultiValue)))';
// eslint-disable-next-line max-len
const ACTIVITIES_FIELDS = `id,timestamp,category(id),${TARGET},${AUTHOR},${ADD},${REM},${AUTHOR_GROUP},${FIELD}`;
// eslint-disable-next-line max-len
const ALL_CATEGORIES = 'CommentsCategory,AttachmentsCategory,AttachmentRenameCategory,CustomFieldCategory,DescriptionCategory,IssueCreatedCategory,IssueResolvedCategory,LinksCategory,ProjectCategory,IssueVisibilityCategory,SprintCategory,SummaryCategory,TagsCategory,VcsChangeCategory';

// eslint-disable-next-line max-len
export async function loadActivities(fetchYouTrack, params) {
  const packSize = 50;
  const skipSize = 0; //TODO implement paging
  const categories = params.categories && params.categories.join(',');
  const queryParams = [
    `fields=${ACTIVITIES_FIELDS}`,
    `categories=${categories || ALL_CATEGORIES}`,
    `$top=${packSize}`,
    `$skip=${skipSize}`,
    'reverse=true',
    params.author && `author=${params.author.id}`,
    params.query && `issueQuery=${encodeURIComponent(params.query)}`,
    params.start && `start=${params.start}`,
    params.end && `end=${params.end}`
  ];
  const queryParamsStr = queryParams.filter(p => !!p).join('&');
  return await fetchYouTrack(`api/activities?${queryParamsStr}`);
}
