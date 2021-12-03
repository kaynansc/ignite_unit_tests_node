import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { CreateTransferError } from "./CreateTransferError";

@injectable()
export class CreateTransferUseCase {
  constructor(
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) { }

  async execute({ amount, description, user_id, sender_id, type }: ICreateStatementDTO): Promise<Statement> {
    const recipient_user = await this.usersRepository.findById(user_id);

    if (!recipient_user) {
      throw new CreateTransferError.UserNotFound();
    }

    const sender_user = await this.usersRepository.findById(sender_id as string);

    if (!sender_user) {
      throw new CreateTransferError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id as string });

    if (balance < amount) {
      throw new CreateTransferError.InsufficientFunds();
    }

    const transfer = await this.statementsRepository.create({
      amount,
      description,
      sender_id,
      type,
      user_id,
    });

    return transfer;
  }
}