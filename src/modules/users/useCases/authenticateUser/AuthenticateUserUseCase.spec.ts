import "dotenv/config";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

describe("AuthenticateUserUseCase", () => {
  let createUserUseCase: CreateUserUseCase;
  let usersRepository: IUsersRepository;
  let authenticateUserUseCase: AuthenticateUserUseCase;
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  });

  it("Should be able to authenticate an existent User", async () => {
    const user = await createUserUseCase.execute({
      name: "John Doe",
      email: "john@doe.com",
      password: "123abc",
    });

    const userAuthenticationResponse = await authenticateUserUseCase.execute({
      email: user.email,
      password: "123abc",
    });

    expect(userAuthenticationResponse).toHaveProperty("token");
  });
});
