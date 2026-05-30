"use strict"

const CustomError = require("../errors/customErrors")
const Token = require("../models/token")

module.exports = {
    list: async(req, res) => {
        /*
            #swagger.ignore = true
        */
        const data = await res.getModelList(Token, {}, "userId")
        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Token),
            data
        })
    },
    create: async(req, res) => {
        /*
            #swagger.ignore = true
        */
        const data = await Token.create(req.body)
        res.status(201).send({
            error: false,
            data
        })
    },
    read: async(req, res) => {
        /*
            #swagger.ignore = true
        */
        const data = await Token.findOne({_id: req.params.id}).populate("userId")
        if(!data) {
            throw new CustomError("Token not found", 404)
        }
        res.status(200).send({
            error: false,
            data
        })
    },
    update: async(req, res) => {
        /*
            #swagger.ignore = true
        */
        const data = await Token.updateOne({_id: req.params.id}, req.body, {runValidators: true})
        if(!data.modifiedCount) {
            throw new CustomError("Token not found or data is the same", 404)
        }
        res.status(202).send({
            error: false,
            data,
            new: await Token.findOne({_id: req.params.id}).populate("userId")
        })
    },
    delete: async(req, res) => {
        /*
            #swagger.ignore = true
        */
        const data = await Token.deleteOne({_id:req.params.id})
        if(!data.deletedCount) {
            throw new CustomError("Token not found", 404)
        }
        res.status(204).send({
            error: false,
            data
        })
    },
}