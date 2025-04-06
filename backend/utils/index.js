


export const checkOwnership =(resourceOwnerId,currentUserId) =>{

    return resourceOwnerId.toString() === currentUserId.toString();
}