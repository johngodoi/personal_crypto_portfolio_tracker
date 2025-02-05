import { expect } from 'chai';
import { Request, Response } from 'express';
import { PortfolioController } from '../../../src/presentation/controllers/get-portfolio';
import { UseCase } from '../../../src/core/use-cases/interface';
import sinon from 'sinon';
import { env } from '../../../src/shared/config/env';

describe('PortfolioController', () => {
    let useCases: { [blockchain: string]: () => UseCase };
    let controller: PortfolioController;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let useCase: Partial<UseCase>;

    beforeEach(() => {
        useCase = {
            isAddressValid: sinon.stub(),
            getPortfolio: sinon.stub(),
        };

        useCases = {
            ethereum: () => useCase as UseCase,
        };

        controller = new PortfolioController(useCases);

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
        await controller.getPortfolio(req as Request, res as Response);
        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWith({ error: 'Invalid blockchain invalid-blockchain' });
    });

    it('should return 400 if the wallet address is invalid', async () => {
        (useCase.isAddressValid as sinon.SinonStub).resolves(false);
        await controller.getPortfolio(req as Request, res as Response);
        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWith({ error: 'Invalid wallet address' });
    });

    it('should return portfolio if the wallet address is valid', async () => {
        const portfolio = { totalValue: '1000', assets: [] };
        (useCase.isAddressValid as sinon.SinonStub).resolves(true);
        (useCase.getPortfolio as sinon.SinonStub).resolves(portfolio);
        await controller.getPortfolio(req as Request, res as Response);
        expect(res.json).to.have.been.calledWith(portfolio);
    });

    it('should return 500 if an error occurs', async () => {
        const error = new Error('Test error');
        (useCase.isAddressValid as sinon.SinonStub).resolves(true);
        (useCase.getPortfolio as sinon.SinonStub).rejects(error);
        await controller.getPortfolio(req as Request, res as Response);
        expect(res.status).to.have.been.calledWith(500);
        expect(res.json).to.have.been.calledWith({ error: `An error occurred: ${error.message}` });
    });
});