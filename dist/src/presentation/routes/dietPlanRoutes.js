"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DietPlanController_1 = require("../controllers/DietPlanController");
const DietPlanCrudController_1 = require("../controllers/DietPlanCrudController");
const AssignmentController_1 = require("../controllers/AssignmentController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const requireRole_1 = require("../middlewares/requireRole");
const validate_1 = require("../middlewares/validate");
const dietPlanValidators_1 = require("../validators/dietPlanValidators");
const dietPlanCrudValidators_1 = require("../validators/dietPlanCrudValidators");
const assignmentValidators_1 = require("../validators/assignmentValidators");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.requireAuth, (0, requireRole_1.requireRole)("nutritionist"));
// Existing endpoints
router.post("/generate-suggested", (0, validate_1.validateBody)(dietPlanValidators_1.generateDietPlanSchema), DietPlanController_1.DietPlanController.generateSuggested);
router.get("/foods/search", DietPlanController_1.DietPlanController.searchFood);
// CRUD endpoints
/**
 * @swagger
 * /v1/meal-plans:
 *   post:
 *     summary: Create a diet plan with days/meals/items
 *     tags: [DietPlans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, days]
 *             properties:
 *               name:
 *                 type: string
 *               notes:
 *                 type: string
 *               days:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Diet plan created
 *   get:
 *     summary: List my diet plans
 *     tags: [DietPlans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of diet plans
 */
router.post("/", (0, validate_1.validateBody)(dietPlanCrudValidators_1.createDietPlanSchema), DietPlanCrudController_1.DietPlanCrudController.create);
router.get("/", DietPlanCrudController_1.DietPlanCrudController.list);
/**
 * @swagger
 * /v1/meal-plans/{id}:
 *   get:
 *     summary: Get diet plan by ID
 *     tags: [DietPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Diet plan
 *       404:
 *         description: Not found
 *   patch:
 *     summary: Update diet plan
 *     tags: [DietPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               notes:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               days:
 *                 type: array
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Soft delete diet plan
 *     tags: [DietPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Soft deleted
 */
router.get("/:id", DietPlanCrudController_1.DietPlanCrudController.getById);
router.patch("/:id", (0, validate_1.validateBody)(dietPlanCrudValidators_1.updateDietPlanSchema), DietPlanCrudController_1.DietPlanCrudController.update);
router.delete("/:id", DietPlanCrudController_1.DietPlanCrudController.remove);
// Assignment endpoints
/**
 * @swagger
 * /v1/meal-plans/{id}/assign:
 *   post:
 *     summary: Assign a diet plan to a patient (only one active plan per patient)
 *     tags: [DietPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId]
 *             properties:
 *               patientId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Plan assigned
 * /v1/meal-plans/{id}/unassign:
 *   post:
 *     summary: Unassign a plan from a patient
 *     tags: [DietPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId]
 *             properties:
 *               patientId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Plan unassigned
 *       404:
 *         description: No active assignment found
 */
router.post("/:id/assign", (0, validate_1.validateBody)(assignmentValidators_1.assignPlanSchema), AssignmentController_1.AssignmentController.assign);
router.post("/:id/unassign", (0, validate_1.validateBody)(assignmentValidators_1.unassignPlanSchema), AssignmentController_1.AssignmentController.unassign);
exports.default = router;
//# sourceMappingURL=dietPlanRoutes.js.map