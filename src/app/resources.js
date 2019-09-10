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

const ISSUE = 'id,idReadable,summary,resolved';
const CHANGED_VALUES = [
  'id,name',
  'text',
  'urls',
  'version',
  'project(shortName),numberInProject',
  ISSUE
];
const CHANGE = CHANGED_VALUES.join(',');
const ADD = `added(${CHANGE})`;
const REM = `removed(${CHANGE})`;
const AUTHOR = 'author(id,login,email,fullName,avatarUrl,ringId,online)';
const TARGET = `target(${ISSUE},issue(${ISSUE}))`;
const AUTHOR_GROUP = 'authorGroup(name,icon)';
const FIELD = 'field(presentation,customField(name,fieldType(valueType,isMultiValue)))';
// eslint-disable-next-line max-len
const ACTIVITIES_FIELDS = `id,timestamp,category(id),${TARGET},${AUTHOR},${ADD},${REM},${AUTHOR_GROUP},${FIELD}`;
// eslint-disable-next-line max-len
const ALL_CATEGORIES = 'CommentsCategory,AttachmentsCategory,AttachmentRenameCategory,CustomFieldCategory,DescriptionCategory,IssueCreatedCategory,IssueResolvedCategory,LinksCategory,ProjectCategory,IssueVisibilityCategory,SprintCategory,SummaryCategory,TagsCategory,VcsChangeCategory';

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

const ACTIVITIES_FIELDS_PAGE = `beforeCursor,hasBefore,afterCursor,hasAfter,activities(${ACTIVITIES_FIELDS})`;

export async function loadActivitiesPage(fetchYouTrack, params) {
  const packSize = 50;
  const categories = params.categories && params.categories.join(',');
  const queryParams = [
    `fields=${ACTIVITIES_FIELDS_PAGE}`,
    `categories=${categories || ALL_CATEGORIES}`,
    `$top=${packSize}`,
    'reverse=true',
    params.cursor && `cursor=${encodeURIComponent(params.cursor)}`,
    params.author && `author=${params.author.id}`,
    params.query && `issueQuery=${encodeURIComponent(params.query)}`
  ];
  const queryParamsStr = queryParams.filter(p => !!p).join('&');
  return await fetchYouTrack(`api/activitiesPage?${queryParamsStr}`);
}
