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
const CATEGORIES = 'CommentsCategory,AttachmentsCategory,AttachmentRenameCategory,CustomFieldCategory,DescriptionCategory,IssueCreatedCategory,IssueResolvedCategory,LinksCategory,ProjectCategory,IssueVisibilityCategory,SprintCategory,SummaryCategory,TagsCategory,VcsChangeCate';

export async function loadActivities(fetchYouTrack, author, query, start, end) {
  const packSize = 50;
  const skipSize = 0; //TODO implement paging
  const fields = `fields=${ACTIVITIES_FIELDS}`;
  const categories = `&categories=${CATEGORIES}`;
  const authorId = author ? `&author=${author.id}` : '';
  const issueQuery = query ? `&issueQuery=${encodeURIComponent(query)}` : '';
  const startParam = start ? `&start=${start}` : '';
  const endParam = start ? `&end=${end}` : '';
  const top = `&$top=${packSize}`;
  const skip = `&$skip=${skipSize || 0}`;
  const reverse = '&reverse=true';
  return await fetchYouTrack(
    `api/activities?${fields}${categories}${authorId}${issueQuery}${startParam}${endParam}${top}${skip}${reverse}`
  );
}
