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

const CHANGE_FIELDS = 'id,name';
const AUTHOR_FIELDS = 'author(id,login)';
// eslint-disable-next-line max-len
const ACTIVITIES_FIELDS = `id,timestamp,category(id),target(id,idReadable),${AUTHOR_FIELDS},added(${CHANGE_FIELDS}),removed(${CHANGE_FIELDS})`;
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
