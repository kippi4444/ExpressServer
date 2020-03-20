const Dialog = require('../models/dialog');
const Mes = require('../models/message');
const User = require('../models/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


class DialogMessageServices {

    static async addDialog (req) {
        let users = req.body.person.map(user => ObjectId(user));
        let reverse = req.body.person.reverse().map(user => ObjectId(user));
        const findDialog = await Dialog.findOne( {$or: [
                      {person: users },
                      {person: reverse}
                             ]});
        if (findDialog) {
            return await this.getDialog({dialog: findDialog._id, user: req.user._id});
        }

        const dialog = new Dialog(req.body);
        await dialog.save();
        return await this.getDialog({dialog: dialog._id, user: req.user._id})
    }

    static async addMes (body) {
        const dialog = await Dialog.findOne({_id: body.dialog});

        if (!dialog) {
            throw new Error("dialog not found!");
        }

        const message = new Mes(body);
        await message.save();

        return await User.populate(message, {path: 'user'});
    }

    static async delDialog(body){
       const dialog = await Dialog.findOne({_id: body.params.id});
       if(dialog.person.length<3){
           await Dialog.deleteOne({_id: body.params.id});
           await Mes.deleteMany({dialog: ObjectId(body.params.id)});
       } else {
           await Dialog.findOneAndUpdate({_id: body.params.id}, { $pullAll: {person: [body.user._id] }});
       }

        return body.params.id;
    }

    static async delMes(id){
        await Mes.deleteOne({_id: id.toString()});

        return id
    }

    static async editDialog(body){
        return await Dialog.findOneAndUpdate({_id: body._id.toString()}, body);
    }

    static async editMes(body){
        return  await Mes.updateMany(
            {dialog: body.dialog, isReading: {$all: [ObjectId(body.sender)]}}, { $pullAll: {isReading: [ObjectId(body.sender)] } }
            );
    }

    static async getDialog(body){
        return await Dialog.aggregate([
            {$match: { _id:   ObjectId(body.dialog) } },
            {$sort: {_id: -1}},
            { $addFields:
                    { persons:
                            {$filter:
                                    {
                                        input: "$person", as: "id", cond:
                                            {$ne: ["$$id", ObjectId(body.user)]}
                                    }
                            }
                    }
            },
            {$unwind: "$persons" },
            {
                $lookup: {
                    from: "users",
                    localField: 'persons',
                    foreignField: '_id',
                    as: "persons"
                }
            },
            {$unwind: "$persons" },
            {$unset: ['person','__v', 'persons.password', 'persons.tokens', 'persons.__v', 'updatedAt']},
            {$sort: {'persons._id': -1}},
            {"$lookup":
                    {from: 'messages',
                        as: 'mes',
                        let: { indicator_id: '$_id' },
                        pipeline: [
                            { $match: {
                                    $expr: { $eq: [ '$dialog', '$$indicator_id' ] }
                                } },
                            { $sort: {created_at: -1} },
                            { $limit: 1}
                        ],
                    }
            },
            {
                $group:
                    {
                        _id: '$_id',
                        title: {$first: '$title'},
                        persons: {"$push": '$persons'},
                        mes: {"$first": "$mes"}
                    }
            },
            {$sort: {mes: -1}},
        ]);
    }

    static async getDialogs(userId){
        const id = ObjectId(userId);
        return await Dialog.aggregate([
            {$match: { person: {$all:   [id] } }},
            { $addFields:
                    { persons:
                            {$filter:
                                    {
                                        input: "$person", as: "id", cond:
                                            {$ne: ["$$id", userId]}
                                    }
                            }
                    }
            },
            {$unwind: "$persons" },
            {
                $lookup: {
                    from: "users",
                    localField: 'persons',
                    foreignField: '_id',
                    as: "persons"
                }
            },
            {$unwind: "$persons" },
            {$unset: ['person','__v', 'persons.password', 'persons.tokens', 'persons.__v', 'updatedAt']},
            {$sort: {'persons._id': -1}},
            {"$lookup":
                    {from: 'messages',
                        as: 'mes',
                        let: { indicator_id: '$_id' },
                        pipeline: [
                            { $match: {
                                    $expr: { $eq: [ '$dialog', '$$indicator_id' ] }
                                } },
                            { $sort: {created_at: -1} },
                            { $limit: 1}
                        ],
                    }
            },
            {
                $group:
                    {
                        _id: '$_id',
                        title: {$first: '$title'},
                        persons: {"$push": '$persons'},
                        mes: {"$first": "$mes"}
                    }
            },
            {$sort: {mes: -1}},
        ]);
    }

     static async getAllDialogs(){
        return await Dialog.find({}).select('_id');
    }

    static async getMessages(dialog){
        return await Dialog.aggregate([
            {
                $match: {_id: ObjectId(dialog.dialog)}
            },
            {
                "$facet": {
                    "dialog": [
                        {"$unwind": "$person"},
                        {
                            "$lookup": {
                                "from": "users",
                                "localField": "person",
                                "foreignField": "_id",
                                "as": "persons"
                            }
                        },
                        {"$unwind": "$persons"},
                        {$unset: ['persons.tokens', 'persons.password']},
                        {
                            "$group": {
                                "_id": "$_id",
                                "title": {"$first": "$title"},
                                "person": {"$push": "$person"},
                                "persons": {"$push": "$persons"}
                            }
                        }

                    ],
                    "mes": [
                        {
                            "$lookup":
                                {
                                    from: 'messages',
                                    as: 'mes',
                                    let: {indicator_id: '$_id'},
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {$eq: ['$dialog', '$$indicator_id']}
                                            }
                                        },
                                        {$sort: {created_at: -1}},
                                        {$skip: dialog.skip},
                                        {$limit: 10}
                                    ],
                                }
                        },
                        {"$unwind": {path: "$mes", "preserveNullAndEmptyArrays": true}},
                        {
                            "$lookup": {
                                "from": "users",
                                "localField": "mes.user",
                                "foreignField": "_id",
                                "as": "mes.user"
                            }
                        },
                        {"$unwind": {path: "$mes.user", "preserveNullAndEmptyArrays": true}},
                        {$unset: ['mes.user.tokens', 'mes.user.password']},
                        {
                            "$group": {
                                "_id": "_id",
                                "mes": {"$push": "$mes"},
                            }
                        },
                        {
                            $project: {
                                _id: -1,
                                mes: {
                                    $filter: {
                                        input: "$mes",
                                        as: "value",
                                        cond: {$ne: ["$$value", {}]}
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                mes: {$reverseArray: '$mes'},
                            }
                        },

                    ],
                    "totalCount": [
                        {
                            "$lookup":
                                {
                                    from: 'messages',
                                    as: 'mes',
                                    let: {indicator_id: '$_id'},
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {$eq: ['$dialog', '$$indicator_id']}
                                            }
                                        },
                                        {"$count": "count"}
                                    ],
                                }
                        },

                    ],
                }
            },
            {$unwind: '$dialog'},
            {$unwind: "$mes"},
            {$unwind: "$totalCount"},
            {$replaceRoot:
                    { newRoot:
                            {dialog: '$dialog', mes: "$mes.mes", count: "$totalCount.mes"}
                    }
            },


        ]);
    }

}

module.exports = DialogMessageServices;
