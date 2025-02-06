import { expect } from 'chai';
import sinon from 'sinon';
import { TronUseCase } from '../../../src/core/use-cases/tron';
import { TronDriver } from '../../../src/shared/drivers/tron';
import { PriceGateway } from '../../../src/shared/gateways/price/interface';
import { CoingeckoGateway } from '../../../src/shared/gateways/price/coingecko';

describe('TronUseCase', () => {
    let driver: sinon.SinonStubbedInstance<TronDriver>;
    let priceGateway: sinon.SinonStubbedInstance<PriceGateway>;
    let useCase: TronUseCase;
    const tokenList = ['USDT'];

    beforeEach(() => {
        driver = sinon.createStubInstance(TronDriver);
        priceGateway = sinon.createStubInstance(CoingeckoGateway);
        useCase = new TronUseCase(driver, priceGateway, tokenList);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should generate a Tron address', async () => {
        const passphrase = 'test-passphrase';
        const generatedAddress = 'T123';
        driver.generateTronAddress.resolves(generatedAddress);

        const address = await useCase.generateAddress(passphrase);

        expect(address).to.equal(generatedAddress);
        expect(driver.generateTronAddress).to.have.been.calledWith(passphrase);
    });

    it('should validate a Tron address', async () => {
        const walletAddress = 'T123';
        driver.isTronAddress.resolves(true);

        const isValid = await useCase.isAddressValid(walletAddress);

        expect(isValid).to.be.true;
        expect(driver.isTronAddress).to.have.been.calledWith(walletAddress);
    });

    it('should get the portfolio for a valid address', async () => {
        const walletAddress = 'T123';
        const nativeBalance = '1000';
        const tokenBalances = [
            { balance: '500', decimals: 6, symbol: 'USDT', contractAddress: 'T456' }
        ];
        const addressBalances = { blockchain: 'tron', nativeBalance, tokenBalances };
        const nativeTokenId = 'tron';
        const nativePrice = 0.1;
        const tokenPrice = 1;

        driver.getBalance.resolves(Number.parseFloat(nativeBalance));
        driver.getTokenBalances.resolves(tokenBalances);
        driver.getCoinIdFromSymbol.withArgs('trx').returns(nativeTokenId);
        driver.getCoinIdFromSymbol.withArgs('USDT').returns('usdt');
        driver.getNativeCurrencyName.returns('TRX');
        driver.getBlockchainName.returns('tron');
        priceGateway.getPrice.withArgs(nativeTokenId).resolves(nativePrice);
        priceGateway.getPrice.withArgs('usdt').resolves(tokenPrice);

        const portfolio = await useCase.getPortfolio(walletAddress);

        expect(portfolio.address).to.equal(walletAddress);
        expect(portfolio.nativeBalance).to.equal(nativeBalance);
        expect(portfolio.nativeBalanceValue).to.equal(Number(nativeBalance) * nativePrice);
        expect(portfolio.tokenBalanceValues[0].value).to.equal(500 * tokenPrice);
    });

    it('should return an empty array if an error occurs while getting token balances', async () => {
        driver.getTokenBalances.rejects(new Error('Test error'));
        driver.getBalance.resolves(1000);
        driver.getNativeCurrencyName.returns('TRX');
        driver.getBlockchainName.returns('tron');

        const tokenBalances = await useCase.getAddressBalances('T123');

        expect(tokenBalances.tokenBalances).to.be.empty;
    });

    it('should get address balances', async () => {
        const walletAddress = 'T123';
        const nativeBalance = '1000';
        const tokenBalances = [
            { balance: '500', decimals: 6, symbol: 'USDT', contractAddress: 'T456' }
        ];

        driver.getBalance.resolves(Number.parseFloat(nativeBalance));
        driver.getTokenBalances.resolves(tokenBalances);
        driver.getBlockchainName.returns('tron');

        const addressBalances = await useCase.getAddressBalances(walletAddress);

        expect(addressBalances.nativeBalance).to.equal(nativeBalance);
        expect(addressBalances.tokenBalances).to.deep.equal(tokenBalances);
        expect(addressBalances.blockchain).to.equal('tron');
    });
});