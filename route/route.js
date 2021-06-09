const express=require('express');
const route=express.Router();
const controllers=require('../controllers/controllers');


route.post('/api/auth/signup',controllers.InterfaceSignUp);
route.post('/api/test/signup',controllers.InterfaceTestSignUp);
route.get('/api/validated/:email',controllers.InterfaceValidatedUser);
route.post('/api/auth/signin',controllers.InterfaceLogin);
route.post('/api/test/signin',controllers.InterfaceTestSignIn);
route.get('/',controllers.InterfaceAllUser);
route.get('/api/profile/user',controllers.InterfaceProfileUser);
route.get('/api/profile/livreur',controllers.InterfaceProfileLivreur);
route.get('/api/profile/admin',controllers.InterfaceProfileAdmin);
route.get('/api/allusersconnected',controllers.InterfaceAllUsersConnected);
route.post('/api/NomUserConnected',controllers.InterfaceNomUserConnected);
route.post('/api/NumeroTelUserConnected',controllers.InterfaceNumeroTelUserConnected);
route.post('/api/AjouterColisInfos',controllers.InterfaceAjouterColisInfo);
route.get('/api/afficherColisInfo',controllers.InterfaceafficherColisInfos);
route.post('/api/SupprimerColisInfos',controllers.InterfaceSupprimerColisInfos);
route.post('/api/accepterNomUser',controllers.InterfaceNomUtilisateurAccepter);

module.exports=route;