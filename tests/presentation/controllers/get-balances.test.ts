import chai, { expect } from 'chai';
import { Request, Response } from 'express';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import { BalancesController } from '../../../src/presentation/controllers/get-balances';
import { UseCase } from '../../../src/core/use-cases/interface';
import sinon from 'sinon';

describe('BalancesController', () => {
    let useCases: { [blockchain: string]: () => UseCase };
    let controller: BalancesController;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let useCase: Partial<UseCase>;

    beforeEach(() => {
        useCase = {
            isAddressValid: sinon.stub(),
            getAddressBalances: sinon.stub(),
        };

        useCases = {
            ethereum: () => useCase as UseCase,
        };

        controller = new BalancesController(useCases);

        req = {
            params: {
                blockchain: 'ethereum',
                address: '0x123',
            },
        };

        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
    });

    it('should return 400 if the blockchain is invalid', async () => {
        req.params!.blockchain = 'invalid-blockchain';
        await controller.getBalances(req as Request, res as Response);
        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWith({ error: 'Invalid blockchain invalid-blockchain' });
    });

    it('should return 400 if the wallet address is invalid', async () => {
        (useCase.isAddressValid as sinon.SinonStub).resolves(false);
        await controller.getBalances(req as Request, res as Response);
        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWith({ error: 'Invalid wallet address' });
    });

    it('should return address balances if the wallet address is valid', async () => {
        const addressBalances = { ethBalance: '100', tokenBalances: {} };
        (useCase.isAddressValid as sinon.SinonStub).resolves(true);
        (useCase.getAddressBalances as sinon.SinonStub).resolves(addressBalances);
        await controller.getBalances(req as Request, res as Response);
        expect(res.json).to.have.been.calledWith(addressBalances);
    });

    it('should return 500 if an error occurs', async () => {
        const error = new Error('Test error');
        (useCase.isAddressValid as sinon.SinonStub).resolves(true);
        (useCase.getAddressBalances as sinon.SinonStub).rejects(error);
        await controller.getBalances(req as Request, res as Response);
        expect(res.status).to.have.been.calledWith(500);
        expect(res.json).to.have.been.calledWith({ error: `An error occurred: ${error.message}` });
    });
});