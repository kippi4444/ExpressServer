const fs = require('fs');
const Photo = require('../models/photo');
const User = require('../models/user');
const Album = require('../models/album');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

class PhotoServices {

     async add (req) {
        const user = await  User.findOne({_id: req.user._id});
        if (!user) {
            throw new Error("Owner not found!");
        }
        let photos = [];
        req.files.map( data => {
         const getUrl = data.path.replace(/public/i, `files`);
            const photo = {
             url: getUrl,
             album: ObjectId(req.params.id),
             owner: req.user._id,
         };
        photos.push(photo);
        });
         return await Photo.populate(await Photo.insertMany(photos), {path: 'owner album'});

    }

    async addWallPhoto (req) {
        const album = await  Album.findOne({owner: req.user._id, title: 'Фотографии со стены' });
        if (!album) {
            throw new Error("Album not found!");
        }
        let photos = [];
        req.files.map( data => {
            let getUrl = data.path.replace(/public/i, `files`);
            getUrl = getUrl.replace(/\\+/g, `/`);
            const photo = {
                url: getUrl,
                album: album._id,
                owner: req.user._id,
            };
            photos.push(photo);
        });
        return await Photo.populate(await Photo.insertMany(photos), {path: 'owner album'});
    }


     async del(req){
        let photo = await Photo.findById(req.params.id.toString());
        let getUrl = photo.url.replace(/files/i, `public`);
        getUrl = getUrl.replace(/\/+/g, `\\`);
         try {
             await Photo.deleteOne({_id: req.params.id.toString()});
             fs.unlink( getUrl, err  => err);
             if(req.user.avatar._id.toString()  === req.params.id){

                 const lastPhoto = await Photo.findOne({album: photo.album}).sort({_id: -1});
                 if(lastPhoto){
                     await User.findOneAndUpdate({_id: req.user._id}, {avatar: lastPhoto})
                 }else{
                     photo.url = '';
                     await User.findOneAndUpdate({_id: req.user._id}, {avatar: photo})
                 }

             }
             return req.params.id
         }
         catch (e) {
             return e
         }
    }

    async updPhoto (req) {
        const photo = await Photo.findOneAndUpdate({_id: req.body.id.toString(), owner: req.user._id}, {album: req.body.album});
        return await this.getPhoto(photo._id) ;
    }

     async getPhoto (id) {
         return  await Photo.aggregate([
             {
                 $match: {_id: ObjectId(id)}
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
             {$unset: ['owner.password', 'owner.tokens' , 'owner.__v']}
         ]);
    }

     async getAllPhotos (login){
        const user = await User.findOne({login: login});
         return  await Photo.aggregate([
             {
                 $match: {owner: user._id}
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
             {$sort: {_id: -1}},
             {$unset: ['owner.password', 'owner.tokens' , 'owner.__v']}
         ]);
    }

     async setAvatarUsers (req){

         let getUrl = req.file.path.replace(/public/i, `files`);
         getUrl = getUrl.replace(/\\+/g, `/`);
         const body = {
            url: getUrl,
            album: req.user.avatar.album,
            owner: req.user._id,
         };
         const photo = new Photo (body);

         await photo.save();
         await User.findOneAndUpdate({_id: req.user._id.toString()}, {avatar: photo} );
         return await Photo.populate(photo, {path: 'owner album'});
    }

    async changeAvatarUser (req){
        let getUrl = req.body.url.replace(/files/i, `public`);
        const timeStamp = Date.now();
        fs.copyFile(`${getUrl}`, `${getUrl}${timeStamp}.jpg`,
            (err) => {if (err) return console.error(err);}
        );
        const body = {
            url: `${req.body.url}${timeStamp}.jpg`,
            album: req.user.avatar.album,
            owner: req.user._id,
        };
        const photo = new Photo (body);

        await photo.save();
        await User.findOneAndUpdate({_id: req.user._id.toString()}, {avatar: photo} );
        return await Photo.populate(photo, {path: 'owner album'});
    }

}

module.exports = new PhotoServices;
