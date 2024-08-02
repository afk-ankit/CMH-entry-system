"use server";

import { IForm } from "@/app/exit/ExitForm";
import prisma from "../prisma";

export const AddExit = async (data: IForm) => {
  try {
    await prisma.form.create({
      data: {
        ...data,
      },
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return error.message;
    }
  }
};
