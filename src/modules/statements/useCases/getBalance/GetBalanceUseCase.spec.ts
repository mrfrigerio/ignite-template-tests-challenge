import { InMemoryStatementsRepository } from "../../../statements/repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../../statements/repositories/IStatementsRepository";
import { GetBalanceUseCase } from "../../../statements/useCases/getBalance/GetBalanceUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";

describe("GetBalanceUseCase", () => {
  let createUserUseCase: CreateUserUseCase;
  let usersRepository: IUsersRepository;
  let statementsRepository: IStatementsRepository;
  let getBalanceUseCase: GetBalanceUseCase;
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository
    );
  });

  it("Should be able to get the authenticated user balance", async () => {
    const user = await createUserUseCase.execute({
      name: "John Doe",
      email: "john@doe.com",
      password: "123abc",
    });

    const { id: user_id } = user;
    let balance;
    if (user_id) {
      balance = await getBalanceUseCase.execute({ user_id });
    }
    expect(balance).toHaveProperty("statement");
    expect(balance).toHaveProperty("balance");
  });
});
