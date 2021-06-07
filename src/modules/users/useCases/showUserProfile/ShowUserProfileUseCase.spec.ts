import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to show user profile with valid id", async () => {
    const { id } = await createUserUseCase.execute({
      name: "User test",
      email: "test@test.com.br",
      password: "passwordsecret",
    });

    const user = await showUserProfileUseCase.execute(id || "");

    expect(user.id).toEqual(id);
  })

  it("should not be able to show user profile with invalid id", () => {
    expect(async () => {
      await showUserProfileUseCase.execute("invalidID");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  })
})
