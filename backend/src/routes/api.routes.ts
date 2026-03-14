const express = require('express');
import { getRecommendation } from '../controllers/recommendation.controller';

const router = express.Router();

router.get('/recommend', getRecommendation);

module.exports = router;