import { Router } from "express";
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get("/provinsi", (req, res, next) => {
    const keyword = (!req.query.keyword) ? "" : req.query.keyword.toString();
    if(keyword.length < 3){
        return res.status(200).send([]);
    }

    prisma.district.findMany({
        where:{
            name: {
                contains: keyword
            },
            kota_id: null,
            kecamatan_id: null,
            kelurahan_id: null
        },
        select: {
            id: true,
            name: true
        },
        orderBy: {
            name: "asc"
        },
        take: 5,
        skip: 0
    }).then(result => {
        return res.status(200).send(result);
    }).catch(error => {
        return res.status(500).send(error);
    })
});

router.get("/kota/:province_id", async(req, res, next) => {
    const keyword = (!req.query.keyword) ? "" : req.query.keyword.toString();
    if(keyword.length < 3){
        return res.status(200).send([]);
    }

    const id = parseInt(req.params.province_id);
    const district = await prisma.district.findUnique({
        where:{
            id: id
        }
    });

    if(district == null || district.kota_id != null || district.kecamatan_id != null || district.kelurahan_id != null){
        return res.status(404).send("Provinsi tidak ditemukan.");
    }

    prisma.district.findMany({
        where:{
            name: {
                contains: keyword
            },
            provinsi_id: district.provinsi_id,
            NOT: {
                kota_id: null
            },
            kecamatan_id: null,
            kelurahan_id: null
        },
        select: {
            id: true,
            name: true
        },
        orderBy: {
            name: 'asc'
        },
        take: 5,
        skip: 0
    }).then(result => {
        res.status(200).send(result);
    }).catch(error => {
        res.status(500).send(error);
    })
})

router.get("/kecamatan/:city_id", async(req, res, next) => {
    const keyword = (!req.query.keyword) ? "" : req.query.keyword.toString();
    if(keyword.length < 2){
        return res.status(200).send([]);
    }

    const id = parseInt(req.params.city_id);
    const district = await prisma.district.findUnique({
        where:{
            id: id
        }
    });

    if(district == null || district.kecamatan_id != null || district.kelurahan_id != null){
        return res.status(404).send("Kota tidak ditemukan.");
    }

    prisma.district.findMany({
        where:{
            name: {
                contains: keyword
            },
            provinsi_id: district.provinsi_id,
            kota_id: district.kota_id,
            NOT: {
                kecamatan_id: null
            },
            kelurahan_id: null
        },
        select: {
            id: true,
            name: true
        },
        orderBy: {
            name: 'asc'
        },
        take: 5,
        skip: 0
    }).then(result => {
        res.status(200).send(result);
    }).catch(error => {
        res.status(500).send(error);
    })
})

router.get("/kelurahan/:kecamatan_id", async(req, res, next) => {
    const keyword = (!req.query.keyword) ? "" : req.query.keyword.toString();
    if(keyword.length < 2){
        return res.status(200).send([]);
    }

    const id = parseInt(req.params.kecamatan_id);
    const district = await prisma.district.findUnique({
        where:{
            id: id
        }
    });

    if(district == null || district.kelurahan_id != null){
        return res.status(404).send("Kecamatan tidak ditemukan.");
    }

    prisma.district.findMany({
        where:{
            name: {
                contains: keyword
            },
            provinsi_id: district.provinsi_id,
            kota_id: district.kota_id,
            kecamatan_id: district.kecamatan_id,
            NOT: {
                kelurahan_id: null
            },
        },
        select: {
            id: true,
            name: true
        },
        orderBy: {
            name: 'asc'
        },
        take: 5,
        skip: 0
    }).then(result => {
        res.status(200).send(result);
    }).catch(error => {
        res.status(500).send(error);
    })
})

export default router;