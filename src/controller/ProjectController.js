const express = require("express");
const prisma = require("../../prisma/client");
const { validationResult } = require("express-validator");

const findProject = async (req, res) => {
    try {

        const project = await prisma.project.findMany({
            select: {
                id: true,
                name: true,
                description: true,
            },
            orderBy: {
                id: "desc",
            },
        });

        res.status(200).send({
            success: true,
            message: "Get all project successfully",
            data: project,
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

const createProject = async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
      return res.status(422).json({
          success: false,
          message: "Validation error",
          errors: errors.array(),
      });
  }

  try {

      const project = await prisma.project.create({
          data: {
              name: req.body.name,
              description: req.body.description
          },
      });

      res.status(201).send({
          success: true,
          message: "Project created successfully",
          data: project,
      });

  } catch (error) {
      res.status(500).send({
          success: false,
          message: "Internal server error",
      });
  }
};

const findProjectById = async (req, res) => {

  const { id } = req.params;

  try {

      const project = await prisma.project.findUnique({
          where: {
              id: Number(id),
          },
          select: {
              id: true,
              name: true,
              description: true,
          },
      });

      res.status(200).send({
          success: true,
          message: `Get user By ID : ${id}`,
          data: project,
      });

  } catch (error) {
      res.status(500).send({
          success: false,
          message: "Internal server error",
      });
  }
};

const updateProject = async (req, res) => {

  const { id } = req.params;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
      return res.status(422).json({
          success: false,
          message: "Validation error",
          errors: errors.array(),
      });
  }

  try {

      const project = await prisma.project.update({
          where: {
              id: Number(id),
          },
          data: {
              name: req.body.name,
              description: req.body.description,
          },
      });

      res.status(200).send({
          success: true,
          message: 'Project updated successfully',
          data: project,
      });

  } catch (error) {
      res.status(500).send({
          success: false,
          message: "Internal server error",
      });
  }
};

const deleteProject = async (req, res) => {

  const { id } = req.params;

  try {

      await prisma.project.delete({
          where: {
              id: Number(id),
          },
      });

      res.status(200).send({
          success: true,
          message: 'Project deleted successfully',
      });

  } catch (error) {
      res.status(500).send({
          success: false,
          message: "Internal server error",
      });
  }

};

module.exports = { findProject, createProject, findProjectById, updateProject, deleteProject };