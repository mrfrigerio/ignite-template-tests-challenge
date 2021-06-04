import "dotenv/config";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

describe("ShowUserProfileUseCase", () => {
  let createUserUseCase: CreateUserUseCase;
  let usersRepository: IUsersRepository;
  let showUserProfileUseCase: ShowUserProfileUseCase;
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("Should be able to show current user profile.", async () => {
    const user = await createUserUseCase.execute({
      name: "John Doe",
      email: "john@doe.com",
      password: "123abc",
    });

    let userProfile;
    const { id } = user;
    if (id) {
      userProfile = await showUserProfileUseCase.execute(id);
    }

    expect(userProfile).toHaveProperty("id");
    expect(userProfile).toHaveProperty("name");
    expect(userProfile).toHaveProperty("email");
    expect(userProfile).toHaveProperty("password");
  });
});
