import { InMemoryStatementsRepository } from "../../../statements/repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../../statements/repositories/IStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

describe("CreateStatementUseCase", () => {
  let createUserUseCase: CreateUserUseCase;
  let usersRepository: IUsersRepository;
  let statementsRepository: IStatementsRepository;
  let createStatementUseCase: CreateStatementUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );
  });

  enum OperationType {
    DEPOSIT = "deposit",
    WITHDRAW = "withdraw",
  }

  it("Should be able to make a deposit", async () => {
    const user = await createUserUseCase.execute({
      name: "John Doe",
      email: "john@doe.com",
      password: "123abc",
    });

    const { id: user_id } = user;
    let statement;
    if (user_id) {
      statement = await createStatementUseCase.execute({
        user_id,
        amount: 1000,
        type: OperationType.DEPOSIT,
        description: "Deposit test",
      });
    }
    expect(statement).toHaveProperty("id");
  });

  it("Should be able to make a withdraw", async () => {
    const user = await createUserUseCase.execute({
      name: "John Doe",
      email: "john@doe.com",
      password: "123abc",
    });

    const { id: user_id } = user;
    let statement;
    if (user_id) {
      statement = await createStatementUseCase.execute({
        user_id,
        amount: 1000,
        type: OperationType.DEPOSIT,
        description: "Deposit test",
      });

      statement = await createStatementUseCase.execute({
        user_id,
        amount: 500,
        type: OperationType.WITHDRAW,
        description: "Withdraw test",
      });
    }
    expect(statement).toHaveProperty("id");
  });
});
