const express = require('express');
const router = express.Router();
const { User, Group } = require('../models');

router.get('/', (req, res) => {
    res.render('group', {
        user: req.user,
        loginError: req.flash('loginError'),
    });
})

router.get('/code', (req, res) => {
    Group.count()
        .then(ele => {
            res.send(String(ele+1));
        });
});

router.get('/create', (req, res) => {
    res.render('group_create', {
        user: req.user,
        loginError: req.flash('loginError'),
    });
});

router.get('/join', (req, res) => {
    res.render('group_join', {
        user: req.user,
        loginError: req.flash('loginError'),
    });
});

router.post('/create', async (req, res, next) => {
    const { name, code, permit, set1, set1_day, set1_time, set2, set2_day, set2_time, set3, set3_day, set3_time } = req.body;
    const user = await User.findOne({ where: { id: req.user.id }});
    try{
        await Group.create({
            name,
            leader: req.user.id,
            permit,
            set1,
            set1_day,
            set1_time,
            set2,
            set2_day,
            set2_time,
            set3,
            set3_day,
            set3_time,
        });
        await user.addGroup(code);
        res.redirect('/');
    }catch(error){
        console.error(error);
        next(error);
    }
});

router.get('/search/:gn/:gc', async(req, res, next) => {
    try{
        if(req.params.gc == 0){
            const groups = await Group.findAll({ 
                where: { name: req.params.gn },
                attributes: ['id', 'name', 'permit'],
                include: [{
                    model: User,
                    where: { id: req.user.id },
                    attributes: ['name'],
                }],
            });
            res.json(groups);
        }else{
            const groups = await Group.findOne({ 
                where: { name: req.params.gn, id: req.params.gc},
                attributes: ['id', 'name', 'permit'],
                include: [{
                    model: User,
                    where: { id: req.user.id },
                    attributes: ['name'],
                }],
            });
            res.json(groups);
        }
    }catch(error){
        console.error(error);
        next(error);
    }
});

module.exports = router;