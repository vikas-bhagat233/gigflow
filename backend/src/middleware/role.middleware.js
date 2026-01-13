export const isOwner = (resourceOwnerId, userId) => {
  return resourceOwnerId.toString() === userId;
};
