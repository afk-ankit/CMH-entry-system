"use server";

import { IForm } from "@/app/exit/ExitForm";
import prisma from "../prisma";
import { IEntryForm } from "@/app/entry/EntryForm";

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

export const AddEntry = async (data: IEntryForm) => {
  try {
    await prisma.entryForm.create({
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
