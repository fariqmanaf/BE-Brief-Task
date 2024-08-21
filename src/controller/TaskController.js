const express = require("express");
const prisma = require("../../prisma/client");
const { validationResult } = require("express-validator");

const findTask = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const numericProjectId = Number(projectId);

    const projectExists = await prisma.project.findUnique({
      where: {
        id: numericProjectId,
      },
    });

    if (!projectExists) {
      return res.status(404).send({
        success: false,
        message: `Project with ID ${projectId} not found`,
      });
    }

    const tasks = await prisma.task.findMany({
      where: {
        projectId: numericProjectId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        isDone: true,
        projectId: true,
        userId: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    if (tasks.length === 0) {
      return res.status(404).send({
        success: false,
        message: `No tasks found for Project ID: ${projectId}`,
      });
    }

    res.status(200).send({
      success: true,
      message: `Tasks for Project ID: ${projectId}`,
      data: tasks,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const createTask = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation error",
      errors: errors.array(),
    });
  }

  try {
    const task = await prisma.task.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        projectId: parseInt(req.params.projectId),
        userId: req.userId,
      },
    });

    res.status(201).send({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateTask = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation error",
      errors: errors.array(),
    });
  }

  try {
    const projectId = req.params.projectId;
    const id = req.params.id;
    const userId = req.userId;

    const task = await prisma.task.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!task || task.projectId !== Number(projectId)) {
      return res.status(404).send({
        success: false,
        message: "Task not found",
      });
    }

    if (task.userId !== userId) {
      return res.status(403).send({
        success: false,
        message: "You are not authorized to edit this task",
      });
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: Number(id),
      },
      data: {
        name: req.body.name,
        description: req.body.description,
        isDone: parseInt(req.body.isDone, 10),
      },
    });

    res.status(200).send({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const id = req.params.id;
    const userId = req.userId;

    const task = await prisma.task.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!task || task.projectId !== Number(projectId)) {
      return res.status(404).send({
        success: false,
        message: "Task not found",
      });
    }

    if (task.userId !== userId) {
      return res.status(403).send({
        success: false,
        message: "You are not authorized to delete this task",
      });
    }

    await prisma.task.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).send({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const findTaskById = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const id = req.params.id;

    const numericProjectId = Number(projectId);
    const numericId = Number(id);

    const projectExists = await prisma.project.findUnique({
      where: {
        id: numericProjectId,
      },
    });

    if (!projectExists) {
      return res.status(404).send({
        success: false,
        message: `Project with ID ${projectId} not found`,
      });
    }

    const task = await prisma.task.findUnique({
      where: {
        id: numericId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        isDone: true,
        projectId: true,
        userId: true,
      },
    });

    if (!task || task.projectId !== numericProjectId) {
      return res.status(404).send({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Task found",
      data: task,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { findTask, createTask, updateTask, deleteTask, findTaskById };
