import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authenticate User", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to authenticate user with valid credentials", async () => {
    const user = await createUserUseCase.execute({
      name: "User test",
      email: "test@test.com.br",
      password: "passwordsecret",
    });

    const userAuthenticated = await authenticateUserUseCase.execute({
      email: "test@test.com.br",
      password: "passwordsecret",
    });

    expect(userAuthenticated).toHaveProperty("token");
  })

  it("should not be able to authenticate user with invalid email", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User test",
        email: "test@test.com.br",
        password: "passwordsecret",
      });

      await authenticateUserUseCase.execute({
        email: "incorrect@email.com.br",
        password: "passwordsecret",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  })

  it("should not be able to authenticate user with invalid password", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User test",
        email: "test@test.com.br",
        password: "passwordsecret",
      });

      await authenticateUserUseCase.execute({
        email: "test@test.com.br",
        password: "incorrectpassword",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  })
})
