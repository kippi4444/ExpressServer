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
         return await Photo.insertMany(photos);

    }

    async addWallPhoto (req) {
        const album = await  Album.findOne({owner: req.user._id, title: 'Фотографии со стены' });
        if (!album) {
            throw new Error("Album not found!");
        }
        let photos = [];
        req.files.map( data => {
            const getUrl = data.path.replace(/public/i, `files`);
            const photo = {
                url: getUrl,
                album: album._id,
                owner: req.user._id,
            };
            photos.push(photo);
        });
        return await Photo.insertMany(photos);
    }


     async del(id){
        const photo = await Photo.findById(id.toString());
        const getUrl = photo.url.replace(/files/i, `public`);
        fs.unlink(getUrl, err => {
            console.log(err)});
        await Photo.deleteOne({_id: id.toString()});
        return "deleted"
    }

    async updPhoto (req) {
        const user = await  User.findOne({_id: req.user._id});
        if (!user) {
            throw new Error("Owner not found!");
        }
        return await Photo.findOneAndUpdate({_id: req.body.id.toString(), owner: req.user._id}, {album: req.body.album});
    }

     async getPhoto (id) {

        return await Photo.find({_id: id.toString()}).populate('owner');
    }

     async getAllPhotos (login){
        const user = await User.findOne({login: login});
        return await Photo.find({owner: user._id}).sort({ _id: -1 }).populate('owner album');
    }

     async setAvatarUsers (req){
        const getUrl = req.file.path.replace(/public/i, `files`);
        const body = {
            url: getUrl,
            album: req.user.avatar,
            owner: req.user._id,
        };
        const photo = new Photo (body);
        await photo.save();


        return 'ok';
    }

}

module.exports = new PhotoServices;
