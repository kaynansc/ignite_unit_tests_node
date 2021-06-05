import { compare } from "bcryptjs";
import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase"


let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository
describe("Create User", () => {

  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  })

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "User test",
      email: "test@test.com.br",
      password: "passwordsecret",
    })

    expect(user).toHaveProperty("id");
    expect(user.name).toEqual("User test");
  })

  it("should be able to encrypt the password when create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "User test 1",
      email: "test@test.com.br",
      password: "passwordsecret",
    })

    const comparePassword = await compare("passwordsecret", user.password);

    expect(comparePassword).toBeTruthy();
  })

  it("should not be able to create a user with exists email", () => {
    expect( async () => {
      await createUserUseCase.execute({
        name: "User test 1",
        email: "test@test.com.br",
        password: "passwordsecret",
      })

      await createUserUseCase.execute({
        name: "User test 2",
        email: "test@test.com.br",
        password: "passwordsecret",
      })
    }).rejects.toBeInstanceOf(CreateUserError);
  })
})

