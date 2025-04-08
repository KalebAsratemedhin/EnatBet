


export const checkOwnership =(resourceOwnerId,currentUserId) =>{
    console.log(resourceOwnerId);
    return resourceOwnerId.toString() === currentUserId.toString();
}