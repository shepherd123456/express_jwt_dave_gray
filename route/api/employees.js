const express = require('express');
const router = express.Router();
const employeesController = require('../../controller/employeeController');
const verifyRoles = require('../../middleware/verifyRoles');

const ROLES_MAP = require('../../config/rolesMap');


router.route('/')
  .get(employeesController.getAllEmployees)
  .post(verifyRoles(ROLES_MAP['ADMIN'], ROLES_MAP['EDITOR']), employeesController.createEmployee)
  .put(verifyRoles(ROLES_MAP['ADMIN'], ROLES_MAP['EDITOR']), employeesController.updateEmployee);

router.route('/:id')
  .get(employeesController.getEmployee)
  .delete(verifyRoles(ROLES_MAP['ADMIN']), employeesController.deleteEmployee);

module.exports = router;