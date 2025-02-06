import { expect } from 'chai';
import sinon from 'sinon';
import { EthereumUseCase } from '../../../src/core/use-cases/ethereum';
import { EthereumDriver } from '../../../src/shared/drivers/ethereum';
import { PriceGateway } from '../../../src/shared/gateways/price/interface';
import { CoingeckoGateway } from '../../../src/shared/gateways/price/coingecko';

describe('EthereumUseCase', () => {
    let driver: sinon.SinonStubbedInstance<EthereumDriver>;
    let priceGateway: sinon.SinonStubbedInstance<PriceGateway>;
    let useCase: EthereumUseCase;
    const tokenList = ['DAI'];

    beforeEach(() => {
        driver = sinon.createStubInstance(EthereumDriver);
        priceGateway = sinon.createStubInstance(CoingeckoGateway);
        useCase = new EthereumUseCase(driver, priceGateway, tokenList);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should generate an Ethereum address', async () => {
        const passphrase = 'test-passphrase';
        const generatedAddress = '0x123';
        driver.generateEthereumAddress.resolves(generatedAddress);

        const address = await useCase.generateAddress(passphrase);

        expect(address).to.equal(generatedAddress);
        expect(driver.generateEthereumAddress).to.have.been.calledWith(passphrase);
    });

    it('should validate an Ethereum address', async () => {
        const walletAddress = '0x123';
        driver.isEthAddress.resolves(true);

        const isValid = await useCase.isAddressValid(walletAddress);

        expect(isValid).to.be.true;
        expect(driver.isEthAddress).to.have.been.calledWith(walletAddress);
    });

    it('should get the portfolio for a valid address', async () => {
        const walletAddress = '0x123';
        const nativeBalance = '10';
        const nativeTokenId = 'ethereum';
        const nativePrice = 2000;
        const tokenPrice = 1;

        driver.getBalance.resolves(nativeBalance);
        driver.getTokenDecimals.resolves(18);
        driver.getTokenBalance.resolves('100');
        driver.getNativeCurrencyName.returns('ETH');
        driver.getBlockchainName.returns('ethereum');
        driver.getCoinIdFromSymbol.withArgs('ETH').returns(nativeTokenId);
        driver.getCoinIdFromSymbol.withArgs('eth').returns(nativeTokenId);
        driver.getCoinIdFromSymbol.withArgs('DAI').returns('dai');
        driver.getContractAddress.withArgs('DAI').returns('0x456');
        driver.getTokenDecimals.withArgs('0x456').returns(Promise.resolve(18));
        priceGateway.getPrice.withArgs(nativeTokenId).resolves(nativePrice);
        priceGateway.getPrice.withArgs('dai').resolves(tokenPrice);

        const portfolio = await useCase.getPortfolio(walletAddress);

        expect(portfolio.address).to.equal(walletAddress);
        expect(portfolio.nativeBalance).to.equal(nativeBalance);
        expect(portfolio.nativeBalanceValue).to.equal(Number(nativeBalance) * nativePrice);
        expect(portfolio.tokenBalanceValues[0].value).to.equal(100 * tokenPrice);
    });

    it('should return null if an error occurs while getting token balances', async () => {
        driver.getTokenBalance.rejects(new Error('Test error'));

        const tokenBalances = await useCase.getTokenBalances('0x123');

        expect(tokenBalances).to.be.null;
    });

    it('should get address balances', async () => {
        const walletAddress = '0x123';
        const nativeBalance = '10';
        const tokenBalances = [
            { balance: '100', decimals: 18, symbol: 'DAI', contractAddress: '0x456' }
        ];

        driver.getBalance.resolves(nativeBalance);
        driver.getTokenDecimals.resolves(18);
        driver.getTokenBalance.resolves('100');
        driver.getContractAddress.withArgs('DAI').returns('0x456');
        driver.getBlockchainName.returns('ethereum');

        const addressBalances = await useCase.getAddressBalances(walletAddress);

        expect(addressBalances.nativeBalance).to.equal(nativeBalance);
        expect(addressBalances.tokenBalances).to.deep.equal(tokenBalances);
        expect(addressBalances.blockchain).to.equal('ethereum');
    });
});