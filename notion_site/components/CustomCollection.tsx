import React from 'react';
import { CollectionViewProps } from 'react-notion-x';
import CustomListItem from './CustomListItem';
import { site } from 'lib/config';

interface ExtendedCollectionViewProps extends CollectionViewProps {
    block: any; // replace 'any' with the actual type of 'block'
    ctx: any; // replace 'any' with the actual type of 'ctx'
}

const CustomCollection: React.FC<ExtendedCollectionViewProps> = (props) => {
    const { block, ctx } = props;
    const { recordMap } = ctx;
    const collectionId = block.collection_id;

    console.log(block);

    if (!block.view_ids || block.view_ids.length === 0) {
        return null;
    }

    const collectionViewId = block.view_ids[0];
  
    const collection = recordMap.collection[collectionId]?.value;
    const collectionView = recordMap.collection_view[collectionViewId]?.value;
  
    if (!collection || !collectionView) {
      return null;
    }
  
    const pageBlockIds = collectionView.page_sort || [];
  
    console.log('pageBlockIds', pageBlockIds);

    const searchParams = new URLSearchParams();
  
    return (
      <div className="notion-collection">
        <div className="notion-collection-header">
          <h3 className="notion-collection-title">{collection.name}</h3>
        </div>
        <div className="notion-collection-card-list">
            {pageBlockIds.map((pageId) => {
            const pageBlock = recordMap.block[pageId]?.value;
            console.log('pageBlock', pageBlock);
            if (!pageBlock) return null;
            return <CustomListItem key={pageId} pageBlock={pageBlock} recordMap={recordMap} site={site} searchParams={searchParams} />;
            })}
        </div>
      </div>
    );
};
export default CustomCollection;
