import { Router } from "express";
import { DietPlanController } from "../controllers/DietPlanController";
import { DietPlanCrudController } from "../controllers/DietPlanCrudController";
import { AssignmentController } from "../controllers/AssignmentController";
import { requireAuth } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/requireRole";
import { validateBody } from "../middlewares/validate";
import { generateDietPlanSchema } from "../validators/dietPlanValidators";
import { createDietPlanSchema, updateDietPlanSchema } from "../validators/dietPlanCrudValidators";
import { assignPlanSchema, unassignPlanSchema } from "../validators/assignmentValidators";

const router = Router();

router.use(requireAuth, requireRole("nutritionist"));

// Existing endpoints
router.post("/generate-suggested", validateBody(generateDietPlanSchema), DietPlanController.generateSuggested);
router.get("/foods/search", DietPlanController.searchFood);

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
router.post("/", validateBody(createDietPlanSchema), DietPlanCrudController.create);
router.get("/", DietPlanCrudController.list);

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
router.get("/:id", DietPlanCrudController.getById);
router.patch("/:id", validateBody(updateDietPlanSchema), DietPlanCrudController.update);
router.delete("/:id", DietPlanCrudController.remove);

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
router.post("/:id/assign", validateBody(assignPlanSchema), AssignmentController.assign);
router.post("/:id/unassign", validateBody(unassignPlanSchema), AssignmentController.unassign);

export default router;