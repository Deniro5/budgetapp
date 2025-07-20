import mongoose from "mongoose";
import TransferModel from "../models/transfer.model";
import * as transactionService from "./transactionService";

interface TransferInput {
  userId: string;
  sendingAccountId: string;
  receivingAccountId: string;
  amount: number;
  date: string;
}

export const createTransfer = async (input: TransferInput) => {
  const session = await mongoose.startSession();

  try {
    let sendingTransaction: any = null;
    let receivingTransaction: any = null;
    let transfer: any = null;

    await session.withTransaction(async () => {
      sendingTransaction = await transactionService.createTransaction({
        userId: input.userId,
        description: "",
        amount: input.amount,
        type: "Expense",
        date: input.date,
        account: input.sendingAccountId,
        category: "Transfer",
        vendor: input.receivingAccountId,
        tags: [],
      });

      receivingTransaction = await transactionService.createTransaction({
        userId: input.userId,
        description: "",
        amount: input.amount,
        type: "Income",
        date: input.date,
        account: input.receivingAccountId,
        category: "Transfer",
        vendor: input.sendingAccountId,
        tags: [],
      });

      transfer = new TransferModel({
        userId: input.userId,
        sendingAccountId: input.sendingAccountId,
        receivingAccountId: input.receivingAccountId,
        transactionIds: [sendingTransaction._id, receivingTransaction._id],
        amount: input.amount,
        date: input.date,
      });

      await transfer.save({ session });
    });

    return {
      transfer,
      transactions: [sendingTransaction, receivingTransaction],
    };
  } finally {
    session.endSession();
  }
};

export const updateTransferByTransactionId = async (
  userId: string,
  transactionId: string,
  updateData: Partial<TransferInput>
) => {
  const session = await mongoose.startSession();

  try {
    const transferToUpdate = await TransferModel.findOne({
      userId,
      transactionIds: { $in: [transactionId] },
    });

    if (!transferToUpdate) {
      throw new Error("Transfer not found");
    }

    const transactions = await Promise.all(
      transferToUpdate.transactionIds.map((transactionId: string) =>
        transactionService.getTransactionById(userId, transactionId)
      )
    );

    const receivingTransaction = transactions.find((t) => t.type === "Income");
    const sendingTransaction = transactions.find((t) => t.type === "Expense");

    if (!receivingTransaction || !sendingTransaction) {
      throw new Error(
        "Invalid transfer: missing income or expense transaction"
      );
    }

    let updatedReceivingTransaction = null;
    let updatedSendingTransaction = null;

    await session.withTransaction(async () => {
      updatedReceivingTransaction = await transactionService.updateTransaction(
        userId,
        receivingTransaction._id.toString(),
        {
          date: updateData.date,
          amount: updateData.amount,
          account: updateData.receivingAccountId,
          vendor: updateData.sendingAccountId,
        }
      );

      updatedSendingTransaction = await transactionService.updateTransaction(
        userId,
        sendingTransaction._id.toString(),
        {
          date: updateData.date,
          amount: updateData.amount,
          account: updateData.sendingAccountId,
          vendor: updateData.receivingAccountId,
        }
      );

      transferToUpdate.sendingAccountId =
        updateData.sendingAccountId || transferToUpdate.sendingAccountId;
      transferToUpdate.receivingAccountId =
        updateData.receivingAccountId || transferToUpdate.receivingAccountId;
      transferToUpdate.amount = updateData.amount ?? transferToUpdate.amount;
      transferToUpdate.date = updateData.date || transferToUpdate.date;

      await transferToUpdate.save({ session });
    });

    return {
      transfer: transferToUpdate,
      updatedTransactions: [
        updatedReceivingTransaction,
        updatedSendingTransaction,
      ],
    };
  } finally {
    session.endSession();
  }
};

export const deleteTransferByTransactionId = async (
  userId: string,
  transactionId: string
) => {
  const session = await mongoose.startSession();

  try {
    const transferToDelete = await TransferModel.findOne({
      userId,
      transactionIds: { $in: [transactionId] },
    }).session(session);

    if (!transferToDelete) {
      throw new Error("Transfer not found");
    }

    await session.withTransaction(async () => {
      await Promise.all(
        transferToDelete.transactionIds.map((transactionId: string) =>
          transactionService.deleteTransaction(userId, transactionId)
        )
      );

      await transferToDelete.deleteOne({ session });
    });

    return transferToDelete.transactionIds;
  } finally {
    session.endSession();
  }
};
