const express = require("express");
const prisma = require("../../prisma/client");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator");

const findUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        photo: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    res.status(200).send({
      success: true,
      message: "Get all users successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const createUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation error",
      errors: errors.array(),
    });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      },
    });

    res.status(201).send({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const findUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        name: true,
        email: true,
        photo: true,
      },
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: `User with ID: ${id} not found`,
      });
    }
    res.status(200).send({
      success: true,
      message: `Get user By ID : ${id}`,
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation error",
      errors: errors.array(),
    });
  }

  try {
    const updateData = {
      name: req.body.name,
      email: req.body.email,
    };

    if (req.file) {
      updateData.photo = req.file.filename;
    }

    const user = await prisma.user.update({
      where: {
        id: Number(req.params.id),
      },
      data: updateData,
    });

    res.status(200).send({
      success: true,
      message: "Update user successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (user.photo) {
      const photoPath = path.join(__dirname, "../uploads", user.photo);
      fs.unlink(photoPath, (err) => {
        if (err) {
          console.error("Failed to delete photo:", err);
        }
      });
    }

    await prisma.user.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.status(200).send({
      success: true,
      message: "User and photo deleted successfully",
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
module.exports = {
  findUsers,
  createUser,
  findUserById,
  updateUser,
  deleteUser,
};
