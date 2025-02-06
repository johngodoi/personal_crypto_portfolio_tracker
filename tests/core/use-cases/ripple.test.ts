import { expect } from 'chai';
import sinon from 'sinon';
import { RippleUseCase } from '../../../src/core/use-cases/ripple';
import { RippleDriver } from '../../../src/shared/drivers/ripple';
import { PriceGateway } from '../../../src/shared/gateways/price/interface';
import { CoingeckoGateway } from '../../../src/shared/gateways/price/coingecko';

describe('RippleUseCase', () => {
    let driver: sinon.SinonStubbedInstance<RippleDriver>;
    let priceGateway: sinon.SinonStubbedInstance<PriceGateway>;
    let useCase: RippleUseCase;

    beforeEach(() => {
        driver = sinon.createStubInstance(RippleDriver);
        priceGateway = sinon.createStubInstance(CoingeckoGateway);
        useCase = new RippleUseCase(driver, priceGateway);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should generate a Ripple address', async () => {
        const passphrase = 'test-passphrase';
        const generatedAddress = 'r123';
        driver.generateRippleAddress.resolves(generatedAddress);

        const address = await useCase.generateAddress(passphrase);

        expect(address).to.equal(generatedAddress);
        expect(driver.generateRippleAddress).to.have.been.calledWith(passphrase);
    });

    it('should validate a Ripple address', async () => {
        const walletAddress = 'r123';
        driver.isXRPAddress.resolves(true);

        const isValid = await useCase.isAddressValid(walletAddress);

        expect(isValid).to.be.true;
        expect(driver.isXRPAddress).to.have.been.calledWith(walletAddress);
    });

    it('should get the portfolio for a valid address', async () => {
        const walletAddress = 'r123';
        const nativeBalance = '10';
        const tokenBalances = [
            { balance: '100', decimals: 6, symbol: 'RUSD', contractAddress: 'r456' }
        ];
        const addressBalances = { blockchain: 'ripple', nativeBalance, tokenBalances };
        const nativeTokenId = 'ripple';
        const nativePrice = 1;
        const tokenPrice = 1;

        driver.getBalance.resolves(Number.parseFloat(nativeBalance));
        driver.getTokenBalances.resolves(tokenBalances);
        driver.getCoinIdFromSymbol.withArgs('xrp').returns(nativeTokenId);
        driver.getCoinIdFromSymbol.withArgs('RUSD').returns('rusd');
        driver.getNativeCurrencyName.returns('XRP');
        driver.getBlockchainName.returns('ripple');
        priceGateway.getPrice.withArgs(nativeTokenId).resolves(nativePrice);
        priceGateway.getPrice.withArgs('xrp').resolves(tokenPrice);
        priceGateway.getPrice.withArgs('rusd').resolves(1);

        const portfolio = await useCase.getPortfolio(walletAddress);

        expect(portfolio.address).to.equal(walletAddress);
        expect(portfolio.nativeBalance).to.equal(nativeBalance);
        expect(portfolio.nativeBalanceValue).to.equal(Number(nativeBalance) * nativePrice);
        expect(portfolio.tokenBalanceValues[0].value).to.equal(100 * tokenPrice);
    });

    it('should return null if an error occurs while getting token balances', async () => {
        driver.getTokenBalances.rejects(new Error('Test error'));
        driver.getBalance.resolves(10);
        driver.getNativeCurrencyName.returns('XRP');
        driver.getBlockchainName.returns('ripple');

        const tokenBalances = await useCase.getAddressBalances('r123');

        expect(tokenBalances.tokenBalances).to.be.empty;
    });

    it('should get address balances', async () => {
        const walletAddress = 'r123';
        const nativeBalance = '10';
        const tokenBalances = [
            { balance: '100', decimals: 6, symbol: 'XRP', contractAddress: 'r456' }
        ];

        driver.getBalance.resolves(Number.parseFloat(nativeBalance));
        driver.getTokenBalances.resolves(tokenBalances);
        driver.getBlockchainName.returns('ripple');

        const addressBalances = await useCase.getAddressBalances(walletAddress);

        expect(addressBalances.nativeBalance).to.equal(nativeBalance);
        expect(addressBalances.tokenBalances).to.deep.equal(tokenBalances);
        expect(addressBalances.blockchain).to.equal('ripple');
    });
});