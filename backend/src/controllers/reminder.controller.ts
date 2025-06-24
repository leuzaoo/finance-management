import { Response } from "express";
import mongoose from "mongoose";

import { AuthRequest } from "../middlewares/authenticate";

import Reminder from "../models/Reminder";

export const listReminders = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const reminders = await Reminder.find({ user: userId }).sort("date");
    res.json(reminders);
  } catch (error: any) {
    console.error("Error fetching reminders:", error);
    res
      .status(500)
      .json({ message: "Erro ao listar lembretes", error: error.message });
  }
};

export const addReminder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { title, description, date } = req.body;

    if (!title || !description || !date) {
      res.status(400).json({
        message: "Título, descrição e data são obrigatórios",
      });
    }

    const rem = new Reminder({
      user: new mongoose.Types.ObjectId(userId),
      title,
      description,
      date,
    });

    await rem.save();
    res.status(201).json(rem);
  } catch (error: any) {
    console.error("Error adding reminder:", error);
    res
      .status(500)
      .json({ message: "Erro ao criar lembrete", error: error.message });
  }
};

export const updateReminder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { title, description, date } = req.body;

    const rem = await Reminder.findOneAndUpdate(
      { _id: id, user: userId },
      {
        title,
        description,
        date,
      },
      { new: true }
    );

    if (!rem) {
      res.status(404).json({ message: "Lembrete não encontrado" });
    }
    res.json(rem);
  } catch (error: any) {
    console.error("Error updating reminder:", error);
    res
      .status(500)
      .json({ message: "Erro ao atualizar lembrete", error: error.message });
  }
};

export const deleteReminder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const rem = await Reminder.findOneAndDelete({ _id: id, user: userId });

    if (!rem) {
      res.status(404).json({ message: "Lembrete não encontrado" });
    }
    res.json({ message: "Lembrete excluído com sucesso" });
  } catch (error: any) {
    console.error("Error deleting reminder:", error);
    res
      .status(500)
      .json({ message: "Erro ao excluir lembrete", error: error.message });
  }
};
