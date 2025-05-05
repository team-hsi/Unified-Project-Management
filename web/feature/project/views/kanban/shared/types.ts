export interface MoveItemParams {
  movedItemIndexInSourceBucket: number;
  sourceBucketId: string;
  destinationBucketId: string;
  movedItemIndexInDestinationBucket: number;
}

export interface ReorderBucketParams {
  bucketId: string;
  startIndex: number;
  finishIndex: number;
}
