import React from 'react';
import { getBlockTitle } from 'notion-utils';
import { mapPageUrl } from 'lib/map-page-url';

const CustomListItem = ({ pageBlock, recordMap, site, searchParams }) => {
  const title = getBlockTitle(pageBlock, recordMap);
  const icon = pageBlock.format?.page_icon;
  const pageId = pageBlock.id;

  return (
    <a className="notion-list-item notion-page-link" href={mapPageUrl(site, recordMap, searchParams)(pageId)}>
      <div className="notion-list-item-title">
        <span className="notion-property notion-property-title">
          {icon && (
            <div className="notion-page-icon-inline notion-page-icon-image">
              <span className="notion-page-title-icon notion-page-icon" role="img" aria-label={icon}>
                {icon}
              </span>
            </div>
          )}
          <span className="notion-page-title-text">{title}</span>
        </span>
      </div>
      <div className="notion-list-item-body">
        {/* Add other properties as needed */}
      </div>
    </a>
  );
};

export default CustomListItem;