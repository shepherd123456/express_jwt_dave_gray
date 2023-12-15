const Employee = require('../model/Employee');

async function getAllEmployees(req, res) {
  const employees = await Employee.find();
  if (employees.length === 0) return res.json({ message: 'no employees' });
  res.json(employees);
}

async function getEmployee(req, res) {
  const _id = req.params.id;
  const employee = await Employee.findOne({ _id }).exec();
  if (!employee) return res.sendStatus(404);
  res.json(employee);
}

async function createEmployee(req, res) {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  if (!firstname || !lastname) {
    return res.status(400).json({ message: 'first and last names are required' });
  }
  try {
    const result = await Employee.create({ firstname, lastname });
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
  }
}

async function updateEmployee(req, res) {
  const _id = req.body.id;
  const employee = await Employee.findOne({ _id }).exec();
  if (!employee) return res.sendStatus(404);
  if (req.body.firstname) employee.firstname = req.body.firstname;
  if (req.body.lastname) employee.lastname = req.body.lastname;
  const result = await employee.save();
  res.json(result);
}

async function deleteEmployee(req, res) {
  const _id = req.params.id;
  const employee = await Employee.findOne({ _id }).exec();
  if (!employee) return res.sendStatus(404);
  await employee.deleteOne();
  res.sendStatus(204);
}

module.exports = {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
}