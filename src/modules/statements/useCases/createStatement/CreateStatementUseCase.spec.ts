import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase"
import { CreateStatementError } from "./CreateStatementError";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Create Statetment", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should not be able to create a new statment with user not exists", () => {
    expect( async () => {
      await createStatementUseCase.execute({
        user_id: "idnotexists",
        description: "Deposit Fake",
        amount: 100,
        type: OperationType.DEPOSIT,
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  })

  it("should be able to create a new deposit", async () => {
    const { id } = await createUserUseCase.execute({
      name: "User test",
      email: "test@test.com.br",
      password: "passwordsecret",
    });

    const statement = await createStatementUseCase.execute({
      user_id: id || "",
      description: "Deposit Fake",
      amount: 100,
      type: OperationType.DEPOSIT,
    })

    expect(statement).toHaveProperty("id");
    expect(statement.type).toEqual(OperationType.DEPOSIT);
  })

  it("should be able to create a new withdraw", async () => {
    const { id } = await createUserUseCase.execute({
      name: "User test",
      email: "test@test.com.br",
      password: "passwordsecret",
    });

    await createStatementUseCase.execute({
      user_id: id || "",
      description: "Deposit Fake",
      amount: 100,
      type: OperationType.DEPOSIT,
    })

    const statment_withdraw = await createStatementUseCase.execute({
      user_id: id || "",
      description: "Withdraw Fake",
      amount: 50,
      type: OperationType.WITHDRAW,
    })

    expect(statment_withdraw).toHaveProperty("id");
  })

  it("should not be able to create a new withdraw if balance < amount", () => {
    expect( async () => {
      const { id } = await createUserUseCase.execute({
        name: "User test",
        email: "test@test.com.br",
        password: "passwordsecret",
      });

      await createStatementUseCase.execute({
        user_id: id || "",
        description: "Deposit Fake",
        amount: 100,
        type: OperationType.DEPOSIT,
      })

      await createStatementUseCase.execute({
        user_id: id || "",
        description: "Withdraw Fake",
        amount: 150,
        type: OperationType.WITHDRAW,
      })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  })
})
