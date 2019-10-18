import React from 'react';

import Link from '@jetbrains/ring-ui/components/link/link';
import {i18n} from 'hub-dashboard-addons/dist/localization';

import ContentDefaultActivity from './content-default-activity';
import './style/activities-widget.scss';
import filter from './activities-filter';

const previewWhiteList = [
  'image/gif',
  'image/png',
  'image/jpeg',
  'image/x-icon',
  'image/bmp',
  'image/x-windows-bmp',
  'image/tiff',
  'image/x-tiff',
  'image/webp'
];


class ContentAttachmentActivity extends ContentDefaultActivity {

  renderRemovedAttachment(activity, attachment) {
    const uniqueKey = `${activity.id}${attachment.id}`;
    return (
      <span
        className="aw__activity__attachment__header__removed"
        key={uniqueKey}
      >
        {attachment.name}
      </span>
    );
  }

  renderAddedAttachment(activity, attachment) {
    const uniqueKey = `${activity.id}${attachment.id}`;
    if (attachment.url) {
      if (!filter.hasOwnProperty('homeUrlNoContext')) {
        // eslint-disable-next-line new-cap,max-len
        filter.homeUrlNoContext = new window.URL(filter.youTrackUrl).origin;
      }

      const attachmentHref = `${filter.homeUrlNoContext}${attachment.url}`;
      const hasPreview = previewWhiteList.indexOf(attachment.mimeType);

      if (hasPreview >= 0) {
        const thumbnailURL = `${filter.homeUrlNoContext}${attachment.thumbnailURL}`;
        return (
          <div
            className="aw__activity__attachment__added-panel__thumbnail"
            key={uniqueKey}
          >
            <Link
              target={'_blank'}
              href={attachmentHref}
            >
              <img width={96} height={64} src={thumbnailURL} alt={'preview'}/>
            </Link>
          </div>
        );
      }
      return (
        <Link
          key={uniqueKey}
          target={'_blank'}
          href={attachmentHref}
        >
          {attachment.name}
        </Link>
      );
    } else {
      return (
        <span key={uniqueKey}>
          {attachment.name}
        </span>
      );
    }
  }

  // eslint-disable-next-line react/display-name
  renderContent = activity => {
    const fieldName = i18n('Attachment');
    return (
      <div className="aw__activity__attachment">
        <div className="aw__activity__attachment__header">
          <span className="aw__activity__attachment__header__field-name">
            {`${fieldName}:`}
          </span>
          {activity.removed.map(attachment =>
            this.renderRemovedAttachment(activity, attachment, true)
          )}
        </div>
        <div className="aw__activity__attachment__added-panel">
          {activity.added.map(attachment =>
            this.renderAddedAttachment(activity, attachment, false)
          )}
        </div>
      </div>
    );
  }
}

export default ContentAttachmentActivity;
