import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("should be able to get statement operation", async () => {
    const { id } = await createUserUseCase.execute({
      name: "User test",
      email: "test@test.com.br",
      password: "passwordsecret",
    });

    const statement_created = await createStatementUseCase.execute({
      user_id: id || "",
      description: "Deposit Fake",
      amount: 100,
      type: OperationType.DEPOSIT,
    });

    const statement = await getStatementOperationUseCase.execute({
      user_id: id || "",
      statement_id: statement_created.id || "",
    })

    expect(statement).toHaveProperty("id");
  });

  it("should not be able to get statement operation with statement not exists", () => {
    expect( async () => {
      const { id } = await createUserUseCase.execute({
        name: "User test",
        email: "test@test.com.br",
        password: "passwordsecret",
      });

      await getStatementOperationUseCase.execute({
        user_id: id || "",
        statement_id: "idnotexists",
      })

    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  })

  it("should not be able to get statement operation with user not exists", () => {
    expect( async () => {
      const { id } = await createUserUseCase.execute({
        name: "User test",
        email: "test@test.com.br",
        password: "passwordsecret",
      });

      const statement_created = await createStatementUseCase.execute({
        user_id: id || "",
        description: "Deposit Fake",
        amount: 100,
        type: OperationType.DEPOSIT,
      });

      await getStatementOperationUseCase.execute({
        user_id: "idnotexists",
        statement_id: statement_created.id || "",
      })

    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });


});
