import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { GetBalanceError } from "./GetBalanceError";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to get balance", async () => {

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
      amount: 50,
      type: OperationType.WITHDRAW,
    })

    const statements = await getBalanceUseCase.execute({
      user_id: id || "",
    });

    expect(statements.balance).toEqual(50);
  })

  it("should not be able to get balance with user not exists", () => {
    expect( async () => {
      await getBalanceUseCase.execute({
        user_id: "idnotexists",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  })
})
