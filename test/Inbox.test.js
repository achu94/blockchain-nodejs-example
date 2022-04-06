const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const wbe3 = new Web3(ganache.provider());

const { abi, evm } = require('../compile');

let accounts;
let inbox;
const INITAL_STRING = "Hi there!";

beforeEach(async () => {
  // Get a list of all accounts

  accounts = await wbe3.eth.getAccounts();

  // Use one of those accounts to deplay the contract
  inbox = await new wbe3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object, arguments: [INITAL_STRING] })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox", () => {
  it("deploys a contract", () => {
    assert.ok(inbox.options.address);
  });

  it("has a default message", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, INITAL_STRING);
  });

  it("can change the message", async () => {
    await inbox.methods.setMessage("I'm here!").send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, "I'm here!");
  });
});
