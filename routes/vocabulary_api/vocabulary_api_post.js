const express = require('express');
const router = express.Router();
const axios = require('axios');

// Util
const apiAuth = require('/util/auth_api')
const cdn = require('/util/urls').cdn
let normalization = require('/util/normalization')

const Vocabulary = require('/models/vocabulary');
const CDN = cdn + "/vocabulary/"

// POST / - Add a new vocabulary providing nameUTF8 and name
router.post('/', apiAuth.checkJwt, (req, res) => {

    let nameUTF8 = normalization.getNormalizedName(req.body.name)

    // Check if verb exists
    Vocabulary.find({'nameUTF8': nameUTF8}, (error, data) => {

        // It doesnt exist duplicate
        if(data.length === 0){

            // Check if image exists
            console.log(CDN + nameUTF8 + ".png")
            axios.get(CDN + nameUTF8 + ".png")
                .then((response) => {

                    let vocabulary = Vocabulary({
                            name: req.body.name,
                            nameUTF8: nameUTF8,
                            imageURL: CDN + nameUTF8 + ".png",
                            category: req.body.category,
                            categoryUTF8: normalization.getNormalizedCategory(req.body.category)
                        }
                    )

                    vocabulary.save((err, data) => {

                        if(err)
                            res.status(404).json({message: "Can't save it!"})
                        else
                            res.status(201).json(data)
                    })
                })
                .catch((err) => {

                    res.status(404).json({message: "Can't find image!"})
                })
        }
        else {
            console.log(data)
            res.status(404).json({message: "Vocabulary image already exists!"})
        }
    })
});

module.exports = router;