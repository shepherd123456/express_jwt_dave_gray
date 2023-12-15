
const express = require('express');
const router = express.Router();
const userController = require('../../controller/userController');
const verifyRoles = require('../../middleware/verifyRoles');

const ROLES_MAP = require('../../config/rolesMap');

router.route('/')
  .get(verifyRoles(ROLES_MAP['ADMIN']), userController.getAllUser)


router.route('/:id')
  .get(verifyRoles(ROLES_MAP['ADMIN']), userController.getUser)
  .delete(verifyRoles(ROLES_MAP['ADMIN']), userController.deleteUser);

module.exports = router;