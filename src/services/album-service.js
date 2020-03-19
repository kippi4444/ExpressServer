const Album = require('../models/album');
const User = require('../models/user');
const Photo = require('../models/photo');
const fs = require('fs');

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

class AlbumService {

    static async add (body) {
        const user = await  User.findOne({_id: body.owner});

        if (!user) {
            throw new Error("Owner not found!");
        }

        const album = new Album(body);
        await album.save();
        return album._id;
    }

    static async update (req){
        const album = await Album.findOneAndUpdate({_id: req.params.id}, req.body);
        const unwindAlbum = await this.getAlbum(album._id.toString());
        return unwindAlbum;
    }

    static async del(id){
        const photos =  await Photo.find({album: id});
        try {
            await Photo.deleteMany({album: id.toString()});
            await Album.deleteOne({_id: id.toString()});
            for (let p of photos){
                const getUrl = p.url.replace(/files/i, `public`);
                fs.unlink(getUrl, err => {
                    console.log(err)});
            }
            return id
        }
        catch (err) {
            return err;
        }
    }

    static async getAlbum (id) {
        const photos =  await Photo.aggregate([
            {
                $match: {album: ObjectId(id)}
            },
            {
                $lookup: {
                    from: "users",
                    localField: 'owner',
                    foreignField: "_id",
                    as: "owner"
                }
            },
            {$unwind: "$owner"},
            {
                $lookup: {
                    from: "albums",
                    localField: 'album',
                    foreignField: "_id",
                    as: "album"
                }
            },
            {$unwind: "$album"},
            {
                $lookup: {
                    from: "comments",
                    localField: '_id',
                    foreignField: "photo",
                    as: "comments"
                }
            },

            {$unwind: {path: "$comments", "preserveNullAndEmptyArrays": true }},
            {
                $lookup: {
                    from: "users",
                    localField: 'comments.user',
                    foreignField: "_id",
                    as: "comments.user"
                }
            },
            {$unwind: {path: "$comments.user", "preserveNullAndEmptyArrays": true }},
            {$unset: ['comments.user.password', 'comments.user.tokens' , 'comments.user.__v']},
            {
                $group: {
                    _id : "$_id",
                    likes: {$push: "$likes"},
                    url: {$first: "$url"},
                    created_at: {$first: "$created_at"},
                    album: { $first: "$album" },
                    owner: { $first: "$owner" },
                    comments: { $push: "$comments" },
                }
            },
            {$unwind: {path:  "$likes", "preserveNullAndEmptyArrays": true }},
            {
                $project: {
                    _id: -1,
                    likes: 1,
                    url: 1,
                    created_at: 1,
                    album: 1,
                    owner: 1,
                    comments: {
                        $filter: {
                            input: "$comments",
                            as: "value",
                            cond: {  $ne : ["$$value" , {}] }
                        }
                    },
                }
            },
            {$sort: {_id: 1}},
            {$unset: ['owner.password', 'owner.tokens' , 'owner.__v']}
            ]);
        const album = await Album.aggregate([
            {
                $match: { _id: ObjectId(id) }
            },
            {
                $lookup: {
                    from: "users",
                    localField: 'owner',
                    foreignField: "_id",
                    as: "owner"
                }
            },
            { $unwind: "$owner" },
            {$unset: ['owner.password', 'owner.tokens']}
        ]);

        return { album: album[0] ,  photos}
    }

    static async getAllAlbums (login){
        const user = await User.findOne({login});

        return await Album.aggregate([
            {
                $match: { owner: user._id }
            },
            {
                $lookup: {
                    from: "photos",
                    localField: '_id',
                    foreignField: "album",
                    as: "photos"
                }
            },
            { $sort: { _id: 1} },
            {
                $lookup: {
                    from: "users",
                    localField: 'owner',
                    foreignField: "_id",
                    as: "owner"
                }
            },
            { $unwind: "$owner" },
            {$unset: ['owner.password', 'owner.tokens']}
        ]);
    }

}

module.exports = AlbumService;
