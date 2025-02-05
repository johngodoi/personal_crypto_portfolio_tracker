import { expect } from 'chai';
import { Request, Response } from 'express';
import { PricesController } from '../../../src/presentation/controllers/get-prices';
import { UseCase } from '../../../src/core/use-cases/interface';
import sinon from 'sinon';
import * as priceGateway from '../../../src/shared/gateways/price';

describe('PricesController', () => {
    let useCases: { [blockchain: string]: () => UseCase };
    let controller: PricesController;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let useCase: Partial<UseCase>;
    let getPriceStub: sinon.SinonStub;

    beforeEach(() => {
        useCase = {
            getCoinIdFromSymbol: sinon.stub(),
        };

        useCases = {
            ethereum: () => useCase as UseCase,
        };

        controller = new PricesController(useCases);

        req = {
            params: {
                blockchain: 'ethereum',
                symbol: 'ETH',
            },
        };

        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        getPriceStub = sinon.stub(priceGateway, 'getPrice');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return 400 if the token symbol is invalid', async () => {
        req.params!.symbol = '';
        await controller.getPrices(req as Request, res as Response);
        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWith({ error: 'Invalid token symbol' });
    });

    it('should return 400 if the blockchain is invalid', async () => {
        req.params!.blockchain = 'invalid-blockchain';
        await controller.getPrices(req as Request, res as Response);
        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWith({ error: 'Invalid blockchain invalid-blockchain' });
    });

    it('should return the price of the token if the request is valid', async () => {
        const tokenId = 'ethereum';
        const price = 2000;
        (useCase.getCoinIdFromSymbol as sinon.SinonStub).resolves(tokenId);
        getPriceStub.resolves(price);

        await controller.getPrices(req as Request, res as Response);

        expect(res.json).to.have.been.calledWith({ blockchain: 'ethereum', symbol: 'ETH', price });
    });

    it('should return 500 if an error occurs', async () => {
        const error = new Error('Test error');
        (useCase.getCoinIdFromSymbol as sinon.SinonStub).rejects(error);

        await controller.getPrices(req as Request, res as Response);

        expect(res.status).to.have.been.calledWith(500);
        expect(res.json).to.have.been.calledWith({ error: `An error occurred: ${error.message}` });
    });
});