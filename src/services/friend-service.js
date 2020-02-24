const Friend = require('../models/friend');
const Request = require('../models/friendRequest');
const User = require('../models/user');


class FriendServices {

    async add (req) {

        const friendRequest = await Request.findOne({$or: [
                {owner: req.body.owner, friend: req.body.friend },
                {owner: req.body.friend, friend: req.body.owner }
            ]});

        const userHavethisFriend = await Friend.findOne({$or: [
            {owner: req.body.owner, friend: req.body.friend },
            {owner: req.body.friend, friend: req.body.owner }
            ]});

        if (userHavethisFriend){
            throw new Error("It is your Friend!");
        }

        if (!friendRequest){
            const reqForFriends = new Request({friend: req.body.friend , owner: req.body.owner });
            await  reqForFriends.save();
            return reqForFriends;
        } else if(friendRequest.friend === req.user._id) {
            throw new Error("Requset send!");
        } else  {

        const friend = new Friend({friend: req.body.friend, owner: req.body.owner });
        const ownerFriend = new Friend({friend: req.body.owner, owner: req.body.friend });
        await friend.save();
        await ownerFriend.save();
        this.delReq(friendRequest._id);
        return friend;
        }
    }

    async delReq(id){
        await Request.deleteOne({_id: id});
        return "deleted"
    }

    async delFriend(id){
        await Friend.deleteOne({owner: id.toString()});
        await Friend.deleteOne({friend: id.toString()});
        return "deleted"
    }

    async getAllReq (user) {

        return await Request.aggregate([
            {
                $match: {owner: user._id}
            },
            {
                $lookup: {
                    from: "users",
                    localField: 'friend',
                    foreignField: "_id",
                    as: "friend"
                }
            },
            {
                $lookup: {
                    from: "photos",
                    localField: 'friend.avatar',
                    foreignField: "album",
                    as: "photos"
                }
            },
            {
                $unset: ["friend.tokens", "friend.__v",
                    "friend.password", "friend.created_at",
                    "friend.updatedAt",  "__v",
                    "created_at" , "updatedAt"]
            },
            {$unwind: "$friend" },
        ]);
    }

    async getAllFriends (login){

        const user = await User.findOne({login});

        return await Friend.aggregate([
            {
                $match: {owner: user._id}
            },
            {
                $lookup: {
                    from: "users",
                    localField: 'friend',
                    foreignField: "_id",
                    as: "friend"
                }
            },
            {
                $lookup: {
                    from: "photos",
                    localField: 'friend.avatar',
                    foreignField: "album",
                    as: "photos"
                }
            },
            {
                $unset: ["friend.tokens", "friend.__v",
                    "friend.password", "friend.created_at",
                    "friend.updatedAt",  "__v",
                    "created_at" , "updatedAt"]
            },
            {$unwind: "$friend" },
        ]);
    }

}

module.exports = new FriendServices;
