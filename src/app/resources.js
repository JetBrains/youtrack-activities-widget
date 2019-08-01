const QUERY_ASSIST_FIELDS = 'query,caret,styleRanges(start,length,style),suggestions(options,prefix,option,suffix,description,matchingStart,matchingEnd,caret,completionStart,completionEnd,group,icon)';
const WATCH_FOLDERS_FIELDS = 'id,$type,name,query,shortName';

export async function loadPinnedIssueFolders(fetchYouTrack, loadAll) {
  const packSize = 100;
  return await fetchYouTrack(`api/userIssueFolders?fields=${WATCH_FOLDERS_FIELDS}&$top=${loadAll ? -1 : packSize}`);
}

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
const ACTIVITIES_FIELDS = `id,category(id),${AUTHOR_FIELDS},added(${CHANGE_FIELDS}),removed(${CHANGE_FIELDS})`;
// eslint-disable-next-line max-len
const CATEGORIES = 'CommentsCategory,AttachmentsCategory,AttachmentRenameCategory,CustomFieldCategory,DescriptionCategory,IssueCreatedCategory,IssueResolvedCategory,LinksCategory,ProjectCategory,IssueVisibilityCategory,SprintCategory,SummaryCategory,TagsCategory,VcsChangeCate';

export async function loadActivities(fetchYouTrack, query) {
  const packSize = 50;
  const skipSize = 0; //TODO implement paging
  const fields = `fields=${ACTIVITIES_FIELDS}`;
  const categories = `&categories=${CATEGORIES}`;
  const issueQuery = query ? `&issueQuery=${encodeURIComponent(query)}` : '';
  const top = `&$top=${packSize}`;
  const skip = `&$skip=${skipSize || 0}`;
  return await fetchYouTrack(
    `api/activities?${fields}${categories}${issueQuery}${top}${skip}`
  );
}
