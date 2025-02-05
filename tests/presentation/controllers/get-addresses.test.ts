import { expect } from 'chai';
import { Request, Response } from 'express';
import { AddressesController } from '../../../src/presentation/controllers/get-addresses';
import { UseCase } from '../../../src/core/use-cases/interface';
import { AddressesConfig } from '../../../src/core/entities/addresses';
import * as config from '../../../src/core/use-cases/config';
import sinon from 'sinon';
import { env } from '../../../src/shared/config/env';

describe('AddressesController', () => {
    let useCases: { [blockchain: string]: () => UseCase };
    let controller: AddressesController;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let useCase: Partial<UseCase>;
    let loadAddressesConfigStub: sinon.SinonStub;

    beforeEach(() => {
        useCase = {
            generateAddress: sinon.stub(),
        };

        useCases = {
            ethereum: () => useCase as UseCase,
        };

        controller = new AddressesController(useCases);

        req = {};

        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        loadAddressesConfigStub = sinon.stub(config, 'loadAddressesConfig');
    });

    afterEach(() => {
        loadAddressesConfigStub.restore();
    });

    it('should return addresses config if it exists', async () => {
        const addressesConfig: AddressesConfig = { ethereum: '0x123' };
        loadAddressesConfigStub.resolves(addressesConfig);

        await controller.getAddresses(req as Request, res as Response);

        expect(res.json).to.have.been.calledWith(addressesConfig);
    });

    it('should return 500 if mnemonic passphrase is not set', async () => {
        loadAddressesConfigStub.resolves(null);
        sinon.stub(env, 'MNEMONIC_PASSPHRASE').value(null);

        await controller.getAddresses(req as Request, res as Response);

        expect(res.status).to.have.been.calledWith(500);
        expect(res.json).to.have.been.calledWith({ error: 'Mnemonic passphrase not set' });
    });

    it('should generate addresses if mnemonic passphrase is set', async () => {
        loadAddressesConfigStub.resolves(null);
        sinon.stub(env, 'MNEMONIC_PASSPHRASE').value('test-passphrase');
        (useCase.generateAddress as sinon.SinonStub).resolves('0x123');

        await controller.getAddresses(req as Request, res as Response);

        const expectedAddresses: AddressesConfig = { ethereum: '0x123' };
        expect(res.json).to.have.been.calledWith(expectedAddresses);
    });
});