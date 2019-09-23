import React from 'react';

import Link from '@jetbrains/ring-ui/components/link/link';

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

  renderAttachmentLink(attachment, removed) {
    if (removed) {
      return (
        <span
          className="activities-widget__activity__change__removed"
          key={attachment.id}
        >
          {attachment.name}
        </span>
      );
    } else if (attachment.url) {
      const attachmentHref = `${filter.youTrackUrl}${attachment.url}`;
      const hasPreview = previewWhiteList.indexOf(attachment.mimeType);

      if (hasPreview >= 0) {
        const thumbnailURL = `${filter.youTrackUrl}${attachment.thumbnailURL}`;
        return (
          <span>
            <Link
              key={attachment.id}
              target={'_blank'}
              href={attachmentHref}
            >
              <img width={96} height={64} src={thumbnailURL}/>
            </Link>
          </span>
        );
      }
      return (
        <Link
          key={attachment.id}
          target={'_blank'}
          href={attachmentHref}
        >
          {attachment.name}
        </Link>
      );
    } else {
      return (
        <span key={attachment.id}>
          {attachment.name}
        </span>
      );
    }
  }

  // eslint-disable-next-line react/display-name
  renderContent = activity => (
    <div>
      <span className="activities-widget__activity__change__field-name activities-widget__activity__change__preview-title">
        {`${activity.field.presentation}:`}
      </span>
      <span>
        {activity.removed.map(attachment =>
          this.renderAttachmentLink(attachment, true)
        )}
        {activity.added.map(attachment =>
          this.renderAttachmentLink(attachment, false)
        )}
      </span>
    </div>
  );
}

export default ContentAttachmentActivity;
