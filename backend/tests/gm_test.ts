
import { describe, it, expect } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("gm contract", () => {
    it("ensures say-gm logs transaction and transfers fee", () => {
        const { result } = simnet.callPublicFn(
            "gm",
            "say-gm",
            [],
            wallet1
        );

        // Should return (ok u1) - first GM
        expect(result).toBeOk(Cl.uint(1));

        // Verify event emitted
        const events = simnet.getEvents();
        const printEvent = events.find(e => e.event === 'print');
        expect(printEvent).toBeDefined();
    });

    it("ensures get-total-gms increments correctly", () => {
        simnet.callPublicFn("gm", "say-gm", [], wallet1);
        simnet.callPublicFn("gm", "say-gm", [], wallet2);

        const { result } = simnet.callReadOnlyFn("gm", "get-total-gms", [], deployer);
        expect(result).toBeOk(Cl.uint(2));
    });

    it("ensures custom message is stored", () => {
        simnet.callPublicFn("gm", "say-gm-message", [Cl.stringAscii("gm frens!")], wallet1);

        const { result } = simnet.callReadOnlyFn("gm", "get-user-gm", [Cl.principal(wallet1)], deployer);
        expect(result).toBeOk(Cl.some(Cl.stringAscii("gm frens!")));
    });
});
