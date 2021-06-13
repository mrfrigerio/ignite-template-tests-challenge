import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

@injectable()
export class CreateStatementUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    user_id,
    type,
    amount,
    description,
    destination_user_id,
  }: ICreateStatementDTO) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new CreateStatementError.UserNotFound();
    }

    if (type === "withdraw") {
      const { balance } = await this.statementsRepository.getUserBalance({
        user_id,
      });

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds();
      }
    }

    if (type === "transfer") {
      if (!destination_user_id) {
        throw new AppError("Destination user missing!");
      }

      const destinationUserExits = await this.usersRepository.findById(
        destination_user_id
      );

      if (!destinationUserExits) {
        throw new CreateStatementError.UserNotFound();
      }

      const { balance } = await this.statementsRepository.getUserBalance({
        user_id,
      });
      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds();
      }
      const statementsOperations: Statement[] = [];

      const statementOperation1 = await this.statementsRepository.create({
        user_id,
        type: "withdraw",
        amount,
        description,
        destination_user_id,
      });

      const statementOperation2 = await this.statementsRepository.create({
        user_id: destination_user_id,
        type: "deposit",
        amount,
        description,
        destination_user_id,
      });

      statementsOperations.push(statementOperation1, statementOperation2);
      return statementsOperations;
    }

    const statementOperation = [
      await this.statementsRepository.create({
        user_id,
        type,
        amount,
        description,
        destination_user_id,
      }),
    ];

    return statementOperation;
  }
}
